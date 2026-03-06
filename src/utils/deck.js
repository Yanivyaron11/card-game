import { questions, topics } from '../data/questions.js';

export const generateDeck = (gridSize, selectedTopics = [], difficulty = 1) => {
    // Filter questions by selected topics AND difficulty level
    if (!Array.isArray(selectedTopics)) {
        console.error('generateDeck: selectedTopics must be an array', selectedTopics);
        return [];
    }

    const availableQuestions = questions.filter(q =>
        selectedTopics.includes(q.category) && q.level === difficulty
    );

    // Map topic details to each question
    const questionsWithTopicInfo = availableQuestions.map(q => {
        const topic = topics.find(t => t.id === q.category);
        return {
            ...q,
            topicName: topic ? topic.name : { en: q.category, he: q.category },
            topicIcon: topic ? topic.icon : ''
        };
    });

    // Shuffle available questions
    const shuffledAvailable = [...questionsWithTopicInfo].sort(() => Math.random() - 0.5);

    // We need enough questions to fill the grid.
    if (shuffledAvailable.length === 0) {
        console.warn('No questions found for the selected topics and difficulty!');
        return [];
    }

    // Limit the deck to the gridSize, but don't duplicate if we have fewer questions
    const deck = shuffledAvailable.slice(0, gridSize);

    // Shuffle the final deck
    const finalDeck = deck.sort(() => Math.random() - 0.5);

    // Add unique IDs to each card for React keys
    return finalDeck.map((card, index) => ({
        ...card,
        id: `card-${index}-${Math.random().toString(36).substr(2, 9)}`,
        isFlipped: false,
        isSolved: false
    }));
};
