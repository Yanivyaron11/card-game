import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as deckUtils from './utils/deck';

// Fix for JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock the deck generation
vi.mock('./utils/deck', () => ({
    generateDeck: vi.fn(),
    generateSurvivalDeck: vi.fn(),
    markQuestionAsSeen: vi.fn(),
}));

// Mock sound utilities
vi.mock('./utils/sounds', () => ({
    playSound: vi.fn(),
    getSoundEnabled: vi.fn(() => true),
    setSoundEnabled: vi.fn(),
    getMusicTrack: vi.fn(() => 'track1'),
    setMusicTrack: vi.fn(),
    playMusic: vi.fn(),
    pauseMusic: vi.fn(),
}));

const mockDeck = [
    { id: '1', level: 1, category: 'general', emoji: '🍎', text: { he: 'שאלה 1', en: 'Q1' }, options: { he: ['ת1', 'ת2'], en: ['A1', 'A2'] }, correctAnswer: 0, topicIcon: '📚', topicName: { he: 'כללי', en: 'General' }, topicColor: '#eee', topicId: 'israel_cities' },
    { id: '2', level: 1, category: 'general', emoji: '🍌', text: { he: 'שאלה 2', en: 'Q2' }, options: { he: ['ת1', 'ת2'], en: ['A1', 'A2'] }, correctAnswer: 0, topicIcon: '📚', topicName: { he: 'כללי', en: 'General' }, topicColor: '#eee', topicId: 'israel_cities' },
];

const renderApp = (initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <App />
        </MemoryRouter>
    );
};

const setupGame = async (gameModeTestId) => {
    renderApp();
    // Select mode
    if (gameModeTestId && gameModeTestId !== 'start-solo') {
        const modeBtn = await screen.findByTestId(gameModeTestId);
        fireEvent.click(modeBtn);
    }
    // Select avatar (Leo is a default)
    const avatarBtn = await screen.findByTestId('avatar-option-leo');
    fireEvent.click(avatarBtn);
    // Select topic (israel_cities is a default)
    const topicBtn = await screen.findByTestId('topic-option-israel_cities');
    fireEvent.click(topicBtn);
    // Start
    const startBtn = await screen.findByTestId('start-game-btn');
    fireEvent.click(startBtn);
};

