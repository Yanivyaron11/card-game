import { useState, useEffect, useRef } from 'react'
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
  const HS_KEY = survivalType === 'adult' ? 'survival_high_score_adult' : 'survival_high_score_child';
  const prev = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
  const isNewRecord = correct > prev;
  if (isNewRecord) localStorage.setItem(HS_KEY, correct);
  const best = isNewRecord ? correct : prev;

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
        {language === 'he' ? `✅ ענית נכון על ${correct} שאלות` : `✅ ${correct} correct answers`}
      </p>
      {isNewRecord && correct > 0 && (
        <p style={{ color: 'gold', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🏆 {language === 'he' ? 'שיא חדש!' : 'New Record!'}
        </p>
      )}
      <p style={{ opacity: 0.75, fontSize: '0.95rem' }}>
        {survivalType === 'adult' ? translations[language].survival_record_adult : translations[language].survival_record_child}: {best}
      </p>
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
  const [coins, setCoins] = useState({ 1: 0, 2: 0 })
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
  const answeringRef = useRef(null);

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

    if (config.gameMode === '1v1') {
      setLives({ 1: initialLives, 2: initialLives });
      setCoins({ 1: initialCoins, 2: initialCoins });
    } else {
      setLives({ 1: initialLives });
      setCoins({ 1: initialCoins });
    }

    if (config.gameMode === 'time_attack') {
      const timeLimit = config.gridSize === 9 ? 75 : config.gridSize === 16 ? 120 : 180;
      setTimeLeft(timeLimit);
    } else {
      setTimeLeft(0);
    }

    if (config.gameMode === 'survival') {
      const survivalDeck = generateSurvivalDeck(config.topics, config.survivalType);
      setDeck(survivalDeck);
      setCurrentSurvivalIndex(0);
      setSurvivalCorrect(0);
      setLives({ 1: 3 });
      setCoins({ 1: 5 });
      setUsedSurvivalPowerups({ '5050': false, 'hint': false, 'solve': false });
      setTimeLeft(30);

      if (survivalDeck.length > 0) {
        navigate(`/quiz/${survivalDeck[0].id}`);
      } else {
        setGameState('topic_selection');
        navigate('/play');
      }
    } else {
      setTimeLeft(config.gameMode === 'time_attack' ? 60 : 30);
      setGameState('topic_selection');
      setDeck(generateDeck(config.gridSize, config.topics, config.difficulty));
      navigate('/play');
    }

    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setStreaks({ 1: 0, 2: 0 });
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
        setNewRecordToast(newScore);
        playSound('victory');
        setTimeout(() => setNewRecordToast(null), 3000);
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
      // Coins no longer increase on correct answer
      // setCoins(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 2 }));

      setDeck(prev => {
        const newDeck = prev.map(card =>
          card.id === cardId ? { ...card, isSolved: true, owner: currentPlayer } : card
        );

        const newStreaks = { ...streaks, [currentPlayer]: streaks[currentPlayer] + 1 };
        setStreaks(newStreaks);

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
    setGameState('start');
    setUsedSurvivalPowerups({ '5050': false, 'hint': false, 'solve': false });
    navigate('/');
  };

  return (
    <div className={`app-container ${language === 'he' ? 'rtl-mode' : ''}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="title-glow" onClick={handleReturnToStart} style={{ cursor: 'pointer' }}>{t.title}</h1>

      <InstallPrompt language={language} />
      {levelUpToast && (
        <div className="level-up-toast card-pop">
          {language === 'he' ? `עברת לשלב ${levelUpToast}!` : `Level Up! Level ${levelUpToast}`}
        </div>
      )}
      {newRecordToast && (
        <div className="level-up-toast record-toast card-pop" style={{ border: '2px solid gold' }}>
          {t.new_record_yay.replace('{n}', newRecordToast)} 🏆
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <StartScreen
            onStart={handleStartGame}
            language={language}
            onLanguageChange={setLanguage}
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
              coins={coins}
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
              coins={coins[currentPlayer] || 0}
              language={language}
              gameMode={gameConfig.gameMode}
              gameConfig={gameConfig}
              timeLeft={timeLeft}
              avatar={gameConfig.avatars?.[currentPlayer]}
              streak={streaks[currentPlayer]}
              onCoinsChange={(newAmount) => setCoins(prev => ({ ...prev, [currentPlayer]: newAmount }))}
              onAnswer={handleAnswer}
              onTimeout={(cardId) => handleAnswer(cardId, false)}
              onPowerUpUsed={handlePowerUpUsed}
              survivalIndex={currentSurvivalIndex}
              survivalCorrect={survivalCorrect}
              usedSurvivalPowerups={usedSurvivalPowerups}
              onSurvivalPowerupUsed={(type) => setUsedSurvivalPowerups(prev => ({ ...prev, [type]: true }))}
              onQuit={handleReturnToStart}
            />
          )
        } />

        <Route path="/result" element={
          <div className="end-screen glass-panel">
            {gameState === 'game_over' && (
              <>
                <h2>{t.game_over} 😢</h2>
                {gameConfig?.avatars?.[1] && gameConfig.gameMode !== '1v1' && (
                  <div className="result-avatar">
                    <span className="result-emoji">{gameConfig.avatars[1].emoji}</span>
                    <p>{gameConfig.avatars[1].name[language]}</p>
                  </div>
                )}
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
                ) : (
                  <p>{t.ran_out_hearts}</p>
                )}
              </>
            )}
            {gameState === 'victory' && (
              <>
                <h2>{t.you_win} 🎉</h2>
                {gameConfig?.avatars?.[1] && gameConfig.gameMode !== '1v1' && (
                  <div className="result-avatar">
                    <span className="result-emoji">{gameConfig.avatars[1].emoji}</span>
                    <p>{gameConfig.avatars[1].name[language]}</p>
                  </div>
                )}
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
                ) : (
                  <p>{t.matched_all}</p>
                )}
              </>
            )}
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
