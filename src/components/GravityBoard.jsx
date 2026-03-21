import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSoundEnabled, setSoundEnabled } from '../utils/sounds';
import { translations } from '../data/translations';
import QuitConfirmModal from './QuitConfirmModal';
import './GravityBoard.css';

function GravityBoard({ columns, config, coins, language, onCardSelected, onQuit }) {
    const t = translations[language];
    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);

    if (!columns || columns.length === 0) return null;

    const handleCardClick = (cIndex, rIndex, card) => {
        if (card.status === 'stone') return;
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

    return (
        <div className="gravity-board-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden' }}>

            {/* Top Bar Controls */}
            <div className="game-controls" style={{ marginTop: '1rem', marginBottom: '0.5rem', width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', zIndex: 10, padding: '0 1rem' }}>
                <button className="control-btn" onClick={toggleSound}>
                    {soundOn ? '🔊' : '🔇'}
                </button>
                <button className="control-btn quit-btn" onClick={handleQuit}>
                    {t.quit_game} ✕
                </button>
            </div>

            {/* Pill Header */}
            <div className="stats-header glass-panel solo-mode" style={{ zIndex: 10, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

                <div className="lives-coins-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="stat-item level-display">
                        <div className="level-badge" style={{ background: 'linear-gradient(135deg, #FF4B2B, #FF416C)', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '13px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            {t.endless || 'מפולת'}
                        </div>
                    </div>
                    <div className="stat-item">
                        <div key={coins} className="coin-pill coin-pop" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#ffd700', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                            <img src="/icons/gold_coin.png" alt="coin" className="global-coin" style={{ width: '28px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }} /> {coins}
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Board */}
            <div className="gravity-board-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div className="gravity-grid glass-panel" style={{ gridAutoFlow: 'column', gridAutoColumns: '1fr' }}>
                    {columns.map((col, cIndex) => (
                        <div key={`col-${cIndex}`} className="gravity-column">
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
                                            {card.powerUp && card.status !== 'stone' && card.status !== 'popping' && (
                                                <div className={`powerup-overlay powerup-${card.powerUp}`}>
                                                    <img
                                                        src={`/icons/bomb_${card.powerUp}.png?v=4`}
                                                        alt={`${card.powerUp} bomb`}
                                                        className="bomb-3d-icon"
                                                    />
                                                </div>
                                            )}
                                            {card.status === 'stone' ? (
                                                <div className="stone-visual">🔒</div>
                                            ) : card.status === 'popping' ? (
                                                <div className="popping-visual">💥</div>
                                            ) : (
                                                <div className="card-inner" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))' }}>
                                                    <div className="gravity-card-emoji">
                                                        {card.topicIcon || '❓'}
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
