import { questions, topics } from '../data/questions/index';

const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Session-level tracker to avoid repeating questions across multiple games until refresh
export const sessionSeenQuestions = new Set();

export const markQuestionAsSeen = (id) => {
    if (id) sessionSeenQuestions.add(id);
};

export const generateDeck = (gridSize, selectedTopics = [], difficulty = 1) => {
    // Filter questions by selected topics AND difficulty level
    if (!Array.isArray(selectedTopics)) {
        console.error('generateDeck: selectedTopics must be an array', selectedTopics);
        return [];
    }

    // 1. Get all eligible questions matching topic and difficulty
    const eligibleQuestions = questions.filter(q => selectedTopics.includes(q.category) && q.level === difficulty);

    // 1a. Filter out questions already seen in this session
    let unseenEligible = eligibleQuestions.filter(q => !sessionSeenQuestions.has(q.id));

    // If we have fewer unseen than gridSize, we still take whatever unseen we HAVE,
    // and then fill the rest from the seen pool (without clearing it entirely).
    // This ensures we don't repeat the SAME questions immediately every time.
    let currentPool = [];
    if (unseenEligible.length >= gridSize) {
        currentPool = unseenEligible;
    } else {
        // Take all unseen + shuffle the rest of eligible
        const seenPool = shuffle(eligibleQuestions.filter(q => sessionSeenQuestions.has(q.id)));
        currentPool = [...unseenEligible, ...seenPool];

        // If currentPool is STILL smaller than gridSize (small pool at this level),
        // we allow repetition of the ENTIRE pool to fill up to gridSize.
        while (currentPool.length > 0 && currentPool.length < gridSize) {
            currentPool = [...currentPool, ...shuffle(currentPool)];
        }
    }

    let filteredEligibleQuestions = currentPool;

    // 2. Group by Category + SubCategory for balancing
    const groups = {};
    filteredEligibleQuestions.forEach(q => {
        const key = `${q.category}-${q.subCategory || 'default'}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(q);
    });

    // Shuffle each group
    Object.keys(groups).forEach(key => {
        groups[key] = shuffle(groups[key]);
    });

    // 3. Weighted Round-robin selection to ensure variety but prioritize specific subcategories
    let allUniqueQuestions = [];
    const groupKeys = Object.keys(groups);
    let groupIdx = 0;

    // Determine the "weight" or "pulls per cycle" for each group.
    // The user strictly wants geometry, word_problems, and measurement to dominate.
    const getGroupWeight = (key) => {
        if (key === 'math-word_problems') return 3; // Pull 3 logic puzzles per cycle
        if (key === 'math-geometry') return 2;      // Pull 2 geometry per cycle
        if (key === 'math-measurement') return 2;   // Pull 2 measurement per cycle
        if (key === 'math-fractions') return 1;     // Pull 1 fraction per cycle
        if (key === 'math-arithmetic') return 1;    // Pull 1 arithmetic per cycle (up to max 3)
        // Israel Geography balancing
        if (key === 'israel_cities-qualitative') return 2; // Pull 2 qualitative facts per cycle
        if (key === 'israel_cities-existence') return 1;   // Pull 1 existence check per cycle
        return 1; // Default for everything else
    };

    // Track templateIds already picked to avoid repetitiveness
    const pickedTemplateIds = new Set();
    const subCategoryCounts = {};

    while (allUniqueQuestions.length < gridSize) {
        const validKeys = groupKeys.filter(k => {
            if (groups[k].length === 0) return false;
            // Strict Arithmetic ceiling
            if (k === 'math-arithmetic' && (subCategoryCounts[k] || 0) >= 3) return false;
            return true;
        });

        if (validKeys.length === 0) break; // No more eligible questions

        const key = validKeys[groupIdx % validKeys.length];
        const pullsThisCycle = getGroupWeight(key);

        for (let p = 0; p < pullsThisCycle && allUniqueQuestions.length < gridSize; p++) {
            // Check viability AGAIN inside the loop because lists empty and quotas hit
            if (groups[key].length === 0) break;
            if (key === 'math-arithmetic' && (subCategoryCounts[key] || 0) >= 3) break;

            // Instead of consistently selecting from index 0, pick a random starting offset 
            // to prevent the first items in the shuffled array from being overwhelmingly favored
            const offset = Math.floor(Math.random() * groups[key].length);
            let qIdx = -1;

            for (let i = 0; i < groups[key].length; i++) {
                const checkIdx = (offset + i) % groups[key].length;
                if (!groups[key][checkIdx].templateId || !pickedTemplateIds.has(groups[key][checkIdx].templateId)) {
                    qIdx = checkIdx;
                    break;
                }
            }

            if (qIdx !== -1) {
                const q = groups[key].splice(qIdx, 1)[0];
                allUniqueQuestions.push(q);
                if (q.templateId) pickedTemplateIds.add(q.templateId);
                subCategoryCounts[key] = (subCategoryCounts[key] || 0) + 1;
            } else {
                // If we've used ALL templates in this subCategory, start allowing repetitions 
                // by popping a random remaining element.
                const randomPopIdx = Math.floor(Math.random() * groups[key].length);
                const q = groups[key].splice(randomPopIdx, 1)[0];
                allUniqueQuestions.push(q);
                subCategoryCounts[key] = (subCategoryCounts[key] || 0) + 1;
            }
        }
        groupIdx++;
    }

    // 4. Removed level fallback - we prefer repetition at the requested level now.

    // Final selection
    let deckSelection = allUniqueQuestions.slice(0, gridSize);

    // Track chosen questions in session history securely using the unique question ID
    // REMOVED: Batch-marking moved to markQuestionAsSeen triggered on click in UI

    // 3. If STILL not enough, allow repetitions (last resort)
    while (deckSelection.length < gridSize && deckSelection.length > 0) {
        const remainingNeeded = gridSize - deckSelection.length;
        const toAdd = deckSelection.slice(0, remainingNeeded);
        deckSelection = [...deckSelection, ...toAdd];
    }

    // Function to find topic by ID in nested structure
    const findTopicRecursively = (topicList, targetId) => {
        for (const t of topicList) {
            if (t.id === targetId) return t;
            if (t.subTopics) {
                const found = findTopicRecursively(t.subTopics, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    // Map topic details to each question
    const deckWithTopicInfo = deckSelection.map(q => {
        const topic = findTopicRecursively(topics, q.category);

        // Shuffle options if they exist and are correctly structured
        let shuffledOptions = q.options ? { ...q.options } : null;
        let newCorrectAnswer = q.correctAnswer;

        if (q.options?.en && q.options.en.length > 0) {
            const originalEn = q.options.en;
            const originalHe = q.options.he || originalEn;

            // Create a mapped array of indices to shuffle consistently across languages
            const indices = Array.from({ length: originalEn.length }, (_, i) => i);
            const shuffledIndices = shuffle(indices);

            shuffledOptions = {
                en: shuffledIndices.map(i => originalEn[i]),
                he: shuffledIndices.map(i => originalHe[i] || originalEn[i])
            };

            // Calculate new correct answer index by finding where the old index moved
            newCorrectAnswer = shuffledIndices.indexOf(Number(q.correctAnswer));
        }

        return {
            ...q,
            options: shuffledOptions,
            correctAnswer: newCorrectAnswer,
            topicName: topic ? topic.name : { en: q.category, he: q.category },
            topicIcon: topic ? topic.icon : '',
            topicColor: topic ? topic.color : null
        };
    });

    // Shuffle the final deck
    const finalDeck = shuffle(deckWithTopicInfo);

    // Add unique IDs and initial card state
    return finalDeck.map((card, index) => {
        return {
            ...card,
            questionId: card.id,
            id: `card-${index}-${Math.random().toString(36).substr(2, 9)}`,
            isFlipped: false,
            isSolved: false,
            failedAttempts: 0,
            isTainted: false,
            lastFailedPlayer: null,
            eliminatedIndices: [],
            isHintVisible: false
        };
    });
};

export const generateSurvivalDeck = (selectedTopics = [], survivalType = 'child') => {
    // Survival mode logic:
    // Always use all available categories for survival mode, ignoring user selection.
    const categoriesToUse = Array.from(new Set(questions.map(q => q.category)));

    // 1. Group questions by level
    const level1 = questions.filter(q => categoriesToUse.includes(q.category) && q.level === 1);
    const level2 = questions.filter(q => categoriesToUse.includes(q.category) && q.level === 2);
    const level3 = questions.filter(q => categoriesToUse.includes(q.category) && q.level === 3);

    // 2. Pick questions for each segment based on survivalType
    let counts = { level1: 15, level2: 10, level3: 5 }; // Default to child
    if (survivalType === 'adult') {
        counts = { level1: 5, level2: 15, level3: 10 };
    }

    const deck = [
        ...shuffle(level1).slice(0, counts.level1),
        ...shuffle(level2).slice(0, counts.level2),
        ...shuffle(level3).slice(0, counts.level3)
    ];

    // 3. Map topic info and card state
    return deck.map((q, index) => {
        // Mocking the findTopicRecursively logic since it's local to generateDeck in original code
        // I should probably move findTopicRecursively out or duplicate it.
        // Actually, I'll move it out in the next step or just use it here if I can.

        // For survival, we don't need "cards" in a grid, just a sequence.
        // But QuizOverlay expects the card structure.

        const findTopicRecursively = (topicList, targetId) => {
            for (const t of topicList) {
                if (t.id === targetId) return t;
                if (t.subTopics) {
                    const found = findTopicRecursively(t.subTopics, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

        const topic = findTopicRecursively(topics, q.category);

        // Consistent shuffling of options
        const originalEn = q.options?.en || [];
        const originalHe = q.options?.he || originalEn;
        const indices = Array.from({ length: originalEn.length }, (_, i) => i);
        const shuffledIndices = shuffle(indices);

        const shuffledOptions = {
            en: shuffledIndices.map(i => originalEn[i]),
            he: shuffledIndices.map(i => originalHe[i])
        };
        const newCorrectAnswer = shuffledIndices.indexOf(Number(q.correctAnswer));

        return {
            ...q,
            options: shuffledOptions,
            correctAnswer: newCorrectAnswer,
            topicName: topic ? topic.name : { en: q.category, he: q.category },
            topicIcon: topic ? topic.icon : '',
            topicColor: topic ? topic.color : null,
            questionId: q.id,
            id: `survival-q-${index}-${Math.random().toString(36).substr(2, 9)}`,
            isFlipped: false,
            isSolved: false,
            failedAttempts: 0,
            isTainted: false,
            eliminatedIndices: [],
            isHintVisible: false
        };
    });
};

