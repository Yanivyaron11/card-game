import { injectHints } from './hint_utils.mjs';

const natureL3Batch1 = {
    "nature_animal_fact_3": { "en": "It is a very small, fast bird that can hover.", "he": "זו ציפור קטנה ומהירה מאוד שיכולה לרחף במקום." },
    "nature_animal_fact_7": { "en": "They are active at night and use echolocation.", "he": "הם פעילים בלילה ומשתמשים בסונאר (איכון הד)." },
    "nature_animal_fact_16": { "en": "They live on islands named after them in the Pacific.", "he": "הם חיים באיים הקרויים על שמם באוקיינוס השקט." },
    "nature_plant_fact_5": { "en": "It is the tallest tree species in the world.", "he": "זהו מין העץ הגבוה ביותר בעולם." },
    "nature_sea_fact_2": { "en": "It is the largest animal to ever exist.", "he": "זהו בעל החיים הגדול ביותר שחי אי פעם." },
    "nature_geo_fact_12": { "en": "The highest mountain in the world.", "he": "ההר הגבוה ביותר בעולם." },
    "nature_space_fact_8": { "en": "The largest planet in our solar system.", "he": "כוכב הלכת הגדול ביותר במערכת השמש שלנו." },
    "nature_space_fact_15": { "en": "The red planet.", "he": "כוכב הלכת האדום." },
    "nature_body_fact_4": { "en": "It's the hardest substance in the human body.", "he": "זהו החומר הקשה ביותר בגוף האדם." },
    "nature_animal_fact_22": { "en": "It has three hearts.", "he": "יש לו שלושה לבבות." },
    "nature_animal_fact_45": { "en": "The fastest land animal.", "he": "בעל החיים היבשתי המהיר ביותר." },
    "nature_insect_fact_5": { "en": "It has the longest migration of any insect.", "he": "יש לו את נתיב ההגירה הארוך ביותר בין החרקים." },
    "nature_bird_fact_12": { "en": "It can't fly but is a great swimmer.", "he": "הוא לא יכול לעוף אבל הוא שחיין מצוין." },
    "nature_weather_fact_7": { "en": "The center of a hurricane.", "he": "מרכז ההוריקן." },
    "nature_geo_fact_3": { "en": "The largest desert in the world.", "he": "המדבר הגדול ביותר בעולם." }
};

const israelL3Batch1 = {
    "israel_geo_fact_7": { "en": "A city on the shores of the Sea of Galilee.", "he": "עיר השוכנת על שפת הכנרת." },
    "q-tel-aviv-136": { "en": "It happened in April 1909.", "he": "זה קרה באפריל 1909." },
    "q-tel-aviv-137": { "en": "She was a famous cosmetics empress.", "he": "היא הייתה אימפריית קוסמטיקה מפורסמת." },
    "israel_hist_fact_12": { "en": "The year the state was established.", "he": "השנה בה הוקמה המדינה." },
    "israel_hist_fact_5": { "en": "The first President of Israel.", "he": "הנשיא הראשון של ישראל." },
    "israel_geo_fact_dist_33": { "en": "Located in the Jerusalem hills.", "he": "ממוקם בהרי ירושלים." },
    "israel_geo_fact_dist_46": { "en": "Located in the Golan Heights.", "he": "נמצא ברמת הגולן." },
    "israel_geo_fact_year_37": { "en": "The year the state was born.", "he": "השנה שבה נולדה המדינה." },
    "israel_geo_fact_year_11": { "en": "Established in the mid-1950s.", "he": "הוקם באמצע שנות ה-50." },
    "israel_geo_fact_year_8": { "en": "Founded by a group of pioneers in the 1930s.", "he": "נוסד על ידי קבוצת חלוצים בשנות ה-30." }
};

injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/nature.js', natureL3Batch1);
injectHints('/Users/yanivyaron/.gemini/antigravity/scratch/kids-card-game/src/data/questions/israel.js', israelL3Batch1);
