import fs from 'fs';

const mashinaData = {
    members: [
        { role: 'Lead Singer', heRole: 'הסולן הראשי', en: 'Yuval Banai', he: 'יובל בנאי' },
        { role: 'Guitarist', heRole: 'הגיטריסט', en: 'Shlomi Bracha', he: 'שלומי ברכה' },
        { role: 'Bassist', heRole: 'בסיסט הלהקה', en: 'Michael Benson', he: 'מייקל בנסון' },
        { role: 'Drummer', heRole: 'המתופף', en: 'Iggy Dayan', he: 'איגי דיין' },
        { role: 'Keyboardist and Saxophonist', heRole: 'הקלידן והסקסופוניסט', en: 'Avner Hodorov', he: 'אבנר חודורוב' }
    ],
    albums: [
        {
            titleEn: 'Mashina (1985)', titleHe: 'משינה (1985)', songs: [
                { en: 'Rakevet Laila LeKahir', he: 'רכבת לילה לקהיר' },
                { en: 'Optikai Medulam', he: 'אופטיקאי מדופלם' },
                { en: 'Anna', he: 'אנה' },
                { en: 'Balada LaSohen Kaful', he: 'בלדה לסוכן כפול' },
                { en: 'HaTotach MeNabarone', he: 'התותח מנברון' }
            ]
        },
        {
            titleEn: 'Mashina 2 (1987)', titleHe: 'משינה 2 (1987)', songs: [
                { en: 'Shlach Li Malach', he: 'שלח לי מלאך' },
                { en: 'Anachnu Shnayim', he: 'אנחנו שניים' },
                { en: 'HaKofim Kofetzim', he: 'הקופים קופצים' }
            ]
        },
        {
            titleEn: 'Mashina 3 (1988)', titleHe: 'משינה 3 (1988)', songs: [
                { en: 'Ahuvati', he: 'אהובתי' },
                { en: 'Sheleg Tzach', he: 'שלג צח' },
                { en: 'Rikud HaMeChona', he: 'ריקוד המכונה' },
                { en: 'Polroid', he: 'פולארויד' },
                { en: 'Dani', he: 'דני' }
            ]
        },
        {
            titleEn: 'HaAmuta LeHeker HaTmuta (1990)', titleHe: 'העמותה לחקר התמותה (1990)', songs: [
                { en: 'Az Lama Li Politika Achshav', he: 'אז למה לי פוליטיקה עכשיו' },
                { en: 'HaCochavim Zorechim', he: 'הכוכבים דולקים על אש קטנה' },
                { en: 'Machoniyot', he: 'מכוניות' },
                { en: 'HaAmuta LeHeker HaTmuta', he: 'העמותה לחקר התמותה' },
                { en: 'Boey VeNipol', he: 'בואי וניפול' }
            ]
        },
        {
            titleEn: 'Miflatzot Tehilah (1992)', titleHe: 'מפלצות התהילה (1992)', songs: [
                { en: 'Ein Makom Acher', he: 'אין מקום אחר' },
                { en: 'It\'s No Game', he: 'איזה איש' },
                { en: 'Banot HaYam', he: 'בנות הים' },
                { en: 'Hakol Od Efshari', he: 'הכל עוד אפשרי' }
            ]
        },
        {
            titleEn: 'Farewell Tour (1995)', titleHe: 'להתראות נעורים שלום אהבה (1995)', songs: [
                { en: 'Tachzor Tachzor', he: 'תחזור תחזור' },
                { en: 'Lehitraot Neurim Shalom Ahava', he: 'להתראות נעורים שלום אהבה' },
                { en: 'Rodafeh', he: 'בן המלך' }
            ]
        }
    ]
};

const distractorsGeneralEn = [
    'Arik Einstein', 'Shalom Hanoch', 'Kaveret', 'Danny Sanderson', 'Gidi Gov',
    'HaYehudim', 'Eifo HaYeled', 'Monica Sex', 'Berry Sakharof', 'Rami Fortis',
    'Ehud Banai', 'Yitzhak Klepter'
];
const distractorsGeneralHe = [
    'אריק איינשטיין', 'שלום חנוך', 'כוורת', 'דני סנדרסון', 'גידי גוב',
    'היהודים', 'איפה הילד', 'מוניקה סקס', 'ברי סחרוף', 'רמי פורטיס',
    'אהוד בנאי', 'יצחק קלפטר'
];

