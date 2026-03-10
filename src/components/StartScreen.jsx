import { useState, useEffect } from 'react';
import { topics, questionCounts } from '../data/questions';
import { playSound, getSoundEnabled, setSoundEnabled, getMusicTrack, setMusicTrack } from '../utils/sounds';
import { translations } from '../data/translations';
import SettingsModal from './SettingsModal';
import NewCategoryModal from './NewCategoryModal';
import NewFeatureModal from './NewFeatureModal';
import { features } from '../data/features';
import './StartScreen.css';

function StartScreen({ onStart, language, onLanguageChange }) {
    const t = translations[language];

    const getLeafTopics = () => {
        if (!topics || !Array.isArray(topics)) return [];
        let leaves = [];
        topics.forEach(t => {
            if (t.subTopics) leaves.push(...t.subTopics);
            else leaves.push(t);
        });
        return leaves;
    };

    // Persistent settings
    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [activePool, setActivePool] = useState(() => {
        try {
            const saved = localStorage.getItem('activeCategories');
            const allLeaves = getLeafTopics();
            const leafIds = allLeaves.map(t => t.id);

            // Define common default categories we always want to show if possible
            const preferredDefaults = ['israel_cities', 'judaism', 'animals', 'countries', 'math', 'israeli_music'];
            const defaultPool = leafIds.filter(id => preferredDefaults.includes(id));

            // If we don't have enough preferred defaults, just take the first 9
            if (defaultPool.length < 3) {
                leafIds.slice(0, 9).forEach(id => {
                    if (!defaultPool.includes(id)) defaultPool.push(id);
                });
            }

            if (!saved) {
                localStorage.setItem('activeCategories', JSON.stringify(defaultPool));
                return defaultPool;
            }

            let parsed = JSON.parse(saved);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                localStorage.setItem('activeCategories', JSON.stringify(defaultPool));
                return defaultPool;
            }

            // Filter out old IDs that no longer exist
            let current = parsed.filter(id => leafIds.includes(id));

            // If everything was filtered out, restore defaults
            if (current.length === 0) {
                localStorage.setItem('activeCategories', JSON.stringify(defaultPool));
                return defaultPool;
            }

            return current;
        } catch (e) {
            console.error("Failed to parse activeCategories", e);
            const fallback = getLeafTopics().map(t => t.id).slice(0, 9);
            return fallback.length > 0 ? fallback : [];
        }
    });

    const [musicTrack, setMusicTrackState] = useState(getMusicTrack());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [gridSize, setGridSize] = useState(16);
    const [difficulty, setDifficulty] = useState(1);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [gameMode, setGameMode] = useState('solo');
    const [newCategories, setNewCategories] = useState([]);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [newFeatures, setNewFeatures] = useState([]);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

    useEffect(() => {
        // Find categories that are marked new and hasn't been seen yet
        const seenNew = JSON.parse(localStorage.getItem('seenNewCategories') || '[]');
        const now = new Date();
        const fresh = getLeafTopics().filter(t =>
            t.newUntil &&
            new Date(t.newUntil) > now &&
            !seenNew.includes(t.id)
        );

        if (fresh.length > 0) {
            setNewCategories(fresh);
            setIsNewModalOpen(true);
        }

        // Check for new features
        const seenFeatures = JSON.parse(localStorage.getItem('seenNewFeatures') || '[]');
        const freshFeatures = features.filter(f =>
            f.newUntil &&
            new Date(f.newUntil) > now &&
            !seenFeatures.includes(f.id)
        );

        if (freshFeatures.length > 0) {
            setNewFeatures(freshFeatures);
            // If category modal is already open, we'll trigger this one after category modal is dismissed
            if (fresh.length === 0) {
                setIsFeatureModalOpen(true);
            }
        }
    }, [activePool]);

    const handleDismissNew = () => {
        const seenNew = JSON.parse(localStorage.getItem('seenNewCategories') || '[]');
        const updated = [...new Set([...seenNew, ...newCategories.map(c => c.id)])];
        localStorage.setItem('seenNewCategories', JSON.stringify(updated));
        setIsNewModalOpen(false);

        // After dismissing category modal, check if we have features to show
        if (newFeatures.length > 0) {
            setIsFeatureModalOpen(true);
        }
    };

    const handleDismissFeatures = () => {
        const seenFeatures = JSON.parse(localStorage.getItem('seenNewFeatures') || '[]');
        const updated = [...new Set([...seenFeatures, ...newFeatures.map(f => f.id)])];
        localStorage.setItem('seenNewFeatures', JSON.stringify(updated));
        setIsFeatureModalOpen(false);
    };

    // Filter topics based on active pool
    const visibleTopics = getLeafTopics().filter(t => activePool.includes(t.id));

    const handleTopicToggle = (topicId) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleCategoryPoolToggle = (topicId) => {
        setActivePool(prev => {
            const isRemoving = prev.includes(topicId);
            if (!isRemoving && prev.length >= 9) {
                // Optional: add a sound or alert here if you want
                playSound('error');
                return prev;
            }
            const next = isRemoving
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId];
            localStorage.setItem('activeCategories', JSON.stringify(next));
            return next;
        });
    };

    const handleSoundToggle = (enabled) => {
        setSoundEnabled(enabled);
        setSoundOn(enabled);
        if (enabled) playSound('pop');
    };

    const handleStart = () => {
        if (selectedTopics.length === 0) {
            alert(t.select_at_least_one);
            return;
        }
        onStart({ gridSize, topics: selectedTopics, difficulty, gameMode });
    };

    return (
        <div className="start-screen glass-panel">
            <div className="top-controls">
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="icon-toggle-btn settings-gear"
                    title={t.settings}
                >
                    ⚙️
                </button>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                language={language}
                onLanguageChange={onLanguageChange}
                soundOn={soundOn}
                onSoundToggle={handleSoundToggle}
                musicTrack={musicTrack}
                onMusicChange={(track) => {
                    setMusicTrack(track);
                    setMusicTrackState(track);
                    playSound('pop');
                }}
                activeCategories={activePool}
                onCategoryToggle={handleCategoryPoolToggle}
            />

            <NewCategoryModal
                isOpen={isNewModalOpen}
                onClose={handleDismissNew}
                newCategories={newCategories}
                language={language}
                t={t}
            />

            <NewFeatureModal
                isOpen={isFeatureModalOpen}
                onClose={handleDismissFeatures}
                features={newFeatures}
                language={language}
                t={t}
            />

            <h2>{t.lets_play}</h2>
            <p className="total-questions-count">
                {t.total_questions.replace('{n}', Object.values(questionCounts).reduce((a, b) => a + b, 0).toLocaleString())}
            </p>

            <div className="config-section">
                <h3>{t.game_mode}</h3>
                <div className="mode-options">
                    <button
                        className={`mode-btn ${gameMode === 'solo' ? 'active' : ''}`}
                        onClick={() => setGameMode('solo')}
                    >
                        👤 {t.solo}
                    </button>
                    <button
                        className={`mode-btn ${gameMode === '1v1' ? 'active' : ''}`}
                        onClick={() => setGameMode('1v1')}
                    >
                        ⚔️ {t.v1}
                    </button>
                    <button
                        className={`mode-btn ${gameMode === 'time_attack' ? 'active' : ''}`}
                        onClick={() => setGameMode('time_attack')}
                    >
                        ⏱️ {t.time_attack}
                    </button>
                </div>
            </div>

            <div className="config-section">
                <h3>{t.choose_size}</h3>
                <div className="grid-options">
                    <button className={`grid-btn ${gridSize === 9 ? 'active' : ''}`} onClick={() => setGridSize(9)}>
                        <span dir="ltr">3 x 3</span>
                    </button>
                    <button className={`grid-btn ${gridSize === 16 ? 'active' : ''}`} onClick={() => setGridSize(16)}>
                        <span dir="ltr">4 x 4</span>
                    </button>
                    <button className={`grid-btn ${gridSize === 25 ? 'active' : ''}`} onClick={() => setGridSize(25)}>
                        <span dir="ltr">5 x 5</span>
                    </button>
                </div>
            </div>

            <div className="config-section">
                <h3>{t.choose_difficulty}</h3>
                <div className="diff-options">
                    {[1, 2, 3].map(level => (
                        <button
                            key={level}
                            className={`diff-btn level-${level} ${difficulty === level ? 'active' : ''}`}
                            onClick={() => setDifficulty(level)}
                        >
                            {t.level} {level}
                        </button>
                    ))}
                </div>
            </div>

            <div className="config-section">
                <h3>{t.choose_topics}</h3>
                <div className="topic-options">
                    {visibleTopics.map(topic => (
                        <div
                            key={topic.id}
                            className={`topic-card ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
                            onClick={() => handleTopicToggle(topic.id)}
                        >
                            <div className="topic-info-main">
                                <span className="topic-name">{topic.name[language]}</span>
                                <span className="topic-count">{questionCounts[topic.id] || 0} {t.questions_count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="start-btn" onClick={handleStart}>{t.start_game} 🚀</button>
        </div>
    );
}

export default StartScreen;

