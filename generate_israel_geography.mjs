import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('public/bycode2024 2.csv');
const outputPath = path.resolve('src/data/questions.js');

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

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
// 0 Population
// 85 Existence
// 215 Qualitative (Intersting Facts + Statistics)
// Total = 300

// 1. Population (REMOVED per user request)

// 2. Existence (85 questions)
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
// 2. Existence (85 questions)
for (let i = 0; i < 85; i++) {
    const pool = i < 40 && smallTowns.length > 0 ? smallTowns : processedData;
    const real = randomItem(pool);
    const fake = randomItem(fakeNames);
    const enOpts = [real.nameEn, fake.en].sort();
    const heOpts = [real.nameHe, fake.he].sort();
    const correctIdx = enOpts.indexOf(real.nameEn);
    questions.push({
        id: `israel_geo_exist_${i}`,
        category: "israel_cities",
        subCategory: "existence",
        templateId: "israel-city-existence",
        level: real.pop > 40000 ? 1 : (real.pop < 15000 ? 3 : 2),
        emoji: "🗺️",
        text: {
            en: `Which of these is a real city or town in Israel?`,
            he: `איזה מהבאים הוא שם של עיר או יישוב אמיתי בישראל?`
        },
        options: { en: enOpts, he: heOpts },
        correctAnswer: correctIdx
    });
}

