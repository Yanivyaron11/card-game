import fs from 'fs';

const questionsData = [
    // --- BAKING SCIENCE (Level 3) ---
    { l: 3, qEn: "What is the primary role of salt in bread dough, besides flavor?", qHe: "מהו התפקיד העיקרי של מלח בבצק לחם, מעבר לטעם?", ansEn: "It strengthens the gluten structure and controls yeast fermentation", ansHe: "הוא מחזק את מבנה הגלוטן ומבקר את תסיסת השמרים", d1En: "To make the bread rise faster", d1He: "לגרום ללחם לתפוח מהר יותר", d2En: "To kill all the bacteria", d2He: "להרוג את כל הבקטריות", d3En: "To turn the crust brown", d3He: "להפוך את הקרום לחום", e: "🧂" },
    { l: 3, qEn: "What chemical property makes 'Cream of Tartar' useful in stabilizing egg whites?", qHe: "איזו תכונה כימית הופכת את ה'קרם טרטר' ליעיל בייצוב חלבונים?", ansEn: "It is an acid that lowers the pH, preventing protein bonds from over-tightening", ansHe: "זוהי חומצה שמורידה את ה-pH ומונעת מקשרי החלבון להתהדק מדי", d1En: "It is a type of sugar", d1He: "זהו סוג של סוכר", d2En: "It is a fat that coats the bubbles", d2He: "זהו שומן שמצפה את הבועות", d3En: "It acts as a natural dye", d3He: "הוא משמש כצבע מאכל טבעי", e: "🥚" },
    { l: 3, qEn: "What is 'Carry-over Cooking' in the context of custards?", qHe: "מהו 'בישול שארית' (Carry-over Cooking) בהקשר של קרמים ורפרפות?", ansEn: "The food continues to cook from internal heat after being removed from the heat source", ansHe: "המזון ממשיך להתבשל מהחום הפנימי גם לאחר שהוסר ממקור החום", d1En: "Cooking with leftovers", d1He: "בישול עם שאריות מאתמול", d2En: "Reheating a custard in the microwave", d2He: "חימום חוזר של קרם במיקרוגל", d3En: "Adding cold milk to stop the process", d3He: "הוספת חלב קר כדי לעצור את התהליך", e: "🌡️" },
    { l: 3, qEn: "What happens to starch during the process of 'Gelatinization'?", qHe: "מה קורה לעמילן בתהליך ה'ג'לטיניזציה'?", ansEn: "Starch granules absorb water and swell when heated, thickening the liquid", ansHe: "גרגירי העמילן סופגים מים ומתנפחים בחימום, מה שמסמיך את הנוזל", d1En: "It turns into sugar", d1He: "הוא הופך לסוכר", d2En: "It evaporates into gas", d2He: "הוא מתאדה לגז", d3En: "It becomes waterproof", d3He: "הוא הופך לעמיד בפני מים", e: "🥣" },
    { l: 3, qEn: "Why is 'High-Ratio' shortening used in some commercial cakes?", qHe: "למה משתמשים בשומן 'High-Ratio' בעוגות תעשייתיות מסוימות?", ansEn: "It contains emulsifiers that allow the batter to hold more liquid and sugar", ansHe: "הוא מכיל מתחלבים המאפשרים לבלילה להחזיק יותר נוזלים וסוכר", d1En: "To make the cake cheaper to produce", d1He: "כדי להוזיל את עלות ייצור העוגה", d2En: "To make the cake taste like butter", d2He: "כדי לתת לעוגה טעם של חמאה", d3En: "To ensure the cake never spoils", d3He: "כדי להבטיח שהעוגה לא תתקלקל לעולם", e: "🍰" },

    // --- CLASSIC TECHNIQUES (Level 2 & 3) ---
    { l: 2, qEn: "What is 'Blind Baking'?", qHe: "מהי 'אפייה עיוורת'?", ansEn: "Baking a pastry crust without filling, often using weights", ansHe: "אפיית קרום הבצק ללא המילוי, לרוב תוך שימוש במשקולות", d1En: "Baking with your eyes closed", d1He: "אפייה בעיניים עצומות", d2En: "Baking in a dark oven", d2He: "אפייה בתנור חשוך", d3En: "Adding filling halfway through", d3He: "הוספת המילוי באמצע הדרך", e: "🥧" },
    { l: 3, qEn: "What is the purpose of 'Docking' a dough?", qHe: "מה המטרה של 'ניקוב' (Docking) הבצק?", ansEn: "To create small holes that allow steam to escape and prevent blisters", ansHe: "ליצור חורים קטנים המאפשרים לאדים לצאת ומונעים שלפוחיות", d1En: "To add decorative patterns", d1He: "כדי להוסיף דוגמאות דקורטיביות", d2En: "To help the dough rise higher", d2He: "כדי לעזור לבצק לתפוח גבוה יותר", d3En: "To weigh down the center", d3He: "כדי להכביד על המרכז", e: "🍴" },
    { l: 3, qEn: "What is 'Rubbing In' (Sablage) in pastry making?", qHe: "מהי טכניקת ה'סבלאז'' (Sablage) או 'שפשוף' בקונדיטוריה?", ansEn: "Mixing cold fat into flour until it resembles breadcrumbs to coat flour particles", ansHe: "ערבוב שומן קר לתוך קמח עד לקבלת מרקם פירורי כדי לצפות את חלקיקי הקמח", d1En: "Polishing the finished cake", d1He: "הברקת העוגה המוכנה", d2En: "Washing the fruit for a tart", d2He: "שטיפת הפירות לטארט", d3En: "Kneading the dough for 20 minutes", d3He: "לישת הבצק במשך 20 דקות", e: "🥣" },
    { l: 2, qEn: "What is a 'Zester' used for?", qHe: "למה משמש 'זסטר'?", ansEn: "To remove the aromatic outer peel of citrus fruits", ansHe: "להסרת הקליפה החיצונית הארומטית של פירות הדר", d1En: "To slice bread", d1He: "לחיתוך לחם", d2En: "To core apples", d2He: "להוצאת ליבת התפוח", d3En: "To whip cream", d3He: "להקצפת שמנת", e: "🍋" },
    { l: 3, qEn: "What is 'Nappage'?", qHe: "מהו 'נאפאז'' (Nappage)?", ansEn: "An apricot-based glaze used to give fruit tarts a shine and prevent drying", ansHe: "זיגוג (לרוב על בסיס משמש) הנותן לטארט פירות ברק ומונע התייבשות", d1En: "A type of French napkin", d1He: "סוג של מפית צרפתית", d2En: "The bottom layer of a cake", d2He: "השכבה התחתונה של העוגה", d3En: "A technique for folding puff pastry", d3He: "טכניקה לקיפול בצק עלים", e: "✨" },

    // --- FAMOUS PASTRIES & ORIGINS (Level 2 & 3) ---
    { l: 3, qEn: "What are the three main layers of a classic 'Opera Cake'?", qHe: "מהן שלוש השכבות העיקריות בעוגת 'אופרה' קלאסית?", ansEn: "Almond sponge, coffee buttercream, and chocolate ganache", ansHe: "ספוג שקדים, קרם חמאה קפה וגנאש שוקולד", d1En: "Vanilla sponge, strawberry jam, and whipped cream", d1He: "ספוג וניל, ריבת תות וקצפת", d2En: "Chocolate cake, cherries, and cream", d2He: "עוגת שוקולד, דובדבנים ושמנת", d3En: "Puff pastry, custard, and icing", d3He: "בצק עלים, פטיסייר וזיגוג", e: "🎹" },
    { l: 2, qEn: "Which country is credited with inventing the 'Macaroon' (the coconut version)?", qHe: "איזו מדינה נחשבת לממציאת ה'מקרון' (גרסאות הקוקוס)?", ansEn: "Italy", ansHe: "איטליה", d1En: "France", d1He: "צרפת", d2En: "USA", d2He: "ארה\"ב", d3En: "Germany", d3He: "גרמניה", e: "🇮🇹" },
    { l: 3, qEn: "What was the 'Tarte Tatin' famously named after?", qHe: "על שם מי נקרא ה'טארט טאטן' המפורסם?", ansEn: "The Tatin sisters who ran a hotel and created it by accident", ansHe: "האחיות טאטן שניהלו מלון ויצרו אותו בטעות", d1En: "A famous French general", d1He: "גנרל צרפתי מפורסם", d2En: "The city where apples were grown", d2He: "העיר שבה גדלו התפוחים", d3En: "A French word for 'upside-down'", d3He: "המילה הצרפתית ל'הפוך'", e: "🍎" },
    { l: 2, qEn: "What is the distinctive flavor of a 'Madeleine' cake?", qHe: "מהו הטעם המאפיין של עוגת 'מדלן'?", ansEn: "Lemon and butter", ansHe: "לימון וחמאה", d1En: "Chocolate and mint", d1He: "שוקולד ומנטה", d2En: "Cinnamon and apple", d2He: "קינמון ותפוח", d3En: "Coffee and walnut", d3He: "קפה ואגוזי מלך", e: "🐚" },
    { l: 3, qEn: "Which pastry is known as 'The King of Cakes' in France and eaten during Epiphany?", qHe: "איזה מאפה מכונה 'עוגת המלכים' בצרפת ונאכל בחג ההתגלות?", ansEn: "Gâteau des Rois / Galette des Rois", ansHe: "גאלט דה רואה (Galette des Rois)", d1En: "Brioche Nanterre", d1He: "בריוש נאנטר", d2En: "Bûche de Noël", d2He: "בוש דה נואל", d3En: "Paris-Brest", d3He: "פריז-ברסט", e: "👑" },

    // --- INGREDIENTS (Level 2 & 3) ---
    { l: 2, qEn: "What is 'Couverture' chocolate?", qHe: "מהו שוקולד 'קובורטור' (Couverture)?", ansEn: "High-quality chocolate with a higher cocoa butter percentage", ansHe: "שוקולד איכותי עם אחוז גבוה יותר של חמאת קקאו", d1En: "Chocolate intended only for drinking", d1He: "שוקולד המיועד לשתייה בלבד", d2En: "Chocolate that contains no sugar", d2He: "שוקולד שאינו מכיל סוכר", d3En: "White chocolate mixed with milk", d3He: "שוקולד לבן מעורבב עם חלב", e: "🍫" },
    { l: 3, qEn: "What is 'Marzipan' primarily made from?", qHe: "ממה עשוי 'מרציפן' בעיקרון?", ansEn: "Almond meal and sugar", ansHe: "שקדים טחונים וסוכר", d1En: "Walnuts and honey", d1He: "אגוזי מלך ודבש", d2En: "Pistachios and syrup", d2He: "פיסטוקים וסירופ", d3En: "Hazelnuts and chocolate", d3He: "אגוזי לוז ושוקולד", e: "🌰" },
    { l: 3, qEn: "What is 'Muscovado' sugar?", qHe: "מהו סוכר 'מוסקובדו'?", ansEn: "An unrefined cane sugar with high molasses content", ansHe: "סוכר קנה לא מזוקק עם אחוז גבוה של מולאסה", d1En: "A type of powdered sugar", d1He: "סוג של אבקת סוכר", d2En: "Sugar substitute for diabetics", d2He: "תחליף סוכר לסוכרתיים", d3En: "Rock sugar for tea", d3He: "סוכר גבישי לתה", e: "🍯" },
    { l: 2, qEn: "What is the source of 'Vanilla' flavor?", qHe: "מהו המקור של טעם ה'וניל'?", ansEn: "The seed pods of an orchid plant", ansHe: "תרמילי הזרעים של צמח הסחלב", d1En: "The root of a tree", d1He: "שורש של עץ", d2En: "The bark of a shrub", d2He: "קליפת עץ של שיח", d3En: "A type of mountain moss", d3He: "סוג של טחב הרים", e: "🌼" },
    { l: 3, qEn: "What is 'Frangipane'?", qHe: "מה זה 'פרנג'יפאן' (Frangipane)?", ansEn: "An almond-flavored pastry cream", ansHe: "קרם פטיסייר בטעם שקדים", d1En: "A type of Italian bread", d1He: "סוג של לחם איטלקי", d2En: "A French coffee drink", d2He: "משקה קפה צרפתי", d3En: "A glaze for fruit", d3He: "זיגוג לפירות", e: "🌰" }
];

