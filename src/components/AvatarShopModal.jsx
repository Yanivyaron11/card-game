import { useState } from 'react';
import { avatars } from '../data/avatars';
import { topics } from '../data/questions/index';
import { translations } from '../data/translations';
import { playSound } from '../utils/sounds';
import './AvatarShopModal.css';

function AvatarShopModal({ isOpen, onClose, language, totalCoins, unlockedAvatars, onBuyAvatar, onSelectAvatar, selectedAvatars, unlockedTopics, onBuyTopic }) {
    const [activeTab, setActiveTab] = useState('avatars');

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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content shop-modal glass-panel card-pop" onClick={e => e.stopPropagation()}>
                <div className="shop-header">
                    <h2>🛒 {t.title} - {t.topic_shop_title}</h2>
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
                        className={`shop-tab-btn ${activeTab === 'themes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('themes')}
                    >
                        {t.shop_tab_themes}
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
                                            <div key={avatar.id} className={`shop-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                                <div className="shop-item-emoji">{avatar.emoji}</div>
                                                <div className="shop-item-name">{avatar.name[language]}</div>

                                                {isUnlocked ? (
                                                    <button
                                                        className={`shop-btn select-btn ${isSelected ? 'active' : ''}`}
                                                        onClick={() => !isSelected && onSelectAvatar(avatar)}
                                                    >
                                                        {isSelected ? (language === 'he' ? 'נבחר' : 'Selected') : (language === 'he' ? 'בחר' : 'Select')}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="shop-btn buy-btn"
                                                        disabled={totalCoins < avatar.price}
                                                        onClick={() => handleBuyAvatar(avatar)}
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
                    ) : (
                        <div className="shop-category-section">
                            <h3>{t.shop_tab_themes}</h3>
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
                                                    onClick={() => handleBuyTopic(group)}
                                                >
                                                    🪙 {group.price}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AvatarShopModal;
