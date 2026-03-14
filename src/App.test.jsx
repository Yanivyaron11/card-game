import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as deckUtils from './utils/deck';
import * as soundUtils from './utils/sounds';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock dependencies
vi.mock('./components/StartScreen', () => ({
    default: ({ onStart, totalCoins }) => (
        <div data-testid="start-screen">
            <h1>Start Screen</h1>
            <p data-testid="total-coins">{totalCoins}</p>
            <button
                data-testid="start-solo"
                onClick={() => onStart({ gameMode: 'solo', gridSize: 9, topics: ['general'], difficulty: 1, avatars: { 1: { id: 'leo', emoji: '🦁', name: { en: 'Leo', he: 'ליאו' } } } })}
            >
                Start Solo
            </button>
            <button
                data-testid="start-1v1"
                onClick={() => onStart({ gameMode: '1v1', gridSize: 9, topics: ['general'], difficulty: 1, avatars: { 1: { id: 'leo', emoji: '🦁', name: { en: 'Leo', he: 'ליאו' } }, 2: { id: 'foxy', emoji: '🦊', name: { en: 'Foxy', he: 'פוקסי' } } } })}
            >
                Start 1v1
            </button>
            <button
                data-testid="start-survival"
                onClick={() => onStart({ gameMode: 'survival', topics: ['general'], survivalType: 'child', avatars: { 1: { id: 'leo', emoji: '🦁', name: { en: 'Leo', he: 'ליאו' } } } })}
            >
                Start Survival
            </button>
        </div>
    )
}));

vi.mock('./components/GameBoard', () => ({
    default: ({ coins, lives, onCardSelected, onQuit }) => (
        <div data-testid="game-board">
            <h2>Game Board</h2>
            <p data-testid="game-coins">{coins}</p>
            <p data-testid="game-lives">{lives[1]}</p>
            <button data-testid="click-card" onClick={() => onCardSelected('test-card-id')}>Click Card</button>
            <button data-testid="quit-game" onClick={onQuit}>Quit</button>
        </div>
    )
}));

vi.mock('./components/QuizOverlay', () => ({
    default: ({ coins, onAnswer, onQuit, streak }) => (
        <div data-testid="quiz-overlay">
            <h2>Quiz</h2>
            <p data-testid="quiz-coins">{coins}</p>
            <p data-testid="quiz-streak">{streak}</p>
            <button data-testid="answer-correct" onClick={() => onAnswer('test-card-id', true)}>Correct</button>
            <button data-testid="answer-wrong" onClick={() => onAnswer('test-card-id', false)}>Wrong</button>
            <button data-testid="quit-quiz" onClick={onQuit}>Quit</button>
        </div>
    )
}));

vi.mock('./utils/deck', () => ({
    generateDeck: vi.fn(),
    generateSurvivalDeck: vi.fn(),
}));

vi.mock('./utils/sounds', () => ({
    playSound: vi.fn(),
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    getSoundEnabled: vi.fn(() => true),
    setSoundEnabled: vi.fn(),
    getMusicTrack: vi.fn(() => 'track1'),
    setMusicTrack: vi.fn(),
}));

