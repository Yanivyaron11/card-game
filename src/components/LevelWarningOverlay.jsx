import React, { useEffect } from 'react';
import './LevelWarningOverlay.css';
import { playSound } from '../utils/sounds';

function LevelWarningOverlay({ level, onComplete, language, coins }) {
    useEffect(() => {
        if (level === 1) {
            playSound('epic_chord_1');
            setTimeout(() => playSound('timpani_strike_1'), 1500); 
        } else if (level === 2) {
            playSound('epic_chord_2');
            setTimeout(() => playSound('timpani_strike_2'), 1000); 
        } else if (level === 3) {
            playSound('epic_chord_3');
            setTimeout(() => playSound('timpani_strike_3'), 500); 
            setTimeout(() => playSound('timpani_strike_3'), 1500);
            setTimeout(() => playSound('timpani_strike_3'), 2500); 
            setTimeout(() => playSound('evil_laugh'), 3500); 
        } else if (level === 'WIN') {
            playSound('win_fanfare');
            // Play coin sound shortly after
            setTimeout(() => playSound('buy'), 1000);
        }

        const t = setTimeout(() => {
            if (onComplete) onComplete();
        }, level === 'WIN' ? 7000 : 5000); // 7 seconds for win

        return () => clearTimeout(t);
    }, [level, onComplete]);

    if (!level) return null;

    const isRtl = language === 'he';
    let warningTextEn, warningTextHe, subTextEn, subTextHe, imgSrc;
    let extraClass = '';

    if (level === 1) {
        warningTextEn = "GET READY!";
        warningTextHe = "התכוננו!";
        subTextEn = "Endless Mode: 30s per question!";
        subTextHe = "מוכנים למפולת? מתחילים!";
        imgSrc = "/assets/gladiator_level1.png";
    } else if (level === 2) {
        warningTextEn = "WARNING: LEVEL 2 AVALANCHE AHEAD!";
        warningTextHe = "אזהרה: מפולת רמה 2 בדרך!";
        subTextEn = "Faster questions!";
        subTextHe = "שאלות משולבות! 20 שניות לשאלה!";
        imgSrc = "/assets/gladiator_level2.png";
    } else if (level === 3) {
        warningTextEn = "WARNING: MAX LEVEL DANGER!";
        warningTextHe = "אזהרה: סכנה ברמה המקסימלית!";
        subTextEn = "Extreme mode! 10 seconds!";
        subTextHe = "שאלות קשוחות! 10 שניות בלבד!";
        imgSrc = "/assets/boss_level3.png";
        extraClass = 'danger-max';
    } else if (level === 'WIN') {
        warningTextEn = "CHAMPION!";
        warningTextHe = "🏆 אלופים! 🏆";
        subTextEn = "You defeated all bosses!";
        subTextHe = "ניצחתם את כל הבוסים!";
        imgSrc = "/assets/sack_of_gold.png";
        extraClass = 'win-max';
    }

    const text = isRtl ? warningTextHe : warningTextEn;
    const subText = isRtl ? subTextHe : subTextEn;

    return (
        <div className={`level-warning-overlay ${extraClass}`}>
            <div className="warning-content">
                {(level === 1 || level === 2 || level === 3) && <div className="flashing-lights"></div>}

                <h1 className="warning-title pulsing-text">{text}</h1>

                {imgSrc && (
                    <div className="warning-character">
                        <img src={imgSrc} alt="Character" className={`character-img bounce-in ${level === 'WIN' ? 'sack-img' : ''}`} />
                    </div>
                )}

                {level === 'WIN' && coins && (
                    <div className="victory-coins-award">
                        <span className="coin-amount">+{coins}</span>
                        <span className="coin-label">{isRtl ? 'מטבעות!' : 'Coins!'}</span>
                    </div>
                )}

                <h2 className="warning-subtitle">{subText}</h2>
            </div>
        </div>
    );
}

export default LevelWarningOverlay;
