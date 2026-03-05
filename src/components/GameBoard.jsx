import { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import './GameBoard.css';

function GameBoard({ config, deck, lives, coins, language, onCardSelected }) {
    const t = translations[language];

    const handleCardClick = (id) => {
        playSound('pop');
        onCardSelected(id);
    };

    const gridCols = config.gridSize === 9 ? 3 : config.gridSize === 25 ? 5 : 4;

    return (
        <div className="game-board-container">
            <div className="stats-header glass-panel">
                <div className="stat-item lives-display">
                    <h3>{t.hearts}:</h3>
                    <div className="hearts">
                        {Array.from({ length: Math.max(0, lives + 1) }).map((_, i) => (
                            <span key={i} className="heart-icon">❤️</span>
                        ))}
                    </div>
                </div>
                <div className="stat-item coins-display">
                    <h3>{t.coins}:</h3>
                    <div key={coins} className="coins-value coin-pop">🪙 {coins}</div>
                </div>
            </div>

            <div
                className="card-grid"
                style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
            >
                {deck.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        language={language}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default GameBoard;
