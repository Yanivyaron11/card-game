import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import QuizOverlay from './components/QuizOverlay'
import LandingPage from './components/LandingPage'
import CleaningMode from './components/CleaningMode'
import LevelWarningOverlay from './components/LevelWarningOverlay'
import StageBonusOverlay from './components/StageBonusOverlay'
import { translations } from './data/translations'
import { generateDeck, generateSurvivalDeck, generateEndlessDeck } from './utils/deck'
import { themes } from './data/themes'
import { playSound, playMusic, stopMusic } from './utils/sounds'
import Confetti from './components/Confetti'
import Rain from './components/Rain'
import GravityBoard from './components/GravityBoard'
import TicTacToeBoard from './components/TicTacToeBoard'
import './App.css'

import InstallPrompt from './components/InstallPrompt'


function SurvivalResult({ correct, language, survivalType }) {
  const { isNewRecord, best } = useMemo(() => {
    const HS_KEY = survivalType === 'endless' ? 'endless_high_score' : (survivalType === 'adult' ? 'survival_high_score_adult' : 'survival_high_score_child');
    const prev = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
    const isNew = correct > prev;
    if (isNew) localStorage.setItem(HS_KEY, correct);
    return { isNewRecord: isNew, best: isNew ? correct : prev };
  }, [correct, survivalType]);

  const t = translations[language];

  const handleShare = async () => {
    const message = t.share_message.replace('{score}', correct);
    const shareData = {
      title: 'Smarty',
      text: message,
      url: window.location.origin + window.location.pathname.replace(/\/result$/, '')
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const canShare = !!navigator.share && isNewRecord && correct > 0;

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
        {survivalType === 'endless'
          ? (language === 'he' ? `✅ צברת ${correct} נקודות במפולת!` : `✅ Scored ${correct} avalanche points!`)
          : (language === 'he' ? `✅ ענית נכון על ${correct} שאלות` : `✅ ${correct} correct answers`)
        }
      </p>
      {isNewRecord && correct > 0 && (
        <p style={{ color: 'gold', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🏆 {t.new_record}
        </p>
      )}
      <p style={{ opacity: 0.75, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        {survivalType === 'endless' ? (language === 'he' ? 'שיא אישי במפולת' : 'Avalanche High Score') : (survivalType === 'adult' ? t.survival_record_adult : t.survival_record_child)}: {best}
      </p>

      {canShare && (
        <button
          className="share-button"
          onClick={handleShare}
        >
          <span>📤</span> {t.share_score}
        </button>
      )}
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState('start')
  const [showLanding, setShowLanding] = useState(false);
  const [gameConfig, setGameConfig] = useState(null)
  const [deck, setDeck] = useState([])
  const [endlessColumns, setEndlessColumns] = useState([]);
  const dropAnimationTimeRef = useRef(null);
  const endlessTargetRef = useRef(null);
  const isGravityPausedRef = useRef(false);
  const endlessLevelRef = useRef(1);
  const [showLevelWarning, setShowLevelWarning] = useState(null);
  const [showStageBonus, setShowStageBonus] = useState(null);

  const getRandomPowerUp = () => {
    const r = Math.random();
    if (r < 0.02) return 'cross'; // 2% chance
    if (r < 0.06) return 'row';   // 4% chance
    if (r < 0.10) return 'col';   // 4% chance
    return null;
  };
  const [lives, setLives] = useState({ 1: 1, 2: 1 })
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'he') // en, he
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [streaks, setStreaks] = useState({ 1: 0, 2: 0 });
  const [maxStreaks, setMaxStreaks] = useState({ 1: 0, 2: 0 });
  const [awardedStreaks, setAwardedStreaks] = useState({ 1: [], 2: [] });
  const [currentSurvivalIndex, setCurrentSurvivalIndex] = useState(0);
  const [levelUpToast, setLevelUpToast] = useState(null);
  const [survivalCorrect, setSurvivalCorrect] = useState(0);
  const [usedSurvivalPowerups, setUsedSurvivalPowerups] = useState({ '5050': false, 'hint': false, 'solve': false });
  const [newRecordToast, setNewRecordToast] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const [rewardToast, setRewardToast] = useState(null);
  const [thiefAvailable, setThiefAvailable] = useState({ 1: true, 2: true });
  const [isThiefModeActive, setIsThiefModeActive] = useState(false);
  const [totalCoins, setTotalCoins] = useState(() => parseInt(localStorage.getItem('total_coins') || '100', 10));
  const recordNotifiedRef = useRef(false);
  const titleClickRef = useRef(0);
  const [unlockedAvatars, setUnlockedAvatars] = useState(() => {
    const saved = localStorage.getItem('unlocked_avatars');
    if (saved) return JSON.parse(saved);
    // Default unlocked: Leo, Bunny, Foxy, Panda, Penguin
    return ['leo', 'bunny', 'foxy', 'panda', 'penguin'];
  });
  const [unlockedTopics, setUnlockedTopics] = useState(() => {
    const saved = localStorage.getItem('unlocked_topics');
    if (saved) return JSON.parse(saved);
    // Core categories unlocked by default
    return ['israel_group', 'nature_group', 'science_group', 'culture_group', 'general', 'language_group', 'world_group', 'sports_group'];
  });
  const [unlockedSkins, setUnlockedSkins] = useState(() => {
    const saved = localStorage.getItem('unlocked_skins');
    if (saved) return JSON.parse(saved);
    // Default unlocked: Leo's default skin
    return ['leo_default'];
  });
  const [activeAvatars, setActiveAvatars] = useState(() => {
    const saved = localStorage.getItem('active_avatars');
    if (saved) return JSON.parse(saved);
    // Default active: All initial unlocked ones
    return ['leo', 'bunny', 'foxy', 'panda', 'penguin'];
  });
  const [activeSkins, setActiveSkins] = useState(() => {
    const saved = localStorage.getItem('active_skins');
    if (saved) return JSON.parse(saved);
    return ['leo_default'];
  });
  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    const saved = localStorage.getItem('unlocked_themes');
    if (saved) return JSON.parse(saved);
    return ['graphite', 'default'];
  });
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('active_theme') || 'graphite';
  });
  const [sessionCoinBreakdown, setSessionCoinBreakdown] = useState({
    base: 0,
    streak: 0,
    bonus: 0,
    spent: 0
  });
  const answeringRef = useRef(new Set());

  useEffect(() => {
    localStorage.setItem('total_coins', totalCoins);
  }, [totalCoins]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Ensure returning players get newly added free groups automatically
  useEffect(() => {
    setUnlockedTopics(prev => {
      let next = [...prev];
      if (!next.includes('language_group')) next.push('language_group');
      if (!next.includes('world_group')) next.push('world_group');
      return next;
    });

    setUnlockedThemes(prev => {
      let next = [...prev];
      const freeThemes = ['graphite', 'space', 'midnight', 'forest_dark', 'burgundy', 'charcoal', 'charcoal_bubbles', 'midnight_grid', 'burgundy_stripes'];
      freeThemes.forEach(themeId => {
        if (!next.includes(themeId)) next.push(themeId);
      });
      return next;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('unlocked_avatars', JSON.stringify(unlockedAvatars));
  }, [unlockedAvatars]);

  useEffect(() => {
    localStorage.setItem('unlocked_topics', JSON.stringify(unlockedTopics));
  }, [unlockedTopics]);

  useEffect(() => {
    localStorage.setItem('unlocked_skins', JSON.stringify(unlockedSkins));
  }, [unlockedSkins]);

  useEffect(() => {
    localStorage.setItem('unlocked_themes', JSON.stringify(unlockedThemes));
  }, [unlockedThemes]);

  useEffect(() => {
    localStorage.setItem('active_theme', activeTheme);
    const themeObj = themes.find(t => t.id === activeTheme);
    document.body.className = themeObj?.className || '';
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('active_avatars', JSON.stringify(activeAvatars));
  }, [activeAvatars]);

  useEffect(() => {
    localStorage.setItem('active_skins', JSON.stringify(activeSkins));
  }, [activeSkins]);

  // Migration: If user had old topics/avatars unlocked, ensure consistency with new economy
  useEffect(() => {
    // 1. Relock topics that became premium
    const premiumGroups = ['judaism_group', 'entertainment_group', 'lifestyle_group', 'world_group'];
    const hasToRelock = unlockedTopics.some(id => premiumGroups.includes(id)) && !localStorage.getItem('premium_migration_done');

    if (hasToRelock) {
      // Keep only strictly basic ones
      const coreOnly = ['israel_group', 'nature_group', 'science_group', 'culture_group', 'general'];
      setUnlockedTopics(coreOnly);
      localStorage.setItem('premium_migration_done', 'true');
    }

    // Ensure sports_group is unlocked for all users (newly free)
    if (!unlockedTopics.includes('sports_group')) {
      setUnlockedTopics(prev => [...prev, 'sports_group']);
    }

    // 2. Ensure all current "Free" avatars are unlocked (like Foxy)
    const freeAvatars = ['leo', 'bunny', 'foxy', 'panda', 'penguin'];
    const missingFree = freeAvatars.some(id => !unlockedAvatars.includes(id));
    if (missingFree) {
      setUnlockedAvatars(prev => [...new Set([...prev, ...freeAvatars])]);
    }
  }, []);

  useEffect(() => {
    if (rewardToast) {
      const timer = setTimeout(() => setRewardToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [rewardToast]);

  useEffect(() => {
    // Daily login bonus logic
    const lastLogin = localStorage.getItem('last_login_date');
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      // Award 20 coins for first login of the day
      setTotalCoins(prev => prev + 20);
      setRewardToast({
        messageKey: 'daily_login_bonus',
        amount: 20
      });
      localStorage.setItem('last_login_date', today);
    }
  }, []);

  const buyAvatar = (avatarId, price) => {
    if (totalCoins >= price && !unlockedAvatars.includes(avatarId)) {
      setTotalCoins(prev => prev - price);
      setUnlockedAvatars(prev => [...prev, avatarId]);
      playSound('victory');
      return true;
    }
    return false;
  };

  const buySkin = (skinId, price) => {
    if (totalCoins >= price && !unlockedSkins.includes(skinId)) {
      setTotalCoins(prev => prev - price);
      setUnlockedSkins(prev => [...prev, skinId]);
      setActiveSkins(prev => [...prev, skinId]); // Activate by default on purchase
      playSound('victory');
      return true;
    }
    return false;
  };

  const toggleAvatarActivation = (avatarId) => {
    setActiveAvatars(prev => {
      if (prev.includes(avatarId)) {
        return prev.filter(id => id !== avatarId);
      }
      return [...prev, avatarId];
    });
  };

  const toggleSkinActivation = (skinId) => {
    setActiveSkins(prev => {
      if (prev.includes(skinId)) {
        return prev.filter(id => id !== skinId);
      }
      return [...prev, skinId];
    });
  };

  const buyTopic = (topicId, price) => {
    if (totalCoins >= price && !unlockedTopics.includes(topicId)) {
      setTotalCoins(prev => prev - price);
      setUnlockedTopics(prev => [...prev, topicId]);
      playSound('victory');
      return true;
    }
    return false;
  };

  const buyTheme = (themeId, price) => {
    if (totalCoins >= price && !unlockedThemes.includes(themeId)) {
      setTotalCoins(prev => prev - price);
      setUnlockedThemes(prev => [...prev, themeId]);
      setActiveTheme(themeId);
      playSound('victory');
      return true;
    }
    return false;
  };

  const equipTheme = (themeId) => {
    if (unlockedThemes.includes(themeId)) {
      setActiveTheme(themeId);
      playSound('pop');
    }
  };

  const t = translations[language];

  useEffect(() => {
    playMusic();

    // -- Update Landing Page / Inactivity Logic --
    const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes timeout for landing page
    const storedTime = localStorage.getItem('last_active_time');
    const now = Date.now();

    console.log("[PWA Pilot] Current time:", now);
    console.log("[PWA Pilot] Stored activity time:", storedTime);

    if (storedTime) {
      const diff = now - parseInt(storedTime, 10);
      console.log("[PWA Pilot] Time since last activity (ms):", diff);
      if (diff > CHECK_INTERVAL) {
        console.log("[PWA Pilot] Timeout reached! Showing landing page.");
        setShowLanding(true);
      }
    } else {
      console.log("[PWA Pilot] No stored time. Setting initial time to now.");
      localStorage.setItem('last_active_time', now.toString());
    }

    // Update last active on every interaction (throttled)
    let lastSaved = 0;
    const updateActivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastSaved > 60000) { // Throttle updates to local storage to 1 minute
        localStorage.setItem('last_active_time', currentTime.toString());
        lastSaved = currentTime;
      }
    };

    window.addEventListener('pointerdown', updateActivity);

    // Also check when coming back from background
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const time = localStorage.getItem('last_active_time');
        if (time) {
          const diff = Date.now() - parseInt(time, 10);
          console.log("[PWA Pilot] Back to visible. Diff:", diff);
          if (diff > CHECK_INTERVAL) {
            setShowLanding(true);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointerdown', updateActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && gameConfig?.gameMode === 'time_attack' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            playSound('wrong');
            setGameState('game_over');
            navigate('/result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, gameConfig, timeLeft, navigate]);

  // If user hits back button on browser from quiz to root, we should handle it
  // But for this simple app, we'll keep state at App level.

  const handleStartGame = (config) => {
    answeringRef.current.clear();
    playMusic(); // Ensure music is playing/unlocked on interaction
    setGameConfig(config);
    const gridSize = Number(config.gridSize);
    const difficulty = Number(config.difficulty || 1);
    const sizeBase = gridSize === 9 ? 3 : gridSize === 16 ? 4 : 5;
    const initialLives = sizeBase - (difficulty - 1);
    const initialCoins = config.gridSize === 9 ? 5 : config.gridSize === 16 ? 10 : 15;

    // 1. Lives & Coins
    if (config.gameMode === '1v1') {
      setLives({ 1: initialLives, 2: initialLives });
    } else if (config.gameMode === 'survival') {
      setLives({ 1: 3 });
    } else {
      setLives({ 1: initialLives });
    }
    // Removed unintended initial coins award

    // 2. Mode Specific Setup (Timer, Deck, etc.)
    if (config.gameMode === 'survival') {
      const survivalDeck = generateSurvivalDeck(config.topics, config.survivalType, config.focusedTopicId || null);
      setDeck(survivalDeck);
      setCurrentSurvivalIndex(0);
      setSurvivalCorrect(0);
      setUsedSurvivalPowerups({ '5050': false, 'hint': false, 'solve': false });
      recordNotifiedRef.current = false;
      let HS_KEY;
      if (config.survivalType === 'adult') HS_KEY = 'survival_high_score_adult';
      else if (config.survivalType === 'focused') HS_KEY = `survival_high_score_focused_${config.focusedTopicId}`;
      else HS_KEY = 'survival_high_score_child';
      setBestScore(parseInt(localStorage.getItem(HS_KEY) || '0', 10));
      setTimeLeft(30);

      if (survivalDeck.length > 0) {
        navigate(`/quiz/${survivalDeck[0].id}`);
      } else {
        setGameState('topic_selection');
        navigate('/play');
        return;
      }
    } else if (config.gameMode === 'time_attack') {
      const gSize = Number(config.gridSize);
      const baseTime = gSize === 9 ? 75 : gSize === 16 ? 120 : 180;

      // Adjust by difficulty: Level 1 (+20%), Level 2 (No change), Level 3 (-20%)
      const diff = Number(config.difficulty || 2);
      const multiplier = diff === 1 ? 1.2 : diff === 3 ? 0.8 : 1.0;
      const timeLimit = Math.floor(baseTime * multiplier);

      setTimeLeft(timeLimit);
      setDeck(generateDeck(gSize, config.topics, config.difficulty));
      setGameState('topic_selection');
      navigate('/play');
    } else if (config.gameMode === 'endless') {
      const cols = 5;
      const rows = 5;

      // Unpack the massive endless deck algorithm mapping all questions database
      const newDeck = generateEndlessDeck(config.topics);

      const initialCols = Array.from({ length: cols }, () => []);
      let cardIndex = 0;
      let highestInitLvl = 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          let deckCard;
          let failsafe = 0;
          do {
            deckCard = newDeck[cardIndex % newDeck.length];
            cardIndex++;
            failsafe++;
          } while (deckCard.level !== 1 && failsafe < newDeck.length);

          if (deckCard.level > highestInitLvl) highestInitLvl = deckCard.level;
          initialCols[c].push({
            id: `init_${c}_${r}_${Math.random().toString(36).substr(2, 9)}`,
            questionId: deckCard.id,
            text: deckCard.he || '?',
            topicIcon: deckCard.topicIcon,
            topicColor: deckCard.topicColor,
            level: deckCard.level,
            powerUp: getRandomPowerUp(),
            status: 'active'
          });
          cardIndex++;
        }
      }
      setEndlessColumns(initialCols);
      endlessTargetRef.current = { col: 0, row: 0, nextDeckIndex: cardIndex };
      endlessLevelRef.current = highestInitLvl;
      setShowLevelWarning(1);
      setDeck(newDeck);
      setSurvivalCorrect(0);
      setTimeLeft(0);
      setGameState('playing');
      navigate('/play');
    } else if (config.gameMode === 'solo') {
      // Relaxed mode: no per-question timer
      setTimeLeft(0);
      setDeck(generateDeck(config.gridSize, config.topics, config.difficulty));
      setGameState('topic_selection');
      navigate('/play');
    } else if (config.gameMode === '1v1') {
      // 1v1 has per-question timer
      setTimeLeft(30);
      setDeck(generateDeck(config.gridSize, config.topics, config.difficulty));
      setGameState('topic_selection');
      navigate('/play');
    } else if (config.gameMode === 'tictactoe') {
      setTimeLeft(0);
      setDeck(generateDeck(9, config.topics, config.difficulty));
      setGameState('playing'); // Skip topic selection wait
      navigate('/play');
    }

    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setStreaks({ 1: 0, 2: 0 });
    setMaxStreaks({ 1: 0, 2: 0 });
    setAwardedStreaks({ 1: [], 2: [] });
    setThiefAvailable({ 1: true, 2: true });
    setIsThiefModeActive(false);
    setSessionCoinBreakdown({ base: 0, streak: 0, bonus: 0, spent: 0 });
    setGameState('playing');
  };

  const applyStreakBonuses = useCallback(() => {
    const players = gameConfig?.gameMode === '1v1' ? [1, 2] : [1];
    let totalStreakBonus = 0;

    players.forEach(p => {
      const mStreak = maxStreaks[p];
      let bonus = 0;
      if (mStreak >= 5) bonus = 10;
      else if (mStreak >= 3) bonus = 5;

      if (bonus > 0) {
        totalStreakBonus += bonus;
        setTotalCoins(prev => prev + bonus);
      }
    });

    if (totalStreakBonus > 0) {
      setSessionCoinBreakdown(prev => ({ ...prev, streak: prev.streak + totalStreakBonus }));
    }
  }, [gameConfig, maxStreaks]);

  const checkWinCondition = useCallback(() => {
    if (deck.length === 0 || gameState !== 'playing') return;

    const allCardsProcessed = deck.length > 0 && deck.every(card => card.isSolved || card.isFailed);
    const solvedCount = deck.filter(c => c.isSolved).length;

    // Early termination for 1v1 mathematically determined
    if (gameConfig.gameMode === '1v1') {
      const getRemainingMaxPointsFor = (playerIdx) => {
        let maxTheoreticalAdded = 0;
        let R_count = 0;
        let F1_count = 0;
        let F2_count = 0;

        deck.forEach(c => {
          if (c.isSolved || c.isFailed) return;
          const isEligibleForRebound = !c.isTainted && c.options?.he?.length > 2;
          const pointsValue = isEligibleForRebound ? 2 : 1;

          if (c.failedAttempts === 1) {
            if (c.lastFailedPlayer !== playerIdx) {
              maxTheoreticalAdded += pointsValue;
              R_count++;
            }
          } else {
            maxTheoreticalAdded += pointsValue;
            if (isEligibleForRebound) F2_count++;
            else F1_count++;
          }
        });

        // Turn-based mathematical invariant:
        // If it is THIS player's turn, they MUST consume a turn.
        // If they have no existing Rebounds and no 1-point fresh cards,
        // they are forced to answer a 2-point fresh card correctly
        // to prevent outright locking it on a fail, thus yielding only 1 point.
        if (currentPlayer === playerIdx && R_count === 0 && F1_count === 0 && F2_count > 0) {
          maxTheoreticalAdded -= 1;
        }

        return maxTheoreticalAdded;
      };

      const p1Current = scores[1] || 0;
      const p2Current = scores[2] || 0;

      const p1MaxPotential = p1Current + getRemainingMaxPointsFor(1);
      const p2MaxPotential = p2Current + getRemainingMaxPointsFor(2);

      const p1HasWon = p1Current > p2MaxPotential;
      const p2HasWon = p2Current > p1MaxPotential;

      const earlyWinTriggered = p1HasWon || p2HasWon;

      if (earlyWinTriggered || allCardsProcessed) {
        applyStreakBonuses();
        if (p1Current === p2Current) {
          setGameState('game_over');
        } else {
          setGameState('victory');
        }
        navigate('/result');
      }
      return;
    }

    // TicTacToe is handled completely within TicTacToeBoard.jsx, including its own win/tie conditions and delays.
    if (gameConfig.gameMode === 'tictactoe') return;

    if (allCardsProcessed) {
      applyStreakBonuses();
      if (solvedCount > deck.length / 2) {
        playSound('victory');
        // Bonus for Time Attack: remaining time as coins
        if (gameConfig.gameMode === 'time_attack' && timeLeft > 0) {
          setTotalCoins(prev => prev + timeLeft);
          setRewardToast({ messageKey: 'time_bonus', amount: timeLeft });
          setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + timeLeft }));
        }

        // Board Completion Bonus
        let boardBonus = 0;
        const gSize = gameConfig.gridSize;
        const diffMultiplier = Number(gameConfig.difficulty || 1);

        if (gSize === 9) boardBonus = 10;      // 3x3
        else if (gSize === 16) boardBonus = 20; // 4x4
        else if (gSize === 25) boardBonus = 30; // 5x5

        boardBonus = boardBonus * diffMultiplier;

        if (boardBonus > 0 && gameConfig.gameMode === 'solo') {
          setTotalCoins(prev => prev + boardBonus);
          setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + boardBonus }));
        }

        // Perfect Board Bonus
        const isPerfect = deck.every(card => !card.isFailed);
        if (isPerfect && boardBonus > 0 && (gameConfig.gameMode === 'solo' || gameConfig.gameMode === 'time_attack')) {
          setTotalCoins(prev => prev + boardBonus);
          setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + boardBonus }));
          setRewardToast({ messageKey: 'perfect_board_bonus', amount: boardBonus });
        }

        setGameState('victory');
        navigate('/result');
      } else {
        playSound('wrong');
        setGameState('game_over');
        navigate('/result');
      }
    }
  }, [deck, gameState, gameConfig, applyStreakBonuses, navigate, timeLeft]);

  // 1v1 Sticky Turn Logic: Skip turn if current player has no valid moves
  useEffect(() => {
    if (gameState === 'playing' && gameConfig?.gameMode === '1v1') {
      const allCardsProcessed = deck.length > 0 && deck.every(c => c.isSolved || c.isFailed);
      if (allCardsProcessed) return;

      const currentPlayerHasMoves = deck.some(c =>
        !c.isSolved &&
        !c.isFailed &&
        !(c.failedAttempts === 1 && c.lastFailedPlayer === currentPlayer)
      );

      if (!currentPlayerHasMoves) {
        const otherPlayer = currentPlayer === 1 ? 2 : 1;
        const otherPlayerHasMoves = deck.some(c =>
          !c.isSolved &&
          !c.isFailed &&
          !(c.failedAttempts === 1 && c.lastFailedPlayer === otherPlayer)
        );
        if (otherPlayerHasMoves) {
          setCurrentPlayer(otherPlayer);
        }
      }
    }
  }, [deck, currentPlayer, gameConfig, gameState]);

  // Gravity Loop logic
  const gravityTick = useCallback(() => {
    if (gameState !== 'playing' || isGravityPausedRef.current) return;
    const now = Date.now();
    const lastDropTime = dropAnimationTimeRef.current || now;
    const timeSinceLastDrop = now - lastDropTime;
    const dropInterval = 1000; // 1 second for now

    if (timeSinceLastDrop >= dropInterval) {
      setEndlessColumns(prev => {
        const newCols = prev.map(c => [...c]);
        let hasDropped = false;

        for (let c = 0; c < newCols.length; c++) {
          for (let r = newCols[c].length - 1; r >= 0; r--) {
            if (newCols[c][r].status === 'active') {
              // Check if card below is 'stone' or if it's the last row
              if (r + 1 < newCols[c].length && newCols[c][r + 1].status === 'stone') {
                newCols[c][r].status = 'stone'; // This card becomes stone
                hasDropped = true;
              } else if (r === newCols[c].length - 1) {
                newCols[c][r].status = 'stone'; // Last row card becomes stone
                hasDropped = true;
              }
            }
          }
        }

        if (hasDropped) {
          dropAnimationTimeRef.current = now;
          playSound('thud');
        } else {
          // If no cards dropped, it means the board is full of stones or solved cards
          // This is a game over condition for endless mode
          const allStones = newCols.every(col => col.every(card => card.status === 'stone'));
          if (allStones) {
            setGameState('game_over');
            navigate('/result');
          }
        }
        return newCols;
      });
    }
  }, [gameState, navigate]);

  useEffect(() => {
    if (gameState === 'playing') {
      checkWinCondition();
    }
  }, [deck, scores, gameState, checkWinCondition]);

  const handleEndlessWin = useCallback(() => {
    setGameState('victory');
    navigate('/result');
  }, [navigate]);

  const handleGravityPauseStateChange = useCallback((isPaused) => {
    isGravityPausedRef.current = isPaused;
  }, []);

  const handleThiefAction = useCallback((cardId) => {
    if (!thiefAvailable[currentPlayer]) return;

    playSound('swoosh'); // Sneaky action sound

    if (gameConfig.gameMode === '1v1') {
      const card = deck.find(c => c.id === cardId);
      if (card && card.owner) {
        setScores(prev => ({
          ...prev,
          [card.owner]: Math.max(0, prev[card.owner] - 1)
        }));
      }
    }

    setDeck(prev => {
      return prev.map(card => {
        if (card.id === cardId && card.owner && card.owner !== currentPlayer) {
          const newCardPool = generateDeck(1, gameConfig.topics, gameConfig.difficulty);
          const replacement = newCardPool[0];

          return {
            ...card,
            isSolved: false,
            isFailed: false,
            owner: null,
            ownerSymbol: null,
            failedAttempts: 0,
            lastFailedPlayer: null,
            isTainted: false,
            questionId: replacement.id,
            text: replacement.he || replacement.en,
            options: replacement.options,
            correctAnswer: replacement.correctAnswer,
            topicColor: replacement.topicColor,
            topicIcon: replacement.topicIcon,
            hint: replacement.hint,
            category: replacement.category,
            emoji: replacement.emoji,
            level: replacement.level
          };
        }
        return card;
      });
    });

    setThiefAvailable(prev => ({ ...prev, [currentPlayer]: false }));
    setIsThiefModeActive(false);
    setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  }, [thiefAvailable, currentPlayer, gameConfig, deck]);

  const handleAnswer = useCallback((cardId, isCorrect, fromQuiz = false) => {
    if (answeringRef.current.has(cardId)) return;
    answeringRef.current.add(cardId);

    if (gameConfig?.gameMode === 'endless') {
      const { col, row, nextDeckIndex } = endlessTargetRef.current || {};
      let isGameOver = false;

      if (isCorrect) {
        let popCount = 0;
        setEndlessColumns(prev => {
          const newCols = prev.map(c => [...c]);
          const target = newCols[col][row];

          const popCard = (cIdx, rIdx) => {
            if (newCols[cIdx] && newCols[cIdx][rIdx] && newCols[cIdx][rIdx].status !== 'popping') {
              newCols[cIdx][rIdx].status = 'popping';
              popCount++;
            }
          };

          popCard(col, row);
          if (target.powerUp === 'row' || target.powerUp === 'cross') {
            for (let c = 0; c < newCols.length; c++) popCard(c, row);
          }
          if (target.powerUp === 'col' || target.powerUp === 'cross') {
            for (let r = 0; r < newCols[col].length; r++) popCard(col, r);
          }

          let earnedCoins = target.level || 1;
          if (target.powerUp === 'row' || target.powerUp === 'col') {
            playSound('explosion_small');
          } else if (target.powerUp === 'cross') {
            playSound('explosion_large');
          }

          endlessTargetRef.current.pendingCoins = earnedCoins;

          return newCols;
        });

        setTimeout(() => {
          setEndlessColumns(current => {
            const newCols = current.map(c => [...c]);
            for (let iCol = 0; iCol < newCols.length; iCol++) {
              const originalLength = newCols[iCol].length;
              newCols[iCol] = newCols[iCol].filter(card => card.status !== 'popping');
              const poppedInCol = originalLength - newCols[iCol].length;

              let targetLvl = 1;
              if (survivalCorrect >= 30) targetLvl = 3;
              else if (survivalCorrect >= 15) targetLvl = 2;

              for (let i = 0; i < poppedInCol; i++) {
                let nextCard;
                let failsafe = 0;
                do {
                  nextCard = deck[endlessTargetRef.current.nextDeckIndex % deck.length];
                  endlessTargetRef.current.nextDeckIndex++;
                  failsafe++;
                } while (nextCard.level !== targetLvl && failsafe < deck.length);

                newCols[iCol].push({
                  id: `new_${endlessTargetRef.current.nextDeckIndex}_${Math.random().toString(36).substr(2, 9)}`,
                  questionId: nextCard.id,
                  text: nextCard.he || '?',
                  topicIcon: nextCard.topicIcon,
                  topicColor: nextCard.topicColor,
                  level: nextCard.level,
                  powerUp: getRandomPowerUp(),
                  status: 'active'
                });
                endlessTargetRef.current.nextDeckIndex++;
              }
            }
            return newCols;
          });

          const coinsToGive = endlessTargetRef.current.pendingCoins || 1;
          let stageBonusToGive = 0;

          // IMPORTANT: Stage progression is strictly 1 point per manual correct answer!
          // Powerups save you from dying and give huge coins, but don't fast-track the Boss.
          setSurvivalCorrect(s => {
            const newTotal = s + 1;
            if (s < 15 && newTotal >= 15) {
              setShowStageBonus({ coins: 50, nextLevel: 2 });
              isGravityPausedRef.current = true;
              stageBonusToGive = 50;
            } else if (s < 30 && newTotal >= 30) {
              setShowStageBonus({ coins: 100, nextLevel: 3 });
              isGravityPausedRef.current = true;
              stageBonusToGive = 100;
            } else if (s < 50 && newTotal >= 50) {
              setShowLevelWarning('WIN');
              isGravityPausedRef.current = true;
              stageBonusToGive = 200;
            }
            return newTotal;
          });

          if (coinsToGive + stageBonusToGive > 0) {
            setTotalCoins(c => c + coinsToGive + stageBonusToGive);
            setSessionCoinBreakdown(cb => ({ ...cb, base: cb.base + coinsToGive + stageBonusToGive }));
          }
          playSound('drop');
        }, 800);

        setGameState('playing');
        navigate('/play');
        answeringRef.current.delete(cardId);
        return;
      } else {
        setEndlessColumns(prev => {
          const newCols = [...prev];
          const colToUpdate = [...newCols[col]];
          colToUpdate[row] = { ...colToUpdate[row], status: 'stone' };
          newCols[col] = colToUpdate;

          isGameOver = newCols.some(c => c.every(card => card.status === 'stone'));
          return newCols;
        });

        if (isGameOver) {
          setGameState('game_over');
          navigate('/result');
        } else {
          setGameState('playing');
          navigate('/play');
        }

        answeringRef.current.delete(cardId);
        return;
      }
    }

    if (gameConfig?.gameMode === 'survival' && isCorrect) {
      const newScore = survivalCorrect + 1;
      setSurvivalCorrect(newScore);

      const isFocused = gameConfig.survivalType === 'focused';
      let HS_KEY;
      if (gameConfig.survivalType === 'adult') HS_KEY = 'survival_high_score_adult';
      else if (isFocused) HS_KEY = `survival_high_score_focused_${gameConfig.focusedTopicId}`;
      else HS_KEY = 'survival_high_score_child';

      const prevBest = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
      if (newScore > prevBest && newScore > 0) {
        setBestScore(newScore);

        if (!recordNotifiedRef.current) {
          recordNotifiedRef.current = true;
          const recordBonus = isFocused ? 10 : 20;
          setTotalCoins(prev => prev + recordBonus);
          setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + recordBonus }));
        }
      }

      // Award base coins: focused gets 1 coin per 2 correct (halved)
      if (isFocused) {
        if (newScore % 2 === 0) {
          setTotalCoins(prev => prev + 1);
          setSessionCoinBreakdown(prev => ({ ...prev, base: prev.base + 1 }));
        }
      }

      // Check for Course Completion
      if (newScore >= deck.length && deck.length > 0) {
        applyStreakBonuses();
        const isFocused = gameConfig.survivalType === 'focused';
        const completionAmount = isFocused ? 40 : (gameConfig.survivalType === 'adult' ? 50 : 30);
        setTotalCoins(prev => prev + completionAmount);
        setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + completionAmount }));
        playSound('victory');
        setGameState('victory');
        navigate('/result');
        return;
      }
    }

    if (isCorrect) {
      // Award coins based on question level (1, 2, or 3)
      const answeredCard = deck.find(c => c.id === cardId);
      const coinAward = answeredCard?.level || 1;

      const newStreaks = { ...streaks, [currentPlayer]: (streaks[currentPlayer] || 0) + 1 };
      const currentStreak = newStreaks[currentPlayer];

      if (gameConfig.gameMode !== 'tictactoe') {
        // Track Max Streak
        if (currentStreak > (maxStreaks[currentPlayer] || 0)) {
          setMaxStreaks(prev => ({ ...prev, [currentPlayer]: currentStreak }));
        }

        setTotalCoins(prev => prev + coinAward);
        setSessionCoinBreakdown(prev => ({
          ...prev,
          base: prev.base + coinAward
        }));
        setStreaks(newStreaks);
      } else {
        // In tictactoe, we just track the win, no streaks or point farming.
        // We still need to record streaks=0 implicitly or just not update it. 
        // We can leave streaks alone to disable streak toasts.
      }

      setDeck(prev => {
        const newDeck = prev.map(card =>
          card.id === cardId ? { ...card, isSolved: true, owner: currentPlayer } : card
        );

        if (gameConfig.gameMode === '1v1' || gameConfig.gameMode === 'tictactoe') {
          const card = prev.find(c => c.id === cardId);
          // Rebound only if: failed once before (by opponent), NOT tainted, and > 2 options
          const isEligibleForRebound = card &&
            card.failedAttempts === 1 &&
            !card.isTainted &&
            card.options.he.length > 2;

          const points = isEligibleForRebound ? 2 : 1;
          const newScores = { ...scores, [currentPlayer]: scores[currentPlayer] + points };
          setScores(newScores);
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        } else if (gameConfig.gameMode === 'tictactoe') {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }

        return newDeck;
      });
    } else {
      if (gameConfig.gameMode === 'solo' || gameConfig.gameMode === 'time_attack' || gameConfig.gameMode === 'survival') {
        const newPlayerLives = lives[currentPlayer] - 1;
        setLives(prev => ({ ...prev, [currentPlayer]: newPlayerLives }));
        setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));

        setDeck(prev => {
          const newDeck = prev.map(card =>
            card.id === cardId ? { ...card, isFailed: true } : card
          );
          return newDeck;
        });

        if (newPlayerLives <= 0) {
          applyStreakBonuses();
          playSound('wrong');
          setGameState('game_over');
          navigate('/result');
          return;
        }
      } else {
        if (gameConfig.gameMode === '1v1' || gameConfig.gameMode === 'tictactoe') {

          // 1v1 and TicTacToe: Pure point race. No heart deduction.
          const cardRef = deck.find(c => c.id === cardId);
          const newFailedCount = (cardRef?.failedAttempts || 0) + 1;
          const isTictactoe = gameConfig.gameMode === 'tictactoe';
          const isBinary = cardRef?.options?.he?.length <= 2;
          const shouldLockImmediately = (isBinary || cardRef?.isTainted) && !isTictactoe;
          const willFail = shouldLockImmediately || (newFailedCount >= 2 && !isTictactoe);

          if (!willFail) {
            answeringRef.current.delete(cardId);
          }

          setDeck(prev => {
            const newDeck = prev.map(card => {
              if (card.id === cardId) {
                const currentFailedCount = (card.failedAttempts || 0) + 1;
                const currentIsBinary = card.options.he.length <= 2;
                const currentShouldLock = (currentIsBinary || card.isTainted) && !isTictactoe;

                return {
                  ...card,
                  failedAttempts: currentFailedCount,
                  lastFailedPlayer: currentPlayer,
                  isFailed: isTictactoe ? false : (currentShouldLock || currentFailedCount >= 2)
                };
              }
              return card;
            });
            return newDeck;
          });

          // Always switch turn on wrong answer in 1v1
          setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
      }
    }

    // Unified Survival Advancement logic
    if (gameConfig.gameMode === 'survival') {
      const nextIdx = currentSurvivalIndex + 1;

      // Continue to next question
      if (nextIdx < deck.length) {
        // Level up check
        const currentCard = deck[currentSurvivalIndex];
        const nextCard = deck[nextIdx];
        if (nextCard.level > currentCard.level) {
          setLevelUpToast(nextCard.level);
          setTimeout(() => setLevelUpToast(null), 3000);
        }

        setCurrentSurvivalIndex(nextIdx);
        const level = nextCard.level;
        const newTime = level === 1 ? 30 : level === 2 ? 25 : 20;
        setTimeLeft(newTime);
        navigate(`/quiz/${nextCard.id}`);
      } else {
        playSound('victory');
        setGameState('victory');
        navigate('/result');
      }
      return;
    }

    // If we didn't navigate to /result, go back to /play
    if (location.pathname.startsWith('/quiz')) {
      navigate('/play');
    }
  }, [gameConfig, survivalCorrect, deck, applyStreakBonuses, navigate, streaks, currentPlayer, maxStreaks, scores, location.pathname, currentSurvivalIndex]);

  const handlePowerUpUsed = (cardId, type, data) => {
    setDeck(prev => prev.map(card => {
      if (card.id === cardId) {
        const updates = { ...card, isTainted: true };
        if (type === '5050') updates.eliminatedIndices = data;
        if (type === 'hint') updates.isHintVisible = true;
        return updates;
      }
      return card;
    }));
  };

  // Helper to apply streak bonuses at end of game


  const handleReturnToStart = () => {
    answeringRef.current.clear();
    setShowStageBonus(null);
    setShowLevelWarning(null);
    // If quitting during a game, treat as end of run for stats/scoring
    if (gameState === 'playing') {
      // Intentionally do NOT apply streak bonuses when quitting
      // Reset any base coins earned during this incomplete session
      const coinsToRevert = sessionCoinBreakdown.base;
      if (coinsToRevert > 0) {
        setTotalCoins(prev => prev - coinsToRevert);
      }
      setSessionCoinBreakdown({ base: 0, streak: 0, bonus: 0, spent: sessionCoinBreakdown.spent });
      setGameState('quit');
      navigate('/result');
    } else {
      setGameState('start');
      setUsedSurvivalPowerups({ '5050': false, 'hint': false, 'solve': false });
      navigate('/');
    }
  };

  if (showLanding) {
    return <LandingPage language={language} />;
  }

  return (
    <div className={`app-container ${language === 'he' ? 'rtl-mode' : ''}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      {showStageBonus && (
        <StageBonusOverlay
          coins={showStageBonus.coins}
          onComplete={() => {
            const nextLvl = showStageBonus.nextLevel;
            setShowStageBonus(null);
            setShowLevelWarning(nextLvl);
          }}
        />
      )}
      {showLevelWarning && (
        <LevelWarningOverlay
          level={showLevelWarning}
          language={language}
          onComplete={() => {
            if (showLevelWarning === 'WIN') {
              const bonusCoins = 300;
              setTotalCoins(c => c + bonusCoins);
              setSessionCoinBreakdown(cb => ({ ...cb, base: cb.base + bonusCoins }));
              applyStreakBonuses();
              setShowLevelWarning(null);
              setGameState('victory');
              navigate('/result');
            } else {
              setShowLevelWarning(null);
              isGravityPausedRef.current = false;
            }
          }}
        />
      )}
      <h1 className="title-glow" onClick={() => {
        titleClickRef.current += 1;
        if (titleClickRef.current >= 5) {
          titleClickRef.current = 0;
          navigate('/admin/clean');
        } else {
          handleReturnToStart();
        }
      }} style={{ cursor: 'pointer' }}>{t.title}</h1>

      <InstallPrompt language={language} />
      <div className="toast-container">
        {levelUpToast && (
          <div className="level-up-toast card-pop">
            {language === 'he' ? `עברת לשלב ${levelUpToast}!` : `Level Up! Level ${levelUpToast}`}
          </div>
        )}
        {rewardToast && (
          <div className={`level-up-toast reward-toast card-pop ${rewardToast.isRecord ? 'record-break' : ''}`}>
            {rewardToast.isRecord ? (
              <span>
                {t.new_record_yay.replace('{n}', rewardToast.score)} 🏆
                {rewardToast.amount > 0 && <><br /> {t.record_bonus.replace('{n}', rewardToast.amount)}</>}
              </span>
            ) : (
              t[rewardToast.messageKey].replace('{n}', rewardToast.amount)
            )}
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={
          <StartScreen
            onStart={handleStartGame}
            language={language}
            onLanguageChange={setLanguage}
            totalCoins={totalCoins}
            unlockedAvatars={unlockedAvatars}
            activeAvatars={activeAvatars}
            onBuyAvatar={buyAvatar}
            unlockedTopics={unlockedTopics}
            onBuyTopic={buyTopic}
            unlockedSkins={unlockedSkins}
            activeSkins={activeSkins}
            onBuySkin={buySkin}
            onToggleAvatar={toggleAvatarActivation}
            onToggleSkin={toggleSkinActivation}
            unlockedThemes={unlockedThemes}
            activeTheme={activeTheme}
            onBuyTheme={buyTheme}
            onEquipTheme={equipTheme}
          />
        } />

        <Route path="/play" element={
          (!gameConfig || !gameConfig.gameMode) ? (
            <Navigate to="/" replace />
          ) : gameConfig.gameMode === 'endless' ? (
            <GravityBoard
              columns={endlessColumns}
              config={gameConfig}
              coins={survivalCorrect}
              language={language}
              onPauseStateChange={(isPaused) => {
                isGravityPausedRef.current = isPaused;
              }}
              onCardSelected={(qId, cIndex, rIndex) => {
                endlessTargetRef.current = { ...endlessTargetRef.current, col: cIndex, row: rIndex };
                navigate(`/quiz/${qId}`);
              }}
              onQuit={() => {
                applyStreakBonuses();
                setGameState('quit');
                navigate('/result');
              }}
              onWin={() => {
                // Champion! Beat all bosses. Max Coin Reward.
                const bonusCoins = 300;
                setTotalCoins(c => c + bonusCoins);
                setSessionCoinBreakdown(cb => ({ ...cb, base: cb.base + bonusCoins }));
                applyStreakBonuses();
                setGameState('victory');
                navigate('/result');
              }}
            />
          ) : gameConfig.gameMode === 'tictactoe' ? (
            <TicTacToeBoard
              config={gameConfig}
              deck={deck || []}
              avatars={gameConfig.avatars}
              currentPlayer={currentPlayer}
              language={language}
              thiefAvailable={thiefAvailable}
              isThiefModeActive={isThiefModeActive}
              onThiefToggle={() => setIsThiefModeActive(!isThiefModeActive)}
              onThiefAction={handleThiefAction}
              onCardSelected={(id) => navigate(`/quiz/${id}`)}
              onGameOver={(winnerId) => {
                if (winnerId) {
                  const winAward = Number(gameConfig.difficulty || 1) * 10;
                  setScores({ [winnerId]: 1, [winnerId === 1 ? 2 : 1]: 0 });
                  setTotalCoins(prev => prev + winAward);
                  setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + winAward }));
                  playSound('victory_level'); // Epic victory sound
                } else {
                  setScores({ 1: 0, 2: 0 }); // Tie
                  playSound('game_over');
                }
                setGameState('victory');
                navigate('/result');
              }}
              onQuit={handleReturnToStart}
            />
          ) : (
            <GameBoard
              config={gameConfig}
              deck={deck || []}
              lives={lives}
              coins={totalCoins}
              language={language}
              currentPlayer={currentPlayer}
              scores={scores}
              timeLeft={timeLeft}
              thiefAvailable={thiefAvailable}
              isThiefModeActive={isThiefModeActive}
              onThiefToggle={() => setIsThiefModeActive(!isThiefModeActive)}
              onThiefAction={handleThiefAction}
              onCardSelected={(id) => navigate(`/quiz/${id}`)}
              onQuit={handleReturnToStart}
            />
          )
        } />

        <Route path="/quiz/:cardId" element={
          (!gameConfig || !gameConfig.gameMode) ? (
            <Navigate to="/" replace />
          ) : (
            <QuizOverlay
              key={location.pathname}
              deck={deck || []}
              lives={lives[currentPlayer] || 0}
              coins={totalCoins}
              language={language}
              gameMode={gameConfig.gameMode}
              gameConfig={gameConfig}
              timeLeft={timeLeft}
              avatar={gameConfig.avatars?.[currentPlayer]}
              streak={streaks[currentPlayer]}
              onCoinsChange={(newAmount) => {
                const diff = totalCoins - newAmount;
                if (diff > 0) {
                  setSessionCoinBreakdown(prev => ({ ...prev, spent: prev.spent + diff }));
                }
                setTotalCoins(newAmount);
              }}
              onAnswer={handleAnswer}
              onTimeout={(cardId) => handleAnswer(cardId, false)}
              onPowerUpUsed={handlePowerUpUsed}
              survivalIndex={currentSurvivalIndex}
              survivalCorrect={survivalCorrect}
              usedSurvivalPowerups={usedSurvivalPowerups}
              onSurvivalPowerupUsed={(type) => setUsedSurvivalPowerups(prev => ({ ...prev, [type]: true }))}
              bestScore={bestScore}
              onQuit={handleReturnToStart}
              activeTheme={activeTheme}
            />
          )
        } />

        <Route path="/result" element={
          <div className="end-screen glass-panel">
            {gameState === 'victory' && <Confetti />}
            {gameState === 'game_over' && <Rain />}
            {/* Header section */}
            {gameState === 'victory' ? (
              <h2>{t.you_win} 🎉</h2>
            ) : (
              <h2>
                {gameState === 'quit' ? t.game_interrupted :
                  (gameConfig?.gameMode === '1v1' && scores[1] === scores[2]) ? t.game_over : t.game_over + ' 😢'}
              </h2>
            )}

            {/* Avatar display */}
            {(() => {
              if (!gameConfig?.avatars) return null;

              let displayAvatar = null;
              let isWinner = gameState === 'victory';
              let isQuit = gameState === 'quit';

              if (gameConfig.gameMode !== '1v1' && gameConfig.gameMode !== 'tictactoe') {
                displayAvatar = gameConfig.avatars[1];
                if (!displayAvatar) return null;

                return (
                  <div className="result-avatar">
                    <div className={`premium-avatar-box ${isWinner || isQuit ? 'result-winner-box' : 'result-loser-box'}`}>
                      {displayAvatar.image ? (
                        <img
                          src={
                            isWinner && displayAvatar.image_happy ? displayAvatar.image_happy :
                              !isWinner && !isQuit && displayAvatar.image_sad ? displayAvatar.image_sad :
                                displayAvatar.image
                          }
                          alt={displayAvatar.name[language]}
                          className={`avatar-img-premium ${isWinner ? 'avatar-happy' : !isQuit ? 'avatar-sad' : ''}`}
                        />
                      ) : (
                        <span className={`result-emoji ${isWinner ? 'avatar-happy' : !isQuit ? 'avatar-sad' : ''}`} style={{ fontSize: isWinner || isQuit ? '8rem' : '6rem', display: 'inline-block' }}>{displayAvatar.emoji}</span>
                      )}
                    </div>
                    <p>{displayAvatar.name[language]}</p>
                  </div>
                );
              } else {
                // 1v1 mode
                if (isQuit) {
                  return (
                    <div className="result-avatar" style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                      {[1, 2].map(p => {
                        const avatar = gameConfig.avatars[p];
                        if (!avatar) return null;
                        return (
                          <div key={p} style={{ textAlign: 'center' }}>
                            <div className="premium-avatar-box result-draw-box">
                              {avatar.image ? (
                                <img
                                  src={avatar.image}
                                  alt={avatar.name[language]}
                                  className="avatar-img-premium"
                                />
                              ) : (
                                <span className="result-emoji" style={{ fontSize: '5rem', display: 'inline-block' }}>{avatar.emoji}</span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{avatar.name[language]}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else if (scores[1] > scores[2]) {
                  displayAvatar = gameConfig.avatars[1];
                  isWinner = true;
                  return (
                    <div className="result-avatar">
                      <div className="premium-avatar-box result-winner-box">
                        {displayAvatar.image ? (
                          <img
                            src={displayAvatar.image_happy || displayAvatar.image}
                            alt={displayAvatar.name[language]}
                            className="avatar-img-premium avatar-happy"
                          />
                        ) : (
                          <span className="result-emoji avatar-happy" style={{ fontSize: '8rem', display: 'inline-block' }}>{displayAvatar.emoji}</span>
                        )}
                      </div>
                      <p>{displayAvatar.name[language]}</p>
                    </div>
                  );
                } else if (scores[2] > scores[1]) {
                  displayAvatar = gameConfig.avatars[2];
                  isWinner = true;
                  return (
                    <div className="result-avatar">
                      <div className="premium-avatar-box result-winner-box">
                        {displayAvatar.image ? (
                          <img
                            src={displayAvatar.image_happy || displayAvatar.image}
                            alt={displayAvatar.name[language]}
                            className="avatar-img-premium avatar-happy"
                          />
                        ) : (
                          <span className="result-emoji avatar-happy" style={{ fontSize: '8rem', display: 'inline-block' }}>{displayAvatar.emoji}</span>
                        )}
                      </div>
                      <p>{displayAvatar.name[language]}</p>
                    </div>
                  );
                } else {
                  // Draw
                  return (
                    <div className="result-avatar" style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                      {[1, 2].map(p => {
                        const avatar = gameConfig.avatars[p];
                        if (!avatar) return null;
                        return (
                          <div key={p} style={{ textAlign: 'center' }}>
                            <div className="premium-avatar-box result-draw-box player-1v1-draw" style={{ animation: 'sway 3s ease-in-out infinite alternate', animationDelay: p === 1 ? '0s' : '1.5s' }}>
                              {avatar.image ? (
                                <img
                                  src={avatar.image}
                                  alt={avatar.name[language]}
                                  className="avatar-img-premium"
                                />
                              ) : (
                                <span className="result-emoji" style={{ fontSize: '4.5rem', display: 'inline-block' }}>{avatar.emoji}</span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{avatar.name[language]}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              }
            })()}

            {/* Mode-specific content */}
            <div className="result-content">
              {gameState === 'quit' ? null : (gameConfig?.gameMode === '1v1' || gameConfig?.gameMode === 'tictactoe') ? (
                <p>
                  {scores[1] > scores[2]
                    ? t.player_wins.replace('{name}', '') // Name is shown under avatar now
                    : scores[2] > scores[1]
                      ? t.player_wins.replace('{name}', '') // Name is shown under avatar now
                      : t.draw
                  }
                  {gameConfig?.gameMode === '1v1' && (
                    <>
                      <br />
                      {t.score}: {scores[1]} - {scores[2]}
                    </>
                  )}
                </p>
              ) : gameConfig?.gameMode === 'survival' || gameConfig?.gameMode === 'endless' ? (
                <SurvivalResult
                  correct={survivalCorrect}
                  language={language}
                  survivalType={gameConfig?.gameMode === 'endless' ? 'endless' : gameConfig.survivalType}
                />
              ) : gameConfig?.gameMode === 'time_attack' ? (
                <div className="time-attack-result">
                  {(() => {
                    const best = localStorage.getItem(`time_attack_best_${gameConfig.gridSize}`);
                    if (best && best !== '0') {
                      return <p>{t.time_attack_record}: {best}{t.timer}</p>;
                    }
                    return null;
                  })()}
                  {gameState === 'game_over' && <p>{t.ran_out_hearts}</p>}
                </div>
              ) : (
                // Solo mode
                <>
                  {gameState === 'game_over' && <p>{t.ran_out_hearts}</p>}
                  {gameState === 'victory' && <p>{t.matched_all}</p>}
                </>
              )}
            </div>
            {/* Coin Summary Section */}
            <div className="coin-summary-card glass-panel card-pop">
              <h3>
                {t.earned_this_game} <img src="/icons/gold_coin.png" alt="coin" className="global-coin" />
              </h3>
              <div className="coin-breakdown">
                <div className="breakdown-item">
                  <span>{t.regular_points}</span>
                  <span>+{sessionCoinBreakdown.base}</span>
                </div>
                {sessionCoinBreakdown.streak > 0 && (
                  <div className="breakdown-item streak">
                    <span>{t.streak_bonus} 🔥</span>
                    <span>+{sessionCoinBreakdown.streak}</span>
                  </div>
                )}
                {sessionCoinBreakdown.bonus > 0 && (
                  <div className="breakdown-item bonus">
                    <span>{sessionCoinBreakdown.bonus >= 50 ? t.special_bonus + ' 🌟' : t.special_bonus + ' ✨'}</span>
                    <span>+{sessionCoinBreakdown.bonus}</span>
                  </div>
                )}
                {sessionCoinBreakdown.spent > 0 && (
                  <div className="breakdown-item spent">
                    <span>{t.spent_on_powerups} 🛒</span>
                    <span>-{sessionCoinBreakdown.spent}</span>
                  </div>
                )}
                <div className="breakdown-total">
                  <span>{t.total_coins}</span>
                  <span>
                    {sessionCoinBreakdown.base + sessionCoinBreakdown.streak + sessionCoinBreakdown.bonus - sessionCoinBreakdown.spent} <img src="/icons/gold_coin.png" alt="coin" className="global-coin" />
                  </span>
                </div>
              </div>
            </div>

            <button onClick={handleReturnToStart}>
              {gameState === 'victory' ? t.play_again : t.try_again}
            </button>
          </div>
        } />
        <Route path="/admin/clean" element={
          <CleaningMode
            language={language}
            onQuit={() => navigate('/')}
          />
        } />
      </Routes>
    </div >
  )
}

export default App
