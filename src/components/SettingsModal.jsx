import React, { useState, useEffect } from 'react';
import { topics } from '../data/questions';
import { translations } from '../data/translations';
import './SettingsModal.css';

function SettingsModal({
    isOpen,
    onClose,
    language,
    onLanguageChange,
    soundOn,
    onSoundToggle,
    activeCategories,
    onCategoryToggle,
    musicTrack,
    onMusicChange
}) {
    const [expandedTopics, setExpandedTopics] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setExpandedTopics([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const t = translations[language];

    const toggleTopicExpand = (groupId) => {
        setExpandedTopics(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t.settings} ⚙️</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="settings-scroll-area">
                    <section className="settings-section">
                        <h3>{t.language_name}</h3>
                        <div className="settings-options">
                            <button
                                className={`settings-btn ${language === 'en' ? 'active' : ''}`}
                                onClick={() => onLanguageChange('en')}
                            >
                                🇺🇸 English
                            </button>
                            <button
                                className={`settings-btn ${language === 'he' ? 'active' : ''}`}
                                onClick={() => onLanguageChange('he')}
                            >
                                🇮🇱 עברית
                            </button>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>{t.sound_effects}</h3>
                        <div className="settings-options">
                            <button
                                className={`settings-btn ${soundOn ? 'active' : ''}`}
                                onClick={() => onSoundToggle(true)}
                            >
                                🔊 {t.on}
                            </button>
                            <button
                                className={`settings-btn ${!soundOn ? 'active' : ''}`}
                                onClick={() => onSoundToggle(false)}
                            >
                                🔇 {t.off}
                            </button>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>{t.music}</h3>
                        <div className="settings-music-options">
                            <button
                                className={`music-track-btn ${musicTrack === 'off' ? 'active' : ''}`}
                                onClick={() => onMusicChange('off')}
                            >
                                🔇 {t.off}
                            </button>
                            <button
                                className={`music-track-btn ${musicTrack === 'track1' ? 'active' : ''}`}
                                onClick={() => onMusicChange('track1')}
                            >
                                🎵 1
                            </button>
                            <button
                                className={`music-track-btn ${musicTrack === 'track2' ? 'active' : ''}`}
                                onClick={() => onMusicChange('track2')}
                            >
                                🎵 2
                            </button>
                            <button
                                className={`music-track-btn ${musicTrack === 'track3' ? 'active' : ''}`}
                                onClick={() => onMusicChange('track3')}
                            >
                                🎵 3
                            </button>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>{t.active_categories}</h3>
                        <div className="category-pool">
                            {topics.map(topic => {
                                if (!topic.subTopics) {
                                    return (
                                        <div
                                            key={topic.id}
                                            className={`pool-item ${activeCategories.includes(topic.id) ? 'selected' : ''}`}
                                            onClick={() => onCategoryToggle(topic.id)}
                                        >
                                            <span className="pool-name">{topic.name[language]}</span>
                                        </div>
                                    );
                                }

                                const isExpanded = expandedTopics.includes(topic.id);
                                const selectedSubTopics = topic.subTopics.filter(sub => activeCategories.includes(sub.id));
                                const isPartiallySelected = selectedSubTopics.length > 0 && selectedSubTopics.length < topic.subTopics.length;
                                const isFullySelected = selectedSubTopics.length === topic.subTopics.length && topic.subTopics.length > 0;

                                return (
                                    <div key={topic.id} className="settings-topic-group">
                                        <div
                                            className={`pool-item folder-item ${isFullySelected ? 'selected' : isPartiallySelected ? 'partially-selected' : ''}`}
                                            onClick={() => toggleTopicExpand(topic.id)}
                                        >
                                            <span className="pool-name">{topic.name[language]}</span>
                                            <div className={`folder-chevron ${isExpanded ? 'expanded' : ''}`}>▼</div>
                                        </div>
                                        {isExpanded && (
                                            <div className="settings-subtopics-container">
                                                {topic.subTopics.map(sub => (
                                                    <div
                                                        key={sub.id}
                                                        className={`pool-item sub-item ${activeCategories.includes(sub.id) ? 'selected' : ''}`}
                                                        onClick={() => onCategoryToggle(sub.id)}
                                                    >
                                                        <span className="pool-icon">{sub.icon}</span>
                                                        <span className="pool-name">{sub.name[language]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <button className="modal-footer-btn start-btn" onClick={onClose}>
                    {t.close}
                </button>
            </div>
        </div>
    );
}

export default SettingsModal;
