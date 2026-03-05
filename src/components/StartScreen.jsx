import { useState } from 'react';
import { topics } from '../data/questions';
import { translations } from '../data/translations';
import './StartScreen.css';

function StartScreen({ onStart, language, onLanguageChange }) {
    const t = translations[language];
    const [gridSize, setGridSize] = useState(16); // 4x4 default
    const [difficulty, setDifficulty] = useState(1); // Level 1 default
    const [selectedTopics, setSelectedTopics] = useState(topics.map(t => t.id)); // All selected by default

    const handleTopicToggle = (topicId) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleStart = () => {
        if (selectedTopics.length === 0) {
            alert(t.select_at_least_one);
            return;
        }
        onStart({ gridSize, topics: selectedTopics, difficulty });
    };

    const toggleLanguage = () => {
        onLanguageChange(language === 'en' ? 'he' : 'en');
    };

    return (
        <div className="start-screen glass-panel">
            <div className="language-selector">
                <button onClick={toggleLanguage} className="lang-toggle-btn">
                    {language === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}
                </button>
            </div>

            <h2>{t.lets_play}</h2>

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
                            <span className="topic-name">{topic.name[language]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button className="start-btn" onClick={handleStart}>{t.start_game} 🚀</button>
        </div>
    );
}

export default StartScreen;