describe('App Integration Tests', () => {

    const mockDeck = [
        { id: 'test-card-id', isSolved: false, isFailed: false, level: 1, category: 'general', options: { he: ['A', 'B'] } },
        { id: 'test-card-2', isSolved: false, isFailed: false, level: 2, category: 'general', options: { he: ['A', 'B'] } }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Default coins
        localStorage.setItem('total_coins', '100');
        // Prevent daily login bonus from adding +20 during tests
        localStorage.setItem('last_login_date', new Date().toDateString());
        deckUtils.generateDeck.mockReturnValue([...mockDeck]);
        deckUtils.generateSurvivalDeck.mockReturnValue([...mockDeck]);
    });

    const renderApp = (initialRoute = '/') => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <App />
            </MemoryRouter>
        );
    };

    it('renders StartScreen initially', () => {
        renderApp();
        expect(screen.getByTestId('start-screen')).toBeDefined();
        expect(screen.getByTestId('total-coins').textContent).toBe('100');
    });

    describe('Game Modes Setup', () => {
        it('sets up a Solo game correctly', async () => {
            renderApp();
            fireEvent.click(screen.getByTestId('start-solo'));

            // Should navigate to /play which renders GameBoard
            await waitFor(() => {
                expect(screen.getByTestId('game-board')).toBeDefined();
            });
            // gridSize 9 -> base 3 lives -> Diff 1 -> 3 lives
            expect(screen.getByTestId('game-lives').textContent).toBe('3');
            expect(deckUtils.generateDeck).toHaveBeenCalledWith(9, ['general'], 1);
        });

        it('sets up a 1v1 game correctly', async () => {
            renderApp();
            fireEvent.click(screen.getByTestId('start-1v1'));

            await waitFor(() => {
                expect(screen.getByTestId('game-board')).toBeDefined();
            });
        });

        it('sets up Survival game correctly and goes to first question', async () => {
            renderApp();
            fireEvent.click(screen.getByTestId('start-survival'));

            await waitFor(() => {
                expect(screen.getByTestId('quiz-overlay')).toBeDefined();
            });
            expect(deckUtils.generateSurvivalDeck).toHaveBeenCalled();
        });
    });

    describe('Gameplay and Scoring Logic', () => {
        it('handles correct answer and updates streak and coins in solo mode', async () => {
            renderApp();
            fireEvent.click(screen.getByTestId('start-solo'));
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());

            // Click card to go to QuizOverlay
            fireEvent.click(screen.getByTestId('click-card'));
            await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined());

            // Initial state
            expect(screen.getByTestId('quiz-coins').textContent).toBe('100');
            expect(screen.getByTestId('quiz-streak').textContent).toBe('0');

            // Answer correctly (card level is 1 -> +1 coin)
            fireEvent.click(screen.getByTestId('answer-correct'));

            // Wait for navigation back to play
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
            // Coins should be 101 now
            expect(screen.getByTestId('game-coins').textContent).toBe('101');
        });

        it('deducts lives on wrong answer in solo mode', async () => {
            renderApp();
            fireEvent.click(screen.getByTestId('start-solo'));
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());

            expect(screen.getByTestId('game-lives').textContent).toBe('3');

            // Go to quiz and answer wrong
            fireEvent.click(screen.getByTestId('click-card'));
            await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined());
            fireEvent.click(screen.getByTestId('answer-wrong'));

            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
            expect(screen.getByTestId('game-lives').textContent).toBe('2');
        });

        it('awards bonus at ONLY exact streaks of 3 and 5, only once per run', async () => {
            // Mock a longer deck to simulate multiple answers
            const longDeck = Array(10).fill(null).map((_, i) => ({
                id: `card-${i}`, isSolved: false, isFailed: false, level: 1, category: 'general', options: { he: ['A', 'B'] }
            }));
            deckUtils.generateDeck.mockReturnValue(longDeck);

            renderApp();
            fireEvent.click(screen.getByTestId('start-solo'));

            let expectedCoins = 100;

            for (let i = 1; i <= 6; i++) {
                await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
                fireEvent.click(screen.getByTestId('click-card'));

                await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined());
                fireEvent.click(screen.getByTestId('answer-correct'));

                expectedCoins += 1; // +1 base point for level 1 card
                if (i === 3) expectedCoins += 5; // Streak 3 bonus
                if (i === 5) expectedCoins += 5; // Streak 5 bonus

                if (i < 6) {
                    // Last valid answer doesn't need to wait for board if game ends, but for 10 items it should continue
                    await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
                    expect(screen.getByTestId('game-coins').textContent).toBe(expectedCoins.toString());
                }
            }

            // Break streak
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
            fireEvent.click(screen.getByTestId('click-card'));
            await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined());
            fireEvent.click(screen.getByTestId('answer-wrong'));

            // Answer 3 correct again - should NOT get the streak 3 bonus again!
            for (let i = 1; i <= 3; i++) {
                await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
                fireEvent.click(screen.getByTestId('click-card'));
                await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined());
                fireEvent.click(screen.getByTestId('answer-correct'));

                expectedCoins += 1; // base point only
                if (i < 3) {
                    await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
                    expect(screen.getByTestId('game-coins').textContent).toBe(expectedCoins.toString());
                }
            }

            // We are checking the final state, there should be no extra 5 points for the second 3-streak
            await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
            expect(screen.getByTestId('game-coins').textContent).toBe(expectedCoins.toString());
        });
    });

    describe('End Game Conditions', () => {
        it('goes to result screen on game over (loss)', async () => {
            // Small deck, 3 lives
            renderApp();
            fireEvent.click(screen.getByTestId('start-solo'));

            for (let i = 0; i < 3; i++) {
                await waitFor(() => expect(screen.getByTestId('game-board')).toBeDefined());
                fireEvent.click(screen.getByTestId('click-card'));
                await waitFor(() => expect(screen.getByTestId('quiz-overlay')).toBeDefined());
                fireEvent.click(screen.getByTestId('answer-wrong'));
            }

            // After 3rd wrong answer, should navigate to result
            await waitFor(() => {
                expect(screen.getByText(/המשחק נגמר/i)).toBeDefined();
            });
        });
    });
});
