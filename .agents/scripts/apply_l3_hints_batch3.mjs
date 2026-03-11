import { injectHints } from './hint_utils.mjs';

const scienceL3Batch3 = {
    "q-science-1": { "en": "The gas that plants need for photosynthesis.", "he": "הגז שצמחים זקוקים לו לצורך פוטוסינתזה." },
    "q-science-2": { "en": "The force that keeps our feet on the ground.", "he": "הכוח ששומר על הרגליים שלנו על הקרקע." },
    "q-science-3": { "en": "The boiling point of water in Celsius.", "he": "נקודת הרתיחה של המים במעלות צלזיוס." },
    "q-science-4": { "en": "The planet known as the Red Planet.", "he": "כוכב הלכת הידוע בתור 'כוכב הלכת האדום'." },
};

const sportsL3Batch3 = {
    "q-sports-1": { "en": "The number of players on a soccer team on the field.", "he": "מספר השחקנים בקבוצת כדורגל הנמצאים על המגרש." },
    "q-sports-2": { "en": "The game where you try to get a strike or a spare.", "he": "המשחק שבו מנסים להשיג 'סטרייק' או 'ספייר'." },
    "q-sports-3": { "en": "The sport that uses an oval ball and is popular in the USA.", "he": "הספורט שמשתמש בכדור סגלגל ופופולרי מאוד בארה\"ב." },
};

injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/science.js', scienceL3Batch3);
injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/sports_life.js', sportsL3Batch3);
