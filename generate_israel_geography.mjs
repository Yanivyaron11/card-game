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

// 1. Population
const bigCities = processedData.filter(s => s.pop > 40000).sort((a, b) => b.pop - a.pop);
for (let i = 0; i < 25; i++) {
    const cityA = randomItem(bigCities);
    let cityB = randomItem(bigCities);
    while (cityA === cityB) cityB = randomItem(bigCities);

    const isLevel1 = Math.abs(cityA.pop - cityB.pop) > 50000;
    const correctIndex = cityA.pop > cityB.pop ? 0 : 1;
    const { options, correctAnswer } = createOptions(cityA, cityB, correctIndex);

    questions.push({
        id: `israel_geo_pop_${i}`,
        category: "israel_cities",
        level: isLevel1 ? 1 : 2,
        emoji: "🏙️",
        text: {
            en: `Which city has a larger population: ${cityA.nameEn} or ${cityB.nameEn}?`,
            he: `למי יש אוכלוסייה גדולה יותר: ${cityA.nameHe} או ${cityB.nameHe}?`
        },
        options: options,
        correctAnswer: correctAnswer
    });
}

// 2. Existence
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
    { en: "Elon HaSharon", he: "אלון השרון" }
];
for (let i = 0; i < 15; i++) {
    const real = randomItem(processedData);
    const fake = randomItem(fakeNames);

    const enOpts = [real.nameEn, fake.en].sort();
    const heOpts = [real.nameHe, fake.he].sort();
    const correctIdx = enOpts.indexOf(real.nameEn);

    questions.push({
        id: `israel_geo_exist_${i}`,
        category: "israel_cities",
        level: real.pop > 20000 ? 1 : 3,
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

// 3. Districts
const districtMap = {
    'הצפון': 'North District',
    'המרכז': 'Central District',
    'הדרום': 'South District',
    'ירושלים': 'Jerusalem District',
    'חיפה': 'Haifa District',
    'תל אביב': 'Tel Aviv District',
    'אזור יהודה ושומרון': 'Judea and Samaria Area'
};
const districtsHe = Object.keys(districtMap);

for (let i = 0; i < 20; i++) {
    const city = randomItem(processedData.filter(s => s.pop > 20000));
    const correctDistrictHe = city.districtHe;
    const correctDistrictEn = districtMap[correctDistrictHe];
    if (!correctDistrictEn) continue;

    let otherDistricts = districtsHe.filter(d => d !== correctDistrictHe);
    const wrong1 = randomItem(otherDistricts);
    const wrong2 = randomItem(otherDistricts.filter(d => d !== wrong1));

    const enOpts = [correctDistrictEn, districtMap[wrong1], districtMap[wrong2]].sort();
    const heOpts = [correctDistrictHe, wrong1, wrong2].sort();
    const correctIdx = enOpts.indexOf(correctDistrictEn);

    questions.push({
        id: `israel_geo_dist_${i}`,
        category: "israel_cities",
        level: 2,
        emoji: "📍",
        text: {
            en: `In which district is the city of ${city.nameEn} located?`,
            he: `באיזה מחוז נמצאת העיר ${city.nameHe}?`
        },
        options: {
            en: enOpts,
            he: heOpts
        },
        correctAnswer: correctIdx
    });
}

// 4. Status
for (let i = 0; i < 20; i++) {
    const city = randomItem(processedData.filter(s => s.pop > 5000));
    const isCity = city.statusHe === 'עירייה';

    const enOpts = ["Yes", "No"];
    const heOpts = ["כן", "לא"];
    const correctIdx = isCity ? 0 : 1;

    questions.push({
        id: `israel_geo_status_${i}`,
        category: "israel_cities",
        level: 3,
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

// 5. Scale
for (let i = 0; i < 20; i++) {
    const big = randomItem(bigCities);
    const small = randomItem(processedData.filter(s => s.pop < 3000));

    const enOpts = [small.nameEn, big.nameEn].sort();
    const heOpts = [small.nameHe, big.nameHe].sort();
    const correctIdx = enOpts.indexOf(small.nameEn);

    questions.push({
        id: `israel_geo_scale_${i}`,
        category: "israel_cities",
        level: 1,
        emoji: "🏚️",
        text: {
            en: `Which of these is a small town (less than 3,000 people)?`,
            he: `איזה מהבאים הוא יישוב קטן (פחות מ-3,000 תושבים)?`
        },
        options: {
            en: enOpts,
            he: heOpts
        },
        correctAnswer: correctIdx
    });
}

let content = fs.readFileSync(outputPath, 'utf8');

// 1. Ensure israel_group is in topics (without nested questions)
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

if (!content.includes('id: "israel_group"')) {
    const topicStr = JSON.stringify(newTopic, null, 4);
    content = content.replace(/export const topics = \[/, `export const topics = [\n${topicStr},`);
}

// 2. Inject into questions array
const questionsStr = questions.map(q => JSON.stringify(q)).join(',\n    ');

if (content.includes('export const questions = [')) {
    // Inject at the start of questions array
    content = content.replace(/export const questions = \[/, `export const questions = [\n    ${questionsStr},`);
}

fs.writeFileSync(outputPath, content);
console.log(`Successfully injected ${questions.length} questions into top-level questions array.`);
