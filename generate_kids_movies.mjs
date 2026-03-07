import fs from 'fs';

const kidsMoviesData = [
    // Shrek
    { enQ: "What type of creature is Shrek?", heQ: "איזה יצור הוא שרק?", ansEn: "Ogre", ansHe: "עוג (מפלצת ירוקה)", d1En: "Troll", d1He: "טרול", d2En: "Goblin", d2He: "גובלין", d3En: "Giant", d3He: "ענק", emoji: "🧅" },
    { enQ: "What is the name of the Princess in Shrek?", heQ: "איך קוראים לנסיכה בשרק?", ansEn: "Fiona", ansHe: "פיונה", d1En: "Aurora", d1He: "אורורה", d2En: "Jasmine", d2He: "יסמין", d3En: "Belle", d3He: "בל", emoji: "👑" },
    { enQ: "Who is Shrek's best friend?", heQ: "מי החבר הכי טוב של שרק?", ansEn: "Donkey", ansHe: "חמור", d1En: "Puss in Boots", d1He: "החתול במגפיים", d2En: "Dragon", d2He: "הדרקונית", d3En: "Pinocchio", d3He: "פינוקיו", emoji: "🐴" },

    // Despicable Me / Minions
    { enQ: "What is the name of the main master in Despicable Me?", heQ: "איך קוראים לדמות הראשית בסרט גנוב על הירח (Despicable Me)?", ansEn: "Gru", ansHe: "גרו", d1En: "Vector", d1He: "וקטור", d2En: "El Macho", d2He: "אל מאצ'ו", d3En: "Balthazar", d3He: "בלתזאר", emoji: "🦹‍♂️" },
    { enQ: "What color are the Minions?", heQ: "באיזה צבע המיניונים?", ansEn: "Yellow", ansHe: "צהוב", d1En: "Green", d1He: "ירוק", d2En: "Blue", d2He: "כחול", d3En: "Orange", d3He: "כתום", emoji: "🍌" },
    { enQ: "What are the names of Gru's three adopted daughters?", heQ: "איך קוראים לשלוש הבנות המאומצות של גרו?", ansEn: "Margo, Edith, Agnes", ansHe: "מרגו, אדית, ואגנס", d1En: "Anna, Elsa, Olaf", d1He: "אנה, אלזה, ואולף", d2En: "Violet, Dash, Jack-Jack", d2He: "ויולט, דאש, וג'ק-ג'ק", d3En: "Joy, Sadness, Disgust", d3He: "שמחה, עצב, וגועל", emoji: "👧🦄" },

    // Madagascar
    { enQ: "What kind of animal is Alex in Madagascar?", heQ: "איזו חיה הוא אלכס בסרט מדגסקר?", ansEn: "Lion", ansHe: "אריה", d1En: "Zebra", d1He: "זברה", d2En: "Hippo", d2He: "היפופוטם", d3En: "Giraffe", d3He: "ג'ירפה", emoji: "🦁" },
    { enQ: "What is the name of the Zebra in Madagascar?", heQ: "איך קוראים לזברה במדגסקר?", ansEn: "Marty", ansHe: "מרטי", d1En: "Melman", d1He: "מלמן", d2En: "Gloria", d2He: "גלוריה", d3En: "Julien", d3He: "ג'וליאן", emoji: "🦓" },
    { enQ: "What song does King Julien like to sing?", heQ: "איזה שיר אוהב לשיר המלך ג'וליאן?", ansEn: "I Like to Move It", ansHe: "I Like to Move It", d1En: "Hakuna Matata", d1He: "האקונה מטטה", d2En: "Let It Go", d2He: "לעזוב (Let It Go)", d3En: "Under the Sea", d3He: "בתוך הים", emoji: "👑🐒" },

    // Ice Age
    { enQ: "What kind of animal is Manny in Ice Age?", heQ: "איזו חיה הוא מני מתעידן הקרח?", ansEn: "Mammoth", ansHe: "ממותה", d1En: "Sloth", d1He: "עצלן", d2En: "Saber-toothed Tiger", d2He: "טיגריס שנחרבי", d3En: "Squirrel", d3He: "סנאי", emoji: "🦣" },
    { enQ: "What is Scrat the squirrel always chasing?", heQ: "ממה סקראט הסנאי רודף תמיד בעידן הקרח?", ansEn: "An Acorn", ansHe: "בלוט", d1En: "A Walnut", d1He: "אגוז מלך", d2En: "A Peanut", d2He: "בוטן", d3En: "An Apple", d3He: "תפוח", emoji: "🐿️🌰" },
    { enQ: "What is the name of the Sloth in Ice Age?", heQ: "איך קוראים לעצלן בעידן הקרח?", ansEn: "Sid", ansHe: "סיד", d1En: "Diego", d1He: "דייגו", d2En: "Crash", d2He: "קראש", d3En: "Eddie", d3He: "אדי", emoji: "🦥" },

    // How to Train Your Dragon
    { enQ: "What is the name of Hiccup's dragon?", heQ: "איך קוראים לדרקון של היקאפ (הדרקון הראשון שלי)?", ansEn: "Toothless", ansHe: "שום-שן (טות'לס)", d1En: "Stormfly", d1He: "סופה", d2En: "Meatug", d2He: "בשרן", d3En: "Hookfang", d3He: "קרס-ניב", emoji: "🐉" },
    { enQ: "What kind of dragon is Toothless?", heQ: "איזה סוג של דרקון הוא שום-שן?", ansEn: "Night Fury", ansHe: "זעם לילי", d1En: "Deadly Nadder", d1He: "נדר קטלני", d2En: "Monstrous Nightmare", d2He: "סיוט מפלצתי", d3En: "Gronckle", d3He: "גרונקל", emoji: "🌌" },

    // The Incredibles
    { enQ: "What is Mr. Incredible's real name?", heQ: "מה שמו האמיתי של מר סופר-על?", ansEn: "Bob Parr", ansHe: "בוב פאר", d1En: "Lucius Best", d1He: "לושיוס בסט", d2En: "Buddy Pine", d2He: "באדי פיין", d3En: "Dash Parr", d3He: "דאש פאר", emoji: "🦸‍♂️" },
    { enQ: "Who makes the superhero suits in The Incredibles?", heQ: "מי מעצבת את חליפות גיבורי העל במשפחת סופר-על?", ansEn: "Edna Mode", ansHe: "עדנה מוד", d1En: "Helen Parr", d1He: "הלן פאר", d2En: "Syndrome", d2He: "סינדרום", d3En: "Mirage", d3He: "מיראז'", emoji: "👗👓" },
    { enQ: "What is Dash's superpower?", heQ: "מה כוח העל של דאש?", ansEn: "Super Speed", ansHe: "מהירות על", d1En: "Invisibility", d1He: "היעלמות", d2En: "Shape-shifting", d2He: "שינוי צורה", d3En: "Super Strength", d3He: "כוח על", emoji: "⚡🏃‍♂️" },

    // Encanto
    { enQ: "Which Family member doesn't get a gift in Encanto?", heQ: "לאיזו בת משפחה אין מתנת קסם באנקאנטו?", ansEn: "Mirabel", ansHe: "מירבל", d1En: "Isabela", d1He: "איסבלה", d2En: "Luisa", d2He: "לואיסה", d3En: "Dolores", d3He: "דולורס", emoji: "🦋" },
    { enQ: "Who do we 'not talk about' in Encanto?", heQ: "על מי 'לא מדברים' באנקאנטו?", ansEn: "Bruno", ansHe: "ברונו", d1En: "Camilo", d1He: "קמילו", d2En: "Felix", d2He: "פליקס", d3En: "Agustin", d3He: "אגוסטין", emoji: "🤫⌛" },

    // Tangled
    { enQ: "What represents the lost princess in Tangled?", heQ: "מהו הסמל של הנסיכה האבודה בפלונטר (Tangled)?", ansEn: "A Sun", ansHe: "שמש", d1En: "A Moon", d1He: "ירח", d2En: "A Star", d2He: "כוכב", d3En: "A Flower", d3He: "פרח", emoji: "☀️" },
    { enQ: "What is the name of Rapunzel's chameleon friend?", heQ: "איך קוראים לזיקית של רפונזל?", ansEn: "Pascal", ansHe: "פסקל", d1En: "Maximus", d1He: "מקסימוס", d2En: "Flynn", d2He: "פלין", d3En: "Sven", d3He: "סוון", emoji: "🦎" },

    // Zootopia
    { enQ: "What kind of animal is Judy Hopps?", heQ: "איזו חיה היא ג'ודי הופס (זוטרופוליס)?", ansEn: "Rabbit", ansHe: "ארנבת", d1En: "Fox", d1He: "שועלה", d2En: "Mouse", d2He: "עכברה", d3En: "Cat", d3He: "חתולה", emoji: "🐰👮‍♀️" },
    { enQ: "What type of animals work at the DMV in Zootopia?", heQ: "אילו חיות עובדות במשרד הרישוי בזוטרופוליס?", ansEn: "Sloths", ansHe: "עצלנים", d1En: "Cheetahs", d1He: "ברדלסים (צ'יטות)", d2En: "Turtles", d2He: "צבים", d3En: "Snails", d3He: "חלזונות", emoji: "🦥🏢" },

    // Inside Out
    { enQ: "Who is Riley's imaginary friend in Inside Out?", heQ: "מי הוא החבר הדמיוני של ריילי בהקול בראש?", ansEn: "Bing Bong", ansHe: "בינג בונג", d1En: "Joy", d1He: "שמחה", d2En: "Sadness", d2He: "עצב", d3En: "Anger", d3He: "כעס", emoji: "🐘🍬" },
    { enQ: "What color is the emotion Fear in Inside Out?", heQ: "באיזה צבע הרגש 'פחד' (בהקול בראש)?", ansEn: "Purple", ansHe: "סגול", d1En: "Green", d1He: "ירוק", d2En: "Red", d2He: "אדום", d3En: "Yellow", d3He: "צהוב", emoji: "😨🟪" },

    // Toy Story
    { enQ: "What is the name of the pink bear in Toy Story 3?", heQ: "איך קוראים לדוב הוורוד בצעצוע של סיפור 3?", ansEn: "Lotso", ansHe: "לוצו (Lots-o-Huggin' Bear)", d1En: "Ken", d1He: "קן", d2En: "Chuckles", d2He: "צ'אקלס", d3En: "Big Baby", d3He: "תינוק גדול", emoji: "🐻🍓" },
    { enQ: "Where does Woody belong in Toy Story 4?", heQ: "של מי וודי בצעצוע של סיפור 4?", ansEn: "Bonnie", ansHe: "בוני", d1En: "Andy", d1He: "אנדי", d2En: "Sid", d2He: "סיד", d3En: "Molly", d3He: "מולי", emoji: "👧🧸" },

    // Up
    { enQ: "Where is Carl trying to fly his house in Up?", heQ: "לאן קארל מנסה להטיס את הבית שלו בסרט 'למעלה'?", ansEn: "Paradise Falls", ansHe: "מפלי גן עדן", d1En: "Niagara Falls", d1He: "מפלי הניאגרה", d2En: "Angel Falls", d2He: "מפלי אנג'ל", d3En: "Victoria Falls", d3He: "מפלי ויקטוריה", emoji: "🎈🏠" },
    { enQ: "What kind of animal is Kevin in Up?", heQ: "איזו חיה הוא קווין בסרט 'למעלה'?", ansEn: "Bird", ansHe: "ציפור (ענק)", d1En: "Dog", d1He: "כלב", d2En: "Cat", d2He: "חתול", d3En: "Lizard", d3He: "לטאה", emoji: "🦤" },

    // Wall-E
    { enQ: "What is Wall-E's job?", heQ: "מה התפקיד של וואל-אי?", ansEn: "Trash Compactor", ansHe: "דחסן אשפה (מנקה)", d1En: "Space Explorer", d1He: "חוקר חלל", d2En: "Fighter", d2He: "לוחם", d3En: "Chef", d3He: "שף", emoji: "🤖🗑️" },
    { enQ: "What does Eve search for on Earth?", heQ: "מה איב (Eve) מחפשת בכדור הארץ?", ansEn: "A Plant", ansHe: "צמח (סימן לחיים)", d1En: "Water", d1He: "מים", d2En: "Gold", d2He: "זהב", d3En: "Animals", d3He: "חיות", emoji: "🌱" },

    // Ratatouille
    { enQ: "What is the name of the scary food critic in Ratatouille?", heQ: "איך קוראים למבקר המסעדות הקשוח ברטטוי?", ansEn: "Anton Ego", ansHe: "אנטון אגו", d1En: "Gusteau", d1He: "גוסטו", d2En: "Skinner", d2He: "סקינר", d3En: "Linguini", d3He: "לינגוויני", emoji: "🍷👨‍🍳" },

    // Monsters, Inc
    { enQ: "What is the human girl's real name in Monsters, Inc.?", heQ: "איך מייק וסאלי קוראים לילדה האנושית במפלצות בע\"מ?", ansEn: "Boo", ansHe: "בו", d1En: "Mary", d1He: "מארי", d2En: "Abby", d2He: "אבי", d3En: "Lucy", d3He: "לוסי", emoji: "👧🚪" },
    { enQ: "What do monsters collect to power their city?", heQ: "מה המפלצות באספות כדי לייצר חשמל לעיר?", ansEn: "Screams (and Later Laughs)", ansHe: "צרחות (ולאחר מכן צחוק)", d1En: "Tears", d1He: "דמעות", d2En: "Gold", d2He: "זהב", d3En: "Light", d3He: "אור", emoji: "😱⚡" },

    // Finding Nemo
    { enQ: "What is the address on the goggles in Finding Nemo?", heQ: "מה הכתובת שרשומה על משקפת הצלילה ב'מוצאים את נמו'?", ansEn: "P. Sherman, 42 Wallaby Way, Sydney", ansHe: "פ. שרמן, רחוב וואלבי 42, סידני", d1En: "J. Smith, 12 Ocean Drive, Gold Coast", d1He: "ג' סמית, רחוב הים 12, קוסט", d2En: "Nemo, Great Barrier Reef", d2He: "נמו, שונית המחסום הגדולה", d3En: "Dory, Sea Anemone, Ocean", d3He: "דורי, שושנת ים, האוקיינוס", emoji: "🥽🇦🇺" },
    { enQ: "What kind of animal is Crush?", heQ: "איזו חיה היא קראש ב'מוצאים את נמו'?", ansEn: "Sea Turtle", ansHe: "צב ים", d1En: "Shark", d1He: "כריש", d2En: "Whale", d2He: "לוויתן", d3En: "Stingray", d3He: "חתול ים (טריגון)", emoji: "🐢🌊" },

    // Spider-Verse
    { enQ: "Who is the main Spider-Man in Into the Spider-Verse?", heQ: "מי הוא ספיידרמן הראשי בסרט 'ספיידרמן: ממד העכביש'?", ansEn: "Miles Morales", ansHe: "מיילס מוראלס", d1En: "Peter Parker", d1He: "פיטר פארקר", d2En: "Miguel O'Hara", d2He: "מיגל אוהרה", d3En: "Gwen Stacy", d3He: "גוון סטייסי", emoji: "🕷️🕸️" },
    { enQ: "What hobby does Miles Morales love?", heQ: "איזה תחביב מיילס מוראלס הכי אוהב?", ansEn: "Graffiti / Art", ansHe: "גרפיטי / ציור", d1En: "Playing Guitar", d1He: "נגינה בגיטרה", d2En: "Football", d2He: "כדורגל", d3En: "Cooking", d3He: "בישול", emoji: "🎨🎧" },

    // Moana
    { enQ: "What is the name of the Demigod Moana seeks out?", heQ: "איך קוראים לחצי-אל שמואנה מנסה למצוא?", ansEn: "Maui", ansHe: "מאווי", d1En: "Chief Tui", d1He: "צ'יף טויי", d2En: "Tamatoa", d2He: "טאמאטואה", d3En: "Hei Hei", d3He: "היי היי", emoji: "🔱🌺" },
    { enQ: "What does Maui carry to use his magic?", heQ: "מה מאווי מחזיק כדי להשתמש בקסם (לשנות צורה)?", ansEn: "A magical fishhook", ansHe: "קרס קסם ענק", d1En: "A magical sword", d1He: "חרב קסומה", d2En: "A magical necklace", d2He: "שרשרת קסומה", d3En: "A special stone", d3He: "אבן מיוחדת", emoji: "🪝" },

    // Coco
    { enQ: "What holiday does Coco take place during?", heQ: "במהלך איזה חג מתרחש הסרט 'קוקו'?", ansEn: "Day of the Dead", ansHe: "יום המתים (דיא דה לוס מוארטוס)", d1En: "Halloween", d1He: "ליל כל הקדושים", d2En: "Christmas", d2He: "חג המולד", d3En: "Easter", d3He: "פסחא", emoji: "💀🌼" },
    { enQ: "What is the name of Miguel's great-grandmother?", heQ: "איך קוראים לסבתא-רבא של מיגל?", ansEn: "Coco", ansHe: "קוקו", d1En: "Imelda", d1He: "אימלדה", d2En: "Elena", d2He: "אלנה", d3En: "Frida", d3He: "פרידה", emoji: "👵🎸" },

    // Kung Fu Panda
    { enQ: "What is Po's dad's restaurant selling?", heQ: "מה מוכרת המסעדה של אבא של פו (קונג פו פנדה)?", ansEn: "Noodles", ansHe: "אטריות (נודלס)", d1En: "Dumplings", d1He: "כופתאות (דאמפלינגס)", d2En: "Sushi", d2He: "סושי", d3En: "Rice", d3He: "אורז", emoji: "🍜🐼" },
    { enQ: "What animal is Master Shifu?", heQ: "איזו חיה הוא מאסטר שיפו?", ansEn: "Red Panda", ansHe: "פנדה אדומה", d1En: "Raccoon", d1He: "דביבון", d2En: "Fox", d2He: "שועל", d3En: "Cat", d3He: "חתול", emoji: "🐾🥋" },

    // Lion King
    { enQ: "What is Simba's mother called?", heQ: "איך קוראים לאמא של סימבה במלך האריות?", ansEn: "Sarabi", ansHe: "סאראבי", d1En: "Nala", d1He: "נלה", d2En: "Kiara", d2He: "קיארה", d3En: "Sarafina", d3He: "סרפינה", emoji: "🦁" },
    { enQ: "What does 'Hakuna Matata' mean?", heQ: "מה הפירוש של המשפט 'האקונה מטטה'?", ansEn: "No Worries", ansHe: "אין דאגות", d1En: "Be Happy", d1He: "תהיה שמח", d2En: "Good Morning", d2He: "בוקר טוב", d3En: "Fast Runner", d3He: "רץ מהיר", emoji: "🐗🐒" },

    // Beauty and the beast
    { enQ: "What is the name of the teacup in Beauty and the Beast?", heQ: "איך קוראים לספל התה ב'היפה והחיה'?", ansEn: "Chip", ansHe: "צ'יפ", d1En: "Lumiere", d1He: "לומייר", d2En: "Cogsworth", d2He: "קוגסוורת'", d3En: "Mrs. Potts", d3He: "גברת תיון (מיסיס פוטס)", emoji: "☕🌹" },

    // Shrek 2
    { enQ: "What is the name of the city Fiona's parents rule?", heQ: "איך קוראים לעיר בה מולכים ההורים של פיונה?", ansEn: "Far Far Away", ansHe: "הרחק הרחק מכאן", d1En: "Duloc", d1He: "דולוק", d2En: "Neverland", d2He: "ארץ לעולם לא", d3En: "Wonderland", d3He: "ארץ הפלאות", emoji: "🏰" },

    // The Lego Movie
    { enQ: "What is the name of the main character in The Lego Movie?", heQ: "איך קוראים לדמות הראשית בסרט לגו?", ansEn: "Emmet", ansHe: "אמט", d1En: "Wyldstyle", d1He: "לוסי (ווילדסטייל)", d2En: "Batman", d2He: "באטמן", d3En: "Lord Business", d3He: "לורד ביזנס", emoji: "🧱👷" },

    // Mulan
    { enQ: "What is the name of Mulan's lucky cricket?", heQ: "איך קוראים לצרצר המזל של מולאן?", ansEn: "Cri-Kee", ansHe: "קרי-קי", d1En: "Mushu", d1He: "מושואו", d2En: "Khan", d2He: "חאן", d3En: "Shan Yu", d3He: "שאן יו", emoji: "🦗" }
];

let generatedQuestions = [];

function addQuestion(level, enText, heText, enCorrect, heCorrect, enOpts, heOpts, emoji) {
    const correctIdx = Math.floor(Math.random() * 4);
    enOpts.splice(correctIdx, 0, enCorrect);
    heOpts.splice(correctIdx, 0, heCorrect);
    generatedQuestions.push(`    { category: 'movies', level: ${level}, text: { en: ${JSON.stringify(enText)}, he: ${JSON.stringify(heText)} }, options: { en: ${JSON.stringify(enOpts)}, he: ${JSON.stringify(heOpts)} }, correctAnswer: ${correctIdx}, emoji: '${emoji}' }`);
}

for (let i = 0; i < kidsMoviesData.length; i++) {
    const q = kidsMoviesData[i];
    addQuestion(
        Math.random() > 0.5 ? 2 : 3, // Assign to level 2 or 3
        q.enQ,
        q.heQ,
        q.ansEn,
        q.ansHe,
        [q.d1En, q.d2En, q.d3En],
        [q.d1He, q.d2He, q.d3He],
        q.emoji
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
console.log(`Successfully injected ${kidsMoviesData.length} Kids Movies questions into questions.js`);
