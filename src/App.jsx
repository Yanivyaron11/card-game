import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import QuizOverlay from './components/QuizOverlay'
import { translations } from './data/translations'
import { generateDeck } from './utils/deck'
import { playSound, playMusic, stopMusic } from './utils/sounds'
import './App.css'

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
      const timeLimit = config.gridSize === 9 ? 90 : config.gridSize === 16 ? 180 : 300;
      setTimeLeft(timeLimit);
    } else {
      setTimeLeft(0);
    }

    setDeck(generateDeck(config.gridSize, config.topics, config.difficulty));
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setGameState('playing');
    navigate('/play');
  };

  const checkWinCondition = (currentDeck) => {
    if (currentDeck.length > 0 && currentDeck.every(card => card.isSolved || card.isFailed)) {
      const solvedCount = currentDeck.filter(c => c.isSolved).length;
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
        checkWinCondition(newDeck);
        return newDeck;
      });

      if (gameConfig.gameMode === '1v1') {
        setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    } else {
      const newPlayerLives = lives[currentPlayer] - 1;
      setLives(prev => ({ ...prev, [currentPlayer]: newPlayerLives }));

      if (gameConfig.gameMode === 'solo' || gameConfig.gameMode === 'time_attack') {
        setDeck(prev => {
          const newDeck = prev.map(card =>
            card.id === cardId ? { ...card, isFailed: true } : card
          );
          checkWinCondition(newDeck);
          return newDeck;
        });

        if ((gameConfig.gameMode === 'solo' || gameConfig.gameMode === 'time_attack') && newPlayerLives < 0) {
          playSound('wrong');
          setGameState('game_over');
          navigate('/result');
          return;
        }
      } else {
        // 1v1: Pass turn even on fail
        setDeck(prev => {
          const newDeck = prev.map(card =>
            card.id === cardId ? { ...card, isFailed: true } : card
          );
          checkWinCondition(newDeck);
          return newDeck;
        });

        // If one player runs out of hearts, the game ends
        if (newPlayerLives < 0) {
          // In 1v1, when someone runs out of hearts, we end the game and compare scores
          playSound('victory');
          setGameState('victory');
          navigate('/result');
          return;
        }

        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }

    // If we didn't navigate to /result, go back to /play
    if (location.pathname.startsWith('/quiz')) {
      navigate('/play');
    }
  };

  const handleReturnToStart = () => {
    setGameState('start');
    navigate('/');
  };

  return (
    <div className={`app-container ${language === 'he' ? 'rtl-mode' : ''}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="title-glow" onClick={handleReturnToStart} style={{ cursor: 'pointer' }}>{t.title}</h1>

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
              onCoinsChange={(newAmount) => setCoins(prev => ({ ...prev, [currentPlayer]: newAmount }))}
              onAnswer={handleAnswer}
              onTimeout={(cardId) => handleAnswer(cardId, false)}
            />
          )
        } />

        <Route path="/result" element={
          <div className="end-screen glass-panel">
            {gameState === 'game_over' && (
              <>
                <h2>{t.game_over} 😢</h2>
                <p>{t.ran_out_hearts}</p>
              </>
            )}
            {gameState === 'victory' && (
              <>
                <h2>{t.you_win} 🎉</h2>
                {gameConfig?.gameMode === '1v1' ? (
                  <p>
                    {scores[1] > scores[2] ? t.p1_wins : scores[2] > scores[1] ? t.p2_wins : t.draw}
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
    </div>
  )
}

export default App
