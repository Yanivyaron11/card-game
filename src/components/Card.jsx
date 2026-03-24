import { translations } from '../data/translations';
import './Card.css';

function Card({ card, onClick, currentPlayer, gameMode, language, avatars, wrapperClass = '' }) {
    const t = translations[language];
    // Simple card that only displays topic and solved status
    const isBlocked = gameMode === '1v1' &&
        card.failedAttempts === 1 &&
        card.lastFailedPlayer === currentPlayer;

    const isEligibleForRebound = gameMode !== 'tictactoe' &&
        card.options &&
        (card.options.he?.length > 2 || card.options.en?.length > 2) &&
        card.failedAttempts === 1 &&
        !card.isTainted;

    // Get the emoji of the player who can rebound (the one who didn't fail)
    const rebounderEmoji = isEligibleForRebound && avatars ?
        (card.lastFailedPlayer === 1 ? avatars[2]?.emoji : avatars[1]?.emoji) : '';

    const ownerClass = card.owner ? `player-${card.owner}` : '';
    const shouldShrinkEmoji = ['solo', '1v1', 'time_attack'].includes(gameMode);

    return (
        <div
            className={`card ${card.isSolved ? 'solved' : ''} ${card.isFailed ? 'failed' : ''} ${isBlocked ? 'blocked' : ''} ${ownerClass} ${wrapperClass} ${shouldShrinkEmoji ? 'shrink-desktop-emoji' : ''}`}
            onPointerDown={isBlocked ? null : onClick}
            onClick={onClick}
            {...((!card.isSolved && !card.isFailed && !isBlocked) ? { 'data-testid': 'click-card' } : {})}
        >
            <div className={`card-inner ${card.isSolved || card.isFailed ? 'flipped' : ''} ${isBlocked ? 'shake-locked' : ''}`}>
                {card.isShielded && (
                    <div className={`shield-badge ${gameMode === 'tictactoe' ? 'tictactoe-badge' : ''}`}>🛡️</div>
                )}
                {/* Card Back (Default state) */}
                <div className="card-back glass-panel">
                    {isEligibleForRebound && !card.isSolved && !card.isFailed && !isBlocked && (
                        <div className="super-answer-badge">
                            <span className="rebound-emoji">{rebounderEmoji}</span> {t.rebound_badge}
                        </div>
                    )}
                    {!((card.isSolved || card.isFailed) && (gameMode === 'tictactoe' || gameMode === '1v1')) && (
                        <div className="pattern">
                            {card.topicIcon}
                        </div>
                    )}
                    {(card.isSolved || card.isFailed) && (gameMode === 'tictactoe' || gameMode === '1v1') && card.ownerSymbol && (
                        <div className="card-owner-overlay">
                            {card.ownerImage ? (
                                <div className="premium-avatar-box card-avatar-box">
                                    <img src={card.ownerImage} alt="Owner" className="avatar-img-premium" />
                                </div>
                            ) : (
                                <span className={`owner-symbol p${card.owner}`}>{card.ownerSymbol}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Card Front (Solved or Failed state) */}
                <div className="card-front glass-panel" style={{ pointerEvents: 'auto' }}>
                    <div className="status-indicator">
                        {card.ownerSymbol ? (
                            card.ownerImage ? (
                                <div className="premium-avatar-box card-avatar-box">
                                    <img src={card.ownerImage} alt="Owner" className="avatar-img-premium" />
                                </div>
                            ) : (
                                <span className={`owner-symbol p${card.owner}`}>{card.ownerSymbol}</span>
                            )
                        ) : (
                            card.isSolved ? <span className="check">✅</span> : <span className="cross">❌</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
