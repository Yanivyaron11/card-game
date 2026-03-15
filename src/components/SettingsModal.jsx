import React, { useState, useEffect } from 'react';
import { topics } from '../data/questions/index';
import { translations } from '../data/translations';
import EarningGuideModal from './EarningGuideModal';
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
    onMusicChange,
    unlockedTopics
}) {
    const [expandedTopics, setExpandedTopics] = useState([]);
    const [isEarningGuideOpen, setIsEarningGuideOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setExpandedTopics([]);
            setIsEarningGuideOpen(false);
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
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{t.settings} ⚙️</h2>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>

                    <div className="settings-scroll-area">
                        <section className="settings-section">
                            <button
                                className="settings-btn earning-guide-btn"
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255, 215, 0, 0.2)', marginBottom: '1rem' }}
                                onClick={() => setIsEarningGuideOpen(true)}
                            >
                                🎁 {t.earning_guide_title}
                            </button>
                        </section>

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
                                                className={`pool-item ${activeCategories.includes(topic.id) ? 'selected' : ''} ${!unlockedTopics.includes(topic.id) ? 'locked' : ''}`}
                                                onClick={() => unlockedTopics.includes(topic.id) && onCategoryToggle(topic.id)}
                                            >
                                                <span className="pool-name">
                                                    {!unlockedTopics.includes(topic.id) && <span className="lock-icon">🔒 </span>}
                                                    {topic.name[language]}
                                                </span>
                                            </div>
                                        );
                                    }

                                    const isUnlocked = unlockedTopics.includes(topic.id);
                                    const isExpanded = expandedTopics.includes(topic.id);
                                    const visibleSubTopics = topic.subTopics.filter(sub => sub.hiddenIf !== language);

                                    if (visibleSubTopics.length === 0) return null;

                                    const selectedSubTopics = visibleSubTopics.filter(sub => activeCategories.includes(sub.id));
                                    const isPartiallySelected = selectedSubTopics.length > 0 && selectedSubTopics.length < visibleSubTopics.length;
                                    const isFullySelected = selectedSubTopics.length === visibleSubTopics.length && visibleSubTopics.length > 0;

                                    return (
                                        <div key={topic.id} className={`settings-topic-group ${!isUnlocked ? 'locked' : ''}`}>
                                            <div
                                                className={`pool-item folder-item ${isFullySelected ? 'selected' : isPartiallySelected ? 'partially-selected' : ''}`}
                                                onClick={() => isUnlocked && toggleTopicExpand(topic.id)}
                                            >
                                                <span className="pool-name">
                                                    {!isUnlocked && <span className="lock-icon">🔒 </span>}
                                                    {topic.name[language]}
                                                </span>
                                                {isUnlocked && <div className={`folder-chevron ${isExpanded ? 'expanded' : ''}`}>▼</div>}
                                            </div>
                                            {isExpanded && (
                                                <div className="settings-subtopics-container">
                                                    {visibleSubTopics.map(sub => (
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

            <EarningGuideModal
                isOpen={isEarningGuideOpen}
                onClose={() => setIsEarningGuideOpen(false)}
                language={language}
            />
        </>
    );
}

export default SettingsModal;
