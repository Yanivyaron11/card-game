import React, { useState, useEffect } from 'react';
import Card from './Card';
import { getSoundEnabled, setSoundEnabled, playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import './TicTacToeBoard.css';

export default function TicTacToeBoard({
    config,
    deck,
    avatars,
    currentPlayer,
    language,
    thiefAvailable,
    isThiefModeActive,
    onThiefToggle,
    onThiefAction,
    shieldAvailable,
    isShieldModeActive,
    onShieldToggle,
    onShieldAction,
    onCardSelected,
    onGameOver,
    onQuit
}) {
    const t = translations[language];
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winningLine, setWinningLine] = useState(null);
    const [soundOn, setSoundOn] = useState(getSoundEnabled());

    const toggleSound = () => {
        const newState = !soundOn;
        setSoundEnabled(newState);
        setSoundOn(newState);
    };

    const gameOverTriggered = React.useRef(false);

    // Sync board with deck updates
    useEffect(() => {
        if (gameOverTriggered.current) return;

        const newBoard = Array(9).fill(null);
        let allClaimed = true;
        for (let i = 0; i < 9; i++) {
            if (deck[i]?.isSolved) {
                newBoard[i] = deck[i].owner;
            } else {
                if (!deck[i]?.isFailed) {
                    allClaimed = false;
                }
            }
        }
        setBoard(newBoard);

        // Check Win
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const [a, b, c] of lines) {
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                gameOverTriggered.current = true;
                setWinningLine([a, b, c]);
                if (soundOn) {
                    playSound('victory');
                }
                setTimeout(() => onGameOver(newBoard[a]), 5000); // 5 second delay for celebration
                return;
            }
        }

        // Check Tie
        if (allClaimed) {
            gameOverTriggered.current = true;
            setTimeout(() => onGameOver(null), 500);
        }
    }, [deck, onGameOver]);

    const hasCardP1 = deck.some(c => c.owner === 1);
    const hasCardP2 = deck.some(c => c.owner === 2);

    const p1Avatar = config?.avatars?.[1] || avatars?.[1];
    const p2Avatar = config?.avatars?.[2] || avatars?.[2];

    const p1Display = p1Avatar?.image ? (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={p1Avatar.image} alt="p1" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.4)' }} />
        </div>
    ) : (
        <span className="player-avatar-emoji">{p1Avatar?.emoji || '🔴'}</span>
    );

    const p2Display = p2Avatar?.image ? (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={p2Avatar.image} alt="p2" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.4)' }} />
        </div>
    ) : (
        <span className="player-avatar-emoji">{p2Avatar?.emoji || '🔵'}</span>
    );

    return (
        <div className="tictactoe-board-container" data-testid="tictactoe-board">
            <div className="game-controls">
                <button className="control-btn" onClick={toggleSound}>
                    {soundOn ? '🔊' : '🔇'}
                </button>
                <button className="control-btn quit-btn" onClick={onQuit}>
                    {t.quit_game} ✕
                </button>
            </div>

            <div className="stats-header glass-panel multi-mode" style={{ marginBottom: '1.5rem', marginTop: '0.5rem', alignSelf: 'center', width: '100%', minWidth: 'auto', padding: '0.5rem 1rem' }}>
                <div className="multiplayer-stats" style={{ justifyContent: 'space-between', width: '100%', margin: 0, gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div className={`player-box p1 ${currentPlayer === 1 ? 'active-turn' : ''}`} style={{ borderRadius: '50%', width: 'clamp(55px, 15vw, 70px)', height: 'clamp(55px, 15vw, 70px)', flex: 'none', padding: 0, justifyContent: 'center' }}>
                            {p1Display}
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {thiefAvailable && (
                                <button
                                    className={`action-btn ${currentPlayer === 1 && isThiefModeActive ? 'active-thief-pulse' : ''}`}
                                    disabled={currentPlayer !== 1 || !thiefAvailable[1] || !hasCardP2}
                                    onClick={() => currentPlayer === 1 && hasCardP2 ? onThiefToggle() : null}
                                    style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 1 && thiefAvailable[1] && hasCardP2) ? 'var(--primary)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 1 && thiefAvailable[1] && hasCardP2) ? 1 : 0.3, cursor: currentPlayer === 1 && thiefAvailable[1] && hasCardP2 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                    title={t.thief_button}
                                >
                                    🥷
                                </button>
                            )}
                            {shieldAvailable && (
                                <button
                                    className={`action-btn ${currentPlayer === 1 && isShieldModeActive ? 'active-shield-pulse' : ''}`}
                                    disabled={currentPlayer !== 1 || !shieldAvailable[1] || !hasCardP1}
                                    onClick={() => currentPlayer === 1 && hasCardP1 ? onShieldToggle() : null}
                                    style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 1 && shieldAvailable[1] && hasCardP1) ? 'var(--success-color)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 1 && shieldAvailable[1] && hasCardP1) ? 1 : 0.3, cursor: currentPlayer === 1 && shieldAvailable[1] && hasCardP1 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                    title={t.shield_button || 'Shield'}
                                >
                                    🛡️
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="vs-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <div className="level-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem clamp(0.5rem, 2.5vw, 1.5rem)' }}>
                            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>⭕</span>
                            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>{language === 'he' ? 'איקס עיגול' : 'Tic-Tac-Toe'}</span>
                        </div>
                        <div className="vs-text" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>VS</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div className={`player-box p2 ${currentPlayer === 2 ? 'active-turn' : ''}`} style={{ borderRadius: '50%', width: 'clamp(55px, 15vw, 70px)', height: 'clamp(55px, 15vw, 70px)', flex: 'none', padding: 0, justifyContent: 'center' }}>
                            {p2Display}
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {thiefAvailable && (
                                <button
                                    className={`action-btn ${currentPlayer === 2 && isThiefModeActive ? 'active-thief-pulse' : ''}`}
                                    disabled={currentPlayer !== 2 || !thiefAvailable[2] || !hasCardP1}
                                    onClick={() => currentPlayer === 2 && hasCardP1 ? onThiefToggle() : null}
                                    style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 2 && thiefAvailable[2] && hasCardP1) ? 'var(--secondary)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 2 && thiefAvailable[2] && hasCardP1) ? 1 : 0.3, cursor: currentPlayer === 2 && thiefAvailable[2] && hasCardP1 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                    title={t.thief_button}
                                >
                                    🥷
                                </button>
                            )}
                            {shieldAvailable && (
                                <button
                                    className={`action-btn ${currentPlayer === 2 && isShieldModeActive ? 'active-shield-pulse' : ''}`}
                                    disabled={currentPlayer !== 2 || !shieldAvailable[2] || !hasCardP2}
                                    onClick={() => currentPlayer === 2 && hasCardP2 ? onShieldToggle() : null}
                                    style={{ fontSize: '1.2rem', padding: '0.3rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (currentPlayer === 2 && shieldAvailable[2] && hasCardP2) ? 'var(--success-color)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', opacity: (currentPlayer === 2 && shieldAvailable[2] && hasCardP2) ? 1 : 0.3, cursor: currentPlayer === 2 && shieldAvailable[2] && hasCardP2 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                    title={t.shield_button || 'Shield'}
                                >
                                    🛡️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="tictactoe-grid glass-panel mt-2 p-4">
                {deck.slice(0, 9).map((card, idx) => {
                    // Override card symbol for rendering
                    const displayCard = { ...card };
                    if (displayCard.isSolved) {
                        const ownerAvatar = config.avatars?.[displayCard.owner];
                        if (ownerAvatar?.image) {
                            displayCard.ownerSymbol = <img src={ownerAvatar.image} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.4)', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }} />;
                        } else {
                            displayCard.ownerSymbol = ownerAvatar?.emoji || (displayCard.owner === 1 ? '❌' : '⭕');
                        }
                    }
                    const isWinningCard = winningLine && winningLine.includes(idx);
                    const targetableByThief = isThiefModeActive && displayCard.isSolved && displayCard.owner && displayCard.owner !== currentPlayer && !displayCard.isShielded;
                    const targetableByShield = isShieldModeActive && displayCard.isSolved && displayCard.owner && displayCard.owner === currentPlayer && !displayCard.isShielded;

                    return (
                        <div key={card.id} className={`tictactoe-cell ${isWinningCard ? 'winning-pulse' : ''} ${targetableByThief ? 'targetable-thief' : ''} ${targetableByShield ? 'targetable-shield' : ''}`}
                            onClick={() => {
                                if (isThiefModeActive) {
                                    if (targetableByThief) onThiefAction(card.id);
                                    return; // ignore clicks on other cards during thief mode
                                }
                                if (isShieldModeActive) {
                                    if (targetableByShield) onShieldAction(card.id);
                                    return; // ignore clicks on other cards during shield mode
                                }
                                if (card.isSolved) return;
                                onCardSelected(card.id);
                            }}>
                            <Card
                                card={displayCard}
                                onClick={() => { }} // Click handled by parent div now
                                currentPlayer={currentPlayer}
                                gameMode="tictactoe"
                                language={language}
                                avatars={avatars}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
