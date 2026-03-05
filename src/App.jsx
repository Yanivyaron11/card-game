import { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import { translations } from './data/translations'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('start') // start, playing, game_over, victory
  const [gameConfig, setGameConfig] = useState(null)
  const [lives, setLives] = useState(1) // 1 extra heart
  const [coins, setCoins] = useState(0) // Starting wealth
  const [language, setLanguage] = useState('he') // en, he

  const t = translations[language];

  const handleStartGame = (config) => {
    setGameConfig(config);
    const initialLives = config.gridSize === 9 ? 1 : config.gridSize === 16 ? 2 : 3;
    const initialCoins = config.gridSize === 9 ? 5 : config.gridSize === 16 ? 10 : 15;
    setLives(initialLives);
    setCoins(initialCoins);
    setGameState('playing');
  };

  return (
    <div className={`app-container ${language === 'he' ? 'rtl-mode' : ''}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="title-glow">{t.title}</h1>

      {gameState === 'start' && (
        <StartScreen
          onStart={handleStartGame}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {gameState === 'playing' && gameConfig && (
        <GameBoard
          config={gameConfig}
          lives={lives}
          onLivesChange={setLives}
          coins={coins}
          onCoinsChange={setCoins}
          language={language}
          onGameOver={() => setGameState('game_over')}
          onVictory={() => setGameState('victory')}
        />
      )}

      {gameState === 'game_over' && (
        <div className="end-screen glass-panel">
          <h2>{t.game_over} 😢</h2>
          <p>{t.ran_out_hearts}</p>
          <button onClick={() => setGameState('start')}>{t.try_again}</button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="end-screen glass-panel">
          <h2>{t.you_win} 🎉</h2>
          <p>{t.matched_all}</p>
          <button onClick={() => setGameState('start')}>{t.play_again}</button>
        </div>
      )}
    </div>
  )
}

export default App
