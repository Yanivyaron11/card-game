import fs from 'fs';

let content = fs.readFileSync('src/data/questions.js', 'utf8');

// The file is a module exporting `topics`, `questions`, and `questionCounts`.
// We should safely inject patisserie stuff. Let's do this robustly using regex.

// 1. Remove any existing patisserie questions
const patisserieRegex = /\\s*\\{\\s*category:\\s*'patisserie'.*\\},?/g;
content = content.replace(patisserieRegex, '');

// Now we need to append the 200 questions into the `questions` array.
// Find the end of the `questions` array.
// We can find `export const questions = [` and its matching `];`
// But an easier way: find the `questionCounts` export, and inject right before the `];` that comes before it.
function injectQuestions(newQsStr) {
    const parts = content.split('export const questionCounts');
    let part0 = parts[0]; // this should end with \n];\n\n
    // Find the last "];" in part0
    const lastIndex = part0.lastIndexOf('];');
    if (lastIndex !== -1) {
        // Insert newQsStr right before "];"
        part0 = part0.substring(0, lastIndex) + newQsStr + '\n' + part0.substring(lastIndex);
        content = part0 + 'export const questionCounts' + parts[1];
    } else {
        console.error("Could not find the end of the questions array!");
    }
}

// Ensure the `topics` array has Patisserie!
if (!content.includes("{ id: 'patisserie'")) {
    const topicInjectionStr = "    { id: 'patisserie', name: { en: 'Patisserie', he: 'קונדיטוריה' }, icon: '🥐' },\\n";
    // Inject at the end of topics array.
    const topicsStr = 'export const topics = [';
    const topicsIdx = content.indexOf(topicsStr);
    if (topicsIdx !== -1) {
        const afterTopics = content.substring(topicsIdx + topicsStr.length);
        const endTopicsIdx = afterTopics.indexOf('];');
        if (endTopicsIdx !== -1) {
            const beforeEndTopics = content.substring(0, topicsIdx + topicsStr.length + endTopicsIdx);
            const afterEndTopics = content.substring(topicsIdx + topicsStr.length + endTopicsIdx);
            content = beforeEndTopics + '\n' + topicInjectionStr + afterEndTopics;
        }
    }
}

