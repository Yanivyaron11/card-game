let isSoundEnabled = localStorage.getItem('soundEnabled') !== 'false';
let globalAudioCtx = null;

export const setSoundEnabled = (enabled) => {
    isSoundEnabled = enabled;
    localStorage.setItem('soundEnabled', enabled);
};

export const getSoundEnabled = () => isSoundEnabled;

const getAudioContext = () => {
    if (!globalAudioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            globalAudioCtx = new AudioContext();
        }
    }
    // Resume context if suspended (common on iOS when created asynchronously)
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    return globalAudioCtx;
};

export const playSound = (type) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
        case 'pop':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(10, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;

        case 'drop':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;

        case 'correct':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;

        case 'wrong':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;

        case 'victory':
            osc.type = 'square';
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'square';
                o.frequency.setValueAtTime(freq, now + i * 0.1);
                o.connect(g);
                g.connect(ctx.destination);
                g.gain.setValueAtTime(0.1, now + i * 0.1);
                g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                o.start(now + i * 0.1);
                o.stop(now + i * 0.1 + 0.3);
            });
            break;

        case 'timer':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

        case 'buy':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;

        case 'error':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.setValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;

        default:
            break;
    }
};

let currentMusic = null;
let currentTrackId = localStorage.getItem('musicTrack') || 'off';

const musicTracks = {
    track1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    track2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    track3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
};

export const setMusicTrack = (trackId) => {
    currentTrackId = trackId;
    localStorage.setItem('musicTrack', trackId);

    if (trackId === 'off') {
        stopMusic();
    } else {
        playMusic(trackId);
    }
};

export const getMusicTrack = () => currentTrackId;

export const playMusic = (trackId = currentTrackId) => {
    if (trackId === 'off') return;

    const url = musicTracks[trackId];
    if (!url) return;

    if (currentMusic) {
        if (currentMusic.src === url) {
            currentMusic.play().catch(e => {
                console.log("Music play blocked, waiting for interaction", e);
                // On block, we wait for next click to try again
                const retry = () => {
                    currentMusic.play();
                    window.removeEventListener('click', retry);
                };
                window.addEventListener('click', retry);
            });
            return;
        }
        stopMusic();
    }

    currentMusic = new Audio(url);
    currentMusic.loop = true;
    currentMusic.volume = 0.4;
    currentMusic.play().catch(e => {
        console.log("Music play blocked, waiting for interaction", e);
        const retry = () => {
            currentMusic?.play();
            window.removeEventListener('click', retry);
        };
        window.addEventListener('click', retry);
    });
};

export const stopMusic = () => {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
        currentMusic = null;
    }
};
