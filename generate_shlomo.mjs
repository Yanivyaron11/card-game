import fs from 'fs';

const shlomoData = {
    hits: [
        { en: 'Yareach', he: 'ירח' },
        { en: 'Tirkod', he: 'תרקוד' },
        { en: 'Eretz Chadasha', he: 'ארץ חדשה' },
        { en: 'Shnayim', he: 'שניים' },
        { en: 'Gever Holech Le\'ibud', he: 'גבר הולך לאיבוד' },
        { en: 'Ahavtiha', he: 'אהבתיה' },
        { en: 'Tachat Shmei Yam Tichon', he: 'תחת שמי ים התיכון' },
        { en: 'Chom Yuli August', he: 'חום יולי אוגוסט' },
        { en: 'Menagev Lach T\'dmaot', he: 'מנגב לך ת\'דמעות' },
        { en: 'Melech HaOlam', he: 'מלך העולם' },
        { en: 'Tetaaru Lachem', he: 'תארו לכם' },
        { en: 'Kmo Az', he: 'כמו אז' },
        { en: 'Af Pa\'am Lo Yada\'ati', he: 'אף פעם לא ידעתי' },
        { en: 'Hi Lo Yoda\'at Ma Over Alay', he: 'היא לא יודעת מה עובר עלי' },
        { en: 'HaIh HaHu', he: 'האיש ההוא' },
        { en: 'Ktzat Ktzat', he: 'קצת קצת' },
        { en: 'Nof Yaldoot', he: 'נוף ילדות' },
        { en: 'Rov HaZman At Ishti', he: 'רוב הזמן את אשתי' },
        { en: 'Tzmaon', he: 'צימאון' },
        { en: 'Avsurd', he: 'אבסורד' },
        { en: 'Meahavot Yishnu HaYom', he: 'האהבה הישנה' },
        { en: 'Pitom KsheLo Ba', he: 'פתאום כשלא באת' },
        { en: 'Layla Lo Saket', he: 'לילה לא שקט' },
        { en: 'Kshe\'At Bocha At Lo Yafa', he: 'כשאת בוכה את לא יפה' } // Originally High Windows, but he has a very famous cover/live version? No wait, let's stick to his originals. Remove this.
    ].filter(s => s.en !== "Kshe\'At Bocha At Lo Yafa"),
    albums: [
        { en: 'Gever Holech Le\'ibud (1977)', he: 'גבר הולך לאיבוד (1977)' },
        { en: 'Drachim (1979)', he: 'דרכים (1979)' },
        { en: 'Chatzot (1981)', he: 'חצות (1981)' },
        { en: 'Tirkod (1984)', he: 'תרקוד (1984)' },
        { en: 'Layla Lo Saket (1986)', he: 'לילה לא שקט (1986)' },
        { en: 'Chom Yuli August (1988)', he: 'חום יולי אוגוסט (1988)' },
        { en: 'Yareach (1992)', he: 'ירח (1992)' },
        { en: 'Shnayim (1996)', he: 'שניים (1996)' },
        { en: 'Ahavtihem (2000)', he: 'אהבתיכם (2000)' },
        { en: 'Tzimaon (2002)', he: 'צימאון (2002)' },
        { en: 'Shfuim (2007)', he: 'שפויים (2007)' },
        { en: 'Osher Expres (2012)', he: 'אושר אקספרס (2012)' }
    ]
};

const distractorsPopEn = [
    'Rakevet Laila LeKahir', 'Oof Gozal', 'Yo Ya', 'Mehakim LaMashiach',
    'Ahuvati', 'Ein Makom Acher', 'Kama Yosi', 'Atur Mitzchech',
    'Ptzatzim VeNeshikot', 'Inyan Shel Zman', 'Bagilgul Haze', 'Lu Yehi'
];

const distractorsPopHe = [
    'רכבת לילה לקהיר', 'עוף גוזל', 'יו יה', 'מחכים למשיח',
    'אהובתי', 'אין מקום אחר', 'כמה יוסי', 'עטור מצחך',
    'פצעים ונשיקות', 'עניין של זמן', 'בגלגול הזה', 'לו יהי'
];

let generatedQuestions = [];
let qCount = 0;

function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    if (qCount >= 50) return;
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    generatedQuestions.push(`    { category: 'israeli_music', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
    qCount++;
}

// 1. Who sang the Shlomo Artzi hit? (Level 2)
for (const song of shlomoData.hits) {
    if (qCount >= 15) break;
    addQuestion(
        2,
        `Which Israeli legend sings "${song.en}"?`,
        `מי האגדה הישראלית ששר את "${song.he}"?`,
        'Shlomo Artzi', 'שלמה ארצי',
        ['Arik Einstein', 'Shalom Hanoch', 'Gidi Gov'],
        ['אריק איינשטיין', 'שלום חנוך', 'גידי גוב'],
        '🎸'
    );
}

// 2. Identify the Shlomo Artzi song among distractors (Level 2/3)
for (const song of shlomoData.hits) {
    if (qCount >= 30) break;
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5).slice(0, 3);
    addQuestion(
        2,
        `Which of these is a famous song by Shlomo Artzi?`,
        `איזה מהשירים הבאים נכתב/בוצע על ידי שלמה ארצי?`,
        song.en, song.he,
        [distractorsPopEn[indices[0]], distractorsPopEn[indices[1]], distractorsPopEn[indices[2]]],
        [distractorsPopHe[indices[0]], distractorsPopHe[indices[1]], distractorsPopHe[indices[2]]],
        '🎤'
    );
}

// 3. Album questions (Level 3)
for (const album of shlomoData.albums) {
    if (qCount >= 42) break;
    addQuestion(
        3,
        `Which artist released the highly successful album "${album.en}"?`,
        `איזה אמן הוציא את האלבום המצליח "${album.he}"?`,
        'Shlomo Artzi', 'שלמה ארצי',
        ['Shalom Hanoch', 'Arik Einstein', 'Yehuda Poliker'],
        ['שלום חנוך', 'אריק איינשטיין', 'יהודה פוליקר'],
        '💿'
    );
}

// 4. Fill up to 50 with "Who sang" from the remaining hits list (Level 3)
const remainingHits = shlomoData.hits.slice(15);
for (const song of remainingHits) {
    if (qCount >= 50) break;
    addQuestion(
        3,
        `Identify the singer of the classic "${song.en}":`,
        `מי הקליט במקור את השיר הקלאסי "${song.he}"?`,
        'Shlomo Artzi', 'שלמה ארצי',
        ['Yitzhak Klepter', 'Berry Sakharof', 'Matti Caspi'],
        ['יצחק קלפטר', 'ברי סחרוף', 'מתי כספי'],
        '🎼'
    );
}

// If we are somehow short:
while (qCount < 50) {
    const s = shlomoData.hits[Math.floor(Math.random() * shlomoData.hits.length)];
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5).slice(0, 3);
    addQuestion(
        3,
        `Which of these track titles belongs to Shlomo Artzi?`,
        `איזה משמות השירים הבאים שייך לשלמה ארצי?`,
        s.en, s.he,
        [distractorsPopEn[indices[0]], distractorsPopEn[indices[1]], distractorsPopEn[indices[2]]],
        [distractorsPopHe[indices[0]], distractorsPopHe[indices[1]], distractorsPopHe[indices[2]]],
        '👑'
    );
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
console.log(`Successfully injected 50 Shlomo Artzi questions into questions.js`);
