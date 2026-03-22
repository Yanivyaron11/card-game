import React, { useState, useEffect } from 'react';
import Card from './Card';
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
    const [board, setBoard] = useState(Array(9).fill(null));

    // Sync board with deck updates
    useEffect(() => {
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
                setTimeout(() => onGameOver(newBoard[a]), 500);
                return;
            }
        }

        // Check Tie
        if (allClaimed) {
            setTimeout(() => onGameOver(null), 500);
        }
    }, [deck, onGameOver]);

    const p1Emoji = avatars?.[1]?.emoji || '🔴';
    const p2Emoji = avatars?.[2]?.emoji || '🔵';

    return (
        <div className="tictactoe-board-container" data-testid="tictactoe-board">
            <div className="game-controls">
                <button className="control-btn quit-btn" onClick={onQuit}>✕</button>
            </div>

            <div className="tictactoe-header glass-panel">
                <div className={`player-box p1 ${currentPlayer === 1 ? 'active-turn' : ''}`}>
                    <span className="player-avatar-emoji">{p1Emoji}</span>
                </div>
                <div className="vs-badge">VS</div>
                <div className={`player-box p2 ${currentPlayer === 2 ? 'active-turn' : ''}`}>
                    <span className="player-avatar-emoji">{p2Emoji}</span>
                </div>
            </div>

            <div className="tictactoe-grid glass-panel mt-6 p-4">
                {deck.slice(0, 9).map((card, idx) => {
                    // Override card symbol for rendering
                    const displayCard = { ...card };
                    if (displayCard.isSolved) {
                        const ownerAvatar = config.avatars?.[displayCard.owner];
                        if (ownerAvatar?.image) {
                            displayCard.ownerSymbol = <img src={ownerAvatar.image} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }} />;
                        } else {
                            displayCard.ownerSymbol = ownerAvatar?.emoji || (displayCard.owner === 1 ? '❌' : '⭕');
                        }
                    }
                    return (
                        <div key={card.id} className="tictactoe-cell">
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
