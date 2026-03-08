import { questions, topics } from '../data/questions.js';

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

export const generateDeck = (gridSize, selectedTopics = [], difficulty = 1) => {
    // Filter questions by selected topics AND difficulty level
    if (!Array.isArray(selectedTopics)) {
        console.error('generateDeck: selectedTopics must be an array', selectedTopics);
        return [];
    }

    // 1. Get all eligible questions matching topic and difficulty
    let eligibleQuestions = questions.filter(q => selectedTopics.includes(q.category) && q.level === difficulty);

    // 1a. Filter out questions already seen in this session
    let unseenEligible = eligibleQuestions.filter(q => !sessionSeenQuestions.has(q.text.en));

    // If we've exhausted our completely unplayed pool, gracefully clear the history for these topics!
    if (unseenEligible.length < gridSize) {
        eligibleQuestions.forEach(q => sessionSeenQuestions.delete(q.text.en));
        unseenEligible = eligibleQuestions; // Reset pool for this category/level combination
    }

    eligibleQuestions = unseenEligible;

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

    // 4. Combine with other difficulty levels if STILL needed
    if (allUniqueQuestions.length < gridSize) {
        let backupEligible = questions.filter(q =>
            selectedTopics.includes(q.category) &&
            q.level !== difficulty &&
            !allUniqueQuestions.some(aq => aq.text.en === q.text.en)
        );

        let unseenBackup = backupEligible.filter(q => !sessionSeenQuestions.has(q.text.en));

        // If backup pool is exhausted, clear history for the backups
        if (allUniqueQuestions.length + unseenBackup.length < gridSize) {
            backupEligible.forEach(q => sessionSeenQuestions.delete(q.text.en));
            unseenBackup = backupEligible;
        }

        backupEligible = unseenBackup;

        const backupGroups = {};
        backupEligible.forEach(q => {
            const key = `${q.category}-${q.subCategory || 'default'}`;
            if (!backupGroups[key]) backupGroups[key] = [];
            backupGroups[key].push(q);
        });

        const bKeys = Object.keys(backupGroups);
        let bIdx = 0;
        while (allUniqueQuestions.length < gridSize) {
            const validKeys = bKeys.filter(k => {
                if (!backupGroups[k] || backupGroups[k].length === 0) return false;
                if (k === 'math-arithmetic' && (subCategoryCounts[k] || 0) >= 3) return false;
                return true;
            });

            if (validKeys.length === 0) break; // No more backup questions

            const key = validKeys[bIdx % validKeys.length];
            const pullsThisCycle = getGroupWeight(key);

            for (let p = 0; p < pullsThisCycle && allUniqueQuestions.length < gridSize; p++) {
                if (!backupGroups[key] || backupGroups[key].length === 0) break;
                if (key === 'math-arithmetic' && (subCategoryCounts[key] || 0) >= 3) break;

                const offset = Math.floor(Math.random() * backupGroups[key].length);
                let qIdx = -1;

                for (let i = 0; i < backupGroups[key].length; i++) {
                    const checkIdx = (offset + i) % backupGroups[key].length;
                    if (!backupGroups[key][checkIdx].templateId || !pickedTemplateIds.has(backupGroups[key][checkIdx].templateId)) {
                        qIdx = checkIdx;
                        break;
                    }
                }

                if (qIdx !== -1) {
                    const q = backupGroups[key].splice(qIdx, 1)[0];
                    allUniqueQuestions.push(q);
                    if (q.templateId) pickedTemplateIds.add(q.templateId);
                    subCategoryCounts[key] = (subCategoryCounts[key] || 0) + 1;
                } else {
                    const randomPopIdx = Math.floor(Math.random() * backupGroups[key].length);
                    const q = backupGroups[key].splice(randomPopIdx, 1)[0];
                    allUniqueQuestions.push(q);
                    subCategoryCounts[key] = (subCategoryCounts[key] || 0) + 1;
                }
            }
            bIdx++;
        }
    }

    // Final selection
    let deckSelection = allUniqueQuestions.slice(0, gridSize);

    // Track chosen questions in session history securely using English text as unique ID
    deckSelection.forEach(q => sessionSeenQuestions.add(q.text.en));

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

