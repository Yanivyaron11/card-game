import fs from 'fs';

const countriesData = [
    { en: 'France', he: 'צרפת', capEn: 'Paris', capHe: 'פריז', contEn: 'Europe', contHe: 'אירופה', landEn: 'Eiffel Tower', landHe: 'מגדל אייפל', currEn: 'Euro', currHe: 'אירו', flag: '🇫🇷', lvl: 1 },
    { en: 'Italy', he: 'איטליה', capEn: 'Rome', capHe: 'רומא', contEn: 'Europe', contHe: 'אירופה', landEn: 'Colosseum', landHe: 'הקולוסיאום', currEn: 'Euro', currHe: 'אירו', flag: '🇮🇹', lvl: 1 },
    { en: 'Japan', he: 'יפן', capEn: 'Tokyo', capHe: 'טוקיו', contEn: 'Asia', contHe: 'אסיה', landEn: 'Mount Fuji', landHe: 'הר פוג\'י', currEn: 'Yen', currHe: 'ין', flag: '🇯🇵', lvl: 1 },
    { en: 'USA', he: 'ארה"ב', capEn: 'Washington D.C.', capHe: 'וושינגטון די.סי.', contEn: 'North America', contHe: 'צפון אמריקה', landEn: 'Statue of Liberty', landHe: 'פסל החירות', currEn: 'US Dollar', currHe: 'דולר אמריקאי', flag: '🇺🇸', lvl: 1 },
    { en: 'United Kingdom', he: 'בריטניה', capEn: 'London', capHe: 'לונדון', contEn: 'Europe', contHe: 'אירופה', landEn: 'Big Ben', landHe: 'הביג בן', currEn: 'Pound', currHe: 'לירה שטרלינג', flag: '🇬🇧', lvl: 1 },
    { en: 'Egypt', he: 'מצרים', capEn: 'Cairo', capHe: 'קהיר', contEn: 'Africa', contHe: 'אפריקה', landEn: 'Pyramids of Giza', landHe: 'הפירמידות בגיזה', currEn: 'Egyptian Pound', currHe: 'לירה מצרית', flag: '🇪🇬', lvl: 1 },
    { en: 'Brazil', he: 'ברזיל', capEn: 'Brasilia', capHe: 'ברזיליה', contEn: 'South America', contHe: 'דרום אמריקה', landEn: 'Christ the Redeemer', landHe: 'פסל ישו הגואל', currEn: 'Real', currHe: 'ריאל', flag: '🇧🇷', lvl: 1 },
    { en: 'China', he: 'סין', capEn: 'Beijing', capHe: 'בייג\'ינג', contEn: 'Asia', contHe: 'אסיה', landEn: 'Great Wall of China', landHe: 'החומה הסינית', currEn: 'Yuan', currHe: 'יואן', flag: '🇨🇳', lvl: 1 },
    { en: 'India', he: 'הודו', capEn: 'New Delhi', capHe: 'ניו דלהי', contEn: 'Asia', contHe: 'אסיה', landEn: 'Taj Mahal', landHe: 'הטאג\' מהאל', currEn: 'Rupee', currHe: 'רופי', flag: '🇮🇳', lvl: 1 },
    { en: 'Australia', he: 'אוסטרליה', capEn: 'Canberra', capHe: 'קנברה', contEn: 'Australia', contHe: 'אוסטרליה', landEn: 'Sydney Opera House', landHe: 'בית האופרה של סידני', currEn: 'Australian Dollar', currHe: 'דולר אוסטרלי', flag: '🇦🇺', lvl: 1 },

    { en: 'Spain', he: 'ספרד', capEn: 'Madrid', capHe: 'מדריד', contEn: 'Europe', contHe: 'אירופה', landEn: 'Sagrada Familia', landHe: 'סגרדה פמיליה', currEn: 'Euro', currHe: 'אירו', flag: '🇪🇸', lvl: 2 },
    { en: 'Germany', he: 'גרמניה', capEn: 'Berlin', capHe: 'ברלין', contEn: 'Europe', contHe: 'אירופה', landEn: 'Brandenburg Gate', landHe: 'שער ברנדנבורג', currEn: 'Euro', currHe: 'אירו', flag: '🇩🇪', lvl: 2 },
    { en: 'Mexico', he: 'מקסיקו', capEn: 'Mexico City', capHe: 'מקסיקו סיטי', contEn: 'North America', contHe: 'צפון אמריקה', landEn: 'Chichen Itza', landHe: 'צ\'יצ\'ן איצה', currEn: 'Peso', currHe: 'פזו', flag: '🇲🇽', lvl: 2 },
    { en: 'Canada', he: 'קנדה', capEn: 'Ottawa', capHe: 'אוטווה', contEn: 'North America', contHe: 'צפון אמריקה', landEn: 'CN Tower', landHe: 'מגדל סי אן', currEn: 'Canadian Dollar', currHe: 'דולר קנדי', flag: '🇨🇦', lvl: 2 },
    { en: 'Russia', he: 'רוסיה', capEn: 'Moscow', capHe: 'מוסקבה', contEn: 'Europe/Asia', contHe: 'אירופה/אסיה', landEn: 'Red Square', landHe: 'הכיכר האדומה', currEn: 'Ruble', currHe: 'רובל', flag: '🇷🇺', lvl: 2 },
    { en: 'Argentina', he: 'ארגנטינה', capEn: 'Buenos Aires', capHe: 'בואנוס איירס', contEn: 'South America', contHe: 'דרום אמריקה', landEn: 'Iguazu Falls', landHe: 'מפלי האיגואסו', currEn: 'Peso', currHe: 'פזו', flag: '🇦🇷', lvl: 2 },
    { en: 'South Africa', he: 'דרום אפריקה', capEn: 'Pretoria', capHe: 'פרטוריה', contEn: 'Africa', contHe: 'אפריקה', landEn: 'Table Mountain', landHe: 'הר השולחן', currEn: 'Rand', currHe: 'ראנד', flag: '🇿🇦', lvl: 2 },
    { en: 'Thailand', he: 'תאילנד', capEn: 'Bangkok', capHe: 'בנגקוק', contEn: 'Asia', contHe: 'אסיה', landEn: 'Grand Palace', landHe: 'ארמון המלך', currEn: 'Baht', currHe: 'בהט', flag: '🇹🇭', lvl: 2 },
    { en: 'Greece', he: 'יוון', capEn: 'Athens', capHe: 'אתונה', contEn: 'Europe', contHe: 'אירופה', landEn: 'Acropolis', landHe: 'האקרופוליס', currEn: 'Euro', currHe: 'אירו', flag: '🇬🇷', lvl: 2 },
    { en: 'Turkey', he: 'טורקיה', capEn: 'Ankara', capHe: 'אנקרה', contEn: 'Europe/Asia', contHe: 'אירופה/אסיה', landEn: 'Hagia Sophia', landHe: 'איה סופיה', currEn: 'Lira', currHe: 'לירה טורקית', flag: '🇹🇷', lvl: 2 },

    { en: 'Peru', he: 'פרו', capEn: 'Lima', capHe: 'לימה', contEn: 'South America', contHe: 'דרום אמריקה', landEn: 'Machu Picchu', landHe: 'מאצ\'ו פיצ\'ו', currEn: 'Sol', currHe: 'סול', flag: '🇵🇪', lvl: 3 },
    { en: 'New Zealand', he: 'ניו זילנד', capEn: 'Wellington', capHe: 'וולינגטון', contEn: 'Oceania', contHe: 'אוקיאניה', landEn: 'Milford Sound', landHe: 'מילפורד סאונד', currEn: 'NZ Dollar', currHe: 'דולר ניו זילנדי', flag: '🇳🇿', lvl: 3 },
    { en: 'Vietnam', he: 'וייטנאם', capEn: 'Hanoi', capHe: 'האנוי', contEn: 'Asia', contHe: 'אסיה', landEn: 'Ha Long Bay', landHe: 'מפרץ הא לונג', currEn: 'Dong', currHe: 'דונג', flag: '🇻🇳', lvl: 3 },
    { en: 'Kenya', he: 'קניה', capEn: 'Nairobi', capHe: 'ניירובי', contEn: 'Africa', contHe: 'אפריקה', landEn: 'Maasai Mara', landHe: 'מסאי מארה', currEn: 'Shilling', currHe: 'שילינג קנייתי', flag: '🇰🇪', lvl: 3 },
    { en: 'Sweden', he: 'שוודיה', capEn: 'Stockholm', capHe: 'שטוקהולם', contEn: 'Europe', contHe: 'אירופה', landEn: 'Vasa Museum', landHe: 'מוזיאון ואסה', currEn: 'Krona', currHe: 'קרונה שוודית', flag: '🇸🇪', lvl: 3 },
    { en: 'Norway', he: 'נורווגיה', capEn: 'Oslo', capHe: 'אוסלו', contEn: 'Europe', contHe: 'אירופה', landEn: 'Trolltunga', landHe: 'טרולטונגה', currEn: 'Krone', currHe: 'קרונה נורווגית', flag: '🇳🇴', lvl: 3 },
    { en: 'Colombia', he: 'קולומביה', capEn: 'Bogota', capHe: 'בוגוטה', contEn: 'South America', contHe: 'דרום אמריקה', landEn: 'Salt Cathedral', landHe: 'קתדרלת המלח', currEn: 'Peso', currHe: 'פזו', flag: '🇨🇴', lvl: 3 },
    { en: 'Portugal', he: 'פורטוגל', capEn: 'Lisbon', capHe: 'ליסבון', contEn: 'Europe', contHe: 'אירופה', landEn: 'Belem Tower', landHe: 'מגדל בלן', currEn: 'Euro', currHe: 'אירו', flag: '🇵🇹', lvl: 3 },
    { en: 'Morocco', he: 'מרוקו', capEn: 'Rabat', capHe: 'רבאט', contEn: 'Africa', contHe: 'אפריקה', landEn: 'Jemaa el-Fnaa', landHe: 'ג\'אמע אל-פנא', currEn: 'Dirham', currHe: 'דירהם', flag: '🇲🇦', lvl: 3 },
    { en: 'South Korea', he: 'דרום קוריאה', capEn: 'Seoul', capHe: 'סיאול', contEn: 'Asia', contHe: 'אסיה', landEn: 'Gyeongbokgung Palace', landHe: 'ארמון גיונגבוקגונג', currEn: 'Won', currHe: 'וון', flag: '🇰🇷', lvl: 3 }
];

