import fs from 'fs';

const frenchPastries = [
    { en: 'Croissant', he: 'קרואסון', descEn: 'A buttery, flaky, crescent-shaped pastry', descHe: 'מאפה חמאתי בצורת סהר', emoji: '🥐' },
    { en: 'Macaron', he: 'מקרון', descEn: 'A sweet meringue-based confection', descHe: 'עוגייה מתוקה מבוססת מרנג', emoji: '🍡' },
    { en: 'Éclair', he: 'אקלר', descEn: 'An oblong pastry filled with cream and topped with icing', descHe: 'מאפה מאורך ממולא בקרם ומצופה בזיגוג', emoji: '🥖' },
    { en: 'Mille-feuille', he: 'מילפיי / קרמשניט', descEn: 'A dessert made of puff pastry layered with pastry cream', descHe: 'קינוח של בצק עלים בשכבות עם קרם פטיסייר', emoji: '🍰' },
    { en: 'Profiterole', he: 'פחזנית', descEn: 'A filled French choux pastry ball', descHe: 'כדור בצק רבוך ממולא בקרם', emoji: '🧁' },
    { en: 'Crème Brûlée', he: 'קרם ברולה', descEn: 'A rich custard base topped with a layer of hardened caramelized sugar', descHe: 'קרם עשיר עם שכבת סוכר מקורמל קשה מעליו', emoji: '🍮' },
    { en: 'Madeleine', he: 'מדלן', descEn: 'A traditional small cake shaped like a shell', descHe: 'עוגה קטנה מסורתית בצורת צדף', emoji: '🐚' },
    { en: 'Tarte Tatin', he: 'טארט טאטן', descEn: 'An upside-down pastry with fruit caramelized in butter and sugar', descHe: 'טארט הפוך עם פירות מקורמלים', emoji: '🥧' },
    { en: 'Canelé', he: 'קנלה', descEn: 'A small French pastry flavored with rum and vanilla', descHe: 'מאפה צרפתי קטן בטעם רום ווניל', emoji: '🍮' },
    { en: 'Paris-Brest', he: 'פריז-ברסט', descEn: 'A dessert made of choux pastry and a praline flavored cream', descHe: 'קינוח מבצק רבוך וקרם פרלינה בצורת גלגל', emoji: '🍩' },
    { en: 'Soufflé', he: 'סופלה', descEn: 'A baked egg-based dish that puffs up', descHe: 'מאפה על בסיס ביצים שתופח מאוד באפייה', emoji: '🧁' },
    { en: 'Financier', he: 'פיננסייר', descEn: 'A small French almond cake, baked in a mold', descHe: 'עוגת שקדים צרפתית קטנה', emoji: '🥮' },
    { en: 'Clafoutis', he: 'קלאפוטי', descEn: 'A baked French dessert of fruit, traditionally black cherries', descHe: 'קינוח אפוי של פירות, לרוב דובדבנים שחורים', emoji: '🍒' },
    { en: 'Kouign-amann', he: 'קווין אמאן', descEn: 'A sweet Breton cake made with laminated dough', descHe: 'עוגת שמרים וסוכר מקורמל בקצוות', emoji: '🥨' }
];

const globalDesserts = [
    { en: 'Tiramisu', he: 'טירמיסו', countryEn: 'Italy', countryHe: 'איטליה', emoji: '☕' },
    { en: 'Churros', he: 'צ\'ורוס', countryEn: 'Spain', countryHe: 'ספרד', emoji: '🥖' },
    { en: 'Baklava', he: 'בקלאווה', countryEn: 'Turkey / Middle East', countryHe: 'טורקיה / מזרח תיכון', emoji: '🍯' },
    { en: 'Cheesecake', he: 'עוגת גבינה', countryEn: 'USA (New York)', countryHe: 'ארה"ב (ניו יורק)', emoji: '🍰' },
    { en: 'Gelato', he: 'ג\'לאטו', countryEn: 'Italy', countryHe: 'איטליה', emoji: '🍨' },
    { en: 'Mochi', he: 'מוצ\'י', countryEn: 'Japan', countryHe: 'יפן', emoji: '🍡' },
    { en: 'Pavlova', he: 'פבלובה', countryEn: 'New Zealand / Australia', countryHe: 'ניו זילנד / אוסטרליה', emoji: '🍓' },
    { en: 'Brownie', he: 'בראוניז', countryEn: 'USA', countryHe: 'ארה"ב', emoji: '🍫' },
    { en: 'Apple Pie', he: 'פאי תפוחים', countryEn: 'USA / England', countryHe: 'ארה"ב / אנגליה', emoji: '🥧' },
    { en: 'Cannoli', he: 'קנולי', countryEn: 'Italy', countryHe: 'איטליה', emoji: '🌮' },
    { en: 'Black Forest Cake', he: 'עוגת היער השחור', countryEn: 'Germany', countryHe: 'גרמניה', emoji: '🍒' },
    { en: 'Pastel de Nata', he: 'פסטל דה נאטה', countryEn: 'Portugal', countryHe: 'פורטוגל', emoji: '🥧' },
    { en: 'Sachertorte', he: 'זאכרטורטה', countryEn: 'Austria', countryHe: 'אוסטריה', emoji: '🍫' },
    { en: 'Malabi', he: 'מלבי', countryEn: 'Middle East', countryHe: 'מזרח תיכון', emoji: '🍮' }
];

