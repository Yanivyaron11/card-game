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

    // 1. Get all eligible questions
    const eligibleQuestions = questions.filter(q => selectedTopics.includes(q.category) && q.level === difficulty);

    // 2. Group by Category + SubCategory for balancing
    const groups = {};
    eligibleQuestions.forEach(q => {
        const key = `${q.category}-${q.subCategory || 'default'}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(q);
    });

    // Shuffle each group
    Object.keys(groups).forEach(key => {
        groups[key] = shuffle(groups[key]);
    });

    // 3. Round-robin selection to ensure variety
    let allUniqueQuestions = [];
    const groupKeys = Object.keys(groups);
    let groupIdx = 0;

    // Track templateIds already picked to avoid repetitiveness
    const pickedTemplateIds = new Set();

    const totalAvailable = eligibleQuestions.length;
    while (allUniqueQuestions.length < gridSize && allUniqueQuestions.length < totalAvailable) {
        const key = groupKeys[groupIdx % groupKeys.length];
        if (groups[key].length > 0) {
            // Find a question in this group that hasn't had its templateId picked yet
            const qIdx = groups[key].findIndex(q => !q.templateId || !pickedTemplateIds.has(q.templateId));

            if (qIdx !== -1) {
                const q = groups[key].splice(qIdx, 1)[0];
                allUniqueQuestions.push(q);
                if (q.templateId) pickedTemplateIds.add(q.templateId);
            } else {
                // If we've used ALL templates in this subCategory, start allowing repetitions 
                // but only as a last resort within this level
                const q = groups[key].pop();
                allUniqueQuestions.push(q);
            }
        }
        groupIdx++;
    }

    // 4. Combine with other difficulty levels if STILL needed
    if (allUniqueQuestions.length < gridSize) {
        const backupEligible = questions.filter(q =>
            selectedTopics.includes(q.category) &&
            q.level !== difficulty &&
            !allUniqueQuestions.some(aq => aq.text.en === q.text.en)
        );

        const backupGroups = {};
        backupEligible.forEach(q => {
            const key = `${q.category}-${q.subCategory || 'default'}`;
            if (!backupGroups[key]) backupGroups[key] = [];
            backupGroups[key].push(q);
        });

        const bKeys = Object.keys(backupGroups);
        let bIdx = 0;
        while (allUniqueQuestions.length < gridSize && allUniqueQuestions.length < (allUniqueQuestions.length + backupEligible.length)) {
            const key = bKeys[bIdx % bKeys.length];
            if (backupGroups[key] && backupGroups[key].length > 0) {
                const qIdx = backupGroups[key].findIndex(q => !q.templateId || !pickedTemplateIds.has(q.templateId));
                if (qIdx !== -1) {
                    const q = backupGroups[key].splice(qIdx, 1)[0];
                    allUniqueQuestions.push(q);
                    if (q.templateId) pickedTemplateIds.add(q.templateId);
                } else {
                    allUniqueQuestions.push(backupGroups[key].pop());
                }
            } else if (bKeys.every(k => !backupGroups[k] || backupGroups[k].length === 0)) {
                break; // No more backup questions at all
            }
            bIdx++;
        }
    }

    // Final selection
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

