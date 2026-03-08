import fs from 'fs';

const updatedTopics = [
    {
        id: "math",
        name: { en: "Math", he: "חשבון" },
        icon: "➕"
    },
    {
        id: "food_group",
        name: { en: "Food & Culinary", he: "אוכל וקולינריה" },
        icon: "🍔",
        subTopics: [
            { id: "food", name: { en: "General Food", he: "אוכל כללי" }, icon: "🍕" },
            { id: "patisserie", name: { en: "Patisserie", he: "קונדיטוריה" }, icon: "🥐" }
        ]
    },
    {
        id: "science_group",
        name: { en: "Science & Nature", he: "מדע וטבע" },
        icon: "🔬",
        subTopics: [
            { id: "animals", name: { en: "Animals", he: "חיות" }, icon: "🦁" },
            { id: "nature", name: { en: "Nature", he: "טבע" }, icon: "🌿" },
            { id: "human_body", name: { en: "The Human Body", he: "גוף האדם" }, icon: "🧬" },
            { id: "psychology", name: { en: "Psychology", he: "פסיכולוגיה" }, icon: "🧠" }
        ]
    },
    {
        id: "world_group",
        name: { en: "World & Geography", he: "עולם וגאוגרפיה" },
        icon: "🌍",
        subTopics: [
            { id: "countries", name: { en: "Countries", he: "מדינות" }, icon: "🗺️" },
            { id: "london", name: { en: "London", he: "לונדון" }, icon: "💂" }
        ]
    },
    {
        id: "culture_group",
        name: { en: "Culture & Art", he: "תרבות ואמנות" },
        icon: "🎭",
        subTopics: [
            { id: "judaism", name: { en: "Judaism", he: "יהדות" }, icon: "🔯" },
            { id: "art", name: { en: "Art", he: "אמנות" }, icon: "🎨" }
        ]
    },
    {
        id: "entertainment_group",
        name: { en: "Entertainment", he: "בידור" },
        icon: "🍿",
        subTopics: [
            { id: "movies", name: { en: "Kids Movies", he: "סרטי ילדים" }, icon: "🎬" },
            { id: "israeli_music", name: { en: "Israeli Music", he: "מוזיקה ישראלית" }, icon: "🎸" },
            { id: "sopranos", name: { en: "The Sopranos", he: "הסופרנוס" }, icon: "🔫" }
        ]
    },
    {
        id: "sports_group",
        name: { en: "Sports", he: "ספורט" },
        icon: "⚽",
        subTopics: [
            { id: "maccabi_haifa", name: { en: "Maccabi Haifa", he: "מכבי חיפה" }, icon: "🟢" }
        ]
    },
    {
        id: "general",
        name: { en: "General Knowledge", he: "ידע כללי" },
        icon: "🧠"
    }
];

const filePath = './src/data/questions.js';
let content = fs.readFileSync(filePath, 'utf8');

// The exported topics array is at the very beginning of the file.
// We can use a regex to replace it up to the `export const questionCounts = ` part.
const newTopicsString = `export const topics = ${JSON.stringify(updatedTopics, null, 4)};\n\n`;

content = content.replace(/export const topics = \[[\s\S]*?\];\n\n/, newTopicsString);

fs.writeFileSync(filePath, content);
console.log('Successfully updated topics structure in questions.js');
