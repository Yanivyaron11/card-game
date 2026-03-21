import React, { useEffect } from 'react';
import './LevelWarningOverlay.css';
import { playSound } from '../utils/sounds';

function LevelWarningOverlay({ level, onComplete, language }) {
    useEffect(() => {
        if (level === 1) {
            playSound('siren');
            setTimeout(() => playSound('boss_drum'), 800);
        } else if (level === 2) {
            playSound('siren');
            setTimeout(() => playSound('boss_drum'), 800);
        } else if (level === 3) {
            playSound('siren');
            setTimeout(() => playSound('boss_drum'), 600);
            setTimeout(() => playSound('boss_drum'), 1200);
        } else if (level === 'WIN') {
            playSound('win_fanfare');
        }

        const t = setTimeout(() => {
            if (onComplete) onComplete();
        }, level === 'WIN' ? 6000 : 3500);

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
        imgSrc = "/assets/gladiator_level1.png";
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
                        <img src={imgSrc} alt="Character" className="character-img bounce-in" />
                    </div>
                )}

                <h2 className="warning-subtitle">{subText}</h2>
            </div>
        </div>
    );
}

export default LevelWarningOverlay;