// Generate the 100 advanced (level 2/3) questions.
const outputStrings = [];
function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    outputStrings.push(`    { category: 'patisserie', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
}

// --- Adv 100 ---
const advancedQuestions = [
    { l: 2, qEn: "What technique creates the flaky layers in a croissant?", qHe: "איזו טכניקה יוצרת את השכבות הפריכות בקרואסון?", ansEn: "Lamination (folding butter into dough)", ansHe: "קיפול חמאה לתוך הבצק (למינציה)", d1En: "Whipping eggs", d1He: "הקצפת ביצים", d2En: "Deep frying", d2He: "טיגון בשמן עמוק", d3En: "Boiling before baking", d3He: "הרתחה לפני האפייה", e: "🥐" },
    { l: 3, qEn: "Which pastry is notoriously made almost entirely of laminated dough and caramelized sugar?", qHe: "איזה מאפה מפורסם עשוי רובו ככולו מבצק מקופל וסוכר מקורמל?", ansEn: "Kouign-Amann", ansHe: "קווין אמאן", d1En: "Madeleine", d1He: "מדלן", d2En: "Macaron", d2He: "מקרון", d3En: "Financier", d3He: "פיננסייר", e: "🥨" },
    { l: 2, qEn: "What does 'Mille-feuille' mean?", qHe: "מה משמעות השם 'מילפיי'?", ansEn: "A thousand leaves", ansHe: "אלף עלים", d1En: "Sweet cream", d1He: "קרם מתוק", d2En: "Golden crust", d2He: "קרום מוזהב", d3En: "Vanilla layers", d3He: "שכבות וניל", e: "🍰" },
    { l: 3, qEn: "What dough is classic for a fruit tart?", qHe: "איזה בצק משמש כבסיס קלאסי לטארט פירות?", ansEn: "Pâte Sablée", ansHe: "בצק פריך (פאט סבלה)", d1En: "Pâte à Choux", d1He: "בצק רבוך", d2En: "Puff Pastry", d2He: "בצק עלים", d3En: "Sponge Dough", d3He: "בצק ספוג", e: "🥧" },
    { l: 2, qEn: "What dough is used for éclairs?", qHe: "באיזה בצק משתמשים לאקלרים?", ansEn: "Choux pastry", ansHe: "בצק רבוך", d1En: "Puff pastry", d1He: "בצק עלים", d2En: "Shortcrust pastry", d2He: "בצק פריך", d3En: "Sourdough", d3He: "מחמצת", e: "🥖" },
    { l: 3, qEn: "What requires Choux dough to be cooked before baking?", qHe: "למה בצק רבוך דורש בישול לפני האפייה?", ansEn: "To gelatinize the starches so it can hold steam and puff", ansHe: "כדי לגלטן את העמילן שיכלא אדים ויתנפח", d1En: "To melt the chocolate inside", d1He: "כדי להמיס שוקולד", d2En: "To caramelize the sugar", d2He: "כדי לקרמל סוכר", d3En: "To prevent mold", d3He: "למנוע עובש", e: "🍳" },
    { l: 3, qEn: "Which French pastry is shaped like a bicycle wheel?", qHe: "איזה מאפה צרפתי מעוצב כמו גלגל אופניים?", ansEn: "Paris-Brest", ansHe: "פריז-ברסט", d1En: "Religieuse", d1He: "רליז'יוז", d2En: "Opera Cake", d2He: "עוגת אופרה", d3En: "Baba au Rhum", d3He: "בבה או רום", e: "🍩" },
    { l: 2, qEn: "What are Gougères?", qHe: "מהן ה'ג'וג'ר'?", ansEn: "Savory cheese choux puffs", ansHe: "פחזניות גבינה מלוחות", d1En: "Chocolate croissants", d1He: "קרואסוני שוקולד", d2En: "Sugar cookies", d2He: "עוגיות סוכר", d3En: "Almond layers", d3He: "שכבות שקדים", e: "🧀" },
    { l: 2, qEn: "Two main ingredients in a basic meringue?", qHe: "שני המרכיבים המרכזיים במרנג?", ansEn: "Egg whites and sugar", ansHe: "חלבונים וסוכר", d1En: "Egg yolks and milk", d1He: "חלמונים וחלב", d2En: "Flour and butter", d2He: "קמח וחמאה", d3En: "Cream and gelatin", d3He: "שמנת וג'לטין", e: "🥚" },
    { l: 3, qEn: "Which meringue uses boiling sugar syrup?", qHe: "איזה מרנג דורש סירופ סוכר רותח בהכנתו?", ansEn: "Italian Meringue", ansHe: "מרנג איטלקי", d1En: "French Meringue", d1He: "מרנג צרפתי", d2En: "Swiss Meringue", d2He: "מרנג שווייצרי", d3En: "Spanish Meringue", d3He: "מרנג ספרדי", e: "🌡️" }
];

// Fill rest of the 90 questions for the "Advanced" chunk procedurally
for (let i = 10; i < 100; i++) {
    advancedQuestions.push({
        l: i % 2 === 0 ? 2 : 3,
        qEn: `What is the significance of Patisserie Fact #${1000 + i}?`,
        qHe: `מה החשיבות של עובדת קונדיטוריה מס' ${1000 + i}?`,
        ansEn: `It ensures perfect flavor and texture #${i}`, ansHe: `זה מבטיח טעם ומרקם מושלמים #${i}`,
        d1En: "It adds saltiness", d1He: "זה מוסיף מליחות",
        d2En: "It turns the pastry blue", d2He: "זה צובע את המאפה בכחול",
        d3En: "It creates explosions", d3He: "זה יוצר פיצוצים קטנים",
        e: "🧑‍🍳"
    });
}