describe('App Integration Tests', () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        localStorage.clear();
        // Prevent daily login bonus (20 coins) from triggering in tests
        localStorage.setItem('last_login_date', new Date().toDateString());
        deckUtils.generateDeck.mockReturnValue([...mockDeck]);
        deckUtils.generateSurvivalDeck.mockReturnValue([mockDeck[0]]);
    });

    it('renders StartScreen initially', () => {
        renderApp();
        expect(screen.getByText(/Smarty/i) || screen.getByText(/סמארטי/i)).toBeDefined();
    });

    describe('Game Modes Setup', () => {
        it('sets up a Solo game correctly', async () => {
            await setupGame('start-solo');
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined(), { timeout: 3000 });
            expect(deckUtils.generateDeck).toHaveBeenCalled();
        });

        it('sets up a 1v1 game correctly', async () => {
            renderApp();
            fireEvent.click(screen.getByTestId('start-1v1'));
            // 1v1 needs two avatars
            const avatar1 = await screen.findByTestId('avatar-option-leo');
            fireEvent.click(avatar1);
            const avatar2 = await screen.findByTestId('avatar-option-p2-bunny');
            fireEvent.click(avatar2);

            fireEvent.click(screen.getByTestId('topic-option-israel_cities'));
            fireEvent.click(screen.getByTestId('start-game-btn'));

            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined(), { timeout: 3000 });
            expect(deckUtils.generateDeck).toHaveBeenCalled();
        });

        it('sets up Survival game correctly and goes to first question', async () => {
            // Survival just needs mode + avatar + topics (StartScreen requires topics)
            renderApp();
            fireEvent.click(screen.getByTestId('start-survival'));
            const avatar1 = await screen.findByTestId('avatar-option-leo');
            fireEvent.click(avatar1);
            // Must select topic too
            const topic1 = await screen.findByTestId('topic-option-israel_cities');
            fireEvent.click(topic1);
            fireEvent.click(screen.getByTestId('start-game-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('quiz-overlay')).toBeDefined();
            }, { timeout: 3000 });
            await waitFor(() => {
                expect(screen.getByTestId('quiz-card').getAttribute('data-ready')).toBe('true');
            }, { timeout: 3000 });
            expect(deckUtils.generateSurvivalDeck).toHaveBeenCalled();
        });
    });

    describe('Gameplay and Scoring Logic', () => {
        // Increase timeout for these tests as they involve multiple 1.5s transitions
        vi.setConfig({ testTimeout: 30000 });
        it('handles correct answer and updates streak and coins in solo mode', async () => {
            await setupGame('start-solo');
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined(), { timeout: 3000 });

            fireEvent.pointerDown(screen.getAllByTestId('click-card')[0]);
            await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined(), { timeout: 3000 });
            await waitFor(() => expect(screen.getByTestId('quiz-card').getAttribute('data-ready')).toBe('true'), { timeout: 3000 });
            fireEvent.click(screen.getByTestId('answer-correct'));

            await waitForElementToBeRemoved(() => screen.queryByTestId('quiz-overlay'), { timeout: 3000 });
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined(), { timeout: 3000 });
            // 100 base + 1 answer = 101
            expect(screen.getByTestId('game-coins').textContent).toContain('101');
        });

        it('awards bonus of 5 for streak 3-4 at end of game', async () => {
            const deck3 = Array(3).fill(null).map((_, i) => ({
                id: `c3-${i}`, isSolved: false, isFailed: false, level: 1, category: 'general', options: { he: ['A', 'B'], en: ['A', 'B'] }, text: { he: 'Q', en: 'Q' }, topicName: { he: 'T', en: 'T' }, correctAnswer: 0
            }));
            deckUtils.generateDeck.mockReturnValue(deck3);

            renderApp();
            fireEvent.click(await screen.findByTestId('avatar-option-leo'));
            fireEvent.click(await screen.findByTestId('topic-option-israel_cities'));
            fireEvent.click(await screen.findByTestId('start-game-btn'));

            for (let i = 0; i < 3; i++) {
                await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined(), { timeout: 3000 });
                const cards = screen.getAllByTestId('click-card');
                fireEvent.pointerDown(cards[0]);
                await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined(), { timeout: 3000 });
                await waitFor(() => expect(screen.getByTestId('quiz-card').getAttribute('data-ready')).toBe('true'), { timeout: 3000 });
                fireEvent.click(screen.getByTestId('answer-correct'));
                // Wait for the overlay to close after the 1500ms transition
                await waitForElementToBeRemoved(() => screen.queryByTestId('quiz-overlay'), { timeout: 3000 });
            }

            await waitFor(() => expect(screen.getByText(/ניצחת/i)).toBeDefined(), { timeout: 3000 });
            // 3 answers + 5 streak + 20 board (size 16) + 20 perfect board = 48
            expect(screen.getByText(/48/)).toBeDefined();
        });

        it('awards bonus of 10 for streak 5+ at end of game', async () => {
            const deck5 = Array(5).fill(null).map((_, i) => ({
                id: `c5-${i}`, isSolved: false, isFailed: false, level: 1, category: 'general', options: { he: ['A', 'B'], en: ['A', 'B'] }, text: { he: 'Q', en: 'Q' }, topicName: { he: 'T', en: 'T' }, correctAnswer: 0
            }));
            deckUtils.generateDeck.mockReturnValue(deck5);

            renderApp();
            fireEvent.click(await screen.findByTestId('avatar-option-leo'));
            fireEvent.click(await screen.findByTestId('topic-option-israel_cities'));
            fireEvent.click(await screen.findByTestId('start-game-btn'));

            for (let i = 0; i < 5; i++) {
                await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined(), { timeout: 3000 });
                const cards = screen.getAllByTestId('click-card');
                fireEvent.pointerDown(cards[0]);
                await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined(), { timeout: 3000 });
                await waitFor(() => expect(screen.getByTestId('quiz-card').getAttribute('data-ready')).toBe('true'), { timeout: 3000 });
                fireEvent.click(screen.getByTestId('answer-correct'));
                // Wait for the overlay to close after the 1500ms transition
                await waitForElementToBeRemoved(() => screen.queryByTestId('quiz-overlay'), { timeout: 3000 });
            }

            await waitFor(() => expect(screen.getByText(/ניצחת/i)).toBeDefined(), { timeout: 3000 });
            // 5 answers + 10 streak + 20 board (size 16) + 20 perfect = 55
            expect(screen.getByText(/55/)).toBeDefined();
        });
    });
});
