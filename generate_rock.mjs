import fs from 'fs';

const data = [
    {
        en: "Arik Einstein", he: "אריק איינשטיין", emoji: "🕊️",
        songs: [
            { en: "Oof Gozal", he: "עוף גוזל" }, { en: "Ani VeAta", he: "אני ואתה" },
            { en: "Sa Leat", he: "סע לאט" }, { en: "San Francisco Al HaMayim", he: "סן פרנסיסקו על המים" },
            { en: "Pesek Zman", he: "פסק זמן" }, { en: "Ima Adama", he: "אמא אדמה" },
            { en: "Atur Mitzchech", he: "עטור מצחך" }, { en: "Shir ShaYara", he: "שיר השיירה" },
            { en: "Kama Tov SheBata HaBaita", he: "כמה טוב שבאת הביתה" }, { en: "Pizmon LaYakinton", he: "פזמון ליקינתון" }
        ],
        albums: [
            { en: "Shablool", he: "שבלול" }, { en: "Plastelina", he: "פלסטלינה" },
            { en: "Pozi", he: "פוזי" }, { en: "Sa Leat", he: "סע לאט" }
        ]
    },
    {
        en: "Kaveret", he: "כוורת", emoji: "🐝",
        songs: [
            { en: "Yo Ya", he: "יו יה" }, { en: "Goliat", he: "גוליית" },
            { en: "Natati La Chaiyai", he: "נתתי לה חיי" }, { en: "Shir HaMakolet", he: "שיר המכולת" },
            { en: "HaMagafayim Shel Baruch", he: "המגפיים של ברוך" }, { en: "Shir Ahava Beduhi", he: "שיר אהבה בדואי" },
            { en: "Yeled Mizdakken", he: "ילד מזדקן" }, { en: "Shiur Moledet", he: "שיעור מולדת" },
            { en: "Lu Yehi", he: "לו יהי" }, { en: "Hora Heachzut", he: "הורה היאחזות" }
        ],
        albums: [
            { en: "Sipurei Poogy", he: "סיפורי פוגי" }, { en: "Poogy Roesh", he: "פוגי רועש" },
            { en: "Tzafoof BaOzen", he: "צפוף באוזן" }
        ]
    },
    {
        en: "Mashina", he: "משינה", emoji: "🚂",
        songs: [
            { en: "Rakevet Laila LeKahir", he: "רכבת לילה לקהיר" }, { en: "Ahuvati", he: "אהובתי" },
            { en: "Optikai Medulam", he: "אופטיקאי מדופלם" }, { en: "Anna", he: "אנה" },
            { en: "Ein Makom Acher", he: "אין מקום אחר" }, { en: "Sheleg Tzach", he: "שלג צח" },
            { en: "Dani", he: "דני" }, { en: "Ben HaMelech", he: "בן המלך" },
            { en: "Rikud HaMeChona", he: "ריקוד המכונה" }, { en: "Tachzor Tachzor", he: "תחזור תחזור" }
        ],
        albums: [
            { en: "Mashina", he: "משינה" }, { en: "Miflatzot Tehilah", he: "מפלצות התהילה" },
            { en: "HaAmuta LeHeker HaTmuta", he: "העמותה לחקר התמותה" }, { en: "Farewell", he: "להתראות נעורים שלום אהבה" }
        ]
    },
    {
        en: "Shalom Hanoch", he: "שלום חנוך", emoji: "🎸",
        songs: [
            { en: "Mehakim LaMashiach", he: "מחכים למשיח" }, { en: "Kacha VeKacha", he: "ככה וככה" },
            { en: "Maya", he: "מאיה" }, { en: "Bagilgul Haze", he: "בגלגול הזה" },
            { en: "Hadarachim HaYeduot", he: "הדרכים הידועות" }, { en: "Shir Lelo Shem", he: "שיר ללא שם" }
        ],
        albums: [
            { en: "Adam BeToch Atzmo", he: "אדם בתוך עצמו" }, { en: "Chatuna Levana", he: "חתונה לבנה" },
            { en: "Mehakim LaMashiach", he: "מחכים למשיח" }
        ]
    },
    {
        en: "Tammuz", he: "תמוז", emoji: "🍊",
        songs: [
            { en: "Sof Onat HaTapuzim", he: "סוף עונת התפוזים" }, { en: "Holech Batel", he: "הולך בטל" },
            { en: "Ma SheYoter Amok", he: "מה שיותר עמוק יותר כחול" }, { en: "Lo Yodea Eich Lomar Lach", he: "לא יודע איך לומר לך" }
        ],
        albums: [
            { en: "Sof Onat HaTapuzim", he: "סוף עונת התפוזים" }
        ]
    },
    {
        en: "Eifo HaYeled", he: "איפה הילד", emoji: "❓",
        songs: [
            { en: "Mishehu Shomea Oti", he: "מישהו שומע אותי" }, { en: "Nofel Al HaRaglaim", he: "נופל על הרגליים" },
            { en: "MaSheavar Met", he: "מה שעובר עלי" }, { en: "Rak Bishvil Lekabel Hibuk", he: "רק בשביל לקבל חיבוק" }
        ],
        albums: [
            { en: "Zman Sukar", he: "זמן סוכר" }, { en: "Shedim", he: "שדים" }
        ]
    },
    {
        en: "Monica Sex", he: "מוניקה סקס", emoji: "🎸",
        songs: [
            { en: "Maka Afura", he: "מכה אפורה" }, { en: "Ptzatzim VeNeshikot", he: "פצעים ונשיקות" },
            { en: "Al HaRitzpa", he: "על הרצפה" }, { en: "Kol HaChevre", he: "כל החברה" },
            { en: "Geshem Chazak", he: "גשם חזק" }
        ],
        albums: [
            { en: "Ptzatzim VeNeshikot", he: "פצעים ונשיקות" }, { en: "Yachasim Ptuhiim", he: "יחסים פתוחים" }
        ]
    },
    {
        en: "HaYehudim", he: "היהודים", emoji: "🤘",
        songs: [
            { en: "Mechapes Uteshuvah", he: "מחפש תשובה" }, { en: "Od Aron Ehad", he: "עוד ארון אחד" },
            { en: "Sami Hoshi", he: "סמי חופשי" }, { en: "Kach Oti", he: "קח אותי" },
            { en: "If You Go", he: "אם כבר" }
        ],
        albums: [
            { en: "Metziut Nifredet", he: "מציאות נפרדת" }, { en: "HaYehudim", he: "היהודים (אלבום)" }
        ]
    },
    {
        en: "Gidi Gov", he: "גידי גוב", emoji: "🎤",
        songs: [
            { en: "Roni", he: "רוני" }, { en: "Inyan Shel Zman", he: "עניין של זמן" },
            { en: "Naachaz BaAvir", he: "נאחז באוויר" }, { en: "Elef Kabaaim", he: "אלף כבאים" },
            { en: "Ani Shuv Ohev", he: "אני שוב מתאהב" }
        ],
        albums: [
            { en: "Derech Eretz", he: "דרך ארץ" }, { en: "Ein Od Yom", he: "אין עוד יום" }
        ]
    },
    {
        en: "Berry Sakharof", he: "ברי סחרוף", emoji: "🌕",
        songs: [
            { en: "Kama Yosi", he: "כמה יוסי" }, { en: "Ein Ketz LaYaldut", he: "אין קץ לילדות" },
            { en: "Yom Huledet", he: "יומולדת" }, { en: "Ruach Kochav", he: "רוח חדשה" },
            { en: "Od Chozer HaNigun", he: "עוד חוזר הניגון" }
        ],
        albums: [
            { en: "Simanim Shel Hulsha", he: "סימנים של חולשה" }, { en: "Negioth", he: "נגיעות" },
            { en: "Cham Al HaYareach", he: "חם על הירח" }
        ]
    }
];

