import { useState, useEffect } from 'react';
import { topics, questionCounts } from '../data/questions';
import { playSound, getSoundEnabled, setSoundEnabled, getMusicTrack, setMusicTrack } from '../utils/sounds';
import { translations } from '../data/translations';
import SettingsModal from './SettingsModal';
import './StartScreen.css';

function StartScreen({ onStart, language, onLanguageChange }) {
    const t = translations[language];

    const getLeafTopics = () => {
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
            const defaultPool = allLeaves.map(t => t.id).slice(0, 9);
            if (!saved) return defaultPool;
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed) && parsed.length > 0) {
                const leafIds = allLeaves.map(t => t.id);
                const hasValidLeaf = parsed.some(id => leafIds.includes(id));
                const containsParent = parsed.some(id => topics.some(t => t.subTopics && t.id === id));
                if (hasValidLeaf && !containsParent) return parsed;
                return defaultPool;
            }
            return defaultPool;
        } catch (e) {
            console.error("Failed to parse activeCategories", e);
            return getLeafTopics().map(t => t.id).slice(0, 9);
        }
    });

    const [musicTrack, setMusicTrackState] = useState(getMusicTrack());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [gridSize, setGridSize] = useState(16);
    const [difficulty, setDifficulty] = useState(1);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [gameMode, setGameMode] = useState('solo');

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

            <h2>{t.lets_play}</h2>

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

