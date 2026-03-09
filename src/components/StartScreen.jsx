import { useState, useEffect } from 'react';
import { topics, questionCounts } from '../data/questions';
import { playSound, getSoundEnabled, setSoundEnabled, getMusicTrack, setMusicTrack } from '../utils/sounds';
import { translations } from '../data/translations';
import SettingsModal from './SettingsModal';
import './StartScreen.css';

function StartScreen({ onStart, language, onLanguageChange }) {
    const t = translations[language];

    // Persistent settings
    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [activePool, setActivePool] = useState(() => {
        try {
            const saved = localStorage.getItem('activeCategories');
            const defaultPool = topics.map(t => t.id).slice(0, 9);
            if (!saved) return defaultPool;
            const parsed = JSON.parse(saved);

            // Check if saved array uses the old system (e.g. 'patisserie' instead of 'food_group')
            const validParentIds = topics.map(t => t.id);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // If they have any valid parents, they are mostly migrated.
                // But let's be safe and just reset to default if they don't have exactly the parents
                const hasValidParent = parsed.some(id => validParentIds.includes(id));
                if (hasValidParent) return parsed;

                // If no valid parents (all legacy IDs), force a reset to defaultPool
                // so the new folders actually show up!
                console.log("Legacy categories detected, resetting to default pool to show folders.");
                return defaultPool;
            }
            return defaultPool;
        } catch (e) {
            console.error("Failed to parse activeCategories", e);
            return topics.map(t => t.id).slice(0, 9);
        }
    });

    const [musicTrack, setMusicTrackState] = useState(getMusicTrack());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [gridSize, setGridSize] = useState(16);
    const [difficulty, setDifficulty] = useState(1);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [gameMode, setGameMode] = useState('solo');
    const [expandedTopics, setExpandedTopics] = useState([]);

    const toggleTopicExpand = (groupId) => {
        setExpandedTopics(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    // Filter topics based on active pool
    const visibleTopics = topics.filter(t => activePool.includes(t.id));

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
                    {visibleTopics.map(topic => {
                        if (!topic.subTopics) {
                            return (
                                <div
                                    key={topic.id}
                                    className={`topic-card ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
                                    onClick={() => handleTopicToggle(topic.id)}
                                >
                                    <span className="topic-icon">{topic.icon}</span>
                                    <div className="topic-info-main">
                                        <span className="topic-name">{topic.name[language]}</span>
                                        <span className="topic-count">{questionCounts[topic.id] || 0} {t.questions_count}</span>
                                    </div>
                                </div>
                            );
                        }

                        const isExpanded = expandedTopics.includes(topic.id);
                        const folderCount = topic.subTopics.reduce((acc, sub) => acc + (questionCounts[sub.id] || 0), 0);
                        const selectedSubTopics = topic.subTopics.filter(sub => selectedTopics.includes(sub.id));
                        const isPartiallySelected = selectedSubTopics.length > 0 && selectedSubTopics.length < topic.subTopics.length;
                        const isFullySelected = selectedSubTopics.length === topic.subTopics.length && topic.subTopics.length > 0;

                        return (
                            <div key={topic.id} className="topic-group-container">
                                <div
                                    className={`topic-card folder-card ${isFullySelected ? 'selected' : isPartiallySelected ? 'partially-selected' : ''}`}
                                    onClick={() => toggleTopicExpand(topic.id)}
                                >
                                    <span className="topic-icon">{topic.icon}</span>
                                    <div className="topic-info-main">
                                        <span className="topic-name">{topic.name[language]}</span>
                                        <span className="topic-count folder-count">{folderCount} {t.questions_count}</span>
                                    </div>
                                    <div className={`folder-chevron ${isExpanded ? 'expanded' : ''}`}>▼</div>
                                </div>
                                {isExpanded && (
                                    <div className="subtopics-container">
                                        {topic.subTopics.map(sub => (
                                            <div
                                                key={sub.id}
                                                className={`topic-card sub-card ${selectedTopics.includes(sub.id) ? 'selected' : ''}`}
                                                onClick={() => handleTopicToggle(sub.id)}
                                            >
                                                <span className="topic-icon">{sub.icon}</span>
                                                <div className="topic-info-main">
                                                    <span className="topic-name">{sub.name[language]}</span>
                                                    <span className="topic-count">{questionCounts[sub.id] || 0} {t.questions_count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="start-btn" onClick={handleStart}>{t.start_game} 🚀</button>
        </div>
    );
}

export default StartScreen;