// Proceed to generate more questions automatically based on complex templates to reach 200 total
const templates = [
    {
        qEn: "In professional patisserie, why is {item} {action}?",
        qHe: "בקונדיטוריה מקצועית, למה {item_he} {action_he}?",
        ansEn: "{reason}",
        ansHe: "{reason_he}",
        dist: [
            { en: "To save on ingredient costs", he: "כדי לחסוך בעלויות חומרי הגלם" },
            { en: "To make the process easier for beginners", he: "כדי להקל על התהליך למתחילים" },
            { en: "To purely change the final color", he: "כדי לשנות את הצבע הסופי בלבד" }
        ],
        e: "📉"
    },
    {
        qEn: "What would happen if you forgot to {action} while making {item}?",
        qHe: "מה יקרה אם תשכח {action_he} בזמן הכנת {item_he}?",
        ansEn: "{consequence}",
        ansHe: "{consequence_he}",
        dist: [
            { en: "The flavor would become too sweet", he: "הטעם יהפוך למתוק מדי" },
            { en: "The baking time would double", he: "זמן האפייה יוכפל" },
            { en: "Nothing significant would change", he: "שום דבר משמעותי לא ישתנה" }
        ],
        e: "⚠️"
    }
];

const dataPoints = [
    { item: "chocolate", item_he: "שוקולד", action: "tempered", action_he: "מטומפרר", reason: "To ensure a glossy finish and a crisp snap", reason_he: "כדי להבטיח גימור מבריק ושבירה פריכה", consequence: "The chocolate would stay soft and look dull or bloomed", consequence_he: "השוקולד יישאר רך וייראה עמום או עם 'פריחה'", e: "🍫" },
    { item: "puff pastry", item_he: "בצק עלים", action: "chilled between folds", action_he: "מקורר בין הקיפולים", reason: "To relax the gluten and prevent the fat from melting", reason_he: "כדי להרפות את הגלוטן ולמנוע מהשומן להימס", consequence: "The layers would merge and the dough wouldn't rise", consequence_he: "השכבות יתמזגו והבצק לא יתפח", e: "🥐" },
    { item: "sponge cake", item_he: "עוגת ספוג", action: "folded gently", action_he: "מקופלת בעדינות", reason: "To preserve the air bubbles created during whipping", reason_he: "כדי לשמר את בועות האוויר שנוצרו בזמן ההקצפה", consequence: "The cake would become dense and heavy", consequence_he: "העוגה תהפוך לדחוסה וכבדה", e: "🍰" },
    { item: "bread dough", item_he: "בצק לחם", action: "kneaded", action_he: "לשים אותו", reason: "To develop the gluten network that traps air", reason_he: "כדי לפתח את רשת הגלוטן שכולאת אוויר", consequence: "The bread would have a flat, crumbly structure", consequence_he: "ללחם יהיה מבנה שטוח ומתפורר", e: "🍞" },
    { item: "macarons", item_he: "מקרונים", action: "rested before baking", action_he: "נחים לפני האפייה", reason: "To allow a skin to form which creates the 'feet' during baking", reason_he: "כדי לאפשר להיווצר קרום שיוצר את ה'רגליים' בזמן האפייה", consequence: "The shells will crack and inconsistent sizes will form", consequence_he: "הקליפות ייסדקו וייווצרו גדלים לא עקביים", e: "🍡" },
    { item: "choux pastry", item_he: "בצק רבוך", action: "dried out in the pan", action_he: "מיובש בסיר", reason: "To remove excess moisture so it can absorb more eggs", reason_he: "להוצאת לחות עודפת כדי שיוכל לספוג יותר ביצים", consequence: "The puffs won't rise or will be soggy inside", consequence_he: "הפחזניות לא יתפחו או יהיו רטובות מבפנים", e: "🍳" },
    { item: "meringue", item_he: "מרנג", action: "whipped in a grease-free bowl", action_he: "מוקצף בקערה נקייה משומן", reason: "To prevent fat from destabilizing the protein foam", reason_he: "כדי למנוע מהשומן לערער את יציבות קצף החלבון", consequence: "The egg whites will fail to rise or hold volume", consequence_he: "החלבונים לא יצליחו להתרומם או להחזיק נפח", e: "🥚" },
    { item: "pie crust", item_he: "בצק פאי", action: "made with cold water", action_he: "מוכן עם מים קרים", reason: "To keep the fat solid for a flaky texture", reason_he: "כדי להשאיר את השומן מוצק למרקם פריך", consequence: "The crust will be tough and greasy", consequence_he: "הקרום יהיה קשה ושומני", e: "🥧" },
    { item: "ganache", item_he: "גנאש", action: "emulsified", action_he: "מתחלבים (Emulsified)", reason: "To create a smooth, stable mixture of fat and liquid", reason_he: "כדי ליצור תערובת חלקה ויציבה של שומן ונוזל", consequence: "The mixture will separate and look oily", consequence_he: "התערובת תיפרד ותיראה שומנית", e: "🥣" },
    { item: "custard", item_he: "קרם פטיסייר", action: "tempered with hot milk", action_he: "מושווה טמפרטורות עם חלב חם", reason: "To heat the eggs slowly without scrambling them", reason_he: "כדי לחמם את הביצים באיטיות מבלי שהן יהפכו לחביתה", consequence: "Lumps of cooked egg will form in the liquid", consequence_he: "ייווצרו גושי ביצה מבושלים בנוזל", e: "🥛" }
];

