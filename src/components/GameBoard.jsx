import { useState, useEffect } from 'react';
import Card from './Card';
import QuizOverlay from './QuizOverlay';
import { generateDeck } from '../utils/deck';
import { playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import './GameBoard.css';

function GameBoard({ config, lives, onLivesChange, coins, onCoinsChange, language, onGameOver, onVictory }) {
    const t = translations[language];
    const [deck, setDeck] = useState([]);
    const [activeCardId, setActiveCardId] = useState(null);

    useEffect(() => {
        const newDeck = generateDeck(config.gridSize, config.topics, config.difficulty);
        setDeck(newDeck);
    }, [config]);

    const activeCard = deck.find(c => c.id === activeCardId);

    const handleCardClick = (id) => {
        playSound('pop');
        setActiveCardId(id);
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
            setActiveCardId(null);
        } else {
            playSound('wrong');
            const newLives = lives - 1;
            onLivesChange(newLives);

            setDeck(prev => {
                const newDeck = prev.map(card =>
                    card.id === cardId ? { ...card, isFailed: true } : card
                );
                checkWinCondition(newDeck);
                return newDeck;
            });
            setActiveCardId(null);

            if (newLives < 0) {
                playSound('wrong');
                onGameOver();
            }
        }
    };

    const checkWinCondition = (currentDeck) => {
        if (currentDeck.length > 0 && currentDeck.every(card => card.isSolved || card.isFailed)) {
            const solvedCount = currentDeck.filter(c => c.isSolved).length;
            if (solvedCount > currentDeck.length / 2) {
                playSound('victory');
                onVictory();
            } else {
                onGameOver();
            }
        }
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

            {activeCard && (
                <QuizOverlay
                    card={activeCard}
                    coins={coins}
                    language={language}
                    onCoinsChange={onCoinsChange}
                    onAnswer={(isCorrect) => handleAnswer(activeCard.id, isCorrect)}
                    onTimeout={() => handleAnswer(activeCard.id, false)}
                />
            )}
        </div>
    );
}

export default GameBoard;
