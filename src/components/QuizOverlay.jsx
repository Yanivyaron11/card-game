import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import './QuizOverlay.css';

function QuizOverlay({ deck, lives, coins, language, onCoinsChange, onAnswer, onTimeout, gameMode, timeLeft: gameTimeLeft, avatar, streak }) {
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
    const [isHintVisible, setIsHintVisible] = useState(false);
    const timerRef = useRef(null);
    const timeoutRef = useRef(onTimeout);
    const mountTimeRef = useRef(Date.now());
    const feedbackMessageRef = useRef("");

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
        setIsHintVisible(false);
        setIsReady(false);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [card?.id]);

    useEffect(() => {
        if (!card || gameMode === 'time_attack' || gameMode === 'solo') return;
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
        if (isCorrect) {
            const currentStreak = streak + 1;
            const feedbackPool = currentStreak >= 3 ? t.streak_feedbacks : t.correct_feedbacks;
            const randomMsg = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
            feedbackMessageRef.current = randomMsg
                .replace('{name}', avatar?.name[language] || "")
                .replace('{n}', currentStreak);
        }

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

    const handleHint = () => {
        if (!isReady || isAnswering || coins < 3 || isHintVisible) {
            playSound('error');
            return;
        }
        playSound('buy');
        onCoinsChange(coins - 3);
        setIsHintVisible(true);
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
                    <div className="stat-item level-display">
                        <div className="level-badge mini">{t.level} {card.level}</div>
                    </div>
                    {gameMode !== '1v1' && (
                        <div className="stat-item lives-display">
                            <div className="hearts mini">
                                {Array.from({ length: Math.max(0, lives + 1) }).map((_, i) => (
                                    <span key={i} className="heart-icon mini">❤️</span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="stat-item coins-display">
                        <div key={coins} className="coins-value mini coin-pop">🪙 {coins}</div>
                    </div>
                    {avatar && (
                        <div className="stat-item avatar-display-mini">
                            <span className="quiz-avatar-emoji">{avatar.emoji}</span>
                            <span className="quiz-avatar-name">{avatar.name[language]}</span>
                        </div>
                    )}
                </div>

                <div className="quiz-header">
                    <div className="topic-info">
                        <span
                            className="topic-icon"
                            style={card.topicColor ? {
                                backgroundColor: card.topicColor,
                                borderRadius: '50%',
                                padding: '2px',
                                display: 'inline-flex',
                                width: '1.5em',
                                height: '1.5em',
                                justifyContent: 'center',
                                alignItems: 'center'
                            } : {}}
                        >
                            {card.topicIcon}
                        </span>
                        <span className="topic-name">{card.topicName[language]}</span>
                    </div>
                    {(gameMode !== 'time_attack' && gameMode !== 'solo') && (
                        <div className="timer-container">
                            <div className="timer-label">
                                ⏰ {timeLeft}{t.timer}
                            </div>
                            <div className="timer-bar-large">
                                <div
                                    className="timer-fill-large"
                                    style={{
                                        width: `${(timeLeft / initialTime) * 100}%`,
                                        backgroundColor: timeLeft <= 5 ? 'var(--primary)' : 'var(--secondary)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {gameMode === 'time_attack' && (
                        <div className="timer-container">
                            <div className="timer-label">
                                ⏰ {gameTimeLeft}{t.timer}
                            </div>
                        </div>
                    )}
                </div>

                <div className="quiz-content">
                    <div className="quiz-emoji">{card.emoji}</div>

                    {isHintVisible && card.hint && (
                        <div className="hint-box">
                            <span className="hint-icon">💡</span>
                            <p className="hint-text">{card.hint[language] || card.hint}</p>
                        </div>
                    )}

                    {isAnswering && selectedAnswer === card.correctAnswer && avatar && (
                        <div className={`feedback-toast ${(streak + 1) >= 3 ? 'streak-active' : ''}`}>
                            {feedbackMessageRef.current}
                        </div>
                    )}

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
                            const showCorrect = (gameMode !== '1v1') || (selectedAnswer === card.correctAnswer) || (card.failedAttempts >= 1);
                            if (i === card.correctAnswer && showCorrect) className += " correct";
                            else if (i === selectedAnswer && i !== card.correctAnswer) className += " wrong";
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
                            {card.hint && (
                                <button
                                    className={`powerup-btn ${coins < 3 || isHintVisible || isAnswering ? 'locked' : ''}`}
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        handleHint();
                                    }}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    disabled={!isReady || isAnswering}
                                >
                                    <span className="cost">🪙 3</span>
                                    <div>🔍 {t.hint}</div>
                                </button>
                            )}
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
