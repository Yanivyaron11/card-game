
import { israelQuestions } from './israel.js';
import { judaismQuestions } from './judaism.js';
import { natureQuestions } from './nature.js';
import { scienceQuestions } from './science.js';
import { riddlesQuestions } from './riddles.js';
import { worldQuestions } from './world.js';
import { culture_entQuestions } from './culture_ent.js';
import { sports_lifeQuestions } from './sports_life.js';
import { generalQuestions } from './general.js';
import { mathQuestions } from './math.js';
import { physicsQuestions } from './physics.js';
import { englishQuestions } from './english.js';
import { spaceQuestions } from './space.js';
import { flagsQuestions } from './flags.js';
import { robloxQuestions } from './roblox.js';
import { kidsMoviesNewQuestions } from './kids_movies_new.js';
import { englishAdvancedQuestions } from './english_advanced.js';

export const topics = [
    // --- GENERATED_TOPICS_START ---
    {
        "id": "israel_group",
        "name": {
            "en": "Israel Geography",
            "he": "ידיעת הארץ"
        },
        "icon": "🇮🇱",
        "subTopics": [
            {
                "id": "israel_cities",
                "name": {
                    "en": "Cities & Towns",
                    "he": "ערים ויישובים"
                },
                "icon": "🏘️",
                "newUntil": "2026-03-24"
            },
            {
                "id": "tel_aviv",
                "name": {
                    "en": "Tel Aviv",
                    "he": "תל אביב"
                },
                "icon": "🏙️"
            }
        ]
    },
    // --- GENERATED_TOPICS_END ---
    {
        "id": "judaism_group",
        "name": {
            "en": "Judaism",
            "he": "יהדות"
        },
        "icon": "🔯",
        "subTopics": [
            {
                "id": "bible_stories",
                "name": {
                    "en": "Bible Stories",
                    "he": "סיפורי התנ''ך"
                },
                "icon": "📜"
            },
            {
                "id": "holidays",
                "name": {
                    "en": "Holidays",
                    "he": "חגים"
                },
                "icon": "🕎"
            },
            {
                "id": "tradition",
                "name": {
                    "en": "Tradition",
                    "he": "מסורת"
                },
                "icon": "🍷"
            }
        ]
    },
    {
        "id": "nature_group",
        "name": {
            "en": "Nature",
            "he": "טבע"
        },
        "icon": "🌿",
        "subTopics": [
            {
                "id": "animals",
                "name": {
                    "en": "Animals",
                    "he": "חיות"
                },
                "icon": "🦁"
            },
            {
                "id": "human_body",
                "name": {
                    "en": "The Human Body",
                    "he": "גוף האדם"
                },
                "icon": "🧬"
            },
            {
                "id": "records",
                "name": {
                    "en": "Records & Discoveries",
                    "he": "שיאים וגילויים"
                },
                "icon": "🏆"
            }
        ]
    },
    {
        "id": "science_group",
        "name": {
            "en": "Science",
            "he": "מדע"
        },
        "icon": "🔬",
        "subTopics": [
            {
                "id": "math",
                "name": {
                    "en": "Math",
                    "he": "חשבון"
                },
                "icon": "🔢"
            },

            {
                "id": "riddles",
                "name": {
                    "en": "Riddles",
                    "he": "חידות"
                },
                "icon": "🧩",
                "newUntil": "2026-03-25"
            },
            {
                "id": "physics",
                "name": {
                    "en": "Physics",
                    "he": "פיזיקה"
                },
                "icon": "⚛️",
                "newUntil": "2026-03-25"
            },
            {
                "id": "space",
                "name": {
                    "en": "Space & Solar System",
                    "he": "חלל ומערכת השמש"
                },
                "icon": "🪐",
                "newUntil": "2026-03-25"
            }
        ]
    },
    {
        "id": "world_group",
        "name": {
            "en": "World & Geography",
            "he": "עולם וגאוגרפיה"
        },
        "icon": "🌍",
        "subTopics": [
            {
                "id": "countries",
                "name": {
                    "en": "Countries",
                    "he": "מדינות"
                },
                "icon": "🗺️"
            },
            {
                "id": "london",
                "name": {
                    "en": "London",
                    "he": "לונדון"
                },
                "icon": "💂"
            },
            {
                "id": "flags",
                "name": {
                    "en": "Flags",
                    "he": "דגלים"
                },
                "icon": "🏳️",
                "newUntil": "2026-03-25"
            }
        ]
    },
    {
        "id": "language_group",
        "name": {
            "en": "Languages",
            "he": "שפות"
        },
        "icon": "🗣️",
        "subTopics": [
            {
                "id": "english",
                "name": {
                    "en": "English Basics",
                    "he": "אנגלית בסיסית"
                },
                "icon": "🇺🇸",
                "hiddenIf": "en"
            },
            {
                "id": "english_advanced",
                "name": {
                    "en": "Psychometric English",
                    "he": "אנגלית פסיכומטרי"
                },
                "icon": "🎓",
                "newUntil": "2026-04-24"
            }
        ]
    },
    {
        "id": "culture_group",
        "name": {
            "en": "Culture & Art",
            "he": "תרבות ואמנות"
        },
        "icon": "🎭",
        "subTopics": [
            {
                "id": "art",
                "name": {
                    "en": "Art",
                    "he": "אמנות"
                },
                "icon": "🎨"
            },
            {
                "id": "israeli_music",
                "name": {
                    "en": "Israeli Music",
                    "he": "מוזיקה ישראלית"
                },
                "icon": "🎸"
            }
        ]
    },
    {
        "id": "entertainment_group",
        "name": {
            "en": "Entertainment",
            "he": "בידור"
        },
        "icon": "🍿",
        "subTopics": [
            {
                "id": "movies",
                "name": {
                    "en": "Kids Movies",
                    "he": "סרטי ילדים"
                },
                "icon": "🎬"
            },
            {
                "id": "sopranos",
                "name": {
                    "en": "The Sopranos",
                    "he": "הסופרנוס"
                },
                "icon": "🔫"
            }
        ]
    },
    {
        "id": "sports_group",
        "name": {
            "en": "Sports",
            "he": "ספורט"
        },
        "icon": "⚽",
        "subTopics": [
            {
                "id": "maccabi_haifa",
                "name": {
                    "en": "Maccabi Haifa",
                    "he": "מכבי חיפה"
                },
                "icon": "⚽",
                "color": "#4ade80"
            },
            {
                "id": "chelsea",
                "name": {
                    "en": "Chelsea",
                    "he": "צ'לסי"
                },
                "icon": "⚽",
                "color": "#3b82f6"
            }
        ]
    },
    {
        "id": "lifestyle_group",
        "name": {
            "en": "Life & Hobbies",
            "he": "חיים ופנאי"
        },
        "icon": "🍕",
        "subTopics": [
            {
                "id": "food",
                "name": {
                    "en": "Food",
                    "he": "אוכל"
                },
                "icon": "🍔"
            },
            {
                "id": "patisserie",
                "name": {
                    "en": "Patisserie",
                    "he": "קונדיטוריה"
                },
                "icon": "🥐"
            }
        ]
    },
    {
        "id": "mind_group",
        "name": {
            "en": "Mind & Development",
            "he": "נפש והתפתחות"
        },
        "icon": "🧘",
        "subTopics": [
            {
                "id": "psychology",
                "name": {
                    "en": "Psychology",
                    "he": "פסיכולוגיה"
                },
                "icon": "🧠"
            }
        ]
    },
    {
        "id": "gaming_group",
        "name": {
            "en": "Gaming",
            "he": "גיימינג"
        },
        "icon": "🎮",
        "subTopics": [
            {
                "id": "roblox",
                "name": {
                    "en": "Roblox",
                    "he": "רובלוקס"
                },
                "icon": "😎",
                "newUntil": "2026-04-25"
            }
        ]
    },
    {
        "id": "general",
        "name": {
            "en": "General Knowledge",
            "he": "ידע כללי"
        },
        "icon": "🧠"
    }
];

