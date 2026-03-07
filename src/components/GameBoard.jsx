import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { playSound, getSoundEnabled, setSoundEnabled } from '../utils/sounds';
import { translations } from '../data/translations';
import './GameBoard.css';

function GameBoard({ config, deck, lives, coins, language, onCardSelected, currentPlayer, scores, timeLeft }) {
    const t = translations[language];
    const navigate = useNavigate();
    const [soundOn, setSoundOn] = useState(getSoundEnabled());

    const handleCardClick = (card) => {
        if (card.isSolved || card.isFailed) return;
        playSound('pop');
        onCardSelected(card.id);
    };

    const toggleSound = () => {
        const newState = !soundOn;
        setSoundEnabled(newState);
        setSoundOn(newState);
    };

    const handleQuit = () => {
        navigate('/');
    };

    const gridCols = config.gridSize === 9 ? 3 : config.gridSize === 25 ? 5 : 4;

    return (
        <div className="game-board-container">
            <div className="game-controls">
                <button className="control-btn" onClick={toggleSound}>
                    {soundOn ? '🔊' : '🔇'}
                </button>
                <button className="control-btn quit-btn" onClick={handleQuit}>
                    {t.quit_game} ✕
                </button>
            </div>

            <div className="stats-header glass-panel">
                {config.gameMode === 'time_attack' ? (
                    <div className="stat-item timer-display-global">
                        <div className="level-badge mini">{t.level} {config.difficulty}</div>
                        <h3>{t.time_left.replace('{n}', timeLeft)}</h3>
                        <div className="hearts-coins-row">
                            <div className="hearts mini">
                                {Array.from({ length: Math.max(0, (lives[1] || 0) + 1) }).map((_, i) => (
                                    <span key={i} className="heart-icon mini">❤️</span>
                                ))}
                            </div>
                            <div className="stat-item coins-display">
                                <div key={coins[1]} className="coins-value coin-pop">🪙 {coins[1]}</div>
                            </div>
                        </div>
                    </div>
                ) : config.gameMode === 'solo' ? (
                    <>
                        <div className="stat-item level-display">
                            <div className="level-badge">{t.level} {config.difficulty}</div>
                        </div>
                        <div className="stat-item lives-display">

                            <div className="hearts">
                                {Array.from({ length: Math.max(0, (lives[1] || 0) + 1) }).map((_, i) => (
                                    <span key={i} className="heart-icon">❤️</span>
                                ))}
                            </div>
                        </div>
                        <div className="stat-item coins-display">

                            <div key={coins[1]} className="coins-value coin-pop">🪙 {coins[1]}</div>
                        </div>
                    </>
                ) : (
                    <div className="multiplayer-stats">
                        <div className={`player-box p1 ${currentPlayer === 1 ? 'active-turn' : ''}`}>
                            <div className="player-label">P1</div>
                            <div className="level-badge mini">{t.level} {config.difficulty}</div>
                            <div className="player-score-value">{t.score}: {scores[1]}</div>
                            <div className="p-hearts">
                                {Array.from({ length: Math.max(0, (lives[1] || 0) + 1) }).map((_, i) => (
                                    <span key={i} className="heart-mini">❤️</span>
                                ))}
                            </div>
                            <div className="p-coins">🪙 {coins[1]}</div>
                        </div>

                        <div className="vs-center">
                            <div className="level-badge mini">{t.level} {config.difficulty}</div>
                            <div className="vs-text">VS</div>
                            <div className="turn-indicator-dot"></div>
                        </div>

                        <div className={`player-box p2 ${currentPlayer === 2 ? 'active-turn' : ''}`}>
                            <div className="player-label">P2</div>
                            <div className="level-badge mini">{t.level} {config.difficulty}</div>
                            <div className="player-score-value">{t.score}: {scores[2]}</div>
                            <div className="p-hearts">
                                {Array.from({ length: Math.max(0, (lives[2] || 0) + 1) }).map((_, i) => (
                                    <span key={i} className="heart-mini">❤️</span>
                                ))}
                            </div>
                            <div className="p-coins">🪙 {coins[2]}</div>
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`card-grid size-${gridCols}`}
                style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
            >
                {deck.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        language={language}
                        onClick={() => handleCardClick(card)}
                    />
                ))}
            </div>
        </div>
    );
}

export default GameBoard;