// 4. Qualitative (215 items)
const qualitative = [];
const factQuestions = [
    // --- HISTORY & FOUNDING ---
    { qEn: "Which city was the first Hebrew city of the modern era, founded in 1909?", qHe: "איזו עיר הייתה העיר העברית הראשונה בעת החדשה, ונוסדה בשנת 1909?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Haifa", "Jerusalem", "Netanya"], wHe: ["חיפה", "ירושלים", "נתניה"], e: "🏙️", l: 1 },
    { qEn: "Which 'Moshava' was founded in 1882 and is known as the 'First to Zion'?", qHe: "איזו מושבה נוסדה בשנת 1882 וידועה בשם 'ראשון לציון'?", aEn: "Rishon LeZion", aHe: "ראשון לציון", wEn: ["Rehovot", "Hadera", "Petah Tikva"], wHe: ["רחובות", "חדרה", "פתח תקווה"], e: "🍷", l: 1 },
    { qEn: "Which city is known as the 'Mother of the Colonies' (Em HaMoshavot)?", qHe: "איזו עיר מכונה 'אם המושבות'?", aEn: "Petah Tikva", aHe: "פתח תקווה", wEn: ["Rosh Pinna", "Zikhron Ya\\'akov", "Mazkeret Batya"], wHe: ["ראש פינה", "זכרון יעקב", "מזכרת בתיה"], e: "🚜", l: 1 },
    { qEn: "Which city was founded by Baron Rothschild and named after his father?", qHe: "איזו עיר הוקמה על ידי הברון רוטשילד וקרויה על שם אביו?", aEn: "Zikhron Ya\\'akov", aHe: "זכרון יעקב", wEn: ["Binyamina", "Bat Shlomo", "Pantry"], wHe: ["בנימינה", "בת שלמה", "פרדס חנה"], e: "🍇", l: 2 },
    { qEn: "Where did the first ship of the First Aliyah arrive in 1882?", qHe: "איפה עגנה האונייה הראשונה של העלייה הראשונה בשנת 1882?", aEn: "Jaffa Port", aHe: "נמל יפו", wEn: ["Haifa Port", "Ashdod Port", "Eilat Port"], wHe: ["נמל חיפה", "נמל אשדוד", "נמל אילת"], e: "🚢", l: 2 },
    { qEn: "Which city was once the capital of the Tribe of Judah?", qHe: "איזו עיר שימשה בעבר כבירת שבט יהודה?", aEn: "Hebron", aHe: "חברון", wEn: ["Jerusalem", "Bethlehem", "Beer Sheva"], wHe: ["ירושלים", "בית לחם", "באר שבע"], e: "📜", l: 2 },
    { qEn: "Which city saw the signing of the Declaration of Independence in 1948?", qHe: "באיזו עיר נחתמה מגילת העצמאות בשנת 1948?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Jerusalem", "Haifa", "Rehovot"], wHe: ["ירושלים", "חיפה", "רחובות"], e: "🇮🇱", l: 1 },
    { qEn: "To which city did the Sanhedrin move after the destruction of the Second Temple?", qHe: "לאיזו עיר עברה הסנהדרין לאחר חורבן בית המקדש השני?", aEn: "Tiberias", aHe: "טבריה", wEn: ["Zefat", "Jerusalem", "Ramla"], wHe: ["צפת", "ירושלים", "רמלה"], e: "📜", l: 3 },
    { qEn: "Which city was the capital of the Umayyad caliphate in Palestine?", qHe: "איזו עיר הוקמה במאה ה-8 ושימשה כבירת ג'ונד פלסטין?", aEn: "Ramla", aHe: "רמלה", wEn: ["Jaffa", "Akko", "Jerusalem"], wHe: ["יפו", "עכו", "ירושלים"], e: " castles:🏰", l: 3 },
    { qEn: "Which city is known for the first Templar colony in Israel (Sarona)?", qHe: "איזו עיר ידועה במושבה הטמפלרית הראשונה בארץ (שרונה)?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Haifa", "Jerusalem", "Bethlehem-of-Galilee"], wHe: ["חיפה", "ירושלים", "בית לחם הגלילית"], e: "🏘️", l: 2 },

    // --- GEOGRAPHY & RECORDS ---
    { qEn: "Which city is the southernmost city in Israel?", qHe: "מהי העיר הדרומית ביותר בישראל?", aEn: "Eilat", aHe: "אילת", wEn: ["Mizpe Ramon", "Be\\'er Sheva", "Dimona"], wHe: ["מצפה רמון", "באר שבע", "דימונה"], e: "☀️", l: 1 },
    { qEn: "Which city is the northernmost town in Israel?", qHe: "מהי העיר/יישוב הצפוני ביותר בישראל?", aEn: "Metula", aHe: "מטולה", wEn: ["Kiryat Shmona", "Nahariya", "Safed"], wHe: ["קריית שמונה", "נהריה", "צפת"], e: "🍎", l: 1 },
    { qEn: "Which city is the highest city in Israel?", qHe: "מהי העיר הגבוהה ביותר בישראל?", aEn: "Safed (Zefat)", aHe: "צפת", wEn: ["Jerusalem", "Mizpe Ramon", "Ma\\'alot"], wHe: ["ירושלים", "מצפה רמון", "מעלות"], e: "⛰️", l: 2 },
    { qEn: "Which city is the lowest city in the world?", qHe: "איזו עיר היא הנמוכה בעולם?", aEn: "Jericho", aHe: "יריחו", wEn: ["Ein Gedi", "Eilat", "Tiberias"], wHe: ["עין גדי", "אילת", "טבריה"], e: "📉", l: 2 },
    { qEn: "Which city is known as the 'Capital of the Negev'?", qHe: "איזו עיר מכונה 'בירת הנגב'?", aEn: "Be\\'er Sheva", aHe: "באר שבע", wEn: ["Arad", "Eilat", "Yeroham"], wHe: ["ערד", "אילת", "ירוחם"], e: "🐪", l: 1 },
    { qEn: "Which city is known as the 'Capital of the Galilee'?", qHe: "איזו עיר מכונה 'בירת הגליל'?", aEn: "Nazareth", aHe: "נצרת", wEn: ["Karmiel", "Tiberias", "Safed"], wHe: ["כרמיאל", "טבריה", "צפת"], e: "⛪", l: 2 },
    { qEn: "Which city is known for its missing 'Crater' (Makhtesh)?", qHe: "איזו עיר שוכנת על שפת 'המכתש' הייחודי?", aEn: "Mizpe Ramon", aHe: "מצפה רמון", wEn: ["Yeroham", "Be\\'er Sheva", "Arad"], wHe: ["ירוחם", "באר שבע", "ערד"], e: "🏜️", l: 2 },
    { qEn: "Which city sits at the foot of Mount Hermon?", qHe: "איזו עיר/יישוב שוכן למרגלות הר החרמון?", aEn: "Majdal Shams", aHe: "מג'דל שמס", wEn: ["Katzrin", "Metula", "Kiryat Shmona"], wHe: ["קצרין", "מטולה", "קריית שמונה"], e: "❄️", l: 2 },
    { qEn: "Which city has the largest industrial zone in the North?", qHe: "באיזו עיר נמצא אזור התעשייה הגדול ביותר בצפון?", aEn: "Karmiel", aHe: "כרמיאל", wEn: ["Haifa", "Nahariya", "Migdal HaEmek"], wHe: ["חיפה", "נהריה", "מגדל העמק"], e: "🏭", l: 2 },
    { qEn: "Which Israeli city is built on ruins that are home to the 'Rosh HaAyin' springs?", qHe: "איזו עיר ישראלית בנויה על חורבות שבהן נביעות המים 'מקורות הירקון'?", aEn: "Rosh HaAyin", aHe: "ראש העין", wEn: ["Petah Tikva", "Lod", "Ramla"], wHe: ["פתח תקווה", "לוד", "רמלה"], e: "💧", l: 2 },

    // --- LANDMARKS & CULTURE ---
    { qEn: "Where are the Bahai Gardens located?", qHe: "איפה נמצאים הגנים הבהאיים?", aEn: "Haifa", aHe: "חיפה", wEn: ["Akko", "Nazareth", "Jerusalem"], wHe: ["עכו", "נצרת", "ירושלים"], e: "🌳", l: 1 },
    { qEn: "In which city is the 'Design Museum' (red building)?", qHe: "באיזו עיר נמצא 'מוזיאון העיצוב' (המבנה האדום)?", aEn: "Holon", aHe: "חולון", wEn: ["Tel Aviv", "Ramat Gan", "Herzliyya"], wHe: ["תל אביב", "רמת גן", "הרצלייה"], e: "🎨", l: 2 },
    { qEn: "Which city hosts the annual 'Holiday of Holidays'?", qHe: "איזו עיר מארחת את פסטיבל 'החג של החגים'?", aEn: "Haifa", aHe: "חיפה", wEn: ["Jerusalem", "Akko", "Nazareth"], wHe: ["ירושלים", "עכו", "נצרת"], e: "🎉", l: 2 },
    { qEn: "Which city is known for its internationally recognized 'Diamond Exchange'?", qHe: "איזו עיר ידועה ב'בורסת היהלומים' המפורסמת שלה?", aEn: "Ramat Gan", aHe: "רמת גן", wEn: ["Tel Aviv", "Netanya", "Herzliyya"], wHe: ["תל אביב", "נתניה", "הרצלייה"], e: "💎", l: 2 },
    { qEn: "In which city is the 'Weizmann Institute of Science'?", qHe: "באיזו עיר נמצא 'מכון ויצמן למדע'?", aEn: "Rehovot", aHe: "רחובות", wEn: ["Tel Aviv", "Herzliyya", "Haifa"], wHe: ["תל אביב", "הרצלייה", "חיפה"], e: "🔬", l: 2 },
    { qEn: "Which city is the home of the 'Israeli Opera'?", qHe: "איזו עיר היא ביתה של 'האופרה הישראלית'?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Jerusalem", "Haifa", "Rishon LeZion"], wHe: ["ירושלים", "חיפה", "ראשון לציון"], e: "🎼", l: 2 },
    { qEn: "Which city is home to the 'Science Museum' (Madatech)?", qHe: "באיזו עיר נמצא מוזיאון המדע 'מדעטק'?", aEn: "Haifa", aHe: "חיפה", wEn: ["Rehovot", "Tel Aviv", "Jerusalem"], wHe: ["רחובות", "תל אביב", "ירושלים"], e: "🧪", l: 2 },
    { qEn: "Which city is known for its beautiful 'Old City' tunnels?", qHe: "איזו עיר ידועה במנהרות 'העיר העתיקה' המדהימות?", aEn: "Jerusalem", aHe: "ירושלים", wEn: ["Akko", "Safed", "Yafo"], wHe: ["עכו", "צפת", "יפו"], e: "🕍", l: 1 },
    { qEn: "In which city can you see the 'White Tower' in the Old City?", qHe: "באיזו עיר ניתן לראות את 'המגדל הלבן' בעיר העתיקה?", aEn: "Ramla", aHe: "רמלה", wEn: ["Jaffa", "Akko", "Ashkelon"], wHe: ["יפו", "עכו", "אשקלון"], e: "🏰", l: 3 },
    { qEn: "Which city is famous for its 'Mini Israel' park?", qHe: "איזו עיר מפורסמת בפארק 'מיני ישראל' הנמצא לידה?", aEn: "Latrun", aHe: "לטרון", wEn: ["Modi\\'in", "Jerusalem", "Kiryat Gat"], wHe: ["מודיעין", "ירושלים", "קריית גת"], e: "🕍", l: 2 },

    // --- STATISTICS & INDUSTRY ---
    { qEn: "Which city has the largest population in Israel?", qHe: "מהי העיר הגדולה ביותר בישראל מבחינת מספר תושבים?", aEn: "Jerusalem", aHe: "ירושלים", wEn: ["Tel Aviv", "Haifa", "Rishon LeZion"], wHe: ["תל אביב", "חיפה", "ראשון לציון"], e: "🏙️", l: 1 },
    { qEn: "Which city has the largest port in Israel?", qHe: "באיזו עיר נמצא הנמל הגדול בישראל?", aEn: "Ashdod", aHe: "אשדוד", wEn: ["Haifa", "Eilat", "Ashkelon"], wHe: ["חיפה", "אילת", "אשקלון"], e: "🚢", l: 1 },
    { qEn: "Which city is the world center for the high-tech 'Check Point' company?", qHe: "איזו עיר היא המרכז העולמי של חברת ההייטק 'צ'ק פוינט'?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Herzliyya", "Ra\\'anana", "Petah Tikva"], wHe: ["הרצלייה", "רעננה", "פתח תקווה"], e: "💻", l: 2 },
    { qEn: "Which city has the largest railway station in Israel (HaShalom)?", qHe: "באיזו עיר נמצאת תחנת הרכבת הגדולה בישראל (השלום)?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Haifa", "Jerusalem", "Herzliyya"], wHe: ["חיפה", "ירושלים", "הרצלייה"], e: "🚂", l: 2 },
    { qEn: "Which city is known for the 'Intel' processor fabrication plant?", qHe: "איזו עיר ידועה במפעל ייצור השבבים של 'אינטל'?", aEn: "Kiryat Gat", aHe: "קריית גת", wEn: ["Yokneam", "Haifa", "Jerusalem"], wHe: ["יקנעם", "חיפה", "ירושלים"], e: "💻", l: 2 },
    { qEn: "Which city is home to the 'Tnuva' dairy company's main headquarters?", qHe: "איזו עיר היא ביתה של הנהלת חברת 'תנובה' ומפעלים שלה?", aEn: "Rehovot", aHe: "רחובות", wEn: ["Tel Aviv", "Ra\\'anana", "Ashdod"], wHe: ["תל אביב", "רעננה", "אשדוד"], e: "🥛", l: 3 },
    { qEn: "Which city is known as the 'City of Orchards' (Ir HaHadarim)?", qHe: "איזו עיר מכונה 'עיר ההדרים'?", aEn: "Rehovot", aHe: "רחובות", wEn: ["Hadera", "Netanya", "Kfar Saba"], wHe: ["חדרה", "נתניה", "כפר סבא"], e: "🍊", l: 2 },
    { qEn: "Which city has the largest stadium in Israel (Teddy)?", qHe: "באיזו עיר נמצא האיצטדיון הגדול בישראל (טדי)?", aEn: "Jerusalem", aHe: "ירושלים", wEn: ["Haifa", "Tel Aviv", "Ramat Gan"], wHe: ["חיפה", "תל אביב", "רמת גן"], e: "⚽", l: 1 },
    { qEn: "Which city is the center of the 'Amidar' housing company history?", qHe: "איזו עיר מזוהה עם ההיסטוריה של שיכוני 'עמידר' הראשונים?", aEn: "Ramat Gan", aHe: "רמת גן", wEn: ["Petah Tikva", "Lod", "Ramla"], wHe: ["פתח תקווה", "לוד", "רמלה"], e: "🏢", l: 3 },

    // --- SPECIAL INTEREST ---
    { qEn: "Which city is home to the world\\'s only 'Children\\'s Museum' of its kind?", qHe: "באיזו עיר נמצא 'מוזיאון הילדים' היחיד מסוגו בעולם?", aEn: "Holon", aHe: "חולון", wEn: ["Tel Aviv", "Bat Yam", "Ramat Gan"], wHe: ["תל אביב", "בת ים", "רמת גן"], e: "🧒", l: 1 },
    { qEn: "Which city is famous for its 'Glass Museum' founded by Gideon Fridman?", qHe: "איזו עיר מפורסמת ב'מוזיאון הזכוכית' שוכן בה?", aEn: "Arad", aHe: "ערד", wEn: ["Katzrin", "Eilat", "Dimona"], wHe: ["קצרין", "אילת", "דימונה"], e: "🧪", l: 3 },
    { qEn: "Which city is known for its high concentration of 'International Style' architecture?", qHe: "איזו עיר ידועה בריכוז הגבוה ביותר של אדריכלות בסגנון 'הבינלאומי'?", aEn: "Tel Aviv", aHe: "תל אביב", wEn: ["Haifa", "Jerusalem", "Beer Sheva"], wHe: ["חיפה", "ירושלים", "באר שבע"], e: "🏠", l: 2 },
    { qEn: "Which city has the oldest active port in the world?", qHe: "באיזו עיר נמצא הנמל הפעיל העתיק ביותר בעולם?", aEn: "Jaffa", aHe: "יפו", wEn: ["Akko", "Sidon", "Tyre"], wHe: ["עכו", "צידון", "צור"], e: "🛶", l: 2 },
    { qEn: "Which city is known for the 'Kinneret' Sea water level marker (The Galilee)?", qHe: "איזו עיר ידועה בסימון מפלס המים של הכנרת?", aEn: "Tiberias", aHe: "טבריה", wEn: ["Zefat", "Katzrin", "Hatzor HaGlilit"], wHe: ["צפת", "קצרין", "חצור הגלילית"], e: "💧", l: 1 },
];