export const questionCounts = {
    // --- GENERATED_COUNTS_START ---
    "israel_cities": 150,
    // --- GENERATED_COUNTS_END ---
    "bible_stories": 377,
    "holidays": 100,
    "tradition": 82,
    "maccabi_haifa": 155,
    "chelsea": 99,
    "math": 293,
    "tel_aviv": 273,
    "patisserie": 400,
    "israeli_music": 286,
    "animals": 154,
    "countries": 246,
    "movies": 262,
    "food": 320,
    "london": 201,
    "art": 101,
    "records": 66,
    "general": 100,
    "sopranos": 100,
    "human_body": 100,
    "psychology": 60,
    "riddles": 250,
    "physics": 150,
    "english": 300,
    "english_advanced": 150,
    "space": 150,
    "flags": 150,
    "roblox": 150
};

export const questions = [
    ...israelQuestions,
    ...judaismQuestions,
    ...natureQuestions,
    ...scienceQuestions,
    ...worldQuestions,
    ...culture_entQuestions,
    ...sports_lifeQuestions,
    ...riddlesQuestions,
    ...mathQuestions,
    ...physicsQuestions,
    ...generalQuestions,
    ...englishQuestions,
    ...englishAdvancedQuestions,
    ...spaceQuestions,
    ...flagsQuestions,
    ...robloxQuestions,
    ...kidsMoviesNewQuestions
];
