import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateDeck, markQuestionAsSeen, sessionSeenQuestions, generateSurvivalDeck } from './deck';

// Mock the questions and topics data
vi.mock('../data/questions/index', () => ({
    questions: [
        { id: '1', category: 'math', level: 1, subCategory: 'arithmetic', options: { en: ['A', 'B', 'C', 'D'], he: ['א', 'ב', 'ג', 'ד'] }, correctAnswer: 0 },
        { id: '2', category: 'math', level: 1, subCategory: 'arithmetic', options: { en: ['A', 'B', 'C', 'D'] }, correctAnswer: 1 },
        { id: '3', category: 'math', level: 1, subCategory: 'geometry', options: { en: ['A', 'B', 'C', 'D'] }, correctAnswer: 2 },
        { id: '4', category: 'science', level: 1, options: { en: ['A', 'B', 'C', 'D'] }, correctAnswer: 3 },
        { id: '5', category: 'math', level: 2, options: { en: ['A', 'B', 'C', 'D'] }, correctAnswer: 0 },
    ],
    topics: [
        { id: 'math', name: { en: 'Math', he: 'חשבון' }, icon: '🔢' },
        { id: 'science', name: { en: 'Science', he: 'מדע' }, icon: '🔬' }
    ]
}));

describe('deck.js utilities', () => {
    beforeEach(() => {
        sessionSeenQuestions.clear();
    });

    describe('markQuestionAsSeen', () => {
        it('should add a question ID to sessionSeenQuestions', () => {
            markQuestionAsSeen('1');
            expect(sessionSeenQuestions.has('1')).toBe(true);
        });

        it('should not add undefined or null IDs', () => {
            markQuestionAsSeen(null);
            markQuestionAsSeen(undefined);
            expect(sessionSeenQuestions.size).toBe(0);
        });
    });

    describe('generateDeck', () => {
        it('should return the requested number of cards', () => {
            const deck = generateDeck(2, ['math'], 1);
            expect(deck.length).toBe(2);
        });

        it('should filter questions by selected topics', () => {
            const deck = generateDeck(10, ['math'], 1);
            // All cards should be 'math' topic
            expect(deck.every(card => card.category === 'math')).toBe(true);

            // Verify that it included level 1 questions
            expect(deck.some(card => card.level === 1)).toBe(true);
            // Verify that it included level 2 questions as fallback since we asked for 10 but only have 3 level 1s
            expect(deck.some(card => card.level === 2)).toBe(true);
        });

        it('should include topic information on each card', () => {
            const deck = generateDeck(1, ['math'], 1);
            const card = deck[0];
            expect(card.topicName.en).toBe('Math');
            expect(card.topicIcon).toBe('🔢');
        });

        it('should shuffle options and update correctAnswer accordingly', () => {
            // Since shuffle is random, we just verify the correct answer STILL points to the same value
            const deck = generateDeck(1, ['math'], 1);
            const card = deck[0];

            // Find the original question in our mock to check values
            // Note: In a real scenario we'd need to access the mock data directly if it wasn't hardcoded
            // But for this test, we know '1' is 'A', '2' is 'B', '3' is 'C'.

            const originalOptions = ['A', 'B', 'C', 'D'];
            const originalCorrectValue = originalOptions[card.correctAnswer === -1 ? 0 : 0]; // This is tricky due to shuffle

            // Let's check consistency: option at card.correctAnswer should be the correct one.
            // However, we don't easily know which original question was picked without checking ID.
            const originalQuestion = {
                '1': { val: 'A' },
                '2': { val: 'B' },
                '3': { val: 'C' }
            }[card.questionId];

            if (originalQuestion) {
                expect(card.options.en[card.correctAnswer]).toBe(originalQuestion.val);
            }
        });

        it('should respect sessionSeenQuestions', () => {
            markQuestionAsSeen('1');
            markQuestionAsSeen('2');
            // If we request 1 card, it should ideally be '3' (the only unseen math level 1)
            const deck = generateDeck(1, ['math'], 1);
            expect(deck[0].questionId).toBe('3');
        });
    });

    describe('generateSurvivalDeck', () => {
        it('should return a deck with questions from all levels', () => {
            // Our mock has level 1 and level 2.
            const deck = generateSurvivalDeck(['math', 'science'], 'child');
            expect(deck.length).toBeGreaterThan(0);

            const levels = new Set(deck.map(q => q.level));
            expect(levels.has(1)).toBe(true);
            expect(levels.has(2)).toBe(true);
        });

        it('should include topic info for survival questions', () => {
            const deck = generateSurvivalDeck(['math'], 'child');
            expect(deck[0].topicName.en).toBe('Math');
        });
    });
});