const continentsEn = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'];
const continentsHe = ['אירופה', 'אסיה', 'אפריקה', 'צפון אמריקה', 'דרום אמריקה', 'אוקיאניה', 'אנטארקטיקה'];

let generatedQuestions = [];
let qCount = 0;

function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    if (qCount >= 100) return;
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    generatedQuestions.push(`    { category: 'countries', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
    qCount++;
}

function getRandomDistractors(arr, count, exclude) {
    const pool = arr.filter(item => item !== exclude);
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
}

// 1. Capital Cities (All levels based on country level)
for (const country of countriesData) {
    if (qCount >= 30) break;
    const distractorsEn = getRandomDistractors(countriesData.map(c => c.capEn), 3, country.capEn);
    const distractorsHe = distractorsEn.map(dEn => countriesData.find(c => c.capEn === dEn).capHe);

    addQuestion(
        country.lvl,
        `What is the capital of ${country.en}?`,
        `מהי עיר הבירה של ${country.he}?`,
        country.capEn, country.capHe,
        distractorsEn, distractorsHe,
        country.flag || '🏛️'
    );
}

// 2. Continents (Levels 1 & 2)
for (const country of countriesData) {
    if (qCount >= 55) break;
    // skip multi-cont for simplicity here
    if (country.contEn.includes('/')) continue;

    const distractorsEn = getRandomDistractors(continentsEn, 3, country.contEn);
    const distractorsHe = distractorsEn.map(dEn => continentsHe[continentsEn.indexOf(dEn)]);

    addQuestion(
        country.lvl === 3 ? 2 : country.lvl,
        `Which continent is ${country.en} located in?`,
        `באיזו יבשת נמצאת ${country.he}?`,
        country.contEn, country.contHe,
        distractorsEn, distractorsHe,
        '🌍'
    );
}

// 3. Landmarks (Level 2 & 3)
for (const country of countriesData) {
    if (qCount >= 80) break;
    const distractorsEn = getRandomDistractors(countriesData.map(c => c.en), 3, country.en);
    const distractorsHe = distractorsEn.map(dEn => countriesData.find(c => c.en === dEn).he);

    addQuestion(
        Math.max(2, country.lvl),
        `Which country is home to the ${country.landEn}?`,
        `באיזו מדינה נמצא ${country.landHe}?`,
        country.en, country.he,
        distractorsEn, distractorsHe,
        '📸'
    );
}

// 4. Currencies (Level 2 & 3)
for (const country of countriesData) {
    if (qCount >= 100) break;
    const distractorsEn = getRandomDistractors(countriesData.map(c => c.currEn), 3, country.currEn);
    const distractorsHe = distractorsEn.map(dEn => countriesData.find(c => c.currEn === dEn).currHe);

    addQuestion(
        Math.max(2, country.lvl),
        `What is the official currency of ${country.en}?`,
        `מהו המטבע הרשמי של ${country.he}?`,
        country.currEn, country.currHe,
        distractorsEn, distractorsHe,
        '💰'
    );
}

// Loop to top up to 100 if needed (mixed bag)
while (qCount < 100) {
    const c = countriesData[Math.floor(Math.random() * countriesData.length)];
    const type = Math.floor(Math.random() * 3); // 0=Capital, 1=Landmark, 2=Flag

    if (type === 0) {
        const distractorsEn = getRandomDistractors(countriesData.map(c => c.en), 3, c.en);
        const distractorsHe = distractorsEn.map(dEn => countriesData.find(x => x.en === dEn).he);
        addQuestion(c.lvl, `Which country has ${c.capEn} as its capital?`, `לאיזו מדינה יש בירה בשם ${c.capHe}?`, c.en, c.he, distractorsEn, distractorsHe, '📍');
    } else if (type === 1) {
        const distractorsEn = getRandomDistractors(countriesData.map(c => c.landEn), 3, c.landEn);
        const distractorsHe = distractorsEn.map(dEn => countriesData.find(x => x.landEn === dEn).landHe);
        addQuestion(Math.max(2, c.lvl), `What famous landmark is located in ${c.en}?`, `איזה אתר מפורסם נמצא ב${c.he}?`, c.landEn, c.landHe, distractorsEn, distractorsHe, '🗺️');
    } else {
        const distractorsEn = getRandomDistractors(countriesData.map(c => c.en), 3, c.en);
        const distractorsHe = distractorsEn.map(dEn => countriesData.find(x => x.en === dEn).he);
        addQuestion(Math.min(2, c.lvl), `Which country does this flag belong to: ${c.flag}?`, `לאיזו מדינה שייך הדגל הבא: ${c.flag}?`, c.en, c.he, distractorsEn, distractorsHe, c.flag);
    }
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
console.log(`Successfully injected 100 Countries questions into questions.js`);
