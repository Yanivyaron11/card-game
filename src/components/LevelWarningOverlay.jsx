import React, { useEffect } from 'react';
import './LevelWarningOverlay.css';
import { playSound } from '../utils/sounds';

function LevelWarningOverlay({ level, onComplete, language }) {
    useEffect(() => {
        if (level === 1) {
            playSound('level1_intro');
        } else if (level === 2) {
            playSound('level2_warning');
        } else if (level === 3) {
            playSound('level3_danger');
        }

        const t = setTimeout(() => {
            if (onComplete) onComplete();
        }, 5500);

        return () => clearTimeout(t);
    }, [level, onComplete]);

    if (!level) return null;

    const isRtl = language === 'he';
    let warningTextEn, warningTextHe, subTextEn, subTextHe, imgSrc;

    if (level === 1) {
        warningTextEn = "GET READY!";
        warningTextHe = "התכוננו!";
        subTextEn = "Endless Mode: 30s per question!";
        subTextHe = "מוכנים למפולת? מתחילים!";
        imgSrc = "/assets/gladiator_level1.png";
    } else if (level === 2) {
        warningTextEn = "WARNING: LEVEL 2 AVALANCHE AHEAD!";
        warningTextHe = "אזהרה: מפולת רמה 2 בדרך!";
        subTextEn = "Faster questions! 20 seconds!";
        subTextHe = "שאלות משולבות! 20 שניות לשאלה!";
        imgSrc = "/assets/gladiator_level2.png";
    } else {
        warningTextEn = "WARNING: MAX LEVEL DANGER!";
        warningTextHe = "אזהרה: סכנה ברמה המקסימלית!";
        subTextEn = "Extreme mode! 10 seconds!";
        subTextHe = "שאלות קשוחות! 10 שניות בלבד!";
        imgSrc = "/assets/boss_level3.png";
    }

    const text = isRtl ? warningTextHe : warningTextEn;
    const subText = isRtl ? subTextHe : subTextEn;

    return (
        <div className={`level-warning-overlay ${level === 3 ? 'danger-max' : ''}`}>
            <div className="warning-content">
                <div className="flashing-lights"></div>
                <h1 className="warning-title pulsing-text">{text}</h1>
                <div className="warning-character">
                    <img src={imgSrc} alt="Warning Character" className="character-img bounce-in" />
                </div>
                <h2 className="warning-subtitle">{subText}</h2>
            </div>
        </div>
    );
}

export default LevelWarningOverlay;
