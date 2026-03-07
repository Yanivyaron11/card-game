import { useState } from 'react';
import { topics, questionCounts } from '../data/questions';

import { playSound, getSoundEnabled, setSoundEnabled, getMusicTrack, setMusicTrack } from '../utils/sounds';
import { translations } from '../data/translations';
import './StartScreen.css';

function StartScreen({ onStart, language, onLanguageChange }) {
    const t = translations[language];
    const [gridSize, setGridSize] = useState(16); // 4x4 default
    const [difficulty, setDifficulty] = useState(1); // Level 1 default
    const [selectedTopics, setSelectedTopics] = useState(['general']); // General Knowledge selected by default
    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [musicTrack, setMusicTrackState] = useState(getMusicTrack());
    const [gameMode, setGameMode] = useState('solo'); // solo or 1v1

    const handleTopicToggle = (topicId) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleMusicChange = (trackId) => {
        setMusicTrackState(trackId);
        setMusicTrack(trackId);
        playSound('pop');
    };

    const handleStart = () => {
        if (selectedTopics.length === 0) {
            alert(t.select_at_least_one);
            return;
        }
        onStart({ gridSize, topics: selectedTopics, difficulty, gameMode });
    };

    const toggleLanguage = () => {
        onLanguageChange(language === 'en' ? 'he' : 'en');
    };

    return (
        <div className="start-screen glass-panel">
            <div className="top-controls">
                <button onClick={() => {
                    const newState = !soundOn;
                    setSoundEnabled(newState);
                    setSoundOn(newState);
                }} className="icon-toggle-btn">
                    {soundOn ? '🔊' : '🔇'}
                </button>
                <button onClick={toggleLanguage} className="icon-toggle-btn">
                    {language === 'en' ? '🇮🇱' : '🇺🇸'}
                </button>
            </div>

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
                    <button
                        className={`grid-btn ${gridSize === 9 ? 'active' : ''}`}
                        onClick={() => setGridSize(9)}
                    >
                        <span dir="ltr">3 x 3</span>
                    </button>
                    <button
                        className={`grid-btn ${gridSize === 16 ? 'active' : ''}`}
                        onClick={() => setGridSize(16)}
                    >
                        <span dir="ltr">4 x 4</span>
                    </button>
                    <button
                        className={`grid-btn ${gridSize === 25 ? 'active' : ''}`}
                        onClick={() => setGridSize(25)}
                    >
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
                    {topics.map(topic => (
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
                    ))}
                </div>
            </div>

            <div className="config-section">
                <h3>4. {t.bg_music}</h3>
                <div className="mode-options">
                    <button
                        className={`mode-btn ${musicTrack === 'off' ? 'active' : ''}`}
                        onClick={() => handleMusicChange('off')}
                    >
                        {t.music_off}
                    </button>
                    <button
                        className={`mode-btn ${musicTrack === 'track1' ? 'active' : ''}`}
                        onClick={() => handleMusicChange('track1')}
                    >
                        🎵 1
                    </button>
                    <button
                        className={`mode-btn ${musicTrack === 'track2' ? 'active' : ''}`}
                        onClick={() => handleMusicChange('track2')}
                    >
                        🎵 2
                    </button>
                    <button
                        className={`mode-btn ${musicTrack === 'track3' ? 'active' : ''}`}
                        onClick={() => handleMusicChange('track3')}
                    >
                        🎵 3
                    </button>
                </div>
            </div>

            <button className="start-btn" onClick={handleStart}>{t.start_game} 🚀</button>
        </div>
    );
}

export default StartScreen;
