import React from 'react';
import './NewFeatureModal.css';

function NewFeatureModal({ isOpen, onClose, features, language, t }) {
    if (!isOpen || features.length === 0) return null;

    return (
        <div className="new-feature-overlay">
            <div className="new-feature-modal glass-panel">
                <div className="new-feature-icon">✨</div>
                <div className="new-feature-list">
                    {features.map(f => (
                        <div key={f.id} className="new-feature-item">
                            <div className="feature-header">
                                <span className="feature-emoji">{f.icon}</span>
                                <h2>{f.title[language]}</h2>
                            </div>
                            <p className="feature-description">{f.description[language]}</p>
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

export default NewFeatureModal;
