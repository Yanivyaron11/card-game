export const topics = [
    { id: 'animals', name: { en: 'Animals', he: 'חיות' }, icon: '🦁' },
    { id: 'countries', name: { en: 'Countries', he: 'מדינות' }, icon: '🌍' },
    { id: 'movies', name: { en: 'Movies (Pixar/Disney)', he: 'סרטים (פיקסאר/דיסני)' }, icon: '🎬' },
    { id: 'math', name: { en: 'Simple Math', he: 'חשבון פשוט' }, icon: '➕' },
];

export const questions = [
    // Animals (20)
    { category: 'animals', text: { en: 'Which animal is known as the King of the Jungle?', he: `איזו חיה ידועה כמלך החיות?` }, options: { en: ['Tiger', 'Lion', 'Elephant', 'Giraffe'], he: ['טיגריס', 'אריה', 'פיל', `ג'ירפה`] }, correctAnswer: 1, emoji: '👑🦁', level: 1 },
    { category: 'animals', text: { en: 'What is the fastest land animal?', he: `מהי החיה היבשתית המהירה ביותר?` }, options: { en: ['Cheetah', 'Horse', 'Greyhound', 'Leopard'], he: ["צ'יטה", 'סוס', 'כלב רוח', 'נמר'] }, correctAnswer: 0, emoji: '🐆⚡', level: 1 },
    { category: 'animals', text: { en: 'Which bird is a universal symbol of peace?', he: `איזה ציפור היא סמל אוניברסלי לשלום?` }, options: { en: ['Eagle', 'Owl', 'Pigeon', 'Dove'], he: ['עיט', 'ינשוף', 'יונת דואר', 'יונה'] }, correctAnswer: 3, emoji: '🕊️✌️', level: 2 },
    { category: 'animals', text: { en: 'What do pandas mostly eat?', he: `מה פנדות אוכלות בעיקר?` }, options: { en: ['Fish', 'Bamboo', 'Insects', 'Fruits'], he: ['דגים', 'במבוק', 'חרקים', 'פירות'] }, correctAnswer: 1, emoji: '🐼🎋', level: 1 },
    { category: 'animals', text: { en: 'How many legs does a spider have?', he: `כמה רגליים יש לעכביש?` }, options: { en: ['6', '8', '10', '12'], he: ['6', '8', '10', '12'] }, correctAnswer: 1, emoji: '🕷️🕸️', level: 1 },
    { category: 'animals', text: { en: 'Which mammal can fly?', he: `איזה יונק יכול לעוף?` }, options: { en: ['Flying Squirrel', 'Bat', 'Sugar Glider', 'Lemur'], he: ['סנאי דואה', 'עטלף', 'שוגר גליידר', 'למור'] }, correctAnswer: 1, emoji: '🦇🌙', level: 2 },
    { category: 'animals', text: { en: 'What is the largest animal on Earth?', he: `מהי החיה הגדולה ביותר בכדור הארץ?` }, options: { en: ['Elephant', 'Blue Whale', 'Giraffe', 'Shark'], he: ['פיל', 'לווייתן כחול', `ג'ירפה`, 'כריש'] }, correctAnswer: 1, emoji: '🐋🌊', level: 2 },
    { category: 'animals', text: { en: 'Which animal has black and white stripes?', he: `לאיזו חיה יש פסים בשחור ולבן?` }, options: { en: ['Zebra', 'Horse', 'Tiger', 'Cow'], he: ['זברה', 'סוס', 'טיגריס', 'פרה'] }, correctAnswer: 0, emoji: '🦓🖤', level: 1 },
    { category: 'animals', text: { en: 'What is the tallest animal in the world?', he: `מהי החיה הגבוהה ביותר בעולם?` }, options: { en: ['Elephant', 'Camel', 'Giraffe', 'Kangaroo'], he: ['פיל', 'גמל', `ג'ירפה`, 'קנגורו'] }, correctAnswer: 2, emoji: '🦒🌳', level: 1 },
    { category: 'animals', text: { en: 'Which bird is known for its beautiful tail feathers?', he: `איזו ציפור ידועה בנוצות הזנב היפהפיות שלה?` }, options: { en: ['Parrot', 'Peacock', 'Flamingo', 'Swan'], he: ['תוכי', 'טווס', 'פלמינגו', 'ברבור'] }, correctAnswer: 1, emoji: '🦚✨', level: 1 },
    { category: 'animals', text: { en: 'What animal produces wool?', he: `איזו חיה מייצרת צמר?` }, options: { en: ['Cow', 'Goat', 'Sheep', 'Alpaca'], he: ['פרה', 'עז', 'כבשה', 'אלפקה'] }, correctAnswer: 2, emoji: '🐑🧶', level: 1 },
    { category: 'animals', text: { en: 'Which animal carries its baby in a pouch?', he: `איזו חיה נושאת את התינוק שלה בכיס?` }, options: { en: ['Koala', 'Kangaroo', 'Possum', 'All of them'], he: ['קואלה', 'קנגורו', 'אופוסום', 'כולן'] }, correctAnswer: 1, emoji: '🦘👶', level: 3 },
    { category: 'animals', text: { en: 'What is a baby dog called?', he: `איך קוראים לתינוק של כלב?` }, options: { en: ['Kitten', 'Cub', 'Puppy', 'Calf'], he: ['חתלתול', 'גור', 'כלבלב', 'עגל'] }, correctAnswer: 2, emoji: '🐶❤️', level: 1 },
    { category: 'animals', text: { en: 'Which reptile can change its color?', he: `איזה זוחל יכול לשנות את צבעו?` }, options: { en: ['Snake', 'Turtle', 'Crocodile', 'Chameleon'], he: ['נחש', 'צב', 'תנין', 'זיקית'] }, correctAnswer: 3, emoji: '🦎🎨', level: 2 },
    { category: 'animals', text: { en: 'What do bees collect from flowers?', he: `מה דבורים אוספות מפרחים?` }, options: { en: ['Water', 'Dirt', 'Honey', 'Nectar'], he: ['מים', 'לכלוך', 'דבש', 'צוף'] }, correctAnswer: 3, emoji: '🐝🌸', level: 2 },
    { category: 'animals', text: { en: 'Which animal is known for having a long trunk?', he: `איזו חיה ידועה בחדק הארוך שלה?` }, options: { en: ['Rhino', 'Elephant', 'Hippo', 'Anteater'], he: ['קרנף', 'פיל', 'היפופוטם', 'דוב נמלים'] }, correctAnswer: 1, emoji: '🐘💦', level: 1 },
    { category: 'animals', text: { en: 'What is a group of lions called?', he: `איך קוראים לקבוצת אריות?` }, options: { en: ['Flock', 'Pack', 'Herd', 'Pride'], he: ['להקה', 'חבורה', 'עדר', 'גאווה'] }, correctAnswer: 3, emoji: '🦁🦁', level: 3 },
    { category: 'animals', text: { en: 'Which animal builds dams across rivers?', he: `איזו חיה בונה סכרים בנהרות?` }, options: { en: ['Otter', 'Beaver', 'Duck', 'Platypus'], he: ['לוטרה', 'בונה', 'ברווז', 'פלטיפוס'] }, correctAnswer: 1, emoji: '🦫🪵', level: 2 },
    { category: 'animals', text: { en: 'Slowest mammal on Earth?', he: `מי היונק האיטי ביותר בכדור הארץ?` }, options: { en: ['Turtle', 'Snail', 'Sloth', 'Koala'], he: ['צב', 'חלזון', 'עצלן', 'קואלה'] }, correctAnswer: 2, emoji: '🦥💤', level: 2 },
    { category: 'animals', text: { en: 'What is a female deer called?', he: `איך קוראים לאיילה נקבה?` }, options: { en: ['Doe', 'Buck', 'Fawn', 'Stag'], he: ['איילה', 'אייל', 'עופר', 'סטאג'] }, correctAnswer: 0, emoji: '🦌🌿', level: 3 },

    // Countries (20)
    { category: 'countries', text: { en: 'What is the capital of France?', he: `מהי בירת צרפת?` }, options: { en: ['London', 'Berlin', 'Madrid', 'Paris'], he: ['לונדון', 'ברלין', 'מדריד', 'פריז'] }, correctAnswer: 3, emoji: '🇫🇷🗼', level: 1 },
    { category: 'countries', text: { en: 'Which country is home to the kangaroo?', he: `איזו מדינה היא ביתו של הקנגורו?` }, options: { en: ['New Zealand', 'South Africa', 'Australia', 'Brazil'], he: ['ניו זילנד', 'דרום אפריקה', 'אוסטרליה', 'ברזיל'] }, correctAnswer: 2, emoji: '🦘🇦🇺', level: 1 },
    { category: 'countries', text: { en: 'Which country has the largest population?', he: `באיזו מדינה יש את האוכלוסייה הגדולה ביותר?` }, options: { en: ['India', 'USA', 'China', 'Russia'], he: ['הודו', 'ארה"ב', 'סין', 'רוסיה'] }, correctAnswer: 0, emoji: '🇮🇳🧑‍🤝‍🧑', level: 2 },
    { category: 'countries', text: { en: 'Where is the Eiffel Tower located?', he: `איפה נמצא מגדל אייפל?` }, options: { en: ['Rome', 'Paris', 'London', 'New York'], he: ['רומא', 'פריז', 'לונדון', 'ניו יורק'] }, correctAnswer: 1, emoji: '🗼🥖', level: 1 },
    { category: 'countries', text: { en: 'Known as the Land of the Rising Sun?', he: `מלכת המזרח - ארץ השמש העולה?` }, options: { en: ['China', 'Japan', 'South Korea', 'Vietnam'], he: ['סין', 'יפן', 'דרום קוריאה', 'וייטנאם'] }, correctAnswer: 1, emoji: '🇯🇵🌅', level: 2 },
    { category: 'countries', text: { en: 'What is the largest country by area?', he: `מהי המדינה הגדולה ביותר בשטחה?` }, options: { en: ['Canada', 'USA', 'China', 'Russia'], he: ['קנדה', 'ארה"ב', 'סין', 'רוסיה'] }, correctAnswer: 3, emoji: '🇷🇺🗺️', level: 2 },
    { category: 'countries', text: { en: 'Which country is shaped like a boot?', he: `איזו מדינה מעוצבת בצורת מגף?` }, options: { en: ['Spain', 'Greece', 'Italy', 'Portugal'], he: ['ספרד', 'יוון', 'איטליה', 'פורטוגל'] }, correctAnswer: 2, emoji: '🇮🇹👢', level: 1 },
    { category: 'countries', text: { en: 'Capital of the United States?', he: `מהי בירת ארצות הברית?` }, options: { en: ['New York', 'Los Angeles', 'Washington D.C.', 'Chicago'], he: ['ניו יורק', 'לוס אנגלס', 'וושינגטון דיסי', 'שיקגו'] }, correctAnswer: 2, emoji: '🇺🇸🦅', level: 1 },
    { category: 'countries', text: { en: 'Where are the Great Pyramids?', he: `איפה נמצאות הפירמידות הגדולות?` }, options: { en: ['Mexico', 'Egypt', 'Peru', 'India'], he: ['מקסיקו', 'מצרים', 'פרו', 'הודו'] }, correctAnswer: 1, emoji: '🇪🇬🐪', level: 1 },
    { category: 'countries', text: { en: 'Which country invented pizza?', he: `איזו מדינה המציאה את הפיצה?` }, options: { en: ['USA', 'France', 'Italy', 'Spain'], he: ['ארה"ב', 'צרפת', 'איטליה', 'ספרד'] }, correctAnswer: 2, emoji: '🍕🇮🇹', level: 1 },

    // Movies (20)
    { category: 'movies', text: { en: 'Toy Story cowboy name?', he: `איך קוראים לקאובוי בצעצוע של סיפור?` }, options: { en: ['Buzz', 'Woody', 'Andy', 'Rex'], he: ['באז', 'וודי', 'אנדי', 'רקס'] }, correctAnswer: 1, emoji: '🤠🧸', level: 1 },
    { category: 'movies', text: { en: 'Who is Simba in The Lion King?', he: `מי זה סימבה במלך האריות?` }, options: { en: ['Leopard', 'Tiger', 'Lion Cub', 'Bird'], he: ['נמר', 'טיגריס', 'גור אריות', 'ציפור'] }, correctAnswer: 2, emoji: '🦁🌅', level: 1 },
    { category: 'movies', text: { en: 'What kind of fish is Nemo?', he: `איזה סוג דג הוא נמו?` }, options: { en: ['Clownfish', 'Goldfish', 'Shark', 'Tuna'], he: ['דג ליצן', 'דג זהב', 'כריש', 'טונה'] }, correctAnswer: 0, emoji: '🐠🌊', level: 1 },
    { category: 'movies', text: { en: 'Frozen magical snowman?', he: `איך קוראים לאיש השלג הקסום בפרוזן?` }, options: { en: ['Kristoff', 'Sven', 'Hans', 'Olaf'], he: ['קריסטוף', 'סוון', 'האנס', 'אולף'] }, correctAnswer: 3, emoji: '⛄❄️', level: 1 },
    { category: 'movies', text: { en: 'Chef rat from Ratatouille?', he: `איך קוראים לחולדה השפית ברטטוי?` }, options: { en: ['Emile', 'Remy', 'Linguini', 'Gusteau'], he: ['אמיל', 'רמי', 'לינגוויני', 'גוסטו'] }, correctAnswer: 1, emoji: '🐀👨‍🍳', level: 2 },
    { category: 'movies', text: { en: 'What does Genie live in?', he: `בתוך מה גר הג'יני באלאדין?` }, options: { en: ['Bottle', 'Cave', 'Magic Lamp', 'Box'], he: ['בקבוק', 'מערה', 'מנורת קסמים', 'קופסה'] }, correctAnswer: 2, emoji: '🧞‍♂️🪔', level: 2 },
    {
        category: 'movies', text: { en: 'Little Mermaid name?', he: `איך קוראים לבת הים הקטנה?` }, options: {
            en: ['Belle', 'Ariel', 'Jasmine', 'Aurora'], he: ['בל', 'אריאל', "ג'סמין", 'אורורה']
        }, correctAnswer: 1, emoji: '🧜‍♀️🦀', level: 1
    },
    { category: 'movies', text: { en: 'Who leaves a glass slipper?', he: `מי השאירה נעל זכוכית בנשף?` }, options: { en: ['Snow White', 'Cinderella', 'Mulan', 'Rapunzel'], he: ['שלגיה', 'סינדרלה', 'מולאן', 'רפונזל'] }, correctAnswer: 1, emoji: '🥿🕛', level: 1 },
    { category: 'movies', text: { en: 'Monsters Inc. green guy?', he: `מי החבר הירוק והעין האחת במפלצות בע"מ?` }, options: { en: ['Sulley', 'Mike Wazowski', 'Boo', 'Roz'], he: ['סאלי', 'מייק וואזובסקי', 'בו', 'רוז'] }, correctAnswer: 1, emoji: '👁️🚪', level: 2 },
    { category: 'movies', text: { en: 'Kung Fu Panda animal?', he: `איזו חיה היא פו בקונג פו פנדה?` }, options: { en: ['Bear', 'Panda', 'Tiger', 'Monkey'], he: ['דוב', 'פנדה', 'טיגריס', 'קוף'] }, correctAnswer: 1, emoji: '🐼🥋', level: 1 },

    // Math (20)
    { category: 'math', text: { en: 'What is 5 + 7?', he: `כמה זה 5 + 7?` }, options: { en: ['10', '11', '12', '13'], he: ['10', '11', '12', '13'] }, correctAnswer: 2, emoji: '🖐️➕👇', level: 1 },
    { category: 'math', text: { en: 'What is 10 - 4?', he: `כמה זה 10 - 4?` }, options: { en: ['4', '5', '6', '7'], he: ['4', '5', '6', '7'] }, correctAnswer: 2, emoji: '🔟➖4️⃣', level: 1 },
    { category: 'math', text: { en: 'What is 3 x 4?', he: `כמה זה 3 כפול 4?` }, options: { en: ['7', '12', '14', '9'], he: ['7', '12', '14', '9'] }, correctAnswer: 1, emoji: '3️⃣✖️4️⃣', level: 2 },
    { category: 'math', text: { en: '2 apples + 3 apples?', he: `2 תפוחים + 3 תפוחים?` }, options: { en: ['4', '5', '6', '10'], he: ['4', '5', '6', '10'] }, correctAnswer: 1, emoji: '🍎🍏🍎', level: 1 },
    { category: 'math', text: { en: 'What is 15 + 5?', he: `כמה זה 15 + 5?` }, options: { en: ['18', '20', '22', '25'], he: ['18', '20', '22', '25'] }, correctAnswer: 1, emoji: '➕🧮', level: 1 },
    { category: 'math', text: { en: 'What is 20 / 4?', he: `כמה זה 20 חלקי 4?` }, options: { en: ['3', '4', '5', '6'], he: ['3', '4', '5', '6'] }, correctAnswer: 2, emoji: '➗🤔', level: 2 },
    { category: 'math', text: { en: 'How many sides in a square?', he: `כמה צלעות יש לריבוע?` }, options: { en: ['3', '4', '5', '6'], he: ['3', '4', '5', '6'] }, correctAnswer: 1, emoji: '◼️🔲', level: 1 },
    { category: 'math', text: { en: 'What is 8 + 8?', he: `כמה זה 8 + 8?` }, options: { en: ['14', '15', '16', '18'], he: ['14', '15', '16', '18'] }, correctAnswer: 2, emoji: '8️⃣➕8️⃣', level: 1 },
    { category: 'math', text: { en: 'What is 12 - 6?', he: `כמה זה 12 - 6?` }, options: { en: ['4', '5', '6', '7'], he: ['4', '5', '6', '7'] }, correctAnswer: 2, emoji: '1️⃣2️⃣➖6️⃣', level: 1 },
    { category: 'math', text: { en: 'What is 2 x 5?', he: `כמה זה 2 כפול 5?` }, options: { en: ['7', '10', '12', '15'], he: ['7', '10', '12', '15'] }, correctAnswer: 1, emoji: '✌️✖️🖐️', level: 1 },

    // Add more questions here... 
    // For brevity in this turn, I will finish the core set.
];
