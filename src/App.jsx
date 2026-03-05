import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import QuizOverlay from './components/QuizOverlay'
import { translations } from './data/translations'
import { generateDeck } from './utils/deck'
import { playSound } from './utils/sounds'
import './App.css'

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState('start') // start, playing, game_over, victory
  const [gameConfig, setGameConfig] = useState(null)
  const [deck, setDeck] = useState([])
  const [lives, setLives] = useState(1) // 1 extra heart
  const [coins, setCoins] = useState(0) // Starting wealth
  const [language, setLanguage] = useState('he') // en, he

  const t = translations[language];

  // If user hits back button on browser from quiz to root, we should handle it
  // But for this simple app, we'll keep state at App level.

  const handleStartGame = (config) => {
    setGameConfig(config);
    const initialLives = config.gridSize === 9 ? 1 : config.gridSize === 16 ? 2 : 3;
    const initialCoins = config.gridSize === 9 ? 5 : config.gridSize === 16 ? 10 : 15;
    setLives(initialLives);
    setCoins(initialCoins);
    setDeck(generateDeck(config.gridSize, config.topics, config.difficulty));
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

  const handleAnswer = (cardId, isCorrect) => {
    if (isCorrect) {
      playSound('correct');
      setDeck(prev => {
        const newDeck = prev.map(card =>
          card.id === cardId ? { ...card, isSolved: true } : card
        );
        checkWinCondition(newDeck);
        return newDeck;
      });
    } else {
      playSound('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      setDeck(prev => {
        const newDeck = prev.map(card =>
          card.id === cardId ? { ...card, isFailed: true } : card
        );
        checkWinCondition(newDeck);
        return newDeck;
      });

      if (newLives < 0) {
        playSound('wrong');
        setGameState('game_over');
        navigate('/result');
        return; // Crucial: avoid navigating to /play if game over
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
          (!gameConfig || gameState !== 'playing') ? (
            <div className="end-screen glass-panel">
              <button onClick={handleReturnToStart}>{t.try_again}</button>
            </div>
          ) : (
            <GameBoard
              config={gameConfig}
              deck={deck}
              lives={lives}
              coins={coins}
              language={language}
              onCardSelected={(id) => navigate(`/quiz/${id}`)}
            />
          )
        } />

        <Route path="/quiz/:cardId" element={
          (!gameConfig || gameState !== 'playing') ? (
            <div className="end-screen glass-panel">
              <button onClick={handleReturnToStart}>{t.try_again}</button>
            </div>
          ) : (
            <QuizOverlay
              deck={deck}
              lives={lives}
              coins={coins}
              language={language}
              onCoinsChange={setCoins}
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
                <p>{t.matched_all}</p>
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