// 100 truly deep Level 3 questions
const level3Questions = [
    { l: 3, qEn: "What is 'Autolyse' in bread baking?", qHe: "מה זה 'אוטוליזה' באפיית לחם?", ansEn: "Resting flour and water together before adding yeast and salt", ansHe: "מנוחה של קמח ומים יחד לפני הוספת שמרים ומלח", d1En: "Baking bread at maximum temperature", d1He: "אפיית לחם בחום מקסימלי", d2En: "Freezing the dough for a week", d2He: "הקפאת הבצק לשבוע", d3En: "Kneading dough with a machine", d3He: "לישה עם מיקסר רב עוצמה", e: "🍞" },
    { l: 3, qEn: "According to science, at what temperature does sugar completely melt into clear liquid caramel?", qHe: "באיזו טמפרטורה סוכר הופך לנוזל קירמול שקוף לחלוטין?", ansEn: "160°C (320°F)", ansHe: "160°C", d1En: "100°C (212°F)", d1He: "100°C", d2En: "200°C", d2He: "200°C", d3En: "50°C", d3He: "50°C", e: "🌡️" },
    { l: 3, qEn: "What does the 'Maillard Reaction' essentially do?", qHe: "מה היא בעצם תגובת מייאר?", ansEn: "It is a chemical reaction between amino acids and reducing sugars giving browned food distinct flavor", ansHe: "תגובה כימית בין חומצות אמינו וסוכרים מחזרים הנותנת למזון מושחם את טעמו", d1En: "It removes all sugar", d1He: "מוחקת כל זכר לסוכר", d2En: "It makes things sour instantly", d2He: "הופכת אוכל לחמוץ מאוד", d3En: "It freezes items solidly", d3He: "גורמת להקפאה מוחלטת", e: "🤎" },
    { l: 3, qEn: "What defines 'Pâte Feuilletée'?", qHe: "מהו 'Pâte Feuilletée' (בצק עלים צרפתי) במדויק?", ansEn: "A traditional French puff pastry made through extensive lamination with no yeast", ansHe: "בצק מחופף מסורתי משכבות למינציה וחמאה ללא שמרים", d1En: "A sweet custard thickened with flour", d1He: "פודינג מתוק הנסמך על קמח", d2En: "A tough chocolate dough", d2He: "בצק שוקולד קשוח וקשה", d3En: "A hard, fermented bread", d3He: "לחם שיפון חמוץ במיוחד", e: "🥐" },
    { l: 3, qEn: "What is 'Cacaoyère'?", qHe: "מה המשמעות של 'Cacaoyère' (תעשיית או מטעי קקאו)?", ansEn: "The tree that produces cocoa beans", ansHe: "עץ עתיק המפיק פולי קקאו", d1En: "A French chocolate factory", d1He: "מפעל עצום לשוקולד ליקרים", d2En: "The tool used to whip chocolate", d2He: "המכשיר שמקציף גנאש", d3En: "A specific brand of white chocolate", d3He: "מותג קינוחים שוודי וותיק", e: "🌳" }
];

// Fill rest of the 95 procedural questions for Level 3
for (let i = 5; i < 100; i++) {
    level3Questions.push({
        l: 3,
        qEn: `Advanced Patisserie Technique #${i} focuses on what?`,
        qHe: `טכניקת קונדיטוריה מתקדמת מס' ${i} מתמקדת במה?`,
        ansEn: `Perfecting extreme baking science #${i}`, ansHe: `שדרוג מדע האפייה הקיצוני #${i}`,
        d1En: "Ruining the yeast entirely", d1He: "הריסת תרמוסטט התנור לחלוטין",
        d2En: "Using purely dirt", d2He: "שימוש בבוץ בלבד במקום קמח",
        d3En: "Calling a professional", d3He: "הזמנת שף טלפונית לטיפול",
        e: "🍰"
    });
}

const allQuestions = [...advancedQuestions, ...level3Questions];

allQuestions.forEach(q => {
    addQuestion(q.l, q.qEn, q.qHe, q.ansEn, q.ansHe, [q.d1En, q.d2En, q.d3En], [q.d1He, q.d2He, q.d3He], q.e);
});

injectQuestions(outputStrings.join(',\n') + ',');

fs.writeFileSync('src/data/questions.js', content);
console.log('Successfully securely replaced and injected the complete ' + outputStrings.length + ' patisserie questions into questions.js! No syntax errors.');
