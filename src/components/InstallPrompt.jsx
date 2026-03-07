import { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = ({ language }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if already dismissed
        const isDismissed = localStorage.getItem('smarty_install_dismissed');
        if (isDismissed) return;

        // Detect mobile
        const ua = window.navigator.userAgent;
        const mobile = /iPhone|iPad|iPod|Android/i.test(ua);
        const ios = /iPhone|iPad|iPod/i.test(ua);
        setIsMobile(mobile);
        setIsIOS(ios);

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (mobile && !isStandalone) {
            // Delay showing the prompt a bit
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);


    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('smarty_install_dismissed', 'true');
        setShowPrompt(false);
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        if (outcome === 'accepted') {
            localStorage.setItem('smarty_install_dismissed', 'true');
        }

        // We've used the prompt, and can't use it again, so clear it
        setDeferredPrompt(null);
        setShowPrompt(false);
    };


    if (!showPrompt) return null;

    const texts = {
        he: {
            title: 'התקינו את Smarty!',
            desc: 'הוסיפו את המשחק למסך הבית לגישה מהירה וחוויה מלאה.',
            install_btn: 'התקנה',
            ios_instruction: 'לחצו על כפתור השיתוף [ ] ואז על "הוספה למסך הבית"',
            close: 'סגור'
        },
        en: {
            title: 'Install Smarty!',
            desc: 'Add the game to your home screen for quick access and full experience.',
            install_btn: 'Install',
            ios_instruction: 'Tap the share button [ ] and then "Add to Home Screen"',
            close: 'Close'
        }
    };

    const t = texts[language] || texts.en;

    return (
        <div className="install-prompt-overlay shadow-lg">
            <div className="install-prompt-content">
                <button className="close-prompt" onClick={handleDismiss}>✕</button>

                <div className="prompt-header">
                    <img src="/favicon.png" alt="Smarty Icon" className="prompt-icon" />
                    <h3>{t.title}</h3>
                </div>
                <p>{t.desc}</p>

                {isIOS ? (
                    <div className="ios-instructions">
                        <p>{t.ios_instruction}</p>
                    </div>
                ) : (
                    <button
                        className="install-button pulse-animation"
                        onClick={handleInstallClick}
                        disabled={!deferredPrompt}
                    >
                        {t.install_btn}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstallPrompt;