const generatedQuestions = [];
let qCount = 0;

function getRandomDistractors(correctArtistEn, count) {
    const distractors = data.filter(d => d.en !== correctArtistEn).sort(() => 0.5 - Math.random()).slice(0, count);
    return distractors;
}

function addQuestion(level, enText, heText, enCorrect, heCorrect, distractors, emoji) {
    if (qCount >= 100) return;
    const correctIdx = Math.floor(Math.random() * 4);

    const enOpts = distractors.map(d => d.en);
    enOpts.splice(correctIdx, 0, enCorrect);

    const heOpts = distractors.map(d => d.he);
    heOpts.splice(correctIdx, 0, heCorrect);

    generatedQuestions.push(`    { category: 'israeli_music', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
    qCount++;
}

// 1. "Who sang [Song]?" questions (Level 2)
for (const artist of data) {
    for (const song of artist.songs) {
        if (qCount >= 60) break; // Limit these to 60 questions
        const distractors = getRandomDistractors(artist.en, 3);
        addQuestion(
            2,
            `Who sang "${song.en}"?`,
            `מי שר את "${song.he}"?`,
            artist.en,
            artist.he,
            distractors.map(d => ({ en: d.en, he: d.he })),
            artist.emoji
        );
    }
}

// 2. "Who released the album [Album]?" questions (Level 3)
for (const artist of data) {
    for (const album of artist.albums) {
        if (qCount >= 85) break;
        const distractors = getRandomDistractors(artist.en, 3);
        addQuestion(
            3,
            `Which artist released the album "${album.en}"?`,
            `מי הוציא את האלבום "${album.he}"?`,
            artist.en,
            artist.he,
            distractors.map(d => ({ en: d.en, he: d.he })),
            artist.emoji || '💿'
        );
    }
}

// 3. "Which of these is a song by [Artist]?" questions (Level 3)
for (const artist of data) {
    if (qCount >= 100) break;
    if (artist.songs.length === 0) continue;

    const correctSong = artist.songs[Math.floor(Math.random() * artist.songs.length)];
    const distractorArtists = getRandomDistractors(artist.en, 3);
    const distractors = distractorArtists.map(da => da.songs[Math.floor(Math.random() * da.songs.length)]);

    addQuestion(
        3,
        `Which of the following is a song by ${artist.en}?`,
        `איזה מהשירים הבאים שייך ל${artist.he}?`,
        correctSong.en,
        correctSong.he,
        distractors,
        '🎸'
    );
}

// Supplement up to 100 if we are short
while (qCount < 100) {
    const artist = data[Math.floor(Math.random() * data.length)];
    const song = artist.songs[Math.floor(Math.random() * artist.songs.length)];
    const distractorArtists = getRandomDistractors(artist.en, 3);
    const distractors = distractorArtists.map(da => da.songs[Math.floor(Math.random() * da.songs.length)]);

    addQuestion(
        3,
        `Identify the song by ${artist.en}:`,
        `זהה את השיר של ${artist.he}:`,
        song.en,
        song.he,
        distractors,
        '🎤'
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
console.log(`Successfully injected ${qCount} Israeli rock questions into questions.js`);
