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

function StartScreen({ onStart, language, onLanguageChange, totalCoins, unlockedAvatars, activeAvatars, onBuyAvatar, unlockedTopics, onBuyTopic, unlockedSkins, activeSkins, onBuySkin, onToggleAvatar, onToggleSkin, unlockedThemes, activeTheme, onBuyTheme, onEquipTheme }) {
    const t = translations[language];

    const getLeafTopics = () => {
        if (!topics || !Array.isArray(topics)) return [];
        let leaves = [];
        topics.forEach(t => {
            const isGroupUnlocked = unlockedTopics.includes(t.id);
            if (isGroupUnlocked) {
                if (t.subTopics) {
                    const visibleSubTopics = t.subTopics.filter(sub => sub.hiddenIf !== language);
                    leaves.push(...visibleSubTopics);
                }
                else leaves.push(t);
            }
        });
        return leaves;
    };

    const [soundOn, setSoundOn] = useState(getSoundEnabled());
    const [activePool, setActivePool] = useState(() => {
        try {
            const saved = localStorage.getItem('activeCategories');
            const allLeaves = getLeafTopics();
            const leafIds = allLeaves.map(t => t.id);
            const preferredDefaults = ['israel_cities', 'judaism', 'animals', 'countries', 'math', 'israeli_music'];
            const defaultPool = leafIds.filter(id => preferredDefaults.includes(id));
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
            let current = parsed.filter(id => leafIds.includes(id));
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
    const [focusedTopicId, setFocusedTopicId] = useState(() => localStorage.getItem('last_focusedTopicId') || null);
    const childRecord = parseInt(localStorage.getItem('survival_high_score_child') || '0', 10);
    const adultRecord = parseInt(localStorage.getItem('survival_high_score_adult') || '0', 10);
    const focusedRecord = focusedTopicId ? parseInt(localStorage.getItem(`survival_high_score_focused_${focusedTopicId}`) || '0', 10) : 0;
    const [newCategories, setNewCategories] = useState([]);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [newFeatures, setNewFeatures] = useState([]);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [selectedAvatars, setSelectedAvatars] = useState(() => {
        try {
            const saved = localStorage.getItem('last_avatars');
            if (!saved) return { 1: null, 2: null };
            const parsed = JSON.parse(saved);

            const getAvatarWithSkin = (id) => {
                const baseAvatar = avatars.find(a => a.id === id);
                if (!baseAvatar) return null;
                const activeSkin = baseAvatar.skins?.find(s => s.id !== 'default' && activeSkins.includes(`${baseAvatar.id}_${s.id}`));
                return {
                    ...baseAvatar,
                    image: activeSkin?.image || baseAvatar.image,
                    image_happy: activeSkin?.image_happy || null,
                    image_sad: activeSkin?.image_sad || null,
                    currentSkin: activeSkin?.id || 'default'
                };
            };

            return {
                1: getAvatarWithSkin(parsed[1]),
                2: getAvatarWithSkin(parsed[2])
            };
        } catch (e) {
            return { 1: null, 2: null };
        }
    });
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', icon: '⚠️' });
    const [isShopOpen, setIsShopOpen] = useState(false);

    useEffect(() => {
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
        const seenFeatures = JSON.parse(localStorage.getItem('seenNewFeatures') || '[]');
        const freshFeatures = features.filter(f =>
            f.newUntil &&
            new Date(f.newUntil) > now &&
            !seenFeatures.includes(f.id)
        );
        if (freshFeatures.length > 0) {
            setNewFeatures(freshFeatures);
            if (fresh.length === 0) {
                setIsFeatureModalOpen(true);
            }
        }
    }, [activePool]);

    useEffect(() => {
        localStorage.setItem('last_gridSize', gridSize.toString());
        localStorage.setItem('last_difficulty', difficulty.toString());
        localStorage.setItem('last_gameMode', gameMode);
        localStorage.setItem('last_survivalType', survivalType);
        if (focusedTopicId) localStorage.setItem('last_focusedTopicId', focusedTopicId);
        localStorage.setItem('last_selectedTopics', JSON.stringify(selectedTopics));
        localStorage.setItem('last_avatars', JSON.stringify({
            1: selectedAvatars[1]?.id || null,
            2: selectedAvatars[2]?.id || null
        }));
    }, [gridSize, difficulty, gameMode, survivalType, focusedTopicId, selectedAvatars, selectedTopics]);

    // Update selected avatars if activeSkins changes (e.g., from ShopModal)
    useEffect(() => {
        setSelectedAvatars(prev => {
            let changed = false;
            const updated = { ...prev };
            [1, 2].forEach(playerNum => {
                if (updated[playerNum]) {
                    const baseAvatar = avatars.find(a => a.id === updated[playerNum].id);
                    if (baseAvatar) {
                        const activeSkin = baseAvatar.skins?.find(s => s.id !== 'default' && activeSkins.includes(`${baseAvatar.id}_${s.id}`));
                        const newImage = activeSkin?.image || baseAvatar.image;
                        const newImageHappy = activeSkin?.image_happy || null;
                        const newImageSad = activeSkin?.image_sad || null;
                        const newSkinId = activeSkin?.id || 'default';

                        if (updated[playerNum].image !== newImage || updated[playerNum].currentSkin !== newSkinId) {
                            updated[playerNum] = {
                                ...baseAvatar,
                                image: newImage,
                                image_happy: newImageHappy,
                                image_sad: newImageSad,
                                currentSkin: newSkinId
                            };
                            changed = true;
                        }
                    }
                }
            });
            return changed ? updated : prev;
        });
    }, [activeSkins]);

    const handleDismissNew = () => {
        const seenNew = JSON.parse(localStorage.getItem('seenNewCategories') || '[]');
        const updated = [...new Set([...seenNew, ...newCategories.map(c => c.id)])];
        localStorage.setItem('seenNewCategories', JSON.stringify(updated));
        setIsNewModalOpen(false);
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

    const visibleTopics = getLeafTopics().filter(t => activePool.includes(t.id));

    const handleModeChange = (mode) => {
        setGameMode(mode);
        if (mode === 'survival') {
            setSelectedTopics(visibleTopics.map(t => t.id));
        }
    };

    const handleTopicToggle = (topicId) => {
        if (gameMode === 'survival') return; // Cannot toggle in survival
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
        // Ensure we only pass topics that are actually visible in the current active pool
        const validSelectedTopics = selectedTopics.filter(id => visibleTopics.some(t => t.id === id));

        if (validSelectedTopics.length === 0 && gameMode !== 'survival') {
            setAlertConfig({ isOpen: true, message: t.select_at_least_one, icon: '📚' });
            return;
        }

        if (gameMode === 'survival' && survivalType === 'focused' && !focusedTopicId) {
            setAlertConfig({ isOpen: true, message: t.survival_focused_pick, icon: '🎯' });
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

        const configAvatars = { 1: selectedAvatars[1], 2: selectedAvatars[2] };
        onStart({
            gridSize,
            topics: validSelectedTopics,
            difficulty,
            gameMode,
            survivalType,
            focusedTopicId: survivalType === 'focused' ? focusedTopicId : null,
            avatars: configAvatars
        });
    };

    const handleAvatarSelect = (avatar, playerNum) => {
        playSound('pop');
        setSelectedAvatars(prev => {
            if (gameMode === '1v1') {
                if (playerNum === 1 && prev[2]?.id === avatar.id) return prev;
                if (playerNum === 2 && prev[1]?.id === avatar.id) return prev;
            }
            return { ...prev, [playerNum]: avatar };
        });
    };

    return (
        <div className="start-screen glass-panel">
            <div className="top-controls">
                <div className="coin-pill coin-pulse" data-testid="start-coins">
                    <img src="/icons/gold_coin.png" alt="coin" className="global-coin main-screen-coin" /> <span className="coin-count">{totalCoins}</span>
                </div>
                <button className="shop-invite-btn" onClick={() => setIsShopOpen(true)}>
                    🛒 {language === 'he' ? 'חנות' : 'Shop'}
                </button>
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
                unlockedTopics={unlockedTopics}
            />

            <NewCategoryModal isOpen={isNewModalOpen} onClose={handleDismissNew} newCategories={newCategories} language={language} t={t} />
            <NewFeatureModal isOpen={isFeatureModalOpen} onClose={handleDismissFeatures} features={newFeatures} language={language} t={t} />
            <AlertModal isOpen={alertConfig.isOpen} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} message={alertConfig.message} icon={alertConfig.icon} />
            <AvatarShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} language={language} totalCoins={totalCoins} unlockedAvatars={unlockedAvatars} activeAvatars={activeAvatars} onBuyAvatar={onBuyAvatar} onToggleAvatar={onToggleAvatar} onSelectAvatar={(avatar) => handleAvatarSelect(avatar, 1)} selectedAvatars={selectedAvatars} unlockedTopics={unlockedTopics} onBuyTopic={onBuyTopic} unlockedSkins={unlockedSkins} activeSkins={activeSkins} onToggleSkin={onToggleSkin} onBuySkin={onBuySkin} unlockedThemes={unlockedThemes} activeTheme={activeTheme} onBuyTheme={onBuyTheme} onEquipTheme={onEquipTheme} />

            <h2>{t.lets_play}</h2>
            <p className="total-questions-count">
                {t.total_questions.replace('{n}', Object.values(questionCounts).reduce((a, b) => a + b, 0).toLocaleString())}
            </p>

            <div className="config-section">
                <h3>{t.game_mode}</h3>
                <div className="mode-options">
                    <button className={`mode-btn ${gameMode === 'solo' ? 'active' : ''}`} onClick={() => handleModeChange('solo')} data-testid="start-solo">
                        <span className="mode-title">👤 {t.solo}</span>
                        <div className="mode-info">
                            <span className="mode-reward-badge"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {t.reward_solo}</span>
                        </div>
                    </button>
                    <button className={`mode-btn ${gameMode === '1v1' ? 'active' : ''}`} onClick={() => handleModeChange('1v1')} data-testid="start-1v1">
                        <span className="mode-title">⚔️ {t.v1}</span>
                        <div className="mode-info">
                            <span className="mode-reward-badge"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {t.reward_1v1}</span>
                        </div>
                    </button>
                    <button className={`mode-btn ${gameMode === 'time_attack' ? 'active' : ''}`} onClick={() => handleModeChange('time_attack')} data-testid="start-time-attack">
                        <span className="mode-title">⏱️ {t.time_attack}</span>
                        <div className="mode-info">
                            <span className="mode-reward-badge"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {t.reward_time_attack}</span>
                        </div>
                    </button>
                    <button className={`mode-btn ${gameMode === 'endless' ? 'active' : ''}`} onClick={() => handleModeChange('endless')} data-testid="start-endless">
                        <span className="mode-title">☄️ {t.endless || 'Avalanche'}</span>
                        <div className="mode-info">
                            <span className="mode-reward-badge"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {t.reward_endless || 'Endless Score'}</span>
                        </div>
                    </button>
                    <button className={`mode-btn ${gameMode === 'survival' ? 'active' : ''}`} onClick={() => handleModeChange('survival')} data-testid="start-survival">
                        <span className="mode-title">🔥 {t.survival}</span>
                        <div className="mode-info">
                            <span className="mode-reward-badge"><img src="/icons/gold_coin.png" alt="coin" className="global-coin" /> {t.reward_survival}</span>
                        </div>
                    </button>
                </div>
            </div>

            {gameMode === 'survival' && (
                <div className="config-section survival-type-selection card-pop">
                    <h3>{t.survival_course}</h3>
                    <div className="mode-options">
                        <button className={`mode-btn ${survivalType === 'child' ? 'active' : ''}`} onClick={() => setSurvivalType('child')} data-testid="start-survival-child">
                            <span className="mode-title" style={{ fontSize: '0.8rem' }}>🟢 {t.survival_child}</span>
                            <div className="mode-info" style={{ marginTop: '2px' }}>
                                <span className="mode-reward-badge">🏆 {t.best}: {childRecord}</span>
                            </div>
                        </button>
                        <button className={`mode-btn ${survivalType === 'adult' ? 'active' : ''}`} onClick={() => setSurvivalType('adult')} data-testid="start-survival-adult">
                            <span className="mode-title" style={{ fontSize: '0.8rem' }}>🔴 {t.survival_adult}</span>
                            <div className="mode-info" style={{ marginTop: '2px' }}>
                                <span className="mode-reward-badge">🏆 {t.best}: {adultRecord}</span>
                            </div>
                        </button>
                        <button className={`mode-btn ${survivalType === 'focused' ? 'active' : ''}`} onClick={() => setSurvivalType('focused')} data-testid="start-survival-focused">
                            <span className="mode-title" style={{ fontSize: '0.8rem' }}>🎯 {t.survival_focused}</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="config-section">
                <div className="section-header-with-btn">
                    <h3>{language === 'he' ? '3. בחרו אווטאר' : '3. Choose Avatar'}</h3>
                </div>
                <div className="avatar-selection-container card-pop">
                    <div className="avatar-player-section">
                        <h4>{language === 'he' ? 'שחקן 1' : 'Player 1'}</h4>
                        <div className="avatar-slider-wrapper">
                            <div className="avatar-slider">
                                {avatars.filter(a => activeAvatars.includes(a.id)).map(avatar => {
                                    const activeSkin = avatar.skins?.find(s => s.id !== 'default' && activeSkins.includes(`${avatar.id}_${s.id}`));
                                    const displayAvatar = { ...avatar, image: activeSkin?.image || avatar.image, currentSkin: activeSkin?.id || 'default' };
                                    return (
                                        <button key={avatar.id} className={`avatar-btn-mini ${selectedAvatars[1]?.id === avatar.id ? 'active' : ''} premium-mode`} onClick={() => handleAvatarSelect(displayAvatar, 1)} data-testid={`avatar-option-${avatar.id}`}>
                                            <div className="premium-avatar-box">
                                                {displayAvatar.image ? <img src={displayAvatar.image} alt={displayAvatar.name[language]} className="avatar-img-premium" /> : <span className="avatar-emoji-mini">{displayAvatar.emoji}</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                                <button className="avatar-btn-mini more-btn">+</button>
                            </div>
                        </div>
                    </div>
                    {gameMode === '1v1' && (
                        <div className="avatar-player-section">
                            <h4>{language === 'he' ? 'שחקן 2' : 'Player 2'}</h4>
                            <div className="avatar-slider-wrapper">
                                <div className="avatar-slider">
                                    {avatars.filter(a => activeAvatars.includes(a.id)).map(avatar => {
                                        const activeSkin = avatar.skins?.find(s => s.id !== 'default' && activeSkins.includes(`${avatar.id}_${s.id}`));
                                        const displayAvatar = { ...avatar, image: activeSkin?.image || avatar.image, currentSkin: activeSkin?.id || 'default' };
                                        return (
                                            <button key={avatar.id} className={`avatar-btn-mini ${selectedAvatars[2]?.id === avatar.id ? 'active' : ''} ${selectedAvatars[1]?.id === avatar.id ? 'disabled' : ''} premium-mode`} onClick={() => handleAvatarSelect(displayAvatar, 2)} data-testid={`avatar-option-p2-${avatar.id}`} disabled={selectedAvatars[1]?.id === avatar.id}>
                                                <div className="premium-avatar-box">
                                                    {displayAvatar.image ? <img src={displayAvatar.image} alt={displayAvatar.name[language]} className="avatar-img-premium" /> : <span className="avatar-emoji-mini">{displayAvatar.emoji}</span>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {gameMode !== 'survival' && gameMode !== 'endless' && (
                <>
                    <div className="config-section">
                        <h3>{t.choose_size}</h3>
                        <div className="grid-options">
                            {[9, 16, 25].map(s => <button key={s} className={`grid-btn ${gridSize === s ? 'active' : ''}`} onClick={() => setGridSize(s)} data-testid={`grid-size-${s}`}><span dir="ltr">{Math.sqrt(s)} x {Math.sqrt(s)}</span></button>)}
                        </div>
                    </div>
                    <div className="config-section">
                        <h3>{t.choose_difficulty}</h3>
                        <div className="diff-options">
                            {[1, 2, 3].map(level => <button key={level} className={`diff-btn level-${level} ${difficulty === level ? 'active' : ''}`} onClick={() => setDifficulty(level)} data-testid={`diff-level-${level}`}>{t.level} {level}</button>)}
                        </div>
                    </div>
                </>
            )}

            <div className="config-section">
                <h3>{gameMode === 'survival' && survivalType === 'focused' ? t.survival_focused_pick : t.choose_topics}</h3>
                <div className="topic-options">
                    {visibleTopics.map(topic => {
                        const isFocusedSurvival = gameMode === 'survival' && survivalType === 'focused';
                        const isSelected = isFocusedSurvival
                            ? focusedTopicId === topic.id
                            : (gameMode === 'survival' ? true : selectedTopics.includes(topic.id));

                        const topicFocusedRecord = isFocusedSurvival
                            ? parseInt(localStorage.getItem(`survival_high_score_focused_${topic.id}`) || '0', 10)
                            : 0;

                        return (
                            <div
                                key={topic.id}
                                className={`topic-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                    if (isFocusedSurvival) {
                                        setFocusedTopicId(topic.id);
                                        playSound('pop');
                                    } else if (gameMode !== 'survival') {
                                        handleTopicToggle(topic.id);
                                    } else if (gameMode === 'survival' && survivalType !== 'focused') {
                                        // Do nothing for normal survival
                                    }
                                }}
                                data-testid={`topic-option-${topic.id}`}
                            >
                                <div className="topic-info-main">
                                    <span className="topic-name">{topic.name[language]}</span>
                                    {isFocusedSurvival && topicFocusedRecord > 0 ? (
                                        <span className="topic-count">🏆 {topicFocusedRecord}</span>
                                    ) : (
                                        <span className="topic-count">{questionCounts[topic.id] || 0} {t.questions_count}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="start-btn card-pop" onClick={handleStart} data-testid="start-game-btn">
                {gameMode === 'survival' ? (language === 'he' ? 'התחל הישרדות!' : 'Start Survival!') : t.start_game + ' 🚀'}
            </button>
        </div>
    );
}

export default StartScreen;
