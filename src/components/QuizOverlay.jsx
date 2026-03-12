import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playSound } from '../utils/sounds';
import { translations } from '../data/translations';
import QuitConfirmModal from './QuitConfirmModal';
import './QuizOverlay.css';

function QuizOverlay({ deck, lives, coins, language, onCoinsChange, onAnswer, onTimeout, onPowerUpUsed, gameMode, gameConfig, timeLeft: gameTimeLeft, avatar, streak, survivalIndex, survivalCorrect, usedSurvivalPowerups = {}, onSurvivalPowerupUsed, bestScore, onQuit }) {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const t = translations[language];

    // Find the correct card from the deck based on the URL parameter
    const card = deck.find(c => c.id === cardId);

    const getInitialTime = () => {
        if (!card) return 30;
        if (gameMode === 'survival') {
            if (card.level === 3) return 20;
            if (card.level === 2) return 25;
            return 30;
        }
        if (card.level === 3) return 10;
        if (card.level === 2) return 20;
        return 30;
    };

    const initialTime = getInitialTime();
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isReady, setIsReady] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswering, setIsAnswering] = useState(false);
    const timerRef = useRef(null);
    const timeoutRef = useRef(onTimeout);
    const mountTimeRef = useRef(Date.now());
    const feedbackMessageRef = useRef("");
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!card) return;

        const readyTimeout = setTimeout(() => setIsReady(true), 500);

        // Setup interval
        if (gameMode !== 'time_attack') {
            // Solo mode doesn't have a per-question timer, but survival does
            if (!(gameMode === 'solo' && !gameTimeLeft)) {
                timerRef.current = setInterval(() => {
                    if (isPaused) return;
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            return 0;
                        }
                        if (prev <= 6) {
                            playSound('timer');
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }

        return () => {
            clearTimeout(readyTimeout);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [card?.id, gameMode, gameTimeLeft, isPaused]);

    useEffect(() => {
        if (timeLeft === 0 && !isAnswering && isReady) {
            if (timeoutRef.current) timeoutRef.current(cardId);
        }
    }, [timeLeft, isAnswering, isReady, cardId]);

    if (!card) return null;

    const handleOptionClick = (index) => {
        if (!isReady || isAnswering || (card.eliminatedIndices || []).includes(index)) return;
        if (timerRef.current) clearInterval(timerRef.current);

        setIsAnswering(true);
        setSelectedAnswer(index);

        const isCorrect = index === card.correctAnswer;
        if (isCorrect) {
            const currentStreak = streak + 1;
            let randomMsg = "";

            if (gameMode === '1v1' && card.failedAttempts >= 1 && !card.isTainted && card.options.he.length > 2) {
                randomMsg = t.rebound_feedback;
            } else {
                const feedbackPool = currentStreak >= 3 ? t.streak_feedbacks : t.correct_feedbacks;
                randomMsg = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
            }

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
        if (gameMode === 'survival') {
            if (!isReady || isAnswering || usedSurvivalPowerups['5050'] || (card.eliminatedIndices?.length > 0)) {
                playSound('error');
                return;
            }
            if (onSurvivalPowerupUsed) onSurvivalPowerupUsed('5050');
        } else {
            if (!isReady || isAnswering || coins < 2 || (card.eliminatedIndices?.length > 0)) {
                playSound('error');
                return;
            }
            onCoinsChange(coins - 2);
        }
        playSound('buy');

        const wrongIndices = card.options.en
            .map((_, index) => index)
            .filter(index => index !== card.correctAnswer);

        const shuffledWrong = wrongIndices.sort(() => Math.random() - 0.5);
        const toEliminate = shuffledWrong.slice(0, 2);

        if (onPowerUpUsed) onPowerUpUsed(card.id, '5050', toEliminate);
    };

    const handleSolve = () => {
        if (gameMode === 'survival') {
            if (!isReady || isAnswering || usedSurvivalPowerups['solve']) {
                playSound('error');
                return;
            }
            if (onSurvivalPowerupUsed) onSurvivalPowerupUsed('solve');
        } else {
            if (!isReady || isAnswering || coins < 5) {
                playSound('error');
                return;
            }
            onCoinsChange(coins - 5);
        }
        playSound('buy');
        if (onPowerUpUsed) onPowerUpUsed(card.id, 'solve');
        if (timerRef.current) clearInterval(timerRef.current);

        if (avatar) {
            feedbackMessageRef.current = t.solved_powerup;
        }

        setIsAnswering(true);
        setSelectedAnswer(card.correctAnswer);
        playSound('correct');

        setTimeout(() => {
            onAnswer(card.id, true, true);
        }, 1500);
    };

    const handleHint = () => {
        if (gameMode === 'survival') {
            if (!isReady || isAnswering || usedSurvivalPowerups['hint'] || card.isHintVisible) {
                playSound('error');
                return;
            }
            if (onSurvivalPowerupUsed) onSurvivalPowerupUsed('hint');
        } else {
            if (!isReady || isAnswering || coins < 1 || card.isHintVisible) {
                playSound('error');
                return;
            }
            onCoinsChange(coins - 1);
        }
        playSound('buy');
        if (onPowerUpUsed) onPowerUpUsed(card.id, 'hint');
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
                <button
                    className="quiz-quit-btn"
                    onClick={() => setIsQuitModalOpen(true)}
                    title={t.quit_game}
                >
                    ✕
                </button>
                <div className="quiz-stats-header">
                    {gameMode !== 'survival' && (
                        <div className="stat-item level-display">
                            <div className="level-badge mini">{t.level} {card.level}</div>
                        </div>
                    )}
                    {gameMode !== '1v1' && (
                        <div className="stat-item lives-display">
                            <div className="hearts mini">
                                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                                    <span key={i} className="heart-icon mini">❤️</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {gameMode !== 'survival' && (
                        <div className="stat-item coins-display">
                            <div key={coins} className="coins-value mini coin-pop">🪙 {coins}</div>
                        </div>
                    )}
                    {gameMode === 'survival' && (
                        <div className="stat-item survival-progress-section">
                            {(() => {
                                const cardLevel = card.level;
                                const isAdult = gameConfig?.survivalType === 'adult';

                                // Child: 15 (L1), 10 (L2), 5 (L3)
                                // Adult: 5 (L1), 15 (L2), 10 (L3)
                                let segmentSize, offset;
                                if (isAdult) {
                                    segmentSize = cardLevel === 1 ? 5 : cardLevel === 2 ? 15 : 10;
                                    offset = cardLevel === 1 ? 0 : cardLevel === 2 ? 5 : 20;
                                } else {
                                    segmentSize = cardLevel === 1 ? 15 : cardLevel === 2 ? 10 : 5;
                                    offset = cardLevel === 1 ? 0 : cardLevel === 2 ? 15 : 25;
                                }

                                const indexInLevel = survivalIndex - offset;
                                const percentage = segmentSize > 0 ? Math.max(5, ((indexInLevel + 1) / segmentSize) * 100) : 0;
                                return (
                                    <div className="survival-progress-bar-wrapper">
                                        <div
                                            className="survival-progress-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                        <div className="survival-progress-text-overlay">
                                            <span className="survival-progress-text" dir="ltr">
                                                {indexInLevel + 1} / {segmentSize}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                            <div className="survival-level-indicator">
                                {t.level} {card.level}
                            </div>
                        </div>
                    )}
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
                    {gameMode === 'survival' && (
                        <div className="survival-score-header">
                            <div className="survival-score-item">🎯 {t.correct_count.replace('{n}', survivalCorrect || 0)}</div>
                            <div className="survival-score-item best-score">🏆 {t.best}: {bestScore || 0}</div>
                        </div>
                    )}
                    {gameMode !== 'time_attack' && (
                        <div className="timer-container">
                            <div className="timer-header">
                                <div className="timer-label">
                                    ⏰ {timeLeft}{t.timer}
                                </div>
                                {gameMode === 'survival' && (
                                    <button
                                        className="pause-btn"
                                        onClick={() => setIsPaused(true)}
                                        title={t.pause}
                                    >
                                        ⏸️
                                    </button>
                                )}
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

                    {card.isHintVisible && (
                        <div className="hint-box">
                            <span className="hint-icon">💡</span>
                            <p className="hint-text">
                                {card.hint ? (card.hint[language] || card.hint) : t.fallback_hint}
                            </p>
                        </div>
                    )}

                    {isAnswering && selectedAnswer === card.correctAnswer && avatar && (
                        <div className={`feedback-toast ${(streak + 1) >= 3 ? 'streak-active' : ''}`}>
                            {feedbackMessageRef.current}
                        </div>
                    )}

                    {gameMode === '1v1' && card.failedAttempts === 1 && !card.isTainted && card.options.he.length > 2 && (
                        <div className="super-answer-indicator">
                            🚀 {t.rebound}
                        </div>
                    )}

                    {gameMode === '1v1' && card.failedAttempts === 1 && card.isTainted && (
                        <div className="rebound-cancelled-notice">
                            ⚠️ {t.rebound_cancelled}
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
                        const showCorrect = (gameMode !== '1v1') || (selectedAnswer === card.correctAnswer) || (card.failedAttempts >= 1);
                        const className = [
                            "quiz-option-btn",
                            isAnswering && Number(i) === Number(card.correctAnswer) && showCorrect ? 'correct' : '',
                            isAnswering && Number(i) === Number(selectedAnswer) && Number(i) !== Number(card.correctAnswer) ? 'wrong' : '',
                            (card.eliminatedIndices || []).includes(i) ? 'eliminated' : ''
                        ].filter(Boolean).join(' ');

                        return (
                            <button
                                key={i}
                                className={className}
                                onClick={() => handleOptionClick(i)}
                                disabled={isAnswering || (card.eliminatedIndices || []).includes(i)}
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
                                className={`powerup-btn half ${((gameMode === 'survival' ? usedSurvivalPowerups['5050'] : coins < 2) || (card.eliminatedIndices?.length > 0) || isAnswering) ? 'locked' : ''}`}
                                onClick={handle5050}
                                disabled={(gameMode === 'survival' ? usedSurvivalPowerups['5050'] : coins < 2) || (card.eliminatedIndices?.length > 0) || isAnswering}
                            >
                                <span className="icon">🌓</span>
                                <span className="name">{t.powerup_5050}</span>
                                <span className="cost">
                                    {gameMode === 'survival'
                                        ? (usedSurvivalPowerups['5050'] ? (language === 'he' ? 'נוצל' : 'Used') : (language === 'he' ? 'חד פעמי' : 'Once'))
                                        : '🪙 2'}
                                </span>
                            </button>

                            {card.level >= 3 && (
                                <button
                                    className={`powerup-btn hint ${((gameMode === 'survival' ? usedSurvivalPowerups['hint'] : coins < 1) || card.isHintVisible || isAnswering) ? 'locked' : ''}`}
                                    onClick={handleHint}
                                    disabled={(gameMode === 'survival' ? usedSurvivalPowerups['hint'] : coins < 1) || card.isHintVisible || isAnswering}
                                >
                                    <span className="icon">💡</span>
                                    <span className="name">{t.powerup_hint}</span>
                                    <span className="cost">
                                        {gameMode === 'survival'
                                            ? (usedSurvivalPowerups['hint'] ? (language === 'he' ? 'נוצל' : 'Used') : (language === 'he' ? 'חד פעמי' : 'Once'))
                                            : '🪙 1'}
                                    </span>
                                </button>
                            )}

                            <button
                                className={`powerup-btn solve ${((gameMode === 'survival' ? usedSurvivalPowerups['solve'] : coins < 5) || isAnswering) ? 'locked' : ''}`}
                                onClick={handleSolve}
                                disabled={(gameMode === 'survival' ? usedSurvivalPowerups['solve'] : coins < 5) || isAnswering}
                            >
                                <span className="icon">⚡</span>
                                <span className="name">{t.powerup_solve}</span>
                                <span className="cost">
                                    {gameMode === 'survival'
                                        ? (usedSurvivalPowerups['solve'] ? (language === 'he' ? 'נוצל' : 'Used') : (language === 'he' ? 'חד פעמי' : 'Once'))
                                        : '🪙 5'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isPaused && (
                <div className="pause-overlay">
                    <div className="pause-modal card-pop">
                        <h2>{t.paused}</h2>
                        <div className="pause-icon">⏳</div>
                        <button className="resume-btn" onClick={() => setIsPaused(false)}>
                            {t.resume}
                        </button>
                    </div>
                </div>
            )}

            <QuitConfirmModal
                isOpen={isQuitModalOpen}
                onClose={() => setIsQuitModalOpen(false)}
                onConfirm={onQuit}
                language={language}
            />
        </div>
    );
}

export default QuizOverlay;
