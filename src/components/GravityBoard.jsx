import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GravityBoard.css';

function GravityBoard({ columns, config, onCardSelected, onQuit }) {
    if (!columns || columns.length === 0) return null;

    const handleCardClick = (cIndex, rIndex, card) => {
        if (card.status === 'stone') return;
        onCardSelected(card.questionId, cIndex, rIndex);
    };

    return (
        <div className="gravity-board-container">
            <button className="quit-btn" onClick={onQuit} style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, padding: '10px 15px', borderRadius: '12px', background: 'rgba(255,100,100,0.8)', color: 'white', border: 'none', fontWeight: 'bold' }}>
                X יציאה
            </button>
            <div className="gravity-grid">
                {columns.map((col, cIndex) => (
                    <div key={`col-${cIndex}`} className="gravity-column">
                        {/* Reverse rendering so array end (index highest) maps to the top of the column visually */}
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
                                            <div className="powerup-overlay">
                                                {card.powerUp === 'row' ? '↔️' : card.powerUp === 'col' ? '↕️' : '➕'}
                                            </div>
                                        )}
                                        {card.status === 'stone' ? (
                                            <div className="stone-visual">🔒</div>
                                        ) : card.status === 'popping' ? (
                                            <div className="popping-visual">💥</div>
                                        ) : (
                                            <div className="card-inner glass-panel" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))' }}>
                                                <div
                                                    style={card.topicColor ? {
                                                        backgroundColor: card.topicColor,
                                                        borderRadius: '50%',
                                                        width: 'min(3rem, 12vw)',
                                                        height: 'min(3rem, 12vw)',
                                                        minWidth: 'min(3rem, 12vw)',
                                                        minHeight: 'min(3rem, 12vw)',
                                                        flexShrink: 0,
                                                        aspectRatio: '1/1',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        boxShadow: `0 0 10px ${card.topicColor}`,
                                                        fontSize: '1.5rem'
                                                    } : { fontSize: '1.5rem' }}
                                                >
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
    );
}

export default GravityBoard;
