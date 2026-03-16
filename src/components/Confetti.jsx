import React, { useEffect, useState } from 'react';
import './Confetti.css';

const Confetti = () => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        // Generate 50 confetti pieces with random properties
        const newPieces = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Left percentage
            delay: Math.random() * 2, // Animation delay
            duration: Math.random() * 2 + 2, // Animation duration (2-4s)
            color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FFD700', '#FF8C00'][Math.floor(Math.random() * 5)],
            size: Math.random() * 10 + 5, // 5px to 15px
            rotation: Math.random() * 360,
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="confetti-container" aria-hidden="true">
            {pieces.map(p => (
                <div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: `${p.x}%`,
                        backgroundColor: p.color,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
