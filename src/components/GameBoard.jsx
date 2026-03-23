import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { playSound, getSoundEnabled, setSoundEnabled } from '../utils/sounds';
import { translations } from '../data/translations';
import { markQuestionAsSeen } from '../utils/deck';
import QuitConfirmModal from './QuitConfirmModal';
import './GameBoard.css';

function GameBoard({
    config, deck, lives, coins, language, onCardSelected, currentPlayer, scores, timeLeft, onQuit,
    thiefAvailable, isThiefModeActive, onThiefToggle, onThiefAction,
    shieldAvailable, isShieldModeActive, onShieldToggle, onShieldAction
}) {
    const t = translations[language];
    const navigate = useNavigate();
    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);

    const hasCardP1 = deck.some(c => c.owner === 1);
    const hasCardP2 = deck.some(c => c.owner === 2);

    const handleCardClick = (card) => {
        if (card.isSolved || card.isFailed) return;

        // Block original player from re-attempting in 1v1
        if (config.gameMode === '1v1' && card.failedAttempts === 1 && card.lastFailedPlayer === currentPlayer) {
            return;
        }

        playSound('pop');

        // Mark question as seen only when explicitly clicked
        if (card.questionId) {
            markQuestionAsSeen(card.questionId);
        }

        onCardSelected(card.id);
    };

    const toggleSound = () => {
        const newState = !soundOn;
        setSoundEnabled(newState);
        setSoundOn(newState);
    };

    const handleQuit = () => {
        setIsQuitModalOpen(true);
    };

    const confirmQuit = () => {
        onQuit ? onQuit() : navigate('/');
    };

    const gridCols = config.gridSize === 9 ? 3 : config.gridSize === 25 ? 5 : 4;

    return (
        <div className="game-board-container" data-testid="game-board">
            <div className="game-controls">
                <button className="control-btn" onClick={toggleSound}>
                    {soundOn ? '🔊' : '🔇'}
                </button>
                <button className="control-btn quit-btn" onClick={handleQuit}>
                    {t.quit_game} ✕
                </button>
            </div>

            <div className={`stats-header glass-panel ${config.gameMode === 'solo' || config.gameMode === 'time_attack' ? 'solo-mode' : 'multi-mode'}`}>
                {config.gameMode === 'solo' || config.gameMode === 'time_attack' ? (
                    <>
                        {config.avatars?.[1] && (
                            <div className="stat-item avatar-display" data-testid="game-avatar">
                                <div className="premium-avatar-box" style={{ width: '60px', borderRadius: '8px', borderWidth: '2px', background: 'rgba(255, 255, 255, 0.4)' }}>
                                    {config.avatars[1].image ? (
                                        <img src={config.avatars[1].image} alt={config.avatars[1].name[language]} className="avatar-img-premium" />
                                    ) : (
                                        <span className="player-avatar-emoji" style={{ fontSize: '2.1rem', lineHeight: '60px' }}>{config.avatars[1].emoji}</span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="stat-item level-display">
                            <div className="level-badge">{t.level} {config.difficulty}</div>
                        </div>
                        <div className="lives-coins-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div className="stat-item lives-display">
                                <div className="hearts">
                                    {Array.from({ length: Math.max(0, (lives[1] || 0)) }).map((_, i) => (
                                        <span key={i} className="heart-icon">❤️</span>
                                    ))}
                                </div>
                            </div>
                            <div className="stat-item">
                                <div key={coins} className="coin-pill coin-pop" data-testid="game-coins"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {coins}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="multiplayer-stats">
                        <div className={`player-box p1 ${currentPlayer === 1 ? 'active-turn' : ''}`}>
                            <div className="player-label">
                                {config.avatars?.[1] ? (
                                    <>
                                        <div className="premium-avatar-box" style={{ width: '50px', borderRadius: '10px', borderWidth: '2px' }}>
                                            {config.avatars[1].image ? (
                                                <img src={config.avatars[1].image} alt={config.avatars[1].name[language]} className="avatar-img-premium" />
                                            ) : (
                                                <span className="player-avatar-emoji" style={{ fontSize: '2rem' }}>{config.avatars[1].emoji}</span>
                                            )}
                                        </div>
                                        <span className="player-avatar-name">{config.avatars[1].name[language]}</span>
                                    </>
                                ) : (language === 'he' ? 'שחקן 1' : 'Player 1')}
                            </div>
                            <div className="player-score-value">{t.score}: {scores[1]}</div>
                            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', justifyContent: 'center' }}>
                                {config.gameMode === '1v1' && thiefAvailable && (
                                    <button
                                        className={`action-btn ${currentPlayer === 1 && isThiefModeActive ? 'active-thief-pulse' : ''}`}
                                        disabled={currentPlayer !== 1 || !thiefAvailable[1] || !hasCardP2}
                                        onClick={(e) => { e.stopPropagation(); currentPlayer === 1 && hasCardP2 ? onThiefToggle() : null; }}
                                        style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 1 && thiefAvailable[1] && hasCardP2) ? 'var(--primary)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 1 && thiefAvailable[1] && hasCardP2) ? 1 : 0.3, cursor: currentPlayer === 1 && thiefAvailable[1] && hasCardP2 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                        title={t.thief_button}
                                    >
                                        🥷
                                    </button>
                                )}
                                {config.gameMode === '1v1' && shieldAvailable && (
                                    <button
                                        className={`action-btn ${currentPlayer === 1 && isShieldModeActive ? 'active-shield-pulse' : ''}`}
                                        disabled={currentPlayer !== 1 || !shieldAvailable[1] || !hasCardP1}
                                        onClick={(e) => { e.stopPropagation(); currentPlayer === 1 && hasCardP1 ? onShieldToggle() : null; }}
                                        style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 1 && shieldAvailable[1] && hasCardP1) ? 'var(--success-color)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 1 && shieldAvailable[1] && hasCardP1) ? 1 : 0.3, cursor: currentPlayer === 1 && shieldAvailable[1] && hasCardP1 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                        title={t.shield_button || 'Shield'}
                                    >
                                        🛡️
                                    </button>
                                )}
                            </div>
                            {config.gameMode !== '1v1' && (
                                <div className="p-hearts">
                                    {Array.from({ length: Math.max(0, (lives[1] || 0)) }).map((_, i) => (
                                        <span key={i} className="heart-mini">❤️</span>
                                    ))}
                                </div>
                            )}
                            {config.gameMode !== '1v1' && (
                                <div className="coin-pill mini"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {coins}</div>
                            )}
                        </div>

                        <div className="vs-center">
                            <div className="level-badge mini">{t.level} {config.difficulty}</div>
                            <div className="vs-text">VS</div>
                            <div className="turn-indicator-dot"></div>
                        </div>

                        <div className={`player-box p2 ${currentPlayer === 2 ? 'active-turn' : ''}`}>
                            <div className="player-label">
                                {config.avatars?.[2] ? (
                                    <>
                                        <div className="premium-avatar-box" style={{ width: '50px', borderRadius: '10px', borderWidth: '2px' }}>
                                            {config.avatars[2].image ? (
                                                <img src={config.avatars[2].image} alt={config.avatars[2].name[language]} className="avatar-img-premium" />
                                            ) : (
                                                <span className="player-avatar-emoji" style={{ fontSize: '2rem' }}>{config.avatars[2].emoji}</span>
                                            )}
                                        </div>
                                        <span className="player-avatar-name">{config.avatars[2].name[language]}</span>
                                    </>
                                ) : (language === 'he' ? 'שחקן 2' : 'Player 2')}
                            </div>
                            <div className="player-score-value">{t.score}: {scores[2]}</div>
                            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', justifyContent: 'center' }}>
                                {config.gameMode === '1v1' && thiefAvailable && (
                                    <button
                                        className={`action-btn ${currentPlayer === 2 && isThiefModeActive ? 'active-thief-pulse' : ''}`}
                                        disabled={currentPlayer !== 2 || !thiefAvailable[2] || !hasCardP1}
                                        onClick={(e) => { e.stopPropagation(); currentPlayer === 2 && hasCardP1 ? onThiefToggle() : null; }}
                                        style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 2 && thiefAvailable[2] && hasCardP1) ? 'var(--secondary)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 2 && thiefAvailable[2] && hasCardP1) ? 1 : 0.3, cursor: currentPlayer === 2 && thiefAvailable[2] && hasCardP1 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                        title={t.thief_button}
                                    >
                                        🥷
                                    </button>
                                )}
                                {config.gameMode === '1v1' && shieldAvailable && (
                                    <button
                                        className={`action-btn ${currentPlayer === 2 && isShieldModeActive ? 'active-shield-pulse' : ''}`}
                                        disabled={currentPlayer !== 2 || !shieldAvailable[2] || !hasCardP2}
                                        onClick={(e) => { e.stopPropagation(); currentPlayer === 2 && hasCardP2 ? onShieldToggle() : null; }}
                                        style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 2 && shieldAvailable[2] && hasCardP2) ? 'var(--success-color)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 2 && shieldAvailable[2] && hasCardP2) ? 1 : 0.3, cursor: currentPlayer === 2 && shieldAvailable[2] && hasCardP2 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                        title={t.shield_button || 'Shield'}
                                    >
                                        🛡️
                                    </button>
                                )}
                            </div>
                            {config.gameMode !== '1v1' && (
                                <div className="p-hearts">
                                    {Array.from({ length: Math.max(0, (lives[2] || 0)) }).map((_, i) => (
                                        <span key={i} className="heart-mini">❤️</span>
                                    ))}
                                </div>
                            )}
                            {config.gameMode !== '1v1' && (
                                <div className="coin-pill mini"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {coins}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {config.gameMode === 'time_attack' && (
                <div className="timer-row card-pop">
                    <div className="global-countdown">
                        <span className="timer-icon">⏰</span>
                        <span className="timer-text">{t.time_left.replace('{n}', timeLeft)}</span>
                    </div>
                </div>
            )}

            <div
                className={`card-grid size-${gridCols} glass-panel`}
                style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
            >
                {deck.map(card => {
                    const targetableByThief = isThiefModeActive && card.isSolved && card.owner && card.owner !== currentPlayer && !card.isShielded;
                    const targetableByShield = isShieldModeActive && card.isSolved && card.owner && card.owner === currentPlayer && !card.isShielded;

                    let wrapperClass = '';
                    if (targetableByThief) wrapperClass = 'targetable-thief';
                    if (targetableByShield) wrapperClass = 'targetable-shield';

                    return (
                        <Card
                            key={card.id}
                            card={card}
                            language={language}
                            wrapperClass={wrapperClass}
                            onClick={() => {
                                if (isThiefModeActive) {
                                    if (targetableByThief) onThiefAction(card.id);
                                    return; // Consume click if thief mode is active
                                }
                                if (isShieldModeActive) {
                                    if (targetableByShield) onShieldAction(card.id);
                                    return;
                                }
                                handleCardClick(card);
                            }}
                            currentPlayer={currentPlayer}
                            gameMode={config.gameMode}
                            avatars={config.avatars}
                        />
                    );
                })}
            </div>
            <QuitConfirmModal
                isOpen={isQuitModalOpen}
                onClose={() => setIsQuitModalOpen(false)}
                onConfirm={confirmQuit}
                language={language}
            />
        </div>
    );
}

export default GameBoard;