// Add template questions from CSV
processedData.forEach(city => {
    if (city.year && city.year < 1920) {
        factQuestions.push({
            qEn: `In which year was the town of ${city.nameEn} founded?`,
            qHe: `באיזו שנה נוסד היישוב ${city.nameHe}?`,
            aEn: city.year.toString(),
            aHe: city.year.toString(),
            wEn: [(city.year - 15).toString(), (city.year + 20).toString(), "1948"],
            wHe: [(city.year - 15).toString(), (city.year + 20).toString(), "1948"],
            e: "📜", l: 3
        });
    }
});

// Map to final format
factQuestions.forEach((q, i) => {
    const optsEn = shuffle([q.aEn, ...q.wEn]);
    const optsHe = shuffle([q.aHe, ...q.wHe]);
    qualitative.push({
        id: `israel_geo_fact_${i}`,
        category: "israel_cities",
        subCategory: "qualitative",
        templateId: "israel-city-fact",
        level: q.l || 2,
        emoji: q.e || "💡",
        text: { en: q.qEn, he: q.qHe },
        options: { en: optsEn, he: optsHe },
        correctAnswer: optsEn.indexOf(q.aEn)
    });
});

// Ensure variety in districts and fill to 215
const districts = {
    'הדרום': { en: 'South', he: 'דרום' },
    'הצפון': { en: 'North', he: 'צפון' },
    'המרכז': { en: 'Central', he: 'מרכז' },
    'תל אביב': { en: 'Tel Aviv', he: 'תל אביב' },
    'חיפה': { en: 'Haifa', he: 'חיפה' },
    'ירושלים': { en: 'Jerusalem', he: 'ירושלים' },
    'יהודה והשומרון': { en: 'Judea and Samaria', he: 'יהודה ושומרון' }
};

