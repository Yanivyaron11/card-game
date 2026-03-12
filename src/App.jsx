import { useState, useEffect, useRef, useMemo } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import QuizOverlay from './components/QuizOverlay'
import { translations } from './data/translations'
import { generateDeck, generateSurvivalDeck } from './utils/deck'
import { playSound, playMusic, stopMusic } from './utils/sounds'
import './App.css'

import InstallPrompt from './components/InstallPrompt'


function SurvivalResult({ correct, language, survivalType }) {
  const { isNewRecord, best } = useMemo(() => {
    const HS_KEY = survivalType === 'adult' ? 'survival_high_score_adult' : 'survival_high_score_child';
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
        {language === 'he' ? `✅ ענית נכון על ${correct} שאלות` : `✅ ${correct} correct answers`}
      </p>
      {isNewRecord && correct > 0 && (
        <p style={{ color: 'gold', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🏆 {t.new_record}
        </p>
      )}
      <p style={{ opacity: 0.75, fontSize: '0.95rem', marginBottom: '1rem' }}>
        {survivalType === 'adult' ? t.survival_record_adult : t.survival_record_child}: {best}
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
  const [gameState, setGameState] = useState('start') // start, playing, game_over, victory
  const [gameConfig, setGameConfig] = useState(null)
  const [deck, setDeck] = useState([])
  const [lives, setLives] = useState({ 1: 1, 2: 1 })
  const [language, setLanguage] = useState('he') // en, he
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [streaks, setStreaks] = useState({ 1: 0, 2: 0 });
  const [currentSurvivalIndex, setCurrentSurvivalIndex] = useState(0);
  const [levelUpToast, setLevelUpToast] = useState(null);
  const [survivalCorrect, setSurvivalCorrect] = useState(0);
  const [usedSurvivalPowerups, setUsedSurvivalPowerups] = useState({ '5050': false, 'hint': false, 'solve': false });
  const [newRecordToast, setNewRecordToast] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const [rewardToast, setRewardToast] = useState(null);
  const [totalCoins, setTotalCoins] = useState(() => parseInt(localStorage.getItem('total_coins') || '10', 10));
  const recordNotifiedRef = useRef(false);
  const [unlockedAvatars, setUnlockedAvatars] = useState(() => {
    const saved = localStorage.getItem('unlocked_avatars');
    if (saved) return JSON.parse(saved);
    // Default unlocked: Leo, Bunny, Foxy, Panda, Penguin
    return ['leo', 'bunny', 'foxy', 'panda', 'penguin'];
  });
  const [sessionCoinBreakdown, setSessionCoinBreakdown] = useState({
    base: 0,
    streak: 0,
    bonus: 0,
    spent: 0
  });
  const answeringRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('total_coins', totalCoins);
  }, [totalCoins]);

  useEffect(() => {
    localStorage.setItem('unlocked_avatars', JSON.stringify(unlockedAvatars));
  }, [unlockedAvatars]);

  useEffect(() => {
    if (rewardToast) {
      const timer = setTimeout(() => setRewardToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [rewardToast]);

  const buyAvatar = (avatarId, price) => {
    if (totalCoins >= price && !unlockedAvatars.includes(avatarId)) {
      setTotalCoins(prev => prev - price);
      setUnlockedAvatars(prev => [...prev, avatarId]);
      playSound('victory');
      return true;
    }
    return false;
  };

  const t = translations[language];

  useEffect(() => {
    playMusic();
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
    playMusic(); // Ensure music is playing/unlocked on interaction
    setGameConfig(config);
    const initialLives = config.gridSize === 9 ? 1 : config.gridSize === 16 ? 2 : 3;
    const initialCoins = config.gridSize === 9 ? 5 : config.gridSize === 16 ? 10 : 15;

    // 1. Lives & Coins
    if (config.gameMode === '1v1') {
      setLives({ 1: initialLives, 2: initialLives });
    } else if (config.gameMode === 'survival') {
      setLives({ 1: 3 });
    } else {
      setLives({ 1: initialLives });
    }
    setTotalCoins(prev => prev + initialCoins);

    // 2. Mode Specific Setup (Timer, Deck, etc.)
    if (config.gameMode === 'survival') {
      const survivalDeck = generateSurvivalDeck(config.topics, config.survivalType);
      setDeck(survivalDeck);
      setCurrentSurvivalIndex(0);
      setSurvivalCorrect(0);
      setUsedSurvivalPowerups({ '5050': false, 'hint': false, 'solve': false });
      recordNotifiedRef.current = false;
      const HS_KEY = config.survivalType === 'adult' ? 'survival_high_score_adult' : 'survival_high_score_child';
      setBestScore(parseInt(localStorage.getItem(HS_KEY) || '0', 10));
      setTimeLeft(30); // Note: QuizOverlay uses its own per-level timer if gameTimeLeft > 0

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
    }

    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setStreaks({ 1: 0, 2: 0 });
    setSessionCoinBreakdown({ base: 0, streak: 0, bonus: 0, spent: 0 });
    setGameState('playing');
  };

  const checkWinCondition = () => {
    if (deck.length === 0 || gameState !== 'playing') return;

    const allCardsProcessed = deck.every(card => card.isSolved || card.isFailed);
    const solvedCount = deck.filter(c => c.isSolved).length;

    // Early termination for 1v1
    if (gameConfig?.gameMode === '1v1') {
      const maxPossiblePoints = deck.filter(c => !c.isSolved && !c.isFailed).reduce((acc, card) => {
        const canEverBeRebound = !card.isTainted && card.options.he.length > 2 && card.failedAttempts === 0;
        // If it was already failed once and is eligible, it's worth 2 points NOW.
        return acc + (canEverBeRebound || card.failedAttempts === 1 ? 2 : 1);
      }, 0);
      const scoreDiff = Math.abs(scores[1] - scores[2]);

      if (scoreDiff > maxPossiblePoints || allCardsProcessed) {
        playSound('victory');
        setGameState('victory');
        navigate('/result');
        return;
      }
    } else if (allCardsProcessed && gameConfig?.gameMode !== 'survival') {
      if (solvedCount > deck.length / 2) {
        playSound('victory');
        // Bonus for Time Attack: remaining time as coins
        if (gameConfig.gameMode === 'time_attack' && timeLeft > 0) {
          setTotalCoins(prev => prev + timeLeft);
          setRewardToast({ messageKey: 'time_bonus', amount: timeLeft });
          setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + timeLeft }));

          const gSize = gameConfig.gridSize;
          const TA_KEY = `time_attack_best_${gSize}`;
          const currentBest = parseInt(localStorage.getItem(TA_KEY) || '0', 10);
          if (timeLeft > currentBest) {
            localStorage.setItem(TA_KEY, timeLeft);
          }
        }
        setGameState('victory');
        navigate('/result');
      } else {
        playSound('wrong');
        setGameState('game_over');
        navigate('/result');
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      checkWinCondition();
    }
  }, [deck, scores, gameState]);

  const handleAnswer = (cardId, isCorrect, silent = false) => {
    if (gameConfig?.gameMode === 'survival' && answeringRef.current === cardId) return;
    answeringRef.current = cardId;

    if (gameConfig?.gameMode === 'survival' && isCorrect) {
      const newScore = survivalCorrect + 1;
      setSurvivalCorrect(newScore);

      // Check for new record toast
      const HS_KEY = gameConfig.survivalType === 'adult' ? 'survival_high_score_adult' : 'survival_high_score_child';
      const prevBest = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
      if (newScore > prevBest && newScore > 0) {
        setBestScore(newScore); // Real-time update

        let bonusToAward = 0;
        if (!recordNotifiedRef.current) {
          recordNotifiedRef.current = true;
          setTotalCoins(prev => prev + 20); // Bonus only once per session
          setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + 20 }));
          bonusToAward = 20;
          playSound('victory');
        }

        setRewardToast({
          messageKey: 'record_bonus',
          amount: bonusToAward,
          isRecord: true,
          score: newScore
        });
      }

      // Check for Course Completion
      if (newScore >= deck.length && deck.length > 0) {
        setTotalCoins(prev => prev + 50); // Big bonus for completion!
        setSessionCoinBreakdown(prev => ({ ...prev, bonus: prev.bonus + 50 }));
        setRewardToast({ messageKey: 'completion_bonus', amount: 50 });
        playSound('victory');
        setGameState('victory');
        navigate('/result');
        return;
      }
    }

    if (!silent) {
      if (isCorrect) {
        playSound('correct');
      } else {
        playSound('wrong');
      }
    }

    if (isCorrect) {
      // Award coins based on question level (1, 2, or 3)
      const answeredCard = deck.find(c => c.id === cardId);
      const coinAward = answeredCard?.level || 1;

      const newStreaks = { ...streaks, [currentPlayer]: (streaks[currentPlayer] || 0) + 1 };
      let extraBonus = 0;
      if (newStreaks[currentPlayer] > 0 && newStreaks[currentPlayer] % 3 === 0) {
        extraBonus = 5;
      }

      setTotalCoins(prev => prev + coinAward + extraBonus);
      setSessionCoinBreakdown(prev => ({
        ...prev,
        base: prev.base + coinAward,
        streak: prev.streak + extraBonus
      }));
      setStreaks(newStreaks);

      setDeck(prev => {
        const newDeck = prev.map(card =>
          card.id === cardId ? { ...card, isSolved: true, owner: currentPlayer } : card
        );

        if (gameConfig.gameMode === '1v1') {
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
          playSound('wrong');
          setGameState('game_over');
          navigate('/result');
          return;
        }
      } else {
        // 1v1: Pure point race. No heart deduction.
        setDeck(prev => {
          const newDeck = prev.map(card => {
            if (card.id === cardId) {
              const newFailedCount = (card.failedAttempts || 0) + 1;
              const isBinary = card.options.he.length <= 2;
              const shouldLockImmediately = isBinary || card.isTainted;

              return {
                ...card,
                failedAttempts: newFailedCount,
                lastFailedPlayer: currentPlayer,
                isFailed: shouldLockImmediately || newFailedCount >= 2
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
  };

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

  const handleReturnToStart = () => {
    if (gameState === 'playing') {
      // For all modes, manual quit counts as "End of Run" so progress is saved/shown
      setGameState('quit');
      navigate('/result');
    } else {
      setGameState('start');
      setUsedSurvivalPowerups({ '5050': false, 'hint': false, 'solve': false });
      navigate('/');
    }
  };

  return (
    <div className={`app-container ${language === 'he' ? 'rtl-mode' : ''}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="title-glow" onClick={handleReturnToStart} style={{ cursor: 'pointer' }}>{t.title}</h1>

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
            onBuyAvatar={buyAvatar}
          />
        } />

        <Route path="/play" element={
          (!gameConfig || !gameConfig.gameMode || gameState !== 'playing') ? (
            <div className="end-screen glass-panel">
              <button onClick={handleReturnToStart}>{t.try_again}</button>
            </div>
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
              onCardSelected={(id) => navigate(`/quiz/${id}`)}
              onQuit={handleReturnToStart}
            />
          )
        } />

        <Route path="/quiz/:cardId" element={
          (!gameConfig || !gameConfig.gameMode || gameState !== 'playing') ? (
            <div className="end-screen glass-panel">
              <button onClick={handleReturnToStart}>{t.try_again}</button>
            </div>
          ) : (
            <QuizOverlay
              key={window.location.pathname}
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
            />
          )
        } />

        <Route path="/result" element={
          <div className="end-screen glass-panel">
            {/* Header section */}
            {gameState === 'victory' ? (
              <h2>{t.you_win} 🎉</h2>
            ) : (
              <h2>{gameState === 'quit' ? t.game_interrupted : t.game_over} {gameState === 'quit' ? '' : '😢'}</h2>
            )}

            {/* Avatar display (only for single player modes) */}
            {gameConfig?.avatars?.[1] && gameConfig.gameMode !== '1v1' && (
              <div className="result-avatar">
                <span className="result-emoji">{gameConfig.avatars[1].emoji}</span>
                <p>{gameConfig.avatars[1].name[language]}</p>
              </div>
            )}

            {/* Mode-specific content */}
            <div className="result-content">
              {gameConfig?.gameMode === '1v1' ? (
                <p>
                  {scores[1] > scores[2]
                    ? t.player_wins.replace('{name}', gameConfig.avatars?.[1] ? `${gameConfig.avatars[1].emoji} ${gameConfig.avatars[1].name[language]}` : (language === 'he' ? 'שחקן 1' : 'Player 1'))
                    : scores[2] > scores[1]
                      ? t.player_wins.replace('{name}', gameConfig.avatars?.[2] ? `${gameConfig.avatars[2].emoji} ${gameConfig.avatars[2].name[language]}` : (language === 'he' ? 'שחקן 2' : 'Player 2'))
                      : t.draw
                  }
                  <br />
                  {t.score}: {scores[1]} - {scores[2]}
                </p>
              ) : gameConfig?.gameMode === 'survival' ? (
                <SurvivalResult correct={survivalCorrect} language={language} survivalType={gameConfig?.survivalType} />
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
              <h3>{t.earned_this_game} 🪙</h3>
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
                    <span>{t.special_bonus} ✨</span>
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
                  <span>{sessionCoinBreakdown.base + sessionCoinBreakdown.streak + sessionCoinBreakdown.bonus - sessionCoinBreakdown.spent} 🪙</span>
                </div>
              </div>
            </div>

            <button onClick={handleReturnToStart}>
              {gameState === 'victory' ? t.play_again : t.try_again}
            </button>
          </div>
        } />
      </Routes>
    </div >
  )
}

export default App
