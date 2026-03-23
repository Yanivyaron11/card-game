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

            <div className="stats-header glass-panel multi-mode" style={{ marginBottom: '1.5rem', marginTop: '0.5rem', alignSelf: 'center', width: '100%', padding: '0.5rem 1rem' }}>
                <div className="multiplayer-stats" style={{ justifyContent: 'space-between', width: '100%', margin: 0, gap: '0.5rem' }}>
                    <div className={`player-box p1 ${currentPlayer === 1 ? 'active-turn' : ''}`} style={{ borderRadius: '50%', width: 'clamp(55px, 15vw, 70px)', height: 'clamp(55px, 15vw, 70px)', flex: 'none', padding: 0, justifyContent: 'center' }}>
                        {p1Display}
                    </div>

                    <div className="vs-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <div className="level-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem clamp(0.5rem, 2.5vw, 1.5rem)' }}>
                            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>⭕</span>
                            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>{language === 'he' ? 'איקס עיגול' : 'Tic-Tac-Toe'}</span>
                        </div>
                        <div className="vs-text" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>VS</div>
                    </div>

                    <div className={`player-box p2 ${currentPlayer === 2 ? 'active-turn' : ''}`} style={{ borderRadius: '50%', width: 'clamp(55px, 15vw, 70px)', height: 'clamp(55px, 15vw, 70px)', flex: 'none', padding: 0, justifyContent: 'center' }}>
                        {p2Display}
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
                    return (
                        <div key={card.id} className={`tictactoe-cell ${isWinningCard ? 'winning-pulse' : ''}`}>
                            <Card
                                card={displayCard}
                                onClick={() => {
                                    if (card.isSolved) return;
                                    onCardSelected(card.id);
                                }}
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
