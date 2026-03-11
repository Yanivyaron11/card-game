import { injectHints } from './hint_utils.mjs';

const scienceL3Batch3 = {
    "q-math-508": { "en": "Numbers that can only be divided by 1 and themselves.", "he": "מספרים שניתן לחלק אותם רק ב-1 ובעצמם." },
    "q-math-509": { "en": "It is the square of 10.", "he": "זהו הריבוע של המספר 10." },
    "q-math-510": { "en": "It is exactly half of the degrees in a full circle.", "he": "זה בדיוק מחצית ממספר המעלות במעגל שלם." },
    "q-math-511": { "en": "A field of study named after the Greek word for 'earth measurement'.", "he": "תחום לימוד הקרוי על שם המילה היוונית ל'מדידת קרקע'." },
};

const sportsL3Batch3 = {
    "q-maccabi_haifa-378": { "en": "A famous team from Paris, France.", "he": "קבוצה מפורסמת מפריז, צרפת." },
    "q-maccabi_haifa-379": { "en": "A major club from Greece.", "he": "מועדון פאר מיוון." },
    "q-maccabi_haifa-380": { "en": "A legendary English team known as the Red Devils.", "he": "קבוצה אנגלית אגדית המכונה 'השדים האדומים'." },
};

injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/science.js', scienceL3Batch3);
injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/sports_life.js', sportsL3Batch3);
