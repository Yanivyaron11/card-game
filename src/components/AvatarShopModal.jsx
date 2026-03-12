import { avatars } from '../data/avatars';
import { translations } from '../data/translations';
import { playSound } from '../utils/sounds';
import './AvatarShopModal.css';

function AvatarShopModal({ isOpen, onClose, language, totalCoins, unlockedAvatars, onBuyAvatar, onSelectAvatar, selectedAvatars }) {
    if (!isOpen) return null;

    const t = translations[language];

    const categories = [
        { id: 'free', label: language === 'he' ? 'חינם' : 'Free' },
        { id: 'premium', label: language === 'he' ? 'פרימיום' : 'Premium' },
        { id: 'legendary', label: language === 'he' ? 'אגדי' : 'Legendary' }
    ];

    const handleBuy = (avatar) => {
        if (totalCoins >= avatar.price) {
            onBuyAvatar(avatar.id, avatar.price);
        } else {
            playSound('error');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content shop-modal glass-panel card-pop" onClick={e => e.stopPropagation()}>
                <div className="shop-header">
                    <h2>🛒 {language === 'he' ? 'חנות האוואטרים' : 'Avatar Shop'}</h2>
                    <div className="shop-coins">🪙 {totalCoins}</div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="shop-body">
                    {categories.map(cat => (
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
                                                    onClick={() => handleBuy(avatar)}
                                                >
                                                    🪙 {avatar.price}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AvatarShopModal;
