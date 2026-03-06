import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import './QuizOverlay.css';

function QuizOverlay({ deck, lives, coins, language, onCoinsChange, onAnswer, onTimeout, gameMode, timeLeft: gameTimeLeft }) {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const t = translations[language];

    // Find the correct card from the deck based on the URL parameter
    const card = deck.find(c => c.id === cardId);

    const getInitialTime = () => {
        if (!card) return 30;
        if (card.level === 3) return 10;
        if (card.level === 2) return 20;
        return 30;
    };

    const initialTime = getInitialTime();
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [eliminatedOptions, setEliminatedOptions] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(-1);
    const [isAnswering, setIsAnswering] = useState(false);
    const timerRef = useRef(null);
    const timeoutRef = useRef(onTimeout);
    const mountTimeRef = useRef(Date.now());

    useEffect(() => {
        timeoutRef.current = onTimeout;
    }, [onTimeout]);

    useEffect(() => {
        timeoutRef.current = onTimeout;
    }, [onTimeout]);

    useEffect(() => {
        if (!card) return; // Prevent crashes if card is not found yet
        setTimeLeft(initialTime);
        setEliminatedOptions([]);
        setSelectedAnswer(-1);
        setIsAnswering(false);
        setIsReady(false);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [card?.id]);

    useEffect(() => {
        if (!card || gameMode === 'time_attack') return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (timeoutRef.current) timeoutRef.current();
                    return 0;
                }
                if (prev <= 6) {
                    playSound('timer');
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [card?.id]);

    // Handle case where card is not found or user navigated directly
    useEffect(() => {
        if (deck.length > 0 && !card) {
            navigate('/play');
        }
    }, [deck, card, navigate]);

    if (!card) return null;

    const handleOptionClick = (index) => {
        if (!isReady || isAnswering || eliminatedOptions.includes(index)) return;
        if (timerRef.current) clearInterval(timerRef.current);

        setIsAnswering(true);
        setSelectedAnswer(index);

        const isCorrect = index === card.correctAnswer;
        playSound(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            onAnswer(card.id, isCorrect, true);
        }, 1500);
    };

    const handle5050 = () => {
        if (!isReady || isAnswering || coins < 2 || eliminatedOptions.length > 0) {
            playSound('error');
            return;
        }
        playSound('buy');
        onCoinsChange(coins - 2);

        // Find all incorrect indices
        const wrongIndices = card.options.en
            .map((_, index) => index)
            .filter(index => index !== card.correctAnswer);

        // Pick 2 random wrong answers to eliminate
        const shuffledWrong = wrongIndices.sort(() => Math.random() - 0.5);
        const toEliminate = shuffledWrong.slice(0, 2);
        setEliminatedOptions(toEliminate);
    };

    const handleSolve = () => {
        if (!isReady || isAnswering || coins < 5) {
            playSound('error');
            return;
        }
        playSound('buy');
        onCoinsChange(coins - 5);
        if (timerRef.current) clearInterval(timerRef.current);

        setIsAnswering(true);
        setSelectedAnswer(card.correctAnswer);
        playSound('correct');

        setTimeout(() => {
            onAnswer(card.id, true, true);
        }, 1500);
    };

    const optionLabelsEn = ['A', 'B', 'C', 'D'];
    const optionLabelsHe = ['א', 'ב', 'ג', 'ד'];
    const labels = language === 'he' ? optionLabelsHe : optionLabelsEn;

    return (
        <div className="quiz-overlay-backdrop">
            {!isReady && (
                <div
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, touchAction: 'none' }}
                    onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                />
            )}
            <div className={`quiz-card glass-panel ${language === 'he' ? 'rtl' : ''} ${!isReady ? 'not-ready' : ''}`}>
                <div className="quiz-stats-header">
                    <div className="stat-item lives-display">
                        <span className="stat-label">{t.hearts}:</span>
                        <div className="hearts mini">
                            {Array.from({ length: Math.max(0, lives + 1) }).map((_, i) => (
                                <span key={i} className="heart-icon mini">❤️</span>
                            ))}
                        </div>
                    </div>
                    <div className="stat-item coins-display">
                        <span className="stat-label">{t.coins}:</span>
                        <div key={coins} className="coins-value mini coin-pop">🪙 {coins}</div>
                    </div>
                </div>

                <div className="quiz-header">
                    <div className="topic-info">
                        <span className="topic-icon">{card.topicIcon}</span>
                        <span className="topic-name">{card.topicName[language]}</span>
                    </div>
                    <div className="timer-container">
                        <div className="timer-label">
                            ⏰ {gameMode === 'time_attack' ? gameTimeLeft : timeLeft}{t.timer}
                        </div>
                        {gameMode !== 'time_attack' && (
                            <div className="timer-bar-large">
                                <div
                                    className="timer-fill-large"
                                    style={{
                                        width: `${(timeLeft / initialTime) * 100}%`,
                                        backgroundColor: timeLeft <= 5 ? 'var(--primary)' : 'var(--secondary)'
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="quiz-content">
                    {card.level === 1 && <div className="quiz-emoji">{card.emoji}</div>}
                    {card.category === 'math' ? (
                        <h2 className="quiz-question" dir="ltr">{card.text[language]}</h2>
                    ) : (
                        <h2 className="quiz-question">{card.text[language]}</h2>
                    )}
                </div>

                <div className="quiz-options">
                    {card.options[language].map((opt, i) => {
                        let className = "quiz-option-btn";
                        if (eliminatedOptions.includes(i)) className += " eliminated";
                        if (isAnswering) {
                            if (i === card.correctAnswer) className += " correct";
                            else if (i === selectedAnswer) className += " wrong";
                        }

                        return (
                            <button
                                key={i}
                                className={className}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    handleOptionClick(i);
                                }}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                disabled={!isReady || isAnswering || eliminatedOptions.includes(i)}
                            >
                                <span className="option-label">{labels[i]}</span>
                                <span className="option-text">{opt}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="quiz-footer">
                    <div className="powerup-section">
                        <h4>{t.powerups}</h4>
                        <div className="powerup-buttons">
                            <button
                                className={`powerup-btn ${coins < 2 || eliminatedOptions.length > 0 || isAnswering ? 'locked' : ''}`}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    handle5050();
                                }}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                disabled={!isReady || isAnswering}
                            >
                                <span className="cost">🪙 2</span>
                                <div>½ 50/50</div>
                            </button>
                            <button
                                className={`powerup-btn ${coins < 5 || isAnswering ? 'locked' : ''}`}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    handleSolve();
                                }}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                disabled={!isReady || isAnswering}
                            >
                                <span className="cost">🪙 5</span>
                                <div>💡 {t.solve}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizOverlay;
