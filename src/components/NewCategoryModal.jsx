import React from 'react';
import './NewCategoryModal.css';

function NewCategoryModal({ isOpen, onClose, newCategories, language, t }) {
    if (!isOpen || newCategories.length === 0) return null;

    const categoryNames = newCategories.map(c => c.name[language]).join(', ');

    return (
        <div className="new-category-overlay">
            <div className="new-category-modal glass-panel">
                <div className="new-category-icon">🆕</div>
                <h2>{t.new_content_title}</h2>
                <p>{t.new_content_desc.replace('{name}', categoryNames)}</p>
                <div className="new-category-list">
                    {newCategories.map(c => (
                        <div key={c.id} className="new-category-item">
                            <span>{c.icon}</span>
                            <span>{c.name[language]}</span>
                        </div>
                    ))}
                </div>
                <button className="got-it-btn" onClick={onClose}>
                    {t.got_it}
                </button>
            </div>
        </div>
    );
}

export default NewCategoryModal;
