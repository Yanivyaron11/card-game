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

        case 'level1_intro':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
            osc.start(now);
            osc.stop(now + 1.0);

            const osc1_2 = ctx.createOscillator();
            osc1_2.type = 'triangle';
            osc1_2.frequency.setValueAtTime(554, now);
            osc1_2.frequency.exponentialRampToValueAtTime(1108, now + 0.5);
            osc1_2.connect(gain);
            osc1_2.start(now);
            osc1_2.stop(now + 1.0);
            break;

        case 'level2_warning':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.5);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);

            const osc2_2 = ctx.createOscillator();
            osc2_2.type = 'square';
            osc2_2.frequency.setValueAtTime(400, now);
            osc2_2.frequency.setValueAtTime(600, now + 0.2);
            osc2_2.frequency.setValueAtTime(400, now + 0.4);
            osc2_2.frequency.setValueAtTime(600, now + 0.6);
            const gain2_2 = ctx.createGain();
            gain2_2.gain.setValueAtTime(0.1, now);
            gain2_2.gain.linearRampToValueAtTime(0, now + 1.0);
            osc2_2.connect(gain2_2);
            gain2_2.connect(ctx.destination);
            osc2_2.start(now);
            osc2_2.stop(now + 1.0);
            break;

        case 'level3_danger':
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(40, now + 1.5);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
            osc.start(now);
            osc.stop(now + 2.0);

            const osc3_2 = ctx.createOscillator();
            osc3_2.type = 'sawtooth';
            osc3_2.frequency.setValueAtTime(1000, now);
            osc3_2.frequency.linearRampToValueAtTime(600, now + 0.5);
            osc3_2.frequency.linearRampToValueAtTime(1000, now + 1.0);
            osc3_2.frequency.linearRampToValueAtTime(600, now + 1.5);
            const gain3_2 = ctx.createGain();
            gain3_2.gain.setValueAtTime(0.15, now);
            gain3_2.gain.linearRampToValueAtTime(0, now + 2.0);
            osc3_2.connect(gain3_2);
            gain3_2.connect(ctx.destination);
            osc3_2.start(now);
            osc3_2.stop(now + 2.0);
            break;

        case 'explosion_small': {
            const bufferSize = ctx.sampleRate * 0.3; // 0.3 seconds
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1000, now);
            noiseFilter.Q.value = 0.5;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(now);
            break;
        }

        case 'explosion_large': {
            const bufferSizeL = ctx.sampleRate * 1.2; // 1.2 seconds
            const bufferL = ctx.createBuffer(1, bufferSizeL, ctx.sampleRate);
            const dataL = bufferL.getChannelData(0);
            for (let i = 0; i < bufferSizeL; i++) {
                dataL[i] = Math.random() * 2 - 1;
            }
            const noiseL = ctx.createBufferSource();
            noiseL.buffer = bufferL;
            const noiseFilterL = ctx.createBiquadFilter();
            noiseFilterL.type = 'lowpass';
            noiseFilterL.frequency.setValueAtTime(1500, now);
            noiseFilterL.frequency.exponentialRampToValueAtTime(50, now + 1.0);
            const noiseGainL = ctx.createGain();
            noiseGainL.gain.setValueAtTime(1.0, now);
            noiseGainL.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
            noiseL.connect(noiseFilterL);
            noiseFilterL.connect(noiseGainL);
            noiseGainL.connect(ctx.destination);
            noiseL.start(now);

            const boom = ctx.createOscillator();
            boom.type = 'sine';
            boom.frequency.setValueAtTime(150, now);
            boom.frequency.exponentialRampToValueAtTime(20, now + 1.0);
            const boomGain = ctx.createGain();
            boomGain.gain.setValueAtTime(1.0, now);
            boomGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
            boom.connect(boomGain);
            boomGain.connect(ctx.destination);
            boom.start(now);
            boom.stop(now + 1.0);
            break;
        }

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
