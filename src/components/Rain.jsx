import React, { useEffect, useState } from 'react';
import './Rain.css';

const Rain = () => {
    const [drops, setDrops] = useState([]);

    useEffect(() => {
        // Generate 60 raindrops with random properties
        const newDrops = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Left percentage
            delay: Math.random() * 2, // Animation delay
            duration: Math.random() * 2 + 2.5, // Animation duration (2.5s-4.5s for a much slower, sadder feel)
            opacity: Math.random() * 0.5 + 0.4, // 0.4 to 0.9 opacity
            height: Math.random() * 15 + 10, // 10px to 25px height
        }));
        setDrops(newDrops);
    }, []);

    return (
        <div className="rain-container" aria-hidden="true">
            {drops.map(d => (
                <div
                    key={d.id}
                    className="rain-drop"
                    style={{
                        left: `${d.x}%`,
                        animationDelay: `${d.delay}s`,
                        animationDuration: `${d.duration}s`,
                        opacity: d.opacity,
                        height: `${d.height}px`
                    }}
                />
            ))}
        </div>
    );
};

export default Rain;