const districtOptions = Object.values(districts);
const usedQualitative = new Set();

while (qualitative.length < 215) {
    const city = randomItem(processedData);
    const type = qualitative.length % 3;
    const comboKey = `${city.nameEn}_${type}`;
    if (usedQualitative.has(comboKey)) continue;
    usedQualitative.add(comboKey);

    const districtInfo = districts[city.districtHe] || { en: 'Central', he: 'מרכז' };
    if (type === 0) {
        // District Question
        const level = city.pop > 50000 ? 1 : 2;
        const opts = shuffle(districtOptions.map(d => d.en)).slice(0, 4);
        if (!opts.includes(districtInfo.en)) opts[0] = districtInfo.en;
        const sortedOptsEn = shuffle(opts);
        const sortedOptsHe = sortedOptsEn.map(en => districtOptions.find(d => d.en === en).he);

        qualitative.push({
            id: `israel_geo_fact_dist_${qualitative.length}`,
            category: "israel_cities",
            subCategory: "qualitative",
            templateId: "israel-city-district",
            level: level,
            emoji: "🗺️",
            text: { en: `In which district is the city of ${city.nameEn} located?`, he: `באיזה מחוז נמצאת העיר ${city.nameHe}?` },
            options: { en: sortedOptsEn, he: sortedOptsHe },
            correctAnswer: sortedOptsEn.indexOf(districtInfo.en)
        });
    } else if (type === 1) {
        // Boolean Question
        const isTrue = Math.random() > 0.5;
        const displayDistrict = isTrue ? districtInfo : randomItem(districtOptions.filter(d => d.en !== districtInfo.en));
        qualitative.push({
            id: `israel_geo_fact_bool_${qualitative.length}`,
            category: "israel_cities",
            subCategory: "qualitative",
            templateId: "israel-city-bool",
            level: city.pop > 20000 ? 1 : 2,
            emoji: "🧐",
            text: { en: `Is ${city.nameEn} located in the ${displayDistrict.en} district?`, he: `האם ${city.nameHe} נמצאת במחוז ${displayDistrict.he}?` },
            options: { en: ["Yes", "No"], he: ["כן", "לא"] },
            correctAnswer: isTrue ? 0 : 1
        });
    } else {
        // Large/Small Question
        const otherCity = randomItem(processedData);
        if (Math.abs(city.pop - otherCity.pop) < 5000) continue; // Skip if too close
        const isLarger = city.pop > otherCity.pop;
        qualitative.push({
            id: `israel_geo_fact_size_${qualitative.length}`,
            category: "israel_cities",
            subCategory: "qualitative",
            templateId: "israel-city-size",
            level: 2,
            emoji: "⚖️",
            text: {
                en: `Which city has a larger population: ${city.nameEn} or ${otherCity.nameEn}?`,
                he: `למי יש אוכלוסייה גדולה יותר: ${city.nameHe} או ${otherCity.nameHe}?`
            },
            options: {
                en: [city.nameEn, otherCity.nameEn].sort(),
                he: [city.nameHe, otherCity.nameHe].sort()
            },
            correctAnswer: [city.nameEn, otherCity.nameEn].sort().indexOf(isLarger ? city.nameEn : otherCity.nameEn)
        });
    }
}

const finalQuestions = shuffle([...questions, ...qualitative]);

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
const filteredLines = lines.filter(line => {
    const hasCategory = line.match(/"category"\s*:\s*"israel_(cities|geo|geography)"/);
    const isStray = line.match(/"id"\s*:\s*"q_iz_/) || line.match(/"id"\s*:\s*"israel_geo_/);
    return !hasCategory && !isStray;
});
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
