import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import Rain from './Rain';
import { getSoundEnabled, setSoundEnabled } from '../utils/sounds';
import { translations } from '../data/translations';
import { markQuestionAsSeen } from '../utils/deck';
import QuitConfirmModal from './QuitConfirmModal';
import './GravityBoard.css';

function GravityBoard({ columns, config, coins, language, onCardSelected, onQuit, gameState, failedColumnIndex }) {
    const t = translations[language];
    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);

    if (!columns || columns.length === 0) return null;

    const handleCardClick = (cIndex, rIndex, card) => {
        if (card.status === 'stone' || gameState === 'game_over') return;
        onCardSelected(card.questionId, cIndex, rIndex);
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
        onQuit();
    };

    const getStageInfo = () => {
        const currentPops = coins;
        if (currentPops < 10) {
            return { stage: 1, current: currentPops, target: 10, label: t.stage_1 || 'שלב 1 (חימום)' };
        } else if (currentPops < 20) {
            return { stage: 2, current: currentPops - 10, target: 10, label: t.stage_2 || 'שלב 2 (הגלדיאטור)' };
        } else if (currentPops < 30) {
            return { stage: 3, current: currentPops - 20, target: 10, label: t.stage_3 || 'שלב 3 (בוס האבן)' };
        } else {
            return { stage: 'WIN', current: 1, target: 1, label: t.stage_win || 'אלופים!' };
        }
    };

    const stageInfo = getStageInfo();

    return (
        <div className="gravity-board-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden' }}>

            {/* Top Bar Controls */}
            <div className="game-controls" style={{ marginTop: '1rem', marginBottom: '0.5rem', width: '100%', maxWidth: '450px', display: 'flex', justifyContent: 'space-between', zIndex: 10, padding: '0 1rem' }}>
                <button className="control-btn" onClick={toggleSound}>
                    {soundOn ? '🔊' : '🔇'}
                </button>
                <button className="control-btn quit-btn" onClick={handleQuit}>
                    {t.quit_game} ✕
                </button>
            </div>

            {/* Pill Header */}
            <div className="stats-header glass-panel solo-mode" style={{ zIndex: 10, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', width: '95%', maxWidth: '450px' }}>
                {config.avatars?.[1] && (
                    <div className="stat-item gravity-avatar-display" data-testid="game-avatar">
                        <div className="premium-avatar-box gravity-avatar-box" style={{ borderRadius: '12px', borderWidth: '2px', background: 'rgba(255, 255, 255, 0.4)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                            {config.avatars[1].image ? (
                                <img src={config.avatars[1].image} alt="" className="avatar-img-premium" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span className="player-avatar-emoji">{config.avatars[1].emoji}</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="lives-coins-wrapper gravity-hud">
                    <div className="progress-container" style={{ flex: '1 0 auto', minHeight: '26px', minWidth: '100px', background: 'rgba(0,0,0,0.4)', borderRadius: '15px', height: '26px', position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)' }}>
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (stageInfo.current / stageInfo.target) * 100)}%` }}
                            transition={{ type: 'spring', bounce: 0.2 }}
                            style={{
                                background: stageInfo.stage === 3 ? 'linear-gradient(90deg, #ff416c, #ff4b2b)' : 'linear-gradient(90deg, #00b4db, #0083b0)',
                                height: '100%',
                                borderRadius: '15px'
                            }}
                        />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                            {stageInfo.stage === 'WIN' ? (language === 'he' ? 'האלוף המושלם!' : 'Perfect Champion!') : `${stageInfo.current} / ${stageInfo.target}`}
                        </div>
                    </div>

                    <div className="gravity-hud-bottom-row">
                        <div className="stat-item level-display">
                            <div className="level-badge" style={{ background: stageInfo.stage === 3 ? '#ff4b2b' : '#0083b0', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                {stageInfo.label}
                            </div>
                        </div>
                        <div className="stat-item">
                            <div key={coins} className="coin-pill coin-pop" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#ffd700', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                <img src="/icons/gold_coin.png" alt="coin" className="global-coin" style={{ width: '28px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }} /> {coins}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Board */}
            <div className="gravity-board-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
                <div className="gravity-grid glass-panel" style={{ gridAutoFlow: 'column', gridAutoColumns: '1fr' }}>
                    {columns.map((col, cIndex) => (
                        <div key={`col-${cIndex}`} className={`gravity-column ${failedColumnIndex === cIndex ? 'flashing-column' : ''}`}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {[...col].reverse().map((card, rIndexReversed) => {
                                    const actualRIndex = col.length - 1 - rIndexReversed;
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ y: -80, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                            key={card.id}
                                            className={`gravity-card ${card.status === 'stone' ? 'stone-card' : ''} ${card.status === 'popping' ? 'popping-card' : ''} ${card.powerUp && card.status === 'active' ? 'powerup-bomb' : ''}`}
                                            onClick={() => handleCardClick(cIndex, actualRIndex, card)}
                                        >
                                            {card.status === 'active' && card.powerUp && (
                                                <div className="powerup-overlay">
                                                    <img src={`/icons/bomb_${card.powerUp === 'col' ? 'row' : card.powerUp}.png?v=5`}
                                                        alt={`${card.powerUp} bomb`}
                                                        className={`bomb-3d-icon ${card.powerUp === 'col' ? 'rotate-90' : ''}`}
                                                    />
                                                </div>
                                            )}
                                            {card.status === 'stone' ? (
                                                <div className="stone-visual">
                                                    <img src="/icons/stone_3d.png" alt="Stone" className="stone-3d-img" />
                                                </div>
                                            ) : card.status === 'popping' ? (
                                                <div className="popping-visual">💥</div>
                                            ) : (
                                                <div className="card-inner" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))' }}>
                                                    <div className="gravity-card-emoji">
                                                        {card.topicIcon?.startsWith('/') ? (
                                                            <img src={card.topicIcon} alt="" className="topic-img-icon" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                                        ) : (
                                                            card.topicIcon || '❓'
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Game Over Overlay */}
                <AnimatePresence>
                    {gameState === 'game_over' && (
                        <motion.div 
                            className="game-over-overlay"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ type: 'spring', damping: 15 }}
                        >
                            <div className="game-over-content">
                                <h1>{language === 'he' ? 'המשחק נגמר!' : 'GAME OVER!'}</h1>
                                <p>{language === 'he' ? 'האבנים הגיעו לתקרה...' : 'The stones reached the top...'}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <QuitConfirmModal
                isOpen={isQuitModalOpen}
                onClose={() => setIsQuitModalOpen(false)}
                onConfirm={confirmQuit}
                language={language}
                t={t}
            />
        </div>
    );
}

export default GravityBoard;