const breads = [
    { en: 'Baguette', he: 'באגט', originEn: 'France', originHe: 'צרפת', formEn: 'Long, thin loaf', formHe: 'לחם ארוך ודק', emoji: '🥖' },
    { en: 'Focaccia', he: 'פוקאצ\'ה', originEn: 'Italy', originHe: 'איטליה', formEn: 'Flat oven-baked bread', formHe: 'לחם שטוח אפוי פתוח', emoji: '🍞' },
    { en: 'Ciabatta', he: 'ג\'בטה', originEn: 'Italy', originHe: 'איטליה', formEn: 'Broad, flat, and light bread', formHe: 'לחם רחב וקליל', emoji: '🍞' },
    { en: 'Sourdough', he: 'לחם מחמצת', originEn: 'Egypt / Global', originHe: 'מצרים / עולמי', formEn: 'Bread made by natural fermentation', formHe: 'לחם מהתססה טבעית ללא שמרים תעשייתיים', emoji: '🥖' },
    { en: 'Pita', he: 'פיתה', originEn: 'Middle East', originHe: 'המזרח התיכון', formEn: 'Round pocket bread', formHe: 'לחם עגול עם כיס', emoji: '🥙' },
    { en: 'Brioche', he: 'בריוש', originEn: 'France', originHe: 'צרפת', formEn: 'Rich, sweet bread with butter and eggs', formHe: 'לחם עשיר ומתוק עם חמאה וביצים', emoji: '🥐' },
    { en: 'Challah', he: 'חלה', originEn: 'Judaism', originHe: 'יהדות', formEn: 'Braided bread eaten on Shabbat', formHe: 'לחם קלוע הנאכל בשבת', emoji: '🥖' },
    { en: 'Pretzel', he: 'בייגלה / פרצל', originEn: 'Germany', originHe: 'גרמניה', formEn: 'Knot-shaped baked pastry', formHe: 'מאפה קשור בצורת קשר', emoji: '🥨' },
    { en: 'Bagel', he: 'בייגל', originEn: 'Poland (Jewish)', originHe: 'פולין (יהודי)', formEn: 'Ring-shaped bread boiled then baked', formHe: 'לחם בצורת טבעת, מבושל לפני אפייה', emoji: '🥯' },
    { en: 'Naan', he: 'נאן', originEn: 'India', originHe: 'הודו', formEn: 'Oven-baked flatbread', formHe: 'לחם שטוח שנאפה בטאבון', emoji: '🫓' }
];

const ingredients = [
    { en: 'Flour', he: 'קמח', descEn: 'Providing the main structure to baked goods', descHe: 'נותן את המבנה העיקרי למאפים', emoji: '🌾' },
    { en: 'Yeast', he: 'שמרים', descEn: 'Making the dough rise', descHe: 'גורם לבצק לתפוח', emoji: '🦠' },
    { en: 'Butter', he: 'חמאה', descEn: 'Adding richness, flavor, and flakiness', descHe: 'מוסיפה עושר, טעם ופריכות', emoji: '🧈' },
    { en: 'Sugar', he: 'סוכר', descEn: 'Adding sweetness and helping browning', descHe: 'מוסיף מתיקות ועוזר להשחמה', emoji: '🍬' },
    { en: 'Eggs', he: 'ביצים', descEn: 'Binding ingredients together and adding moisture', descHe: 'קושרות את המרכיבים יחד ומוסיפות לחות', emoji: '🥚' },
    { en: 'Baking Powder', he: 'אבקת אפייה', descEn: 'Helping cakes and cookies rise quickly without yeast', descHe: 'עוזרת לעוגות ועוגיות לתפוח מהר בלי שמרים', emoji: '🧁' },
    { en: 'Vanilla Extract', he: 'תמצית וניל', descEn: 'Adding a pleasant aroma and flavor', descHe: 'מוסיפה ארומה וטעם נעים', emoji: '🌼' },
    { en: 'Cocoa Powder', he: 'אבקת קקאו', descEn: 'Adding chocolate flavor without extra fat', descHe: 'מוסיפה טעם שוקולדי', emoji: '🍫' }
];


