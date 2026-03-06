import { questions, topics } from '../data/questions.js';

export const generateDeck = (gridSize, selectedTopics = [], difficulty = 1) => {
    // Filter questions by selected topics AND difficulty level
    if (!Array.isArray(selectedTopics)) {
        console.error('generateDeck: selectedTopics must be an array', selectedTopics);
        return [];
    }

    // 1. Get primary questions (matching topics AND difficulty)
    let primaryPool = questions.filter(q =>
        selectedTopics.includes(q.category) && q.level === difficulty
    );

    // 2. If not enough, get questions from other difficulty levels for the same topics
    let backupPool = [];
    if (primaryPool.length < gridSize) {
        backupPool = questions.filter(q =>
            selectedTopics.includes(q.category) && q.level !== difficulty
        );
    }

    // Combine unique questions
    let allUniqueQuestions = [...primaryPool];
    for (const q of backupPool) {
        if (allUniqueQuestions.length >= gridSize) break;
        if (!allUniqueQuestions.some(aq => aq.text.en === q.text.en)) {
            allUniqueQuestions.push(q);
        }
    }

    // 3. If STILL not enough, allow repetitions (last resort)
    let finalSelection = [...allUniqueQuestions];
    while (finalSelection.length < gridSize && finalSelection.length > 0) {
        const remainingNeeded = gridSize - finalSelection.length;
        const toAdd = finalSelection.slice(0, remainingNeeded);
        finalSelection = [...finalSelection, ...toAdd];
    }

    // Map topic details to each question
    const deckWithTopicInfo = finalSelection.map(q => {
        const topic = topics.find(t => t.id === q.category);
        return {
            ...q,
            topicName: topic ? topic.name : { en: q.category, he: q.category },
            topicIcon: topic ? topic.icon : ''
        };
    });

    // Shuffle the final deck
    const finalDeck = [...deckWithTopicInfo].sort(() => Math.random() - 0.5);

    // Add unique IDs to each card for React keys
    return finalDeck.map((card, index) => ({
        ...card,
        id: `card-${index}-${Math.random().toString(36).substr(2, 9)}`,
        isFlipped: false,
        isSolved: false
    }));
};
