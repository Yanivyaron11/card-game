import { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import './QuizOverlay.css';

function QuizOverlay({ card, lives, coins, language, onCoinsChange, onAnswer, onTimeout }) {
    const t = translations[language];
    const [timeLeft, setTimeLeft] = useState(30);
    const [eliminatedOptions, setEliminatedOptions] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        setTimeLeft(30);
        setEliminatedOptions([]);
        setIsReady(false);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [card.id]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    onTimeout();
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
    }, [card.id, onTimeout]);

    const handleOptionClick = (index) => {
        if (!isReady || eliminatedOptions.includes(index)) return;
        if (timerRef.current) clearInterval(timerRef.current);
        onAnswer(index === card.correctAnswer);
    };

    const handle5050 = () => {
        if (!isReady || coins < 2 || eliminatedOptions.length > 0) {
            playSound('error');
            return;
        }
        playSound('buy');
        onCoinsChange(prev => prev - 2);

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
        if (!isReady || coins < 5) {
            playSound('error');
            return;
        }
        playSound('buy');
        onCoinsChange(prev => prev - 5);
        if (timerRef.current) clearInterval(timerRef.current);
        onAnswer(true);
    };

    const optionLabelsEn = ['A', 'B', 'C', 'D'];
    const optionLabelsHe = ['א', 'ב', 'ג', 'ד'];
    const labels = language === 'he' ? optionLabelsHe : optionLabelsEn;

    return (
        <div className="quiz-overlay-backdrop">
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
                        <div className="timer-label">⏰ {timeLeft}{t.timer}</div>
                        <div className="timer-bar-large">
                            <div
                                className="timer-fill-large"
                                style={{
                                    width: `${(timeLeft / 30) * 100}%`,
                                    backgroundColor: timeLeft <= 5 ? 'var(--primary)' : 'var(--secondary)'
                                }}
                            ></div>
                        </div>
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
                    {card.options[language].map((opt, i) => (
                        <button
                            key={i}
                            className={`quiz-option-btn ${eliminatedOptions.includes(i) ? 'eliminated' : ''}`}
                            onClick={() => handleOptionClick(i)}
                            disabled={eliminatedOptions.includes(i)}
                        >
                            <span className="option-label">{labels[i]}</span>
                            <span className="option-text">{opt}</span>
                        </button>
                    ))}
                </div>

                <div className="quiz-footer">
                    <div className="powerup-section">
                        <h4>{t.powerups}</h4>
                        <div className="powerup-buttons">
                            <button
                                className={`powerup-btn ${coins < 2 || eliminatedOptions.length > 0 ? 'locked' : ''}`}
                                onClick={handle5050}
                            >
                                <span className="cost">🪙 2</span>
                                <div>½ 50/50</div>
                            </button>
                            <button
                                className={`powerup-btn ${coins < 5 ? 'locked' : ''}`}
                                onClick={handleSolve}
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
