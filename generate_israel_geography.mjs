import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('public/bycode2024 2.csv');
const outputPath = path.resolve('src/data/questions.js');

function parseCSV(content) {
    const lines = content.split('\n');
    const startIndex = lines[0].includes('Table 1') ? 1 : 0;
    const headerLine = lines[startIndex];
    if (!headerLine) return [];

    const headers = headerLine.split(',').map(h => h.trim());

    const rows = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const row = [];
        let current = '';
        let inQuotes = false;
        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());

        const obj = {};
        headers.forEach((h, index) => {
            obj[h] = row[index];
        });
        rows.push(obj);
    }
    return rows;
}

if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`);
    process.exit(1);
}

const csvData = fs.readFileSync(csvPath, 'utf8');
const allRows = parseCSV(csvData);

const settlements = allRows.filter(r => {
    const name = r['שם יישוב'];
    const pop = r['סך הכל אוכלוסייה 2024'];
    return name && pop && !name.includes('אזור') && !name.includes('מ"א') && !name.includes('(שבט)');
});

const processedData = settlements.map(s => ({
    nameHe: s['שם יישוב'],
    nameEn: s['שם יישוב באנגלית'] || s['תעתיק'],
    pop: parseInt(s['סך הכל אוכלוסייה 2024']?.replace(/,/g, '') || '0'),
    districtHe: s['שם מחוז'],
    statusHe: s['שם מעמד מונציפאלי'],
    year: s['שנת ייסוד'] ? parseInt(s['שנת ייסוד']) : null
})).filter(s => s.pop > 0 && s.nameEn);

const questions = [];
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to create options and return index
function createOptions(cityA, cityB, correctIndex) {
    const en = [cityA.nameEn, cityB.nameEn].sort();
    const he = [cityA.nameHe, cityB.nameHe].sort();
    const correctVal = correctIndex === 0 ? cityA.nameEn : cityB.nameEn;
    const idx = en.indexOf(correctVal);
    return { options: { en, he }, correctAnswer: idx };
}

const bigCities = processedData.filter(s => s.pop > 40000).sort((a, b) => b.pop - a.pop);
const mediumCities = processedData.filter(s => s.pop > 10000 && s.pop <= 40000);
const smallTowns = processedData.filter(s => s.pop <= 10000);

// NEW DISTRIBUTION: 
// 20% Population = 40 questions
// 40% Existence = 80 questions
// 40% Status = 80 questions
// Total = 200

// 1. Population (40 questions) - 20%
for (let i = 0; i < 40; i++) {
    let cityA, cityB;
    if (i < 25) {
        cityA = randomItem(smallTowns);
        cityB = randomItem(smallTowns);
    } else {
        cityA = randomItem(mediumCities);
        cityB = randomItem(bigCities);
    }

    while (cityA === cityB) cityB = (i < 25 ? randomItem(smallTowns) : randomItem(bigCities));

    const correctIndex = cityA.pop > cityB.pop ? 0 : 1;
    const { options, correctAnswer } = createOptions(cityA, cityB, correctIndex);

    questions.push({
        id: `israel_geo_pop_${i}`,
        category: "israel_cities",
        level: (cityA.pop < 5000) ? 3 : 2,
        emoji: "🏙️",
        text: {
            en: `Which city has a larger population: ${cityA.nameEn} or ${cityB.nameEn}?`,
            he: `למי יש אוכלוסייה גדולה יותר: ${cityA.nameHe} או ${cityB.nameHe}?`
        },
        options: options,
        correctAnswer: correctAnswer
    });
}

// 2. Existence (80 questions) - 40%
const fakeNames = [
    { en: "Givat Savyon", he: "גבעת סביון" },
    { en: "Tel Rimon", he: "תל רימון" },
    { en: "Beit Habanim", he: "בית הבנים" },
    { en: "Mitzpe Galil", he: "מצפה גליל" },
    { en: "Neve Ahva", he: "נווה אחווה" },
    { en: "Kfar HaZait", he: "כפר הזית" },
    { en: "Ramat Yam", he: "רמת ים" },
    { en: "Nof HaEmek", he: "נוף העמק" },
    { en: "Ganei Yerushalayim", he: "גני ירושלים" },
    { en: "Elon HaSharon", he: "אלון השרון" },
    { en: "Nof haSela", he: "נוף הסלע" },
    { en: "Givat haBroshim", he: "גבעת הברושים" },
    { en: "Mitzpe Yam", he: "מצפה ים" },
    { en: "Beit haPardes", he: "בית הפרדס" },
    { en: "Avivim haChadasha", he: "אביבים החדשה" }
];
for (let i = 0; i < 80; i++) {
    const pool = i < 60 ? smallTowns : processedData;
    const real = randomItem(pool);
    const fake = randomItem(fakeNames);

    const enOpts = [real.nameEn, fake.en].sort();
    const heOpts = [real.nameHe, fake.he].sort();
    const correctIdx = enOpts.indexOf(real.nameEn);

    questions.push({
        id: `israel_geo_exist_${i}`,
        category: "israel_cities",
        level: real.pop > 20000 ? 1 : (real.pop < 1000 ? 3 : 2),
        emoji: "🗺️",
        text: {
            en: `Which of these is a real city or town in Israel?`,
            he: `איזה מהבאים הוא שם של עיר או יישוב אמיתי בישראל?`
        },
        options: {
            en: enOpts,
            he: heOpts
        },
        correctAnswer: correctIdx
    });
}

// 3. Status (80 questions) - 40%
for (let i = 0; i < 80; i++) {
    const pool = i < 60 ? smallTowns : bigCities;
    const city = randomItem(pool);
    const isCity = city.statusHe === 'עירייה';

    const enOpts = ["Yes", "No"];
    const heOpts = ["כן", "לא"];
    const correctIdx = isCity ? 0 : 1;

    questions.push({
        id: `israel_geo_status_${i}`,
        category: "israel_cities",
        level: city.pop < 5000 ? 3 : 2,
        emoji: "📜",
        text: {
            en: `Is ${city.nameEn} officially defined as a "City" (Municipality)?`,
            he: `האם ${city.nameHe} מוגדרת רשמית כעיר (עירייה)?`
        },
        options: {
            en: enOpts,
            he: heOpts
        },
        correctAnswer: correctIdx
    });
}

let content = fs.readFileSync(outputPath, 'utf8');

// 1. Ensure israel_group is in topics
const newTopic = {
    id: "israel_group",
    name: { en: "Israel Geography", he: "ידיעת הארץ" },
    icon: "🇮🇱",
    subTopics: [
        {
            id: "israel_cities",
            name: { en: "Cities & Towns", he: "ערים ויישובים" },
            icon: "🏘️"
        }
    ]
};

if (!content.includes('"id": "israel_group"') && !content.includes("'id': 'israel_group'")) {
    const topicStr = JSON.stringify(newTopic, null, 4);
    content = content.replace(/export const topics = \[/, `export const topics = [\n${topicStr},`);
}

// 2. Clear existing israel_cities questions
// Modified to be more precise: only delete lines that start with the category.
const lines = content.split('\n');
const filteredLines = lines.filter(line => !line.includes('"category":"israel_cities"'));
content = filteredLines.join('\n');

// 3. Inject into questions array
const questionsStr = questions.map(q => JSON.stringify(q)).join(',\n    ');

if (content.includes('export const questions = [')) {
    content = content.replace(/export const questions = \[/, `export const questions = [\n    ${questionsStr},`);
}

// 4. Update questionCounts
content = content.replace(/"israel_cities": \d+/, `"israel_cities": ${questions.length}`);

fs.writeFileSync(outputPath, content);
console.log(`Successfully injected ${questions.length} questions into top-level questions array.`);
