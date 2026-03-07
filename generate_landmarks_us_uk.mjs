import fs from 'fs';

const usaData = [
    { en: 'Statue of Liberty', he: 'פסל החירות', cityEn: 'New York', cityHe: 'ניו יורק' },
    { en: 'Golden Gate Bridge', he: 'גשר שער הזהב', cityEn: 'San Francisco', cityHe: 'סן פרנסיסקו' },
    { en: 'Mount Rushmore', he: 'הר רשמור', cityEn: 'South Dakota', cityHe: 'דקוטה הדרומית' },
    { en: 'Grand Canyon', he: 'הגרנד קניון', cityEn: 'Arizona', cityHe: 'אריזונה' },
    { en: 'White House', he: 'הבית הלבן', cityEn: 'Washington D.C.', cityHe: 'וושינגטון די.סי.' },
    { en: 'Empire State Building', he: 'בניין האמפייר סטייט', cityEn: 'New York', cityHe: 'ניו יורק' },
    { en: 'Hollywood Sign', he: 'שלט הוליווד', cityEn: 'Los Angeles', cityHe: 'לוס אנג\'לס' },
    { en: 'Gateway Arch', he: 'קשת השער', cityEn: 'St. Louis', cityHe: 'סנט לואיס' },
    { en: 'Lincoln Memorial', he: 'אנדרטת לינקולן', cityEn: 'Washington D.C.', cityHe: 'וושינגטון די.סי.' },
    { en: 'Space Needle', he: 'מחט החלל', cityEn: 'Seattle', cityHe: 'סיאטל' },
    { en: 'Alcatraz Island', he: 'אי אלקטרז', cityEn: 'San Francisco', cityHe: 'סן פרנסיסקו' },
    { en: 'Yellowstone', he: 'פארק ילוסטון', cityEn: 'Wyoming', cityHe: 'ויומינג' },
    { en: 'Times Square', he: 'טיימס סקוור', cityEn: 'New York', cityHe: 'ניו יורק' },
    { en: 'Hoover Dam', he: 'סכר הובר', cityEn: 'Nevada', cityHe: 'נבדה' },
    { en: 'Central Park', he: 'סנטרל פארק', cityEn: 'New York', cityHe: 'ניו יורק' }
];

const ukData = [
    { en: 'Big Ben', he: 'הביג בן', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'Stonehenge', he: 'סטונהנג\'', cityEn: 'Wiltshire', cityHe: 'וילטשייר' },
    { en: 'Tower of London', he: 'מצודת לונדון', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'Buckingham Palace', he: 'ארמון בקינגהאם', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'London Eye', he: 'הלונדון איי (עין לונדון)', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'Edinburgh Castle', he: 'טירת אדינבורו', cityEn: 'Edinburgh', cityHe: 'אדינבורו' },
    { en: 'Tower Bridge', he: 'גשר המצודה', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'The Shard', he: 'מגדל השארד', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'Windsor Castle', he: 'טירת וינדזור', cityEn: 'Berkshire', cityHe: 'ברקשייר' },
    { en: 'St Paul\'s Cathedral', he: 'קתדרלת סנט פול', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'Westminster Abbey', he: 'מנזר וסטמינסטר', cityEn: 'London', cityHe: 'לונדון' },
    { en: 'Hadrian\'s Wall', he: 'חומת אדריאנוס', cityEn: 'Northern England', cityHe: 'צפון אנגליה' },
    { en: 'Loch Ness', he: 'לוך נס', cityEn: 'Scotland', cityHe: 'סקוטלנד' },
    { en: 'Roman Baths', he: 'המרחצאות הרומיים', cityEn: 'Bath', cityHe: 'באת\'' },
    { en: 'Giant\'s Causeway', he: 'סוללת הענק', cityEn: 'Northern Ireland', cityHe: 'צפון אירלנד' }
];

let generatedQuestions = [];

function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    generatedQuestions.push(`    { category: 'countries', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
}

function getRandomDistractors(arr, count, exclude) {
    const pool = arr.filter(item => item !== exclude);
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Generate USA Questions (Target: 50)
let usaCount = 0;

// Type 1: In which US city/state is [Landmark]? (Level 2)
for (const lm of usaData) {
    if (usaCount >= 15) break;
    const distractorCitiesEn = getRandomDistractors([...new Set(usaData.map(l => l.cityEn))], 3, lm.cityEn);
    const distractorCitiesHe = distractorCitiesEn.map(dEn => usaData.find(l => l.cityEn === dEn).cityHe);

    // Fallback if we don't have enough unique cities:
    while (distractorCitiesEn.length < 3) {
        const fallbackEn = ['Chicago', 'Miami', 'Boston', 'Houston'];
        const fallbackHe = ['שיקגו', 'מיאמי', 'בוסטון', 'יוסטון'];
        const p = Math.floor(Math.random() * 4);
        if (!distractorCitiesEn.includes(fallbackEn[p])) {
            distractorCitiesEn.push(fallbackEn[p]);
            distractorCitiesHe.push(fallbackHe[p]);
        }
    }

    addQuestion(
        2,
        `Where in the USA can you find the ${lm.en}?`,
        `היכן בארה"ב ניתן למצוא את ${lm.he}?`,
        lm.cityEn, lm.cityHe,
        distractorCitiesEn, distractorCitiesHe,
        '🗽'
    );
    usaCount++;
}

