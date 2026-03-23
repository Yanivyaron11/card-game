import React from 'react';
import { translations } from '../data/translations';
import './EarningGuideModal.css';

function EarningGuideModal({ isOpen, onClose, language }) {
    if (!isOpen) return null;

    const t = translations[language];

    const sections = [
        {
            title: t.rules_section_coins,
            rules: [
                { icon: '🎯', text: t.rule_level_1 },
                { icon: '🎯', text: t.rule_level_2 },
                { icon: '🎯', text: t.rule_level_3 },
                { icon: '⏱️', text: t.rule_time_attack },
                { icon: '⭕', text: t.rule_tictactoe },
                { icon: '☄️', text: t.rule_endless_1 }
            ]
        },
        {
            title: t.rules_section_bonuses,
            rules: [
                { icon: '💥', text: t.rule_endless_2 },
                { icon: '✨', text: t.rule_endless_3 },
                { icon: '🐉', text: t.rule_endless_4 },
                { icon: '🌋', text: t.rule_endless_5 },
                { icon: '👑', text: t.rule_endless_6 },
                { icon: '🔥', text: t.rule_streak },
                { icon: '🏆', text: t.rule_survival_record },
                { icon: '🎉', text: t.rule_survival_completion },
                { icon: '🧩', text: t.rule_board_completion },
                { icon: '🌟', text: t.rule_perfect_board },
                { icon: '🎁', text: t.rule_daily_bonus }
            ]
        },
        {
            title: t.rules_section_penalties,
            rules: [
                { icon: '🛑', text: t.rule_quit_penalty }
            ]
        },
        {
            title: t.rules_section_mechanics || 'Special Mechanics',
            rules: [
                { icon: '🥷', text: t.rule_thief },
                { icon: '🛡️', text: t.rule_shield }
            ]
        }
    ];

    return (
        <div className="modal-overlay earning-guide-overlay" onClick={onClose}>
            <div className="modal-content earning-guide-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t.earning_guide_title} 📜</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="earning-rules-list">
                    {sections.map((section, idx) => (
                        <div key={idx} className="rules-section">
                            <h3 className="rules-section-title">{section.title}</h3>
                            <div className="rules-section-content">
                                {section.rules.map((rule, index) => (
                                    <div key={index} className="earning-rule-item card-pop">
                                        <span className="rule-icon">{rule.icon}</span>
                                        <span className="rule-text">{rule.text}</span>
                                    </div>
                                ))}
                            </div>
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
