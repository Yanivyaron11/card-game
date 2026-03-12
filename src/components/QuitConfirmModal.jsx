import React from 'react';
import { translations } from '../data/translations';
import './QuitConfirmModal.css';

function QuitConfirmModal({ isOpen, onClose, onConfirm, language }) {
    if (!isOpen) return null;
    const t = translations[language];

    return (
        <div className="modal-backdrop">
            <div className="confirm-modal glass-panel">
                <div className="modal-icon">❓</div>
                <h3>{t.confirm_quit}</h3>
                <div className="modal-actions">
                    <button className="confirm-btn no" onClick={onClose}>
                        {t.no}
                    </button>
                    <button className="confirm-btn yes" onClick={onConfirm}>
                        {t.yes}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuitConfirmModal;