// Type 2: Which of these is a famous landmark in the USA? (Level 3)
for (const lm of usaData) {
    if (usaCount >= 30) break;
    const distractorsForeignEn = ['Eiffel Tower', 'Colosseum', 'Taj Mahal', 'Big Ben', 'Stonehenge', 'Machu Picchu'];
    const distractorsForeignHe = ['מגדל אייפל', 'הקולוסיאום', 'הטאג\' מהאל', 'הביג בן', 'סטונהנג\'', 'מאצ\'ו פיצ\'ו'];
    const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).slice(0, 3);

    addQuestion(
        3,
        `Which of these famous landmarks is located in the United States?`,
        `איזה מהאתרים המפורסמים הבאים נמצא בארצות הברית?`,
        lm.en, lm.he,
        [distractorsForeignEn[indices[0]], distractorsForeignEn[indices[1]], distractorsForeignEn[indices[2]]],
        [distractorsForeignHe[indices[0]], distractorsForeignHe[indices[1]], distractorsForeignHe[indices[2]]],
        '🇺🇸'
    );
    usaCount++;
}

// Type 3: Mix to reach 50
while (usaCount < 50) {
    const lm = usaData[Math.floor(Math.random() * usaData.length)];
    const countryDistractorsEn = ['Canada', 'United Kingdom', 'France', 'Germany', 'Australia'];
    const countryDistractorsHe = ['קנדה', 'בריטניה', 'צרפת', 'גרמניה', 'אוסטרליה'];
    const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5).slice(0, 3);

    addQuestion(
        2,
        `In which country is the ${lm.en} located?`,
        `באיזו מדינה ממוקם ${lm.he}?`,
        'United States', 'ארצות הברית',
        [countryDistractorsEn[indices[0]], countryDistractorsEn[indices[1]], countryDistractorsEn[indices[2]]],
        [countryDistractorsHe[indices[0]], countryDistractorsHe[indices[1]], countryDistractorsHe[indices[2]]],
        '🌎'
    );
    usaCount++;
}

// Generate UK Questions (Target: 50)
let ukCount = 0;

// Type 1: In which UK city/region is [Landmark]? (Level 2)
for (const lm of ukData) {
    if (ukCount >= 15) break;
    const distractorCitiesEn = getRandomDistractors([...new Set(ukData.map(l => l.cityEn))], 3, lm.cityEn);
    const distractorCitiesHe = distractorCitiesEn.map(dEn => ukData.find(l => l.cityEn === dEn).cityHe);

    // fallback
    while (distractorCitiesEn.length < 3) {
        const fallbackEn = ['Manchester', 'Liverpool', 'Birmingham', 'Glasgow'];
        const fallbackHe = ['מנצ\'סטר', 'ליברפול', 'ברמינגהאם', 'גלאזגו'];
        const p = Math.floor(Math.random() * 4);
        if (!distractorCitiesEn.includes(fallbackEn[p])) {
            distractorCitiesEn.push(fallbackEn[p]);
            distractorCitiesHe.push(fallbackHe[p]);
        }
    }

    addQuestion(
        2,
        `Where in the UK is ${lm.en} located?`,
        `היכן בבריטניה ממוקם ${lm.he}?`,
        lm.cityEn, lm.cityHe,
        distractorCitiesEn, distractorCitiesHe,
        '💂'
    );
    ukCount++;
}

// Type 2: Which of these is a famous landmark in the UK? (Level 3)
for (const lm of ukData) {
    if (ukCount >= 30) break;
    const distractorsForeignEn = ['Eiffel Tower', 'Statue of Liberty', 'Taj Mahal', 'Colosseum', 'Golden Gate Bridge', 'Machu Picchu'];
    const distractorsForeignHe = ['מגדל אייפל', 'פסל החירות', 'הטאג\' מהאל', 'הקולוסיאום', 'גשר שער הזהב', 'מאצ\'ו פיצ\'ו'];
    const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).slice(0, 3);

    addQuestion(
        3,
        `Which of these famous landmarks is located in the United Kingdom?`,
        `איזה מהאתרים המפורסמים הבאים נמצא בבריטניה?`,
        lm.en, lm.he,
        [distractorsForeignEn[indices[0]], distractorsForeignEn[indices[1]], distractorsForeignEn[indices[2]]],
        [distractorsForeignHe[indices[0]], distractorsForeignHe[indices[1]], distractorsForeignHe[indices[2]]],
        '🇬🇧'
    );
    ukCount++;
}

// Type 3: Mix to reach 50
while (ukCount < 50) {
    const lm = ukData[Math.floor(Math.random() * ukData.length)];
    const countryDistractorsEn = ['United States', 'France', 'Italy', 'Spain', 'Germany'];
    const countryDistractorsHe = ['ארה"ב', 'צרפת', 'איטליה', 'ספרד', 'גרמניה'];
    const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5).slice(0, 3);

    addQuestion(
        2,
        `In which country is ${lm.en} located?`,
        `באיזו מדינה ממוקם ${lm.he}?`,
        'United Kingdom', 'בריטניה',
        [countryDistractorsEn[indices[0]], countryDistractorsEn[indices[1]], countryDistractorsEn[indices[2]]],
        [countryDistractorsHe[indices[0]], countryDistractorsHe[indices[1]], countryDistractorsHe[indices[2]]],
        '🏰'
    );
    ukCount++;
}

const content = fs.readFileSync('src/data/questions.js', 'utf8');
const lines = content.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('];')) {
        lines.splice(i, 0, generatedQuestions.join(',\n') + ',');
        break;
    }
}

fs.writeFileSync('src/data/questions.js', lines.join('\n'));
console.log(`Successfully injected 50 USA and 50 UK landmark questions into questions.js`);
