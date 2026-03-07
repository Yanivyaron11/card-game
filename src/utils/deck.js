import { questions, topics } from '../data/questions.js';

const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const generateDeck = (gridSize, selectedTopics = [], difficulty = 1) => {
    // Filter questions by selected topics AND difficulty level
    if (!Array.isArray(selectedTopics)) {
        console.error('generateDeck: selectedTopics must be an array', selectedTopics);
        return [];
    }

    // 1. Get primary questions (matching topics AND difficulty)
    let primaryPool = shuffle(
        questions.filter(q => selectedTopics.includes(q.category) && q.level === difficulty)
    );

    // 2. Combine with other difficulty levels if needed
    let allUniqueQuestions = [...primaryPool];
    if (allUniqueQuestions.length < gridSize) {
        const backupPool = shuffle(
            questions.filter(q => selectedTopics.includes(q.category) && q.level !== difficulty)
        );

        for (const q of backupPool) {
            if (allUniqueQuestions.length >= gridSize) break;
            if (!allUniqueQuestions.some(aq => aq.text.en === q.text.en)) {
                allUniqueQuestions.push(q);
            }
        }
    }

    // Slice to gridSize (in case we have too many)
    let deckSelection = allUniqueQuestions.slice(0, gridSize);

    // 3. If STILL not enough, allow repetitions (last resort)
    while (deckSelection.length < gridSize && deckSelection.length > 0) {
        const remainingNeeded = gridSize - deckSelection.length;
        const toAdd = deckSelection.slice(0, remainingNeeded);
        deckSelection = [...deckSelection, ...toAdd];
    }

    // Map topic details to each question
    const deckWithTopicInfo = deckSelection.map(q => {
        const topic = topics.find(t => t.id === q.category);
        return {
            ...q,
            topicName: topic ? topic.name : { en: q.category, he: q.category },
            topicIcon: topic ? topic.icon : ''
        };
    });

    // Shuffle the final deck
    const finalDeck = shuffle(deckWithTopicInfo);

    // Add unique IDs to each card for React keys
    return finalDeck.map((card, index) => ({
        ...card,
        id: `card-${index}-${Math.random().toString(36).substr(2, 9)}`,
        isFlipped: false,
        isSolved: false
    }));
};

