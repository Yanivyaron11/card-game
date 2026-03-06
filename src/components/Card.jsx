import './Card.css';

function Card({ card, onClick }) {
    // Simple card that only displays topic and solved status
    const ownerClass = card.owner ? `player-${card.owner}` : '';

    return (
        <div
            className={`card ${card.isSolved ? 'solved' : ''} ${card.isFailed ? 'failed' : ''} ${ownerClass}`}
            onPointerDown={onClick}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            <div className="card-inner">
                {/* Card Back (Default state) */}
                <div className="card-back glass-panel">
                    <div className="pattern">{card.topicIcon}</div>
                </div>

                {/* Card Front (Solved or Failed state) */}
                <div className="card-front glass-panel">
                    <div className="status-indicator">
                        {card.isSolved ? <span className="check">✅</span> : <span className="cross">❌</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
