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

    return (
        <div
            className={`card ${card.isSolved ? 'solved' : ''} ${card.isFailed ? 'failed' : ''} ${isBlocked ? 'blocked' : ''} ${ownerClass} ${wrapperClass}`}
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
                    {!((card.isSolved || card.isFailed) && gameMode === 'tictactoe') && (
                        <div className="pattern">
                            {card.topicIcon}
                        </div>
                    )}
                    {(card.isSolved || card.isFailed) && gameMode === 'tictactoe' && card.ownerSymbol && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
                            <span className={`owner-symbol p${card.owner}`}>{card.ownerSymbol}</span>
                        </div>
                    )}
                </div>

                {/* Card Front (Solved or Failed state) */}
                <div className="card-front glass-panel" style={{ pointerEvents: 'auto' }}>
                    <div className="status-indicator">
                        {card.ownerSymbol ? (
                            <span className={`owner-symbol p${card.owner}`}>{card.ownerSymbol}</span>
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
