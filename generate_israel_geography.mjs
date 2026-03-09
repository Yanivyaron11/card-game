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
    const pop = parseInt(r['סך הכל אוכלוסייה 2024']?.replace(/,/g, '') || '0');
    return name && pop >= 3000 && !name.includes('אזור') && !name.includes('מ"א') && !name.includes('(שבט)');
});

const processedData = settlements.map(s => ({
    nameHe: s['שם יישוב'],
    nameEn: (s['שם יישוב באנגלית'] || s['תעתיק'] || s['שם יישוב']).replace(/'/g, "\\'"),
    pop: parseInt(s['סך הכל אוכלוסייה 2024']?.replace(/,/g, '') || '0'),
    districtHe: s['שם מחוז'],
    statusHe: s['שם מעמד מונציפאלי'],
    year: s['שנת ייסוד'] ? parseInt(s['שנת ייסוד']) : null
})).filter(s => s.pop >= 3000 && s.nameEn);

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
const smallTowns = processedData.filter(s => s.pop < 10000);

// NEW DISTRIBUTION (MASTER SCRIPT): 
// 40 Population
// 80 Existence
// 80 Status
// 100 Qualitative
// Total = 300

// 1. Population (40 questions)
for (let i = 0; i < 40; i++) {
    let cityA, cityB;
    if (i < 25 && smallTowns.length > 1) {
        cityA = randomItem(smallTowns);
        cityB = randomItem(smallTowns);
    } else {
        cityA = randomItem(mediumCities);
        cityB = randomItem(bigCities);
    }
    while (cityA === cityB) cityB = (i < 25 && smallTowns.length > 1 ? randomItem(smallTowns) : randomItem(bigCities));
    const correctIndex = cityA.pop > cityB.pop ? 0 : 1;
    const { options, correctAnswer } = createOptions(cityA, cityB, correctIndex);
    questions.push({
        id: `israel_geo_pop_${i}`,
        category: "israel_cities",
        level: (cityA.pop < 10000) ? 3 : 2,
        emoji: "🏙️",
        text: {
            en: `Which city has a larger population: ${cityA.nameEn} or ${cityB.nameEn}?`,
            he: `למי יש אוכלוסייה גדולה יותר: ${cityA.nameHe} או ${cityB.nameHe}?`
        },
        options: options,
        correctAnswer: correctAnswer
    });
}

// 2. Existence (80 questions)
const fakeNames = [
    { en: "Givat Savyon", he: "גבעת סביון" }, { en: "Tel Rimon", he: "תל רימון" },
    { en: "Beit Habanim", he: "בית הבנים" }, { en: "Mitzpe Galil", he: "מצפה גליל" },
    { en: "Neve Ahva", he: "נווה אחווה" }, { en: "Kfar HaZait", he: "כפר הזית" },
    { en: "Ramat Yam", he: "רמת ים" }, { en: "Nof HaEmek", he: "נוף העמק" },
    { en: "Ganei Yerushalayim", he: "גני ירושלים" }, { en: "Elon HaSharon", he: "אלון השרון" },
    { en: "Nof haSela", he: "נוף הסלע" }, { en: "Givat haBroshim", he: "גבעת הברושים" },
    { en: "Mitzpe Yam", he: "מצפה ים" }, { en: "Beit haPardes", he: "בית הפרדס" },
    { en: "Avivim haChadasha", he: "אביבים החדשה" }
];
for (let i = 0; i < 80; i++) {
    const pool = i < 60 && smallTowns.length > 0 ? smallTowns : processedData;
    const real = randomItem(pool);
    const fake = randomItem(fakeNames);
    const enOpts = [real.nameEn, fake.en].sort();
    const heOpts = [real.nameHe, fake.he].sort();
    const correctIdx = enOpts.indexOf(real.nameEn);
    questions.push({
        id: `israel_geo_exist_${i}`,
        category: "israel_cities",
        level: real.pop > 50000 ? 1 : (real.pop < 10000 ? 3 : 2),
        emoji: "🗺️",
        text: {
            en: `Which of these is a real city or town in Israel?`,
            he: `איזה מהבאים הוא שם של עיר או יישוב אמיתי בישראל?`
        },
        options: { en: enOpts, he: heOpts },
        correctAnswer: correctIdx
    });
}

// 3. Status (80 questions)
for (let i = 0; i < 80; i++) {
    const pool = i < 60 && smallTowns.length > 0 ? smallTowns : bigCities;
    const city = randomItem(pool);
    const isCity = city.statusHe === 'עירייה';
    const enOpts = ["Yes", "No"];
    const heOpts = ["כן", "לא"];
    const correctIdx = isCity ? 0 : 1;
    questions.push({
        id: `israel_geo_status_${i}`,
        category: "israel_cities",
        level: city.pop < 10000 ? 3 : 2,
        emoji: "📜",
        text: {
            en: `Is ${city.nameEn} officially defined as a "City" (Municipality)?`,
            he: `האם ${city.nameHe} מוגדרת רשמית כעיר (עירייה)?`
        },
        options: { en: enOpts, he: heOpts },
        correctAnswer: correctIdx
    });
}

// 4. Qualitative (100 questions)
const qualitative = [];
const handpicked = [
    { text: { en: "What is the largest city in Israel by population?", he: "מהי העיר הגדולה בישראל מבחינת מספר תושבים?" }, options: { en: ["Haifa", "Tel Aviv", "Jerusalem", "Rishon LeZion"], he: ["חיפה", "תל אביב", "ירושלים", "ראשון לציון"] }, correctAnswer: 2, emoji: '🏙️' },
    { text: { en: "Which city is known as 'The White City'?", he: "איזו עיר מכונה 'העיר הלבנה'?" }, options: { en: ["Jerusalem", "Tel Aviv", "Haifa", "Zefat"], he: ["ירושלים", "תל אביב", "חיפה", "צפת"] }, correctAnswer: 1, emoji: '🏠' },
    { text: { en: "Which city is the 'Capital of the Negev'?", he: "איזו עיר מכונה 'בירת הנגב'?" }, options: { en: ["Eilat", "Arad", "Be'er Sheva", "Dimona"], he: ["אילת", "ערד", "באר שבע", "דימונה"] }, correctAnswer: 2, emoji: '🐪' },
    { text: { en: "Which city is known for its beautiful Bahai Gardens?", he: "באיזו עיר נמצאים הגנים הבהאיים המפורסמים?" }, options: { en: ["Akko", "Tel Aviv", "Haifa", "Tiberias"], he: ["עכו", "תל אביב", "חיפה", "טבריה"] }, correctAnswer: 2, emoji: '🌳' },
    { text: { en: "Which city is the holy city with the Western Wall?", he: "איזו עיר קדושה ובה נמצא הכותל המערבי?" }, options: { en: ["Hebron", "Tiberias", "Jerusalem", "Safed"], he: ["חברון", "טבריה", "ירושלים", "צפת"] }, correctAnswer: 2, emoji: '🕍' },
    { text: { en: "Which city is the lowest city in the world?", he: "איזו עיר היא הנמוכה בעולם?" }, options: { en: ["Arad", "Jericho", "Eilat", "Ein Gedi"], he: ["ערד", "יריחו", "אילת", "עין גדי"] }, correctAnswer: 1, emoji: '📉' },
    { text: { en: "Which city is known for Mount Carmel?", he: "איזו עיר ידועה בזכות הר הכרמל?" }, options: { en: ["Ashdod", "Eilat", "Haifa", "Tel Aviv"], he: ["אשדוד", "אילת", "חיפה", "תל אביב"] }, correctAnswer: 2, emoji: '⚓' },
    { text: { en: "Which city is the southernmost in Israel?", he: "מהי העיר הדרומית ביותר בישראל?" }, options: { en: ["Mizpe Ramon", "Be'er Sheva", "Eilat", "Yotvata"], he: ["מצפה רמון", "באר שבע", "אילת", "יוטבתה"] }, correctAnswer: 2, emoji: '☀️' },
    { text: { en: "Which city is on the shores of the Sea of Galilee?", he: "איזו עיר שוכנת לחוף הכנרת?" }, options: { en: ["Tiberias", "Bet She'an", "Afula", "Katzrin"], he: ["טבריה", "בית שאן", "עפולה", "קצרין"] }, correctAnswer: 0, emoji: '🌊' },
    { text: { en: "Which city is known for Kabbalah history?", he: "איזו עיר צפונית ידועה בהיסטוריית הקבלה שלה?" }, options: { en: ["Haifa", "Zefat", "Akko", "Nahariyya"], he: ["חיפה", "צפת", "עכו", "נהרייה"] }, correctAnswer: 1, emoji: '🎨' }
];

handpicked.forEach((q, i) => qualitative.push({ ...q, id: `q_iz_hand_${i}`, category: 'israel_cities', level: 1 }));

// Templates for districts
const districtData = [
    { nameEn: "Yotvata", nameHe: "יוטבתה", districtEn: "South District", districtHe: "הדרום" },
    { nameEn: "Metula", nameHe: "מטולה", districtEn: "North District", districtHe: "הצפון" },
    { nameEn: "Savyon", nameHe: "סביון", districtEn: "Central District", districtHe: "המרכז" },
    { nameEn: "Kefar Habad", nameHe: "כפר חבד", districtEn: "Central District", districtHe: "המרכז" },
    { nameEn: "Mizpe Ramon", nameHe: "מצפה רמון", districtEn: "South District", districtHe: "הדרום" },
    { nameEn: "Arad", nameHe: "ערד", districtEn: "South District", districtHe: "הדרום" },
    { nameEn: "Akko", nameHe: "עכו", districtEn: "North District", districtHe: "הצפון" },
    { nameEn: "Dimona", nameHe: "דימונה", districtEn: "South District", districtHe: "הדרום" },
    { nameEn: "Katzrin", nameHe: "קצרין", districtEn: "North District", districtHe: "הצפון" },
    { nameEn: "Nahariyya", nameHe: "נהרייה", districtEn: "North District", districtHe: "הצפון" },
    { nameEn: "Hadera", nameHe: "חדרה", districtEn: "Haifa District", districtHe: "חיפה" },
    { nameEn: "Afula", nameHe: "עפולה", districtEn: "North District", districtHe: "הצפון" },
    { nameEn: "Ra'annana", nameHe: "רעננה", districtEn: "Central District", districtHe: "המרכז" },
    { nameEn: "Holon", nameHe: "חולון", districtEn: "Tel Aviv District", districtHe: "תל אביב" },
    { nameEn: "Ashdod", nameHe: "אשדוד", districtEn: "South District", districtHe: "הדרום" }
];

const allDistricts = [
    { en: "North District", he: "הצפון" }, { en: "Central District", he: "המרכז" },
    { en: "South District", he: "הדרום" }, { en: "Jerusalem District", he: "ירושלים" },
    { en: "Haifa District", he: "חיפה" }, { en: "Tel Aviv District", he: "תל אביב" }
];

for (let i = 0; i < 40; i++) {
    const city = districtData[i % districtData.length];
    const others = allDistricts.filter(d => d.en !== city.districtEn);
    const wrong1 = randomItem(others);
    const wrong2 = randomItem(others.filter(d => d.en !== wrong1.en));
    const enOpts = [city.districtEn, wrong1.en, wrong2.en].sort();
    const heOpts = enOpts.map(en => [...allDistricts, { en: city.districtEn, he: city.districtHe }].find(d => d.en === en).he);
    const correctIdx = enOpts.indexOf(city.districtEn);
    qualitative.push({
        id: `q_iz_dist_${i}`,
        category: "israel_cities", level: 2, emoji: "📍",
        text: { en: `In which district is ${city.nameEn} located?`, he: `באיזה מחוז שוכנת ${city.nameHe}?` },
        options: { en: enOpts, he: heOpts },
        correctAnswer: correctIdx
    });
}

// Port/Coast templates
const coastalCities = [
    { en: "Tel Aviv", he: "תל אביב" }, { en: "Haifa", he: "חיפה" }, { en: "Ashdod", he: "אשדוד" },
    { en: "Ashqelon", he: "אשקלון" }, { en: "Netanya", he: "נתיבות" }, { en: "Eilat", he: "אילת" },
    { en: "Nahariyya", he: "נהרייה" }, { en: "Akko", he: "עכו" }
];
for (let i = 0; i < 25; i++) {
    const city = coastalCities[i % coastalCities.length];
    qualitative.push({
        id: `q_iz_coast_${i}`,
        category: "israel_cities", level: 2, emoji: "🏖️",
        text: { en: `Is ${city.en} located on a coast (sea)?`, he: `האם ${city.he} שוכנת לחוף ים?` },
        options: { en: ["Yes", "No"], he: ["כן", "לא"] },
        correctAnswer: 0
    });
}

// Fill remaining to reach 100
while (qualitative.length < 100) {
    const city = randomItem(processedData);
    qualitative.push({
        id: `q_iz_extra_${qualitative.length}`,
        category: "israel_cities", level: 2, emoji: "🏘️",
        text: { en: `Is ${city.nameEn} in the South of Israel?`, he: `האם ${city.nameHe} נמצאת בדרום הארץ?` },
        options: { en: ["Yes", "No"], he: ["כן", "לא"] },
        correctAnswer: city.districtHe.includes("דרום") ? 0 : 1
    });
}

const finalQuestions = [...questions, ...qualitative.slice(0, 100)];

let content = fs.readFileSync(outputPath, 'utf8');

// 1. Ensure topics
const newTopic = {
    id: "israel_group",
    name: { en: "Israel Geography", he: "ידיעת הארץ" },
    icon: "🇮🇱",
    subTopics: [
        { id: "israel_cities", name: { en: "Cities & Towns", he: "ערים ויישובים" }, icon: "🏘️" }
    ]
};

if (!content.includes('"id": "israel_group"')) {
    content = content.replace(/export const topics = \[/, `export const topics = [\n${JSON.stringify(newTopic, null, 4)},`);
}

// 2. Clear existing
const lines = content.split('\n');
const filteredLines = lines.filter(line => !line.includes('"category":"israel_cities"'));
content = filteredLines.join('\n');

// 3. Inject
const questionsStr = finalQuestions.map(q => JSON.stringify(q)).join(',\n    ');
if (content.includes('export const questions = [')) {
    content = content.replace(/export const questions = \[/, `export const questions = [\n    ${questionsStr},`);
}

// 4. Update Counts
if (content.includes('"israel_cities":')) {
    content = content.replace(/"israel_cities": \d+/, `"israel_cities": ${finalQuestions.length}`);
} else {
    content = content.replace(/export const questionCounts = \{/, `export const questionCounts = {\n    "israel_cities": ${finalQuestions.length},`);
}
fs.writeFileSync(outputPath, content);
console.log(`Successfully injected ${finalQuestions.length} questions.`);
