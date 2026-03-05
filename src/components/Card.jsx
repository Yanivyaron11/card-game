import './Card.css';

function Card({ card, onClick }) {
    // Simple card that only displays topic and solved status
    const isSolved = card.isSolved;
    const isFailed = card.isFailed;

    return (
        <div
            className={`card ${isSolved ? 'solved' : ''} ${isFailed ? 'failed' : ''}`}
            onPointerDown={(!isSolved && !isFailed) ? (e) => {
                e.preventDefault();
                onClick();
            } : undefined}
        >
            <div className="card-inner">
                {/* Card Back (Default state) */}
                <div className="card-back glass-panel">
                    <div className="pattern">{card.topicIcon}</div>
                </div>

                {/* Card Front (Solved or Failed state) */}
                <div className="card-front glass-panel">
                    <div className="status-indicator">
                        {isSolved ? <span className="check">✅</span> : <span className="cross">❌</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
