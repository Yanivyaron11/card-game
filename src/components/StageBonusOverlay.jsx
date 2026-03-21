import React, { useEffect, useState } from 'react';
import './LevelWarningOverlay.css';
import { playSound } from '../utils/sounds';

export default function StageBonusOverlay({ coins, onComplete }) {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Double chime for maximum rewarding dopamine
        playSound('powerup_sound');

        const t1 = setTimeout(() => {
            setShowText(true);
            playSound('powerup_sound'); // Pop the coins!
        }, 500);

        const t2 = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2800); // Hold for almost 3 seconds to let them savor the win

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [onComplete]);

    return (
        <div className="boss-warning-overlay" style={{ background: 'rgba(0, 0, 0, 0.95)' }}>
            <div className="boss-warning-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <h1 style={{
                    color: '#FFD700',
                    fontSize: '3.5rem',
                    textShadow: '0 4px 15px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.4)',
                    margin: 0,
                    animation: 'bossTextPulse 1.5s infinite'
                }}>
                    שלב הושלם!
                </h1>

                <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                    <img
                        src="/assets/sack_of_gold.png"
                        alt="Sack of Coins"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            mixBlendMode: 'screen', // Seamlessly deletes the absolute black background naturally representing glowing UI
                            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.3))',
                            animation: 'bombPulse 2s infinite'
                        }}
                    />
                </div>

                {showText && (
                    <h2 style={{
                        fontSize: '4rem',
                        color: '#FFF',
                        margin: 0,
                        textShadow: '0 4px 10px rgba(0,0,0,0.8)',
                        animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                    }}>
                        + {coins} <span style={{ color: '#FFD700' }}>מטבעות!</span>
                    </h2>
                )}
            </div>
        </div>
    );
}
