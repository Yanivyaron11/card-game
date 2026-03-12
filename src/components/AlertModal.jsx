import React from 'react';
import './AlertModal.css';

function AlertModal({ isOpen, onClose, message, title, icon = "⚠️" }) {
    if (!isOpen) return null;

    return (
        <div className="alert-modal-backdrop" onClick={onClose}>
            <div className="alert-modal-content glass-panel card-pop" onClick={e => e.stopPropagation()}>
                <div className="alert-modal-icon">{icon}</div>
                {title && <h3 className="alert-modal-title">{title}</h3>}
                <p className="alert-modal-message">{message}</p>
                <button className="alert-modal-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default AlertModal;
