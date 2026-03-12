import React from 'react';
import { translations } from '../data/translations';
import './EarningGuideModal.css';

function EarningGuideModal({ isOpen, onClose, language }) {
    if (!isOpen) return null;

    const t = translations[language];

    const rules = [
        { icon: '🎯', text: t.rule_level_1 },
        { icon: '🎯', text: t.rule_level_2 },
        { icon: '🎯', text: t.rule_level_3 },
        { icon: '🔥', text: t.rule_streak },
        { icon: '⏱️', text: t.rule_time_attack },
        { icon: '🏆', text: t.rule_survival_record },
        { icon: '🎉', text: t.rule_survival_completion }
    ];

    return (
        <div className="modal-overlay earning-guide-overlay" onClick={onClose}>
            <div className="modal-content earning-guide-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t.earning_guide_title} 🎁</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="earning-rules-list">
                    {rules.map((rule, index) => (
                        <div key={index} className="earning-rule-item card-pop">
                            <span className="rule-icon">{rule.icon}</span>
                            <span className="rule-text">{rule.text}</span>
                        </div>
                    ))}
                </div>

                <button className="modal-footer-btn start-btn" onClick={onClose}>
                    {t.close}
                </button>
            </div>
        </div>
    );
}

export default EarningGuideModal;