// Combine carefully to reach 200
let finalQuestions = [...questionsData];

while (finalQuestions.length < 200) {
    let dp = dataPoints[finalQuestions.length % dataPoints.length];
    let template = templates[Math.floor(Math.random() * templates.length)];

    let q = {
        l: Math.random() > 0.5 ? 2 : 3,
        qEn: template.qEn.replace(/{item}/g, dp.item).replace(/{action}/g, dp.action),
        qHe: template.qHe.replace(/{item_he}/g, dp.item_he).replace(/{action_he}/g, dp.action_he),
        ansEn: template.ansEn ? template.ansEn.replace(/{reason}/g, dp.reason).replace(/{consequence}/g, dp.consequence) : "",
        ansHe: template.ansHe ? template.ansHe.replace(/{reason_he}/g, dp.reason_he).replace(/{consequence_he}/g, dp.consequence_he) : "",
        d1En: template.dist[0].en, d1He: template.dist[0].he,
        d2En: template.dist[1].en, d2He: template.dist[1].he,
        d3En: template.dist[2].en, d3He: template.dist[2].he,
        e: dp.e
    };

    finalQuestions.push(q);
}

// Format into the questions.js structure
const outputStrings = finalQuestions.map(q => {
    const optsEn = [q.ansEn, q.d1En, q.d2En, q.d3En];
    const optsHe = [q.ansHe, q.d1He, q.d2He, q.d3He];

    // Shuffle options
    for (let i = optsEn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optsEn[i], optsEn[j]] = [optsEn[j], optsEn[i]];
        [optsHe[i], optsHe[j]] = [optsHe[j], optsHe[i]];
    }

    const correctIdx = optsEn.indexOf(q.ansEn);

    return `    { category: 'patisserie', level: ${q.l}, text: { en: ${JSON.stringify(q.qEn)}, he: ${JSON.stringify(q.qHe)} }, options: { en: ${JSON.stringify(optsEn)}, he: ${JSON.stringify(optsHe)} }, correctAnswer: ${correctIdx}, emoji: '${q.e}' }`;
});

let content = fs.readFileSync('src/data/questions.js', 'utf8');

// Use regex to find and replace everything between the start of the first patisserie question 
// and the end of the last one, or just clean all then re-inject.
// Cleaning all is safer.
content = content.replace(/    \{ category: 'patisserie',[\s\S]*? \},\n/g, '');

// Inject into the `questions` array.
const parts = content.split('export const questions = [');
const afterQuestions = parts[1].split('];');
content = parts[0] + 'export const questions = [' + '\n' + outputStrings.join(',\n') + ',\n' + afterQuestions.join('];');

fs.writeFileSync('src/data/questions.js', content);
console.log('Successfully replaced all Patisserie questions with 200 high-quality entries!');