let generatedQuestions = [];

function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    if (generatedQuestions.length >= 50) return;
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    generatedQuestions.push(`    { category: 'israeli_music', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
}

function getRandomGeneralDistractors(count) {
    const indices = [];
    while (indices.length < count) {
        const r = Math.floor(Math.random() * distractorsGeneralEn.length);
        if (!indices.includes(r)) indices.push(r);
    }
    return {
        en: indices.map(i => distractorsGeneralEn[i]),
        he: indices.map(i => distractorsGeneralHe[i])
    };
}

// Generates generic questions based on the Mashina dataset

// 1. Who is the X of Mashina? (Level 2)
for (const member of mashinaData.members) {
    const othersEn = mashinaData.members.filter(m => m.en !== member.en).map(m => m.en);
    const othersHe = mashinaData.members.filter(m => m.he !== member.he).map(m => m.he);
    // shuffle and pick 3
    const shuffledOthersEn = [];
    const shuffledOthersHe = [];
    const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, 3);
    for (const i of indices) {
        shuffledOthersEn.push(othersEn[i]);
        shuffledOthersHe.push(othersHe[i]);
    }
    addQuestion(
        2,
        `Who is the ${member.role} of Mashina?`,
        `מי הוא ${member.heRole} של משינה?`,
        member.en, member.he,
        shuffledOthersEn, shuffledOthersHe,
        '🎸'
    );
}

// 2. Which album contains the song X? (Level 3)
mashinaData.albums.forEach(album => {
    album.songs.forEach(song => {
        const otherAlbumsEn = mashinaData.albums.filter(a => a.titleEn !== album.titleEn).map(a => a.titleEn).sort(() => Math.random() - 0.5).slice(0, 3);
        const otherAlbumsHe = mashinaData.albums.filter(a => a.titleHe !== album.titleHe).map(a => a.titleHe).sort(() => Math.random() - 0.5).slice(0, 3);
        addQuestion(
            3,
            `Which Mashina album contains the song "${song.en}"?`,
            `באיזה מאלבומי משינה מופיע השיר "${song.he}"?`,
            album.titleEn, album.titleHe,
            otherAlbumsEn, otherAlbumsHe,
            '💿'
        );
    });
});

// 3. Which of these is a Mashina song? (Level 2)
const allSongs = mashinaData.albums.flatMap(a => a.songs);
for (let i = 0; i < allSongs.length; i++) {
    if (generatedQuestions.length >= 50) break;
    const song = allSongs[i];
    // We need distractors. Let's invent some fake song names or use generic ones from other bands.
    const fakeSongsEn = ['Oof Gozal', 'Yo Ya', 'Mehakim LaMashiach', 'Nofel Al HaRaglaim', 'Ptzatzim VeNeshikot', 'Inyan Shel Zman', 'Kama Yosi', 'Atur Mitzchech', 'HaMagafayim Shel Baruch', 'Ahava Kazu'];
    const fakeSongsHe = ['עוף גוזל', 'יו יה', 'מחכים למשיח', 'נופל על הרגליים', 'פצעים ונשיקות', 'עניין של זמן', 'כמה יוסי', 'עטור מצחך', 'המגפיים של ברוך', 'אהבה כזו'];
    const fi = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 3);

    addQuestion(
        2,
        `Which of these is a song by Mashina?`,
        `איזה מהשירים הבאים הוא שיר של משינה?`,
        song.en, song.he,
        [fakeSongsEn[fi[0]], fakeSongsEn[fi[1]], fakeSongsEn[fi[2]]],
        [fakeSongsHe[fi[0]], fakeSongsHe[fi[1]], fakeSongsHe[fi[2]]],
        '🚂'
    );
}

// 4. Fill up to 50 with more specific trivia if needed...
while (generatedQuestions.length < 50) {
    const s1 = allSongs[Math.floor(Math.random() * allSongs.length)];
    const general = getRandomGeneralDistractors(3);
    addQuestion(
        2,
        `Who performed the song "${s1.en}"?`,
        `מי ביצעה את השיר אולפן "${s1.he}"?`,
        'Mashina', 'משינה',
        general.en, general.he,
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
console.log(`Successfully injected ${generatedQuestions.length} Mashina questions into questions.js`);
