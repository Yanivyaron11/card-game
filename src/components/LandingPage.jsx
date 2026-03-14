import React, { useEffect, useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ language }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to trigger entry animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleStart = () => {
        // Force a hard reload from the server to ensure PWA is updated
        window.location.reload(true);
    };

    const emojis = ['🎈', '🎨', '🚀', '⭐', '🎲', '🧩', '🦁', '🦉'];

    return (
        <div className={`landing-overlay ${language === 'he' ? 'rtl-mode' : ''}`}>
            <div className="floating-emojis">
                {emojis.map((emoji, i) => (
                    <span
                        key={i}
                        className="floating-emoji"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            animationDelay: `${i * 1.5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    >
                        {emoji}
                    </span>
                ))}
            </div>

            <div className="landing-content">
                <h1 className="landing-title">
                    {language === 'he' ? 'ברוכים הבאים לסמארטי!' : 'Welcome to Smarty!'}
                </h1>
                <p className="landing-subtitle">
                    {language === 'he' ? 'המשחק שעוזר לכם להפוך לחכמים יותר' : 'The game that helps you become smarter'}
                </p>

                <button className="start-button-big" onClick={handleStart}>
                    {language === 'he' ? 'בואו נשחק! 🚀' : 'Let\'s Play! 🚀'}
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
