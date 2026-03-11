import { injectHints } from './hint_utils.mjs';

const natureL3BatchCorrected = {
    "q-nature-2152": { "en": "Found in South America, it lives near water.", "he": "נמצא בדרום אמריקה וחי בקרבת מים." },
    "q-nature-2167": { "en": "It has a massive wingspan and is found in the Andes.", "he": "בעלת מוטת כנפיים עצומה ונמצאת בהרי האנדים." },
    "q-nature-2168": { "en": "The queen of this social insect colony can live for decades.", "he": "מלכת המושבה של החרק החברתי הזה יכולה לחיות עשרות שנים." },
    "q-nature-2169": { "en": "Recorded in a valley in California known for its heat.", "he": "תועדה בעמק בקליפורניה הידוע בחום הקיצוני שבו." },
    "q-nature-2170": { "en": "It covers the most southern continent.", "he": "הוא מכסה את היבשת הדרומית ביותר בעולם." },
    "q-nature-2171": { "en": "Located in the Caucasus range in Russia.", "he": "ממוקם ברכס הרי הקווקז ברוסיה." },
    "q-nature-2145": { "en": "What is the fastest animal in the ocean? Hint: It has a spear-like bill.", "he": "מהו בעל החיים המהיר ביותר באוקיינוס? רמז: יש לו מקור דמוי חנית." },
    "q-nature-2146": { "en": "The largest fish in the world.", "he": "הדג הגדול ביותר בעולם." },
    "q-nature-2147": { "en": "What is the only mammal that can truly fly?", "he": "מהו היונק היחיד שיכול לעוף באמת?" },
    "q-nature-2148": { "en": "What is the largest living primate?", "he": "מהו הפרימט (קוף אדם) הגדול ביותר כיום?" },
};

const israelL3BatchCorrected = {
    "israel_geo_fact_7": { "en": "A city on the shores of the Sea of Galilee.", "he": "עיר השוכנת על שפת הכנרת." },
    "q-tel-aviv-136": { "en": "Also the founding date of the first Hebrew city.", "he": "גם התאריך שבו נוסדה העיר העברית הראשונה." },
    "q-tel-aviv-137": { "en": "Her name is synonymous with beauty products.", "he": "שמה הפך לשם נרדף למוצרי טיפוח ויופי." },
    "israel_geo_fact_8": { "en": "Located between Jaffa and Lod.", "he": "שוכנת בין יפו ללוד." },
    "israel_geo_fact_19": { "en": "Named after the scientist who lived there.", "he": "קרויה על שם המדען שחי ופעל בה." },
    "israel_geo_fact_1": { "en": "The first official Hebrew settlement of the First Aliyah.", "he": "המושבה העברית הרשמית הראשונה של העלייה הראשונה." },
    "q-tel-aviv-50": { "en": "What is the name of the central square of Tel Aviv?", "he": "איך קוראים לכיכר המרכזית של תל אביב?" },
    "q-tel-aviv-60": { "en": "The first neighborhood of Tel Aviv.", "he": "השכונה הראשונה של תל אביב." },
};

injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/nature.js', natureL3BatchCorrected);
injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/israel.js', israelL3BatchCorrected);
