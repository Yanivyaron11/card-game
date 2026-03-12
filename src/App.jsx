import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import QuizOverlay from './components/QuizOverlay'
import { translations } from './data/translations'
import { generateDeck } from './utils/deck'
import { playSound, playMusic, stopMusic } from './utils/sounds'
import './App.css'

import InstallPrompt from './components/InstallPrompt'

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

    setDeck(generateDeck(config.gridSize, config.topics, config.difficulty));
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setStreaks({ 1: 0, 2: 0 });
    setGameState('playing');
    navigate('/play');
  };

  const checkWinCondition = (currentDeck, currentScores) => {
    if (currentDeck.length === 0) return;

    const allCardsProcessed = currentDeck.every(card => card.isSolved || card.isFailed);
    const solvedCount = currentDeck.filter(c => c.isSolved).length;

    // Early termination for 1v1
    if (gameConfig?.gameMode === '1v1') {
      const maxPossiblePoints = currentDeck.filter(c => !c.isSolved && !c.isFailed).reduce((acc, card) => {
        const canEverBeRebound = !card.isTainted && card.options.he.length > 2 && card.failedAttempts === 0;
        // If it was already failed once and is eligible, it's worth 2 points NOW.
        return acc + (canEverBeRebound || card.failedAttempts === 1 ? 2 : 1);
      }, 0);
      const scoreDiff = Math.abs(currentScores[1] - currentScores[2]);

      if (scoreDiff > maxPossiblePoints || allCardsProcessed) {
        playSound('victory');
        setGameState('victory');
        navigate('/result');
        return;
      }
    } else if (allCardsProcessed) {
      if (solvedCount > currentDeck.length / 2) {
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

  const handleAnswer = (cardId, isCorrect, silent = false) => {
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
          checkWinCondition(newDeck, newScores);
        } else {
          checkWinCondition(newDeck, scores);
        }

        return newDeck;
      });
    } else {
      if (gameConfig.gameMode === 'solo' || gameConfig.gameMode === 'time_attack') {
        const newPlayerLives = lives[currentPlayer] - 1;
        setLives(prev => ({ ...prev, [currentPlayer]: newPlayerLives }));
        setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));

        setDeck(prev => {
          const newDeck = prev.map(card =>
            card.id === cardId ? { ...card, isFailed: true } : card
          );
          checkWinCondition(newDeck);
          return newDeck;
        });

        if (newPlayerLives < 0) {
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
          checkWinCondition(newDeck, scores);
          return newDeck;
        });

        // Always switch turn on wrong answer in 1v1
        setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
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
    navigate('/');
  };

  return (
    <div className={`app-container ${language === 'he' ? 'rtl-mode' : ''}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="title-glow" onClick={handleReturnToStart} style={{ cursor: 'pointer' }}>{t.title}</h1>

      <InstallPrompt language={language} />


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
              deck={deck || []}
              lives={lives[currentPlayer] || 0}
              coins={coins[currentPlayer] || 0}
              language={language}
              gameMode={gameConfig.gameMode}
              timeLeft={timeLeft}
              avatar={gameConfig.avatars?.[currentPlayer]}
              streak={streaks[currentPlayer]}
              onCoinsChange={(newAmount) => setCoins(prev => ({ ...prev, [currentPlayer]: newAmount }))}
              onAnswer={handleAnswer}
              onTimeout={(cardId) => handleAnswer(cardId, false)}
              onPowerUpUsed={handlePowerUpUsed}
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
