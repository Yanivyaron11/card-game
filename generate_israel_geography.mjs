import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('public/bycode2024 2.csv');
const outputPath = path.resolve('src/data/questions.js');

const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

function shuffleWithSync(arr1, arr2) {
    const indices = [...Array(arr1.length).keys()];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return [indices.map(i => arr1[i]), indices.map(i => arr2[i])];
}

function parseCSV(content) {
    const lines = content.split('\n');
    const row0 = lines[0] || '';
    const startIndex = row0.includes('Table 1') ? 1 : 0;
    const headerLine = lines[startIndex];
    if (!headerLine) return [];

    const headers = headerLine.split(',').map(h => h.trim());

    const rows = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let current = '';
        let inQuotes = false;
        for (let char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else current += char;
        }
        row.push(current.trim());

        const obj = {};
        headers.forEach((h, idx) => obj[h] = row[idx]);
        rows.push(obj);
    }
    return rows;
}

const DISTRICT_MAP = {
    "ירושלים": "Jerusalem",
    "הצפון": "North",
    "חיפה": "Haifa",
    "המרכז": "Central",
    "תל אביב": "Tel Aviv",
    "הדרום": "South",
    "יהודה והשומרון": "Judea and Samaria"
};

if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at ${csvPath}`);
    process.exit(1);
}

const csvData = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(csvData);

const cities = rows.filter(r => r["שם יישוב"] && r["שם יישוב באנגלית"])
    .map(r => ({
        en: r["שם יישוב באנגלית"],
        he: r["שם יישוב"],
        districtEn: DISTRICT_MAP[r["שם מחוז"]] || 'Other',
        districtHe: r["שם מחוז"] || 'אזור יהודה ושומרון',
        year: r["שנת ייסוד"]
    }));

if (cities.length === 0) {
    console.error("No cities found in CSV. Check parsing logic.");
    process.exit(1);
}

const generatedQuestions = [];
const fakeCities = [
    { en: "Mitzpe Galil", he: "מצפה גליל" }, { en: "Beit Habanim", he: "בית הבנים" },
    { en: "Givat Savyon", he: "גבעת סביון" }, { en: "Avivim haChadasha", he: "אביבים החדשה" },
    { en: "Nof haSela", he: "נוף הסלע" }, { en: "Ramat Yam", he: "רמת ים" },
    { en: "Neve Ahva", he: "נווה אחווה" }, { en: "Givat haBroshim", he: "גבעת הברושים" },
    { en: "Beit haPardes", he: "בית הפרדס" }, { en: "Ganei Tehom", he: "גני תהום" },
    { en: "Kfar Shekhakim", he: "כפר שחקים" }, { en: "Mitzpe Ananim", he: "מצפה עננים" },
    { en: "Nof Harim", he: "נוף הרים" }, { en: "Givat haOr", he: "גבעת האור" },
    { en: "Pardesh haDarim", he: "פרדס הדרים" }
];

for (let i = 0; i < 85; i++) {
    const isReal = Math.random() > 0.5;
    const city = isReal ? cities[Math.floor(Math.random() * cities.length)] : fakeCities[Math.floor(Math.random() * fakeCities.length)];
    const distractorsPool = isReal ? fakeCities : cities;
    const distractor = distractorsPool[Math.floor(Math.random() * distractorsPool.length)];

    const idx = Math.floor(Math.random() * 2);
    const finalOptsEn = [];
    const finalOptsHe = [];

    if (idx === 0) {
        finalOptsEn.push(city.en, distractor.en);
        finalOptsHe.push(city.he, distractor.he);
    } else {
        finalOptsEn.push(distractor.en, city.en);
        finalOptsHe.push(distractor.he, city.he);
    }

    generatedQuestions.push({
        id: `israel_geo_exist_${i}`,
        category: "israel_cities",
        subCategory: "existence",
        templateId: "israel-city-existence",
        level: isReal ? (Math.random() > 0.5 ? 2 : 1) : 3,
        emoji: "🗺️",
        text: { en: "Which of these is a real city or town in Israel?", he: "איזה מהבאים הוא שם של עיר או יישוב אמיתי בישראל?" },
        options: { en: finalOptsEn, he: finalOptsHe },
        correctAnswer: idx
    });
}

const qualitative = [];
const factQuestions = [
    { qEn: "Which city was the first Hebrew city of the modern era, founded in 1909?", qHe: "איזו עיר הייתה העיר העברית הראשונה בעת החדשה, ונוסדה בשנת 1909?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Haifa", "Jerusalem", "Netanya"], wHe: ["חיפה", "ירושלים", "נתניה"], e: "🏙️", l: 1 },
    { qEn: "Which 'Moshava' was founded in 1882 and is known as the 'First to Zion'?", qHe: "איזו מושבה נוסדה בשנת 1882 וידועה בשם 'ראשון לציון'?", aEn: "Rishon LeZion", aHe: "ראשון לציון", wEn: ["Rehovot", "Hadera", "Petah Tikva"], wHe: ["רחובות", "חדרה", "פתח תקווה"], e: "🍷", l: 1 },
    { qEn: "Which city is known as the 'Mother of the Colonies' (Em HaMoshavot)?", qHe: "איזו עיר מכונה 'אם המושבות'?", aEn: "Petah Tikva", aHe: "פתח תקווה", wEn: ["Rosh Pinna", "Zikhron Ya\\'akov", "Mazkeret Batya"], wHe: ["ראש פינה", "זכרון יעקב", "מזכרת בתיה"], e: "🚜", l: 1 },
    { qEn: "Which city was founded by Baron Rothschild and named after his father?", qHe: "איזו עיר הוקמה על ידי הברון רוטשילד וקרויה על שם אביו?", aEn: "Zikhron Ya\\'akov", aHe: "זכרון יעקב", wEn: ["Binyamina", "Bat Shlomo", "Pantry"], wHe: ["בנימינה", "בת שלמה", "פרדס חנה"], e: "🍇", l: 2 },
    { qEn: "Where did the first ship of the First Aliyah arrive in 1882?", qHe: "איפה עגנה האונייה הראשונה של העלייה הראשונה בשנת 1882?", aEn: "Jaffa Port", aHe: "נמל יפו", wEn: ["Haifa Port", "Ashdod Port", "Eilat Port"], wHe: ["נמל חיפה", "נמל אשדוד", "נמל אילת"], e: "🚢", l: 2 },
    { qEn: "Which city was once the capital of the Tribe of Judah?", qHe: "איזו עיר שימשה בעבר כבירת שבט יהודה?", aEn: "Hebron", aHe: "חברון", wEn: ["Jerusalem", "Bethlehem", "Beer Sheva"], wHe: ["ירושלים", "בית לחם", "באר שבע"], e: "📜", l: 2 },
    { qEn: "Which city saw the signing of the Declaration of Independence in 1948?", qHe: "באיזו עיר נחתמה מגילת העצמאות בשנת 1948?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Jerusalem", "Haifa", "Rehovot"], wHe: ["ירושלים", "חיפה", "רחובות"], e: "🇮🇱", l: 1 },
    { qEn: "To which city did the Sanhedrin move after the destruction of the Second Temple?", qHe: "לאיזו עיר עברה הסנהדרין לאחר חורבן בית המקדש השני?", aEn: "Tiberias", aHe: "טבריה", wEn: ["Zefat", "Jerusalem", "Ramla"], wHe: ["צפת", "ירושלים", "רמלה"], e: "📜", l: 3 },
    { qEn: "Which city was the capital of the Umayyad caliphate in Palestine?", qHe: "איזו עיר הוקמה במאה ה-8 ושימשה כבירת ג'ונד פלסטין?", aEn: "Ramla", aHe: "רמלה", wEn: ["Jaffa", "Akko", "Jerusalem"], wHe: ["יפו", "עכו", "ירושלים"], e: "🏰", l: 3 },
    { qEn: "Which city is known for the first Templar colony in Israel (Sarona)?", qHe: "איזו עיר ידועה במושבה הטמפלרית הראשונה בארץ (שרונה)?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Haifa", "Jerusalem", "Bethlehem-of-Galilee"], wHe: ["חיפה", "ירושלים", "בית לחם הגלילית"], e: "🏘️", l: 2 },
    { qEn: "Which city is the southernmost city in Israel?", qHe: "מהי העיר הדרומית ביותר בישראל?", aEn: "Eilat", aHe: "אילת", wEn: ["Mizpe Ramon", "Be\\'er Sheva", "Dimona"], wHe: ["מצפה רמון", "באר שבע", "דימונה"], e: "☀️", l: 1 },
    { qEn: "Which city is the northernmost town in Israel?", qHe: "מהי העיר/יישוב הצפוני ביותר בישראל?", aEn: "Metula", aHe: "מטולה", wEn: ["Kiryat Shmona", "Nahariya", "Safed"], wHe: ["קריית שמונה", "נהריה", "צפת"], e: "🍎", l: 1 },
    { qEn: "Which city is the highest city in Israel?", qHe: "מהי העיר הגבוהה ביותר בישראל?", aEn: "Safed (Zefat)", aHe: "צפת", wEn: ["Jerusalem", "Mizpe Ramon", "Ma\\'alot"], wHe: ["ירושלים", "מצפה רמון", "מעלות"], e: "⛰️", l: 2 },
    { qEn: "Which city is the lowest city in the world?", qHe: "איזו עיר היא הנמוכה בעולם?", aEn: "Jericho", aHe: "יריחו", wEn: ["Ein Gedi", "Eilat", "Tiberias"], wHe: ["עין גדי", "אילת", "טבריה"], e: "📉", l: 2 },
    { qEn: "Which city is known as the 'Capital of the Negev'?", qHe: "איזו עיר מכונה 'בירת הנגב'?", aEn: "Be\\'er Sheva", aHe: "באר שבע", wEn: ["Arad", "Eilat", "Yeroham"], wHe: ["ערד", "אילת", "ירוחם"], e: "🐪", l: 1 },
    { qEn: "Which city is known as the 'Capital of the Galilee'?", qHe: "איזו עיר מכונה 'בירת הגליל'?", aEn: "Nazareth", aHe: "נצרת", wEn: ["Karmiel", "Tiberias", "Safed"], wHe: ["כרמיאל", "טבריה", "צפת"], e: "⛪", l: 2 },
    { qEn: "Which city is famous for its Bahai Gardens and golden dome?", qHe: "איזו עיר מפורסמת בגנים הבהאיים ובכיפת הזהב שלה?", aEn: "Haifa", aHe: "חיפה", wEn: ["Akko", "Jerusalem", "Ashdod"], wHe: ["עכו", "ירושלים", "אשדוד"], e: "🌺", l: 1 },
    { qEn: "In which city is the 'Weizmann Institute of Science'?", qHe: "באיזו עיר נמצא 'מכון ויצמן למדע'?", aEn: "Rehovot", aHe: "רחובות", wEn: ["Tel Aviv", "Haifa", "Herzliyya"], wHe: ["תל אביב", "חיפה", "הרצלייה"], e: "🔬", l: 2 },
    { qEn: "Which city is home to the world\\'s only 'Children\\'s Museum' of its kind?", qHe: "באיזו עיר נמצא 'מוזיאון הילדים' היחיד מסוגו בעולם?", aEn: "Holon", aHe: "חולון", wEn: ["Ramat Gan", "Tel Aviv", "Bat Yam"], wHe: ["רמת גן", "תל אביב", "בת ים"], e: "🧒", l: 1 },
    { qEn: "Which city is known as the 'City of Orchards' (Ir HaHadarim)?", qHe: "איזו עיר מכונה 'עיר ההדרים'?", aEn: "Rehovot", aHe: "רחובות", wEn: ["Hadera", "Netanya", "Kfar Saba"], wHe: ["חדרה", "נתניה", "כפר סבא"], e: "🍊", l: 1 }
];

factQuestions.forEach((q, idx) => {
    const [optsEn, optsHe] = shuffleWithSync([q.aEn, ...q.wEn], [q.aHe, ...q.wHe]);
    qualitative.push({
        id: `israel_geo_fact_${idx}`,
        category: "israel_cities",
        subCategory: "qualitative",
        templateId: "israel-city-fact",
        level: q.l,
        emoji: q.e,
        text: { en: q.qEn, he: q.qHe },
        options: { en: optsEn, he: optsHe },
        correctAnswer: optsEn.indexOf(q.aEn)
    });
});

cities.forEach((c, idx) => {
    if (idx < 100) {
        const isTrue = Math.random() > 0.5;
        const otherDist = cities.find(x => x.districtEn !== c.districtEn) || cities[0];
        qualitative.push({
            id: `israel_geo_fact_bool_${idx}`,
            category: "israel_cities",
            subCategory: "qualitative",
            templateId: "israel-city-bool",
            level: Math.random() > 0.5 ? 2 : 1,
            emoji: "🧐",
            text: {
                en: `Is ${c.en} located in the ${isTrue ? c.districtEn : otherDist.districtEn} district?`,
                he: `האם ${c.he} נמצאת במחוז ${isTrue ? c.districtHe : otherDist.districtHe}?`
            },
            options: { en: ["Yes", "No"], he: ["כן", "לא"] },
            correctAnswer: isTrue ? 0 : 1
        });
    }
    if (idx >= 100 && idx < 200) {
        const otherDists = cities.filter(x => x.districtEn !== c.districtEn).map(x => ({ en: x.districtEn, he: x.districtHe }));
        const uniqueOthers = [];
        const seen = new Set([c.districtEn]);
        for (const d of otherDists) {
            if (!seen.has(d.en)) {
                uniqueOthers.push(d);
                seen.add(d.en);
            }
            if (uniqueOthers.length >= 3) break;
        }
        const [optsEn, optsHe] = shuffleWithSync([c.districtEn, ...uniqueOthers.map(o => o.en)], [c.districtHe, ...uniqueOthers.map(o => o.he)]);
        qualitative.push({
            id: `israel_geo_fact_dist_${idx}`,
            category: "israel_cities",
            subCategory: "qualitative",
            templateId: "israel-city-district",
            level: Math.random() > 0.5 ? 2 : 1,
            emoji: "🗺️",
            text: { en: `In which district is the city of ${c.en} located?`, he: `באיזה מחוז נמצאת העיר ${c.he}?` },
            options: { en: optsEn, he: optsHe },
            correctAnswer: optsEn.indexOf(c.districtEn)
        });
    }
});

const finalQuestions = shuffle([...generatedQuestions, ...qualitative]);

let content = fs.readFileSync(outputPath, 'utf8');

function replaceBlock(content, startMarker, endMarker, newBlock) {
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (startIdx === -1 || endIdx === -1) {
        console.warn(`Markers not found: ${startMarker} or ${endMarker}`);
        return content;
    }
    // Surgical replacement between markers
    return content.substring(0, startIdx + startMarker.length) +
        "\n" + newBlock + "\n    " +
        content.substring(endIdx);
}

// 1. Update Topics (WITH COMMA)
const topicGroup = {
    "id": "israel_group",
    "name": { "en": "Israel Geography", "he": "ידיעת הארץ" },
    "icon": "🇮🇱",
    "subTopics": [
        {
            "id": "israel_cities",
            "name": { "en": "Cities & Towns", "he": "ערים ויישובים" },
            "icon": "🏘️",
            "newUntil": "2026-03-24"
        }
    ]
};
// We add a comma after the object so it fits in the array successfully
const topicInjected = "    " + JSON.stringify(topicGroup, null, 4) + ",";
content = replaceBlock(content, "// --- GENERATED_TOPICS_START ---", "// --- GENERATED_TOPICS_END ---", topicInjected);

// 2. Update Counts
content = replaceBlock(content, "// --- GENERATED_COUNTS_START ---", "// --- GENERATED_COUNTS_END ---", `    "israel_cities": ${finalQuestions.length},`);

// 3. Update Questions
const questionsStr = finalQuestions.map(q => JSON.stringify(q)).join(',\n    ') + ",";
content = replaceBlock(content, "// --- GENERATED_QUESTIONS_START ---", "// --- GENERATED_QUESTIONS_END ---", "    " + questionsStr);

fs.writeFileSync(outputPath, content);
console.log(`Successfully injected ${finalQuestions.length} questions.`);
