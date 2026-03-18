import { useState } from 'react';
import { avatars } from '../data/avatars';
import { topics } from '../data/questions/index';
import { themes } from '../data/themes';
import { translations } from '../data/translations';
import { playSound } from '../utils/sounds';
import './AvatarShopModal.css';

function AvatarShopModal({
    isOpen, onClose, language, totalCoins,
    unlockedAvatars, activeAvatars, onBuyAvatar, onToggleAvatar,
    onSelectAvatar, selectedAvatars,
    unlockedTopics, onBuyTopic,
    unlockedSkins, activeSkins, onToggleSkin, onBuySkin,
    unlockedThemes, activeTheme, onBuyTheme, onEquipTheme
}) {
    const [activeTab, setActiveTab] = useState('avatars');
    const [previewItem, setPreviewItem] = useState(null);

    if (!isOpen) return null;

    const t = translations[language];

    const avatarCategories = [
        { id: 'free', label: language === 'he' ? 'חינם' : 'Free' },
        { id: 'premium', label: language === 'he' ? 'פרימיום' : 'Premium' },
        { id: 'legendary', label: language === 'he' ? 'אגדי' : 'Legendary' }
    ];

    // Define purchasable topics
    const themePrices = {
        'judaism_group': 555,
        'sports_group': 450,
        'entertainment_group': 400,
        'lifestyle_group': 300,
        'world_group': 350
    };

    const purchasableTopicGroups = topics
        .filter(group => themePrices[group.id])
        .map(group => ({
            ...group,
            price: themePrices[group.id]
        }));

    const handleBuyAvatar = (avatar) => {
        if (totalCoins >= avatar.price) {
            onBuyAvatar(avatar.id, avatar.price);
        } else {
            playSound('error');
        }
    };

    const handleBuyTopic = (group) => {
        if (totalCoins >= group.price) {
            onBuyTopic(group.id, group.price);
        } else {
            playSound('error');
        }
    };

    const handleBuySkin = (skin) => {
        if (totalCoins >= skin.price) {
            onBuySkin(skin.id, skin.price);
        } else {
            playSound('error');
        }
    };

    const handleSelectSkin = (avatar, skin) => {
        onSelectAvatar({ ...avatar, image: skin.image, currentSkin: skin.id }, 1); // Simple P1 selection for now
    };

    const handleBuyTheme = (theme) => {
        if (totalCoins >= theme.price) {
            onBuyTheme(theme.id, theme.price);
        } else {
            playSound('error');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content shop-modal glass-panel card-pop" onClick={e => e.stopPropagation()}>
                <div className="shop-header">
                    <h2>🛒 {t.shop}</h2>
                    <div className="shop-coins">🪙 {totalCoins}</div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="shop-tabs">
                    <button
                        className={`shop-tab-btn ${activeTab === 'avatars' ? 'active' : ''}`}
                        onClick={() => setActiveTab('avatars')}
                    >
                        {t.shop_tab_avatars}
                    </button>
                    <button
                        className={`shop-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('topics')}
                    >
                        {t.shop_tab_topics}
                    </button>
                    <button
                        className={`shop-tab-btn ${activeTab === 'backgrounds' ? 'active' : ''}`}
                        onClick={() => setActiveTab('backgrounds')}
                    >
                        {t.shop_tab_backgrounds}
                    </button>
                    <button
                        className={`shop-tab-btn ${activeTab === 'skins' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skins')}
                    >
                        {t.shop_tab_skins}
                    </button>
                </div>

                <div className="shop-body">
                    {activeTab === 'avatars' ? (
                        avatarCategories.map(cat => (
                            <div key={cat.id} className="shop-category-section">
                                <h3>{cat.label}</h3>
                                <div className="shop-grid">
                                    {avatars.filter(a => a.category === cat.id).map(avatar => {
                                        const isUnlocked = unlockedAvatars.includes(avatar.id);
                                        const isSelected = selectedAvatars[1]?.id === avatar.id || selectedAvatars[2]?.id === avatar.id;

                                        return (
                                            <div
                                                key={avatar.id}
                                                className={`shop-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                                                onClick={() => setPreviewItem({
                                                    ...avatar,
                                                    image: avatar.image, // will be undefined for emoji-base
                                                    isUnlocked,
                                                    isActive: activeAvatars.includes(avatar.id),
                                                    onToggle: onToggleAvatar,
                                                    onBuy: handleBuyAvatar,
                                                    type: 'avatar'
                                                })}
                                            >
                                                <div className="shop-item-emoji">
                                                    <div className="premium-avatar-box" style={{ width: '70px' }}>
                                                        {avatar.image ? (
                                                            <img src={avatar.image} alt={avatar.name[language]} className="avatar-img-premium" />
                                                        ) : (
                                                            <span style={{ fontSize: '2.5rem' }}>{avatar.emoji}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="shop-item-name">{avatar.name[language]}</div>

                                                {isUnlocked ? (
                                                    <div
                                                        className={`toggle-switch ${activeAvatars.includes(avatar.id) ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleAvatar(avatar.id);
                                                        }}
                                                    >
                                                        <div className="toggle-knob"></div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="shop-btn buy-btn"
                                                        disabled={totalCoins < avatar.price}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBuyAvatar(avatar);
                                                        }}
                                                    >
                                                        🪙 {avatar.price}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : activeTab === 'skins' ? (
                        <div className="shop-skins-container">
                            {avatars.filter(a => a.skins).map(avatar => (
                                <div key={avatar.id} className="character-skins-group">
                                    <div className="character-info-row">
                                        <div className="premium-avatar-box mini-box">
                                            <span style={{ fontSize: '1.2rem' }}>{avatar.emoji}</span>
                                        </div>
                                        <h3 className="character-skins-title">{avatar.name[language]}</h3>
                                    </div>
                                    <div className="character-skins-row">
                                        {avatar.skins.map(skin => {
                                            const skinFullId = `${avatar.id}_${skin.id}`;
                                            const isUnlocked = unlockedSkins.includes(skinFullId);
                                            const isSelected = selectedAvatars[1]?.currentSkin === skin.id && selectedAvatars[1]?.id === avatar.id;
                                            const isBaseUnlocked = unlockedAvatars.includes(avatar.id);

                                            return (
                                                <div
                                                    key={skinFullId}
                                                    className={`shop-item skin-item ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setPreviewItem({
                                                        ...skin,
                                                        id: skinFullId,
                                                        baseId: avatar.id,
                                                        isUnlocked,
                                                        isActive: activeSkins.includes(skinFullId),
                                                        onToggle: onToggleSkin,
                                                        onBuy: handleBuySkin,
                                                        type: 'skin'
                                                    })}
                                                >
                                                    <div className="shop-item-emoji">
                                                        <div className="premium-avatar-box" style={{ width: '55px' }}>
                                                            <img src={skin.image} alt={skin.name[language]} className="avatar-img-premium" />
                                                        </div>
                                                    </div>
                                                    <div className="shop-item-name">{skin.name[language]}</div>
                                                    {isUnlocked ? (
                                                        <div
                                                            className={`toggle-switch ${activeSkins.includes(skinFullId) ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onToggleSkin(skinFullId);
                                                            }}
                                                        >
                                                            <div className="toggle-knob"></div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="shop-btn buy-btn"
                                                            disabled={totalCoins < skin.price || !isBaseUnlocked}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBuySkin({ ...skin, id: skinFullId });
                                                            }}
                                                        >
                                                            🪙 {skin.price}
                                                        </button>
                                                    )}
                                                    {!isBaseUnlocked && <div className="base-lock-warning">{language === 'he' ? 'צריך להשיג את הדמות קודם! ✨' : 'Get the character first! ✨'}</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activeTab === 'topics' ? (
                        <div className="shop-category-section">
                            <h3>{t.shop_tab_topics}</h3>
                            <div className="shop-grid">
                                {purchasableTopicGroups.map(group => {
                                    const isUnlocked = unlockedTopics.includes(group.id);
                                    return (
                                        <div key={group.id} className={`shop-item topic-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                            <div className="shop-item-emoji">{group.icon}</div>
                                            <div className="shop-item-name">{group.name[language]}</div>
                                            {isUnlocked ? (
                                                <div className="owned-label">✅ {t.owned}</div>
                                            ) : (
                                                <button
                                                    className="shop-btn buy-btn"
                                                    disabled={totalCoins < group.price}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBuyTopic(group);
                                                    }}
                                                >
                                                    🪙 {group.price}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="shop-category-section">
                                <h3>{language === 'he' ? 'רקעים סולידיים' : 'Solid Backgrounds'}</h3>
                                <div className="shop-grid">
                                    {themes.filter(t => t.category === 'free').map(theme => {
                                        const isUnlocked = unlockedThemes.includes(theme.id);
                                        const isEquipped = activeTheme === theme.id;
                                        return (
                                            <div
                                                key={theme.id}
                                                className={`shop-item topic-item ${isUnlocked ? 'unlocked' : 'locked'} ${isEquipped ? 'selected' : ''}`}
                                                onClick={() => setPreviewItem({
                                                    ...theme,
                                                    isUnlocked,
                                                    isActive: isEquipped,
                                                    onToggle: () => onEquipTheme(theme.id),
                                                    onBuy: handleBuyTheme,
                                                    type: 'theme'
                                                })}
                                            >
                                                <div className="shop-item-emoji">
                                                    <div className="premium-avatar-box" style={{ width: '85px', height: '85px' }}>
                                                        {theme.image ? (
                                                            <img src={theme.image} alt={theme.name[language]} className="avatar-img-premium" />
                                                        ) : theme.color ? (
                                                            <div style={{ width: '100%', height: '100%', backgroundColor: theme.color, borderRadius: 'inherit' }}></div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="shop-item-name">{theme.name[language]}</div>

                                                {isUnlocked ? (
                                                    <div
                                                        className={`toggle-switch ${isEquipped ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEquipTheme(theme.id);
                                                        }}
                                                    >
                                                        <div className="toggle-knob"></div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="shop-btn buy-btn"
                                                        disabled={totalCoins < theme.price}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBuyTheme(theme);
                                                        }}
                                                    >
                                                        🪙 {theme.price}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="shop-category-section">
                                <h3>{language === 'he' ? 'רקעים מיוחדים' : 'Special Backgrounds'}</h3>
                                <div className="shop-grid">
                                    {themes.filter(t => t.category === 'premium').map(theme => {
                                        const isUnlocked = unlockedThemes.includes(theme.id);
                                        const isEquipped = activeTheme === theme.id;
                                        return (
                                            <div
                                                key={theme.id}
                                                className={`shop-item topic-item ${isUnlocked ? 'unlocked' : 'locked'} ${isEquipped ? 'selected' : ''}`}
                                                onClick={() => setPreviewItem({
                                                    ...theme,
                                                    isUnlocked,
                                                    isActive: isEquipped,
                                                    onToggle: () => onEquipTheme(theme.id),
                                                    onBuy: handleBuyTheme,
                                                    type: 'theme'
                                                })}
                                            >
                                                <div className="shop-item-emoji">
                                                    <div className="premium-avatar-box" style={{ width: '85px', height: '85px' }}>
                                                        {theme.image ? (
                                                            <img src={theme.image} alt={theme.name[language]} className="avatar-img-premium" />
                                                        ) : theme.color ? (
                                                            <div style={{ width: '100%', height: '100%', backgroundColor: theme.color, borderRadius: 'inherit' }}></div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="shop-item-name">{theme.name[language]}</div>

                                                {isUnlocked ? (
                                                    <div
                                                        className={`toggle-switch ${isEquipped ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEquipTheme(theme.id);
                                                        }}
                                                    >
                                                        <div className="toggle-knob"></div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="shop-btn buy-btn"
                                                        disabled={totalCoins < theme.price}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBuyTheme(theme);
                                                        }}
                                                    >
                                                        🪙 {theme.price}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {previewItem && (
                    <div className="big-show-overlay" onClick={() => setPreviewItem(null)}>
                        <div className="big-show-content card-pop" onClick={e => e.stopPropagation()}>
                            <button className="big-show-close" onClick={() => setPreviewItem(null)}>✕</button>
                            <div className="big-show-main">
                                <div className="premium-avatar-box big-view">
                                    {previewItem.image ? (
                                        <img src={previewItem.image} alt={previewItem.name[language]} className="avatar-img-premium" />
                                    ) : previewItem.color ? (
                                        <div style={{ width: '100%', height: '100%', backgroundColor: previewItem.color, borderRadius: 'inherit' }}></div>
                                    ) : (
                                        <span className="big-emoji">{previewItem.emoji}</span>
                                    )}
                                </div>
                                <div className="big-show-details">
                                    <h2 className="big-show-name">{previewItem.name[language]}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AvatarShopModal;