let generatedQuestions = [];

function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    generatedQuestions.push(`    { category: 'patisserie', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
}

function getRandomDistractors(arr, count, exclude) {
    const pool = arr.filter(item => item !== exclude);
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Generate EXACTLY 100 questions

let count = 0;

// Type 1: French Pastry Definitions (Level 2)
for (const p of frenchPastries) {
    if (count >= 100) break;
    const distractorsEn = getRandomDistractors(frenchPastries.map(x => x.en), 3, p.en);
    const distractorsHe = distractorsEn.map(d => frenchPastries.find(x => x.en === d).he);
    addQuestion(
        2,
        `Which French pastry is described as: ${p.descEn}?`,
        `איזה מאפה צרפתי מתואר כ: ${p.descHe}?`,
        p.en, p.he,
        distractorsEn, distractorsHe,
        p.emoji
    );
    count++;
}

// Type 2: Is it a French pastry? (Level 1)
for (const p of frenchPastries) {
    if (count >= 100) break;
    const distractorsEn = getRandomDistractors(globalDesserts.map(x => x.en), 3, '');
    const distractorsHe = distractorsEn.map(d => globalDesserts.find(x => x.en === d).he);
    addQuestion(
        1,
        `Which of these is a famous French Patisserie item?`,
        `מי מהבאים הוא פריט קונדיטוריה צרפתי מפורסם?`,
        p.en, p.he,
        distractorsEn, distractorsHe,
        p.emoji
    );
    count++;
}

// Type 3: Global Dessert Origins (Level 2)
for (const d of globalDesserts) {
    if (count >= 100) break;
    const allOriginsEn = [...new Set(globalDesserts.map(x => x.countryEn)), 'France', 'Mexico', 'Greece'];
    const distractorsEn = getRandomDistractors(allOriginsEn, 3, d.countryEn);
    const fallbackHeMap = { 'France': 'צרפת', 'Mexico': 'מקסיקו', 'Greece': 'יוון' };
    const distractorsHe = distractorsEn.map(eng => {
        let f = globalDesserts.find(x => x.countryEn === eng);
        return f ? f.countryHe : fallbackHeMap[eng];
    });

    addQuestion(
        2,
        `Where does ${d.en} originally come from?`,
        `מאיזו מדינה במקור מגיע ${d.he}?`,
        d.countryEn, d.countryHe,
        distractorsEn, distractorsHe,
        d.emoji
    );
    count++;
}

// Type 4: Which dessert is from [Country]? (Level 3)
for (const d of globalDesserts) {
    if (count >= 100) break;
    const distractorsEn = getRandomDistractors(globalDesserts.map(x => x.en).filter(e => e !== d.en), 3, d.en);
    const distractorsHe = distractorsEn.map(eng => globalDesserts.find(x => x.en === eng).he);

    addQuestion(
        3,
        `Which of these desserts famously originates from ${d.countryEn}?`,
        `איזה מהקינוחים הבאים במקור מ${d.countryHe}?`,
        d.en, d.he,
        distractorsEn, distractorsHe,
        d.emoji
    );
    count++;
}

// Type 5: Bread Origins (Level 2)
for (const b of breads) {
    if (count >= 100) break;
    const allOriginsEn = [...new Set(breads.map(x => x.originEn)), 'Spain', 'Greece'];
    const distractorsEn = getRandomDistractors(allOriginsEn, 3, b.originEn);
    const fallbackHeMap = { 'Spain': 'ספרד', 'Greece': 'יוון' };
    const distractorsHe = distractorsEn.map(eng => {
        let f = breads.find(x => x.originEn === eng);
        return f ? f.originHe : fallbackHeMap[eng];
    });

    addQuestion(
        2,
        `Where does the bread ${b.en} originate from?`,
        `מקור הלחם ${b.he} הוא מ:`,
        b.originEn, b.originHe,
        distractorsEn, distractorsHe,
        b.emoji
    );
    count++;
}

// Type 6: Bread Definition (Level 1)
for (const b of breads) {
    if (count >= 100) break;
    const distractorsEn = getRandomDistractors(breads.map(x => x.en), 3, b.en);
    const distractorsHe = distractorsEn.map(eng => breads.find(x => x.en === eng).he);

    addQuestion(
        1,
        `Which type of bread is described as: ${b.formEn}?`,
        `איזה סוג לחם מתואר כ: ${b.formHe}?`,
        b.en, b.he,
        distractorsEn, distractorsHe,
        b.emoji
    );
    count++;
}

// Type 7: Ingredient Purpose (Level 3)
for (const i of ingredients) {
    if (count >= 100) break;
    const distractorsEn = getRandomDistractors(ingredients.map(x => x.en), 3, i.en);
    const distractorsHe = distractorsEn.map(eng => ingredients.find(x => x.en === eng).he);

    addQuestion(
        3,
        `What baking ingredient is responsible for: ${i.descEn}?`,
        `איזה מצרך אפייה אחראי על: ${i.descHe}?`,
        i.en, i.he,
        distractorsEn, distractorsHe,
        i.emoji
    );
    count++;
}

// We have about 66 questions so far. Let's fill the rest with generic baking/patisserie trivia to reach exactly 100.
const extraTrivia = [
    { enQ: 'What is the main ingredient of a chocolate crust?', heQ: 'מהו המרכיב העיקרי בתחתית שוקולד רגילה?', enAns: 'Cocoa or Chocolate Cookies', heAns: 'קקאו או עוגיות שוקולד', d1En: 'Vanilla', d1He: 'וניל', d2En: 'Apples', d2He: 'תפוחים', d3En: 'Yeast', d3He: 'שמרים', e: '🍫' },
    { enQ: 'Which of these is NOT an essential ingredient in basic bread dough?', heQ: 'מה אינו מרכיב חובה בבצק לחם בסיסי?', enAns: 'Sugar', heAns: 'סוכר', d1En: 'Flour', d1He: 'קמח', d2En: 'Water', d2He: 'מים', d3En: 'Salt', d3He: 'מלח', e: '🥖' },
    { enQ: 'What do you call a person who makes breads?', heQ: 'איך קוראים לאדם שאופה לחמים?', enAns: 'Baker', heAns: 'אופה', d1En: 'Chef', d1He: 'שף', d2En: 'Butcher', d2He: 'קצב', d3En: 'Barista', d3He: 'בריסטה', e: '👨‍🍳' },
    { enQ: 'What do you call a person specializing in French pastries?', heQ: 'איך קוראים למי שמומחה בהכנת מאפים וקונדיטוריה?', enAns: 'Pâtissier (Pastry Chef)', heAns: 'קונדיטור / פטיסייר', d1En: 'Sommelier', d1He: 'סומלייה', d2En: 'Waiter', d2He: 'מלצר', d3En: 'Farmer', d3He: 'חקלאי', e: '🍰' },
    { enQ: 'Which baked good has a hole in the middle?', heQ: 'לאיזה מאפה יש חור באמצע?', enAns: 'Donut', heAns: 'סופגניית דונאט', d1En: 'Croissant', d1He: 'קרואסון', d2En: 'Muffin', d2He: 'מאפין', d3En: 'Eclair', d3He: 'אקלר', e: '🍩' },
    { enQ: 'What is a "Boulangerie"?', heQ: 'מהי "בולונז\'רי" (Boulangerie)?', enAns: 'A French Bakery', heAns: 'מאפייה צרפתית', d1En: 'A Cheese Shop', d1He: 'חנות גבינות', d2En: 'A Butcher Shop', d2He: 'קצביה', d3En: 'A Restaurant', d3He: 'מסעדה', e: '🥖' },
    { enQ: 'What is the main flavor of a classic Tarte au Citron?', heQ: 'מהו הטעם המרכזי של מרכיב ב"טארט או סיטרון"?', enAns: 'Lemon', heAns: 'לימון', d1En: 'Chocolate', d1He: 'שוקולד', d2En: 'Apple', d2He: 'תפוח', d3En: 'Strawberry', d3He: 'תות', e: '🍋' },
    { enQ: 'What do you call the crisp outer layer of a bread loaf?', heQ: 'איך קוראים לשכבה החיצונית הפריכה של הלחם?', enAns: 'Crust', heAns: 'קרום / קראסט', d1En: 'Core', d1He: 'ליבה', d2En: 'Skin', d2He: 'עור', d3En: 'Shell', d3He: 'שריון', e: '🍞' },
    { enQ: 'Which tool is used to flatten dough?', heQ: 'איזה כלי משמש לשיטוח ורידוד בצק?', enAns: 'Rolling Pin', heAns: 'מערוך', d1En: 'Spatula', d1He: 'מרית', d2En: 'Whisk', d2He: 'מטרפה', d3En: 'Knife', d3He: 'סכין', e: '🥖' },
    { enQ: 'Which tool is used to whip cream by hand?', heQ: 'באיזה כלי משתמשים כדי להקציף שמנת ביד?', enAns: 'Whisk', heAns: 'מטרפה', d1En: 'Spoon', d1He: 'כף', d2En: 'Fork', d2He: 'מזלג', d3En: 'Rolling Pin', d3He: 'מערוך', e: '🥣' },
    { enQ: 'What is the Spanish fried dough pastry coated in cinnamon sugar?', heQ: 'מהו המאפה הספרדי של בצק מטוגן מצופה בסוכר וקינמון?', enAns: 'Churros', heAns: 'צ\'ורוס', d1En: 'Donuts', d1He: 'דונאטס', d2En: 'Beignets', d2He: 'בנייה', d3En: 'Profiterole', d3He: 'פחזנית', e: '🥖' },
    { enQ: 'What is a "Pancake" usually cooked on?', heQ: 'על מה בדרך כלל מטגנים "פנקייק"?', enAns: 'Pan / Griddle', heAns: 'מחבת', d1En: 'Oven', d1He: 'תנור', d2En: 'Microwave', d2He: 'מיקרוגל', d3En: 'Toaster', d3He: 'טוסטר', e: '🥞' },
    { enQ: 'Which of these is filled with apples?', heQ: 'איזה מהמאפים הבאים ממולא בתפוחים?', enAns: 'Apple Strudel', heAns: 'שטרודל תפוחים', d1En: 'Eclair', d1He: 'אקלר', d2En: 'Macaron', d2He: 'מקרון', d3En: 'Brownie', d3He: 'בראוניז', e: '🍎' },
    { enQ: 'Which famous cake is red?', heQ: 'איזו עוגה מפורסמת היא בצבע אדום?', enAns: 'Red Velvet Cake', heAns: 'עוגת רד וולווט (קטיפה אדומה)', d1En: 'Cheesecake', d1He: 'עוגת גבינה', d2En: 'Carrot Cake', d2He: 'עוגת גזר', d3En: 'Vanilla Cake', d3He: 'עוגת וניל', e: '🍰' },
    { enQ: 'What do you grate to make Carrot Cake?', heQ: 'מה מגרדים כדי להכין עוגת גזר?', enAns: 'Carrots', heAns: 'גזרים', d1En: 'Apples', d1He: 'תפוחים', d2En: 'Chocolate', d2He: 'שוקולד', d3En: 'Cheese', d3He: 'גבינה', e: '🥕' },
    { enQ: 'Which hot drink often accompanies pastries?', heQ: 'איזה משקה חם מלווה לעיתים קרובות מאפים?', enAns: 'Coffee / Tea', heAns: 'קפה / תה', d1En: 'Soda', d1He: 'קולה', d2En: 'Juice', d2He: 'מיץ קל', d3En: 'Water', d3He: 'מים', e: '☕' },
    { enQ: 'What is fondant used for?', heQ: 'למה משמש בצק סוכר (Fondant)?', enAns: 'Decorating cakes', heAns: 'לקישוט ועיטוף עוגות', d1En: 'Frying donuts', d1He: 'לטיגון סופגניות', d2En: 'Making bread dough', d2He: 'להכנת בצק לחם', d3En: 'Whipping cream', d3He: 'להקצפת שמנת', e: '🎂' },
    { enQ: 'What is ganache made of?', heQ: 'ממה מורכב גנאש בסיסי?', enAns: 'Chocolate and Cream', heAns: 'שוקולד ושמנת מתוקה', d1En: 'Butter and Sugar', d1He: 'חמאה וסוכר', d2En: 'Flour and Water', d2He: 'קמח ומים', d3En: 'Milk and Eggs', d3He: 'חלב וביצים', e: '🍫' }
];

// Loop through extra questions recursively until 100
let idx = 0;
while (count < 100) {
    let t = extraTrivia[idx % extraTrivia.length];
    addQuestion(
        Math.random() > 0.5 ? 2 : 1, // random level
        t.enQ, t.heQ, t.enAns, t.heAns,
        [t.d1En, t.d2En, t.d3En], [t.d1He, t.d2He, t.d3He],
        t.e
    );
    idx++;
    count++;
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
console.log(`Successfully injected ${generatedQuestions.length} Patisserie questions into questions.js`);
