import { useState, useEffect } from 'react';
import { topics, questionCounts } from '../data/questions/index';
import { playSound, getSoundEnabled, setSoundEnabled, getMusicTrack, setMusicTrack } from '../utils/sounds';
import { translations } from '../data/translations';
import SettingsModal from './SettingsModal';
import NewCategoryModal from './NewCategoryModal';
import NewFeatureModal from './NewFeatureModal';
import AlertModal from './AlertModal';
import { features } from '../data/features';
import { avatars } from '../data/avatars';
import AvatarShopModal from './AvatarShopModal';
import './StartScreen.css';

function StartScreen({ onStart, language, onLanguageChange, totalCoins, unlockedAvatars, onBuyAvatar }) {
    const t = translations[language];

    // ... (logic remains same until return)

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
    const [gridSize, setGridSize] = useState(() => parseInt(localStorage.getItem('last_gridSize') || '16', 10));
    const [difficulty, setDifficulty] = useState(() => parseInt(localStorage.getItem('last_difficulty') || '1', 10));
    const [selectedTopics, setSelectedTopics] = useState(() => {
        const saved = localStorage.getItem('last_selectedTopics');
        return saved ? JSON.parse(saved) : [];
    });
    const [gameMode, setGameMode] = useState(() => localStorage.getItem('last_gameMode') || 'solo');
    const [survivalType, setSurvivalType] = useState(() => localStorage.getItem('last_survivalType') || 'child');
    const [newCategories, setNewCategories] = useState([]);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [newFeatures, setNewFeatures] = useState([]);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [selectedAvatars, setSelectedAvatars] = useState(() => {
        try {
            const saved = localStorage.getItem('last_avatars');
            if (!saved) return { 1: null, 2: null };
            const parsed = JSON.parse(saved);
            return {
                1: avatars.find(a => a.id === parsed[1]) || null,
                2: avatars.find(a => a.id === parsed[2]) || null
            };
        } catch (e) {
            return { 1: null, 2: null };
        }
    });
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', icon: '⚠️' });
    const [isShopOpen, setIsShopOpen] = useState(false);

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

    // Persist settings
    useEffect(() => {
        localStorage.setItem('last_gridSize', gridSize.toString());
        localStorage.setItem('last_difficulty', difficulty.toString());
        localStorage.setItem('last_gameMode', gameMode);
        localStorage.setItem('last_survivalType', survivalType);
        localStorage.setItem('last_selectedTopics', JSON.stringify(selectedTopics));
        localStorage.setItem('last_avatars', JSON.stringify({
            1: selectedAvatars[1]?.id || null,
            2: selectedAvatars[2]?.id || null
        }));
    }, [gridSize, difficulty, gameMode, survivalType, selectedAvatars, selectedTopics]);

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
        if (gameMode !== 'survival' && selectedTopics.length === 0) {
            setAlertConfig({ isOpen: true, message: t.select_at_least_one, icon: '📚' });
            return;
        }
        if ((gameMode === 'solo' || gameMode === 'survival') && !selectedAvatars[1]) {
            setAlertConfig({ isOpen: true, message: t.select_avatar, icon: '👤' });
            return;
        }
        if (gameMode === '1v1' && (!selectedAvatars[1] || !selectedAvatars[2])) {
            setAlertConfig({ isOpen: true, message: t.select_avatars_1v1, icon: '👥' });
            return;
        }

        // Map avatars to name objects for backward compatibility if needed, 
        // or just pass the whole avatar objects
        const configAvatars = {
            1: selectedAvatars[1],
            2: selectedAvatars[2]
        };

        onStart({
            gridSize,
            topics: gameMode === 'survival' ? activePool : selectedTopics,
            difficulty,
            gameMode,
            survivalType,
            avatars: configAvatars
        });
    };

    const handleAvatarSelect = (avatar, playerNum) => {
        playSound('pop');
        setSelectedAvatars(prev => {
            // If picking for P1, and it's already P2's choice, swap or prevent? 
            // Let's prevent picking the same one.
            if (playerNum === 1 && prev[2]?.id === avatar.id) return prev;
            if (playerNum === 2 && prev[1]?.id === avatar.id) return prev;
            return { ...prev, [playerNum]: avatar };
        });
    };

    return (
        <div className="start-screen glass-panel">
            <div className="top-controls">
                <div className="total-coins-display">
                    🪙 <span className="coin-count">{totalCoins}</span>
                </div>
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

            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                message={alertConfig.message}
                icon={alertConfig.icon}
            />

            <AvatarShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                language={language}
                totalCoins={totalCoins}
                unlockedAvatars={unlockedAvatars}
                onBuyAvatar={onBuyAvatar}
                onSelectAvatar={(avatar) => {
                    // Default to P1 if single player, otherwise user decides in shop (future)
                    handleAvatarSelect(avatar, 1);
                }}
                selectedAvatars={selectedAvatars}
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
                    <button
                        className={`mode-btn ${gameMode === 'survival' ? 'active' : ''}`}
                        onClick={() => setGameMode('survival')}
                    >
                        🔥 {t.survival}
                    </button>
                </div>
            </div>

            {gameMode === 'survival' && (
                <div className="config-section survival-type-selection card-pop">
                    <h3>{t.survival_course}</h3>
                    <div className="mode-options">
                        <button
                            className={`mode-btn ${survivalType === 'child' ? 'active' : ''}`}
                            onClick={() => setSurvivalType('child')}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                <span>🟢 {t.survival_child}</span>
                                {(() => {
                                    const hs = localStorage.getItem('survival_high_score_child') || '0';
                                    return <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>🏆 {t.survival_record_child}: {hs}</span>;
                                })()}
                            </div>
                        </button>
                        <button
                            className={`mode-btn ${survivalType === 'adult' ? 'active' : ''}`}
                            onClick={() => setSurvivalType('adult')}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                <span>🔴 {t.survival_adult}</span>
                                {(() => {
                                    const hs = localStorage.getItem('survival_high_score_adult') || '0';
                                    return <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>🏆 {t.survival_record_adult}: {hs}</span>;
                                })()}
                            </div>
                        </button>
                    </div>
                </div>
            )}

            <div className="config-section">
                <div className="section-header-with-btn">
                    <h3>{language === 'he' ? '3. בחרו אווטאר' : '3. Choose Avatar'}</h3>
                    <button className="shop-invite-btn" onClick={() => setIsShopOpen(true)}>
                        🛒 {language === 'he' ? 'לחנות' : 'Shop'}
                    </button>
                </div>

                <div className="avatar-selection-container card-pop">
                    <div className="avatar-player-section">
                        <h4>{language === 'he' ? 'שחקן 1' : 'Player 1'}</h4>
                        <div className="avatar-slider-wrapper">
                            <div className="avatar-slider">
                                {avatars.filter(a => unlockedAvatars.includes(a.id)).map(avatar => (
                                    <button
                                        key={avatar.id}
                                        className={`avatar-btn-mini ${selectedAvatars[1]?.id === avatar.id ? 'active' : ''}`}
                                        onClick={() => handleAvatarSelect(avatar, 1)}
                                    >
                                        <span className="avatar-emoji-mini">{avatar.emoji}</span>
                                    </button>
                                ))}
                                <button className="avatar-btn-mini more-btn" onClick={() => setIsShopOpen(true)}>+</button>
                            </div>
                        </div>
                    </div>

                    {gameMode === '1v1' && (
                        <div className="avatar-player-section">
                            <h4>{language === 'he' ? 'שחקן 2' : 'Player 2'}</h4>
                            <div className="avatar-slider-wrapper">
                                <div className="avatar-slider">
                                    {avatars.filter(a => unlockedAvatars.includes(a.id)).map(avatar => (
                                        <button
                                            key={avatar.id}
                                            className={`avatar-btn-mini ${selectedAvatars[2]?.id === avatar.id ? 'active' : ''} ${selectedAvatars[1]?.id === avatar.id ? 'disabled' : ''}`}
                                            disabled={selectedAvatars[1]?.id === avatar.id}
                                            onClick={() => handleAvatarSelect(avatar, 2)}
                                        >
                                            <span className="avatar-emoji-mini">{avatar.emoji}</span>
                                        </button>
                                    ))}
                                    <button className="avatar-btn-mini more-btn" onClick={() => setIsShopOpen(true)}>+</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {gameMode !== 'survival' && (
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
            )}

            {gameMode !== 'survival' && (
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
            )}

            <div className="config-section">
                <h3>{gameMode === 'survival' ? t.participating_topics : t.choose_topics}</h3>
                <div className="topic-options">
                    {visibleTopics.map(topic => (
                        <div
                            key={topic.id}
                            className={`topic-card ${(gameMode === 'survival' || selectedTopics.includes(topic.id)) ? 'selected' : ''} ${gameMode === 'survival' ? 'read-only' : ''}`}
                            onClick={gameMode === 'survival' ? null : () => handleTopicToggle(topic.id)}
                        >
                            <div className="topic-info-main">
                                <span className="topic-name">{topic.name[language]}</span>
                                <span className="topic-count">{questionCounts[topic.id] || 0} {t.questions_count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="start-btn card-pop" onClick={handleStart}>
                {gameMode === 'survival' ? (language === 'he' ? 'התחל הישרדות!' : 'Start Survival!') : t.start_game + ' 🚀'}
            </button>
        </div>
    );
}

export default StartScreen;
