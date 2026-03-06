export const topics = [
    { id: 'animals', name: { en: 'Animals', he: 'חיות' }, icon: '🦁' },
    { id: 'countries', name: { en: 'Countries', he: 'מדינות' }, icon: '🌍' },
    { id: 'movies', name: { en: 'Movies', he: 'סרטים' }, icon: '🎬' },
    { id: 'math', name: { en: 'Math', he: 'חשבון' }, icon: '➕' },
];

export const questions = [
    // --- ANIMALS (20) ---
    // Level 1 (Easy)
    { category: 'animals', level: 1, text: { en: 'Which animal is known as the King of the Jungle?', he: `איזו חיה ידועה כמלך החיות?` }, options: { en: ['Tiger', 'Lion', 'Elephant', 'Giraffe'], he: ['טיגריס', 'אריה', 'פיל', `ג'ירפה`] }, correctAnswer: 1, emoji: '👑🦁' },
    { category: 'animals', level: 1, text: { en: 'What do pandas mostly eat?', he: `מה פנדות אוכלות בעיקר?` }, options: { en: ['Fish', 'Bamboo', 'Insects', 'Fruits'], he: ['דגים', 'במבוק', 'חרקים', 'פירות'] }, correctAnswer: 1, emoji: '🐼🎋' },
    { category: 'animals', level: 1, text: { en: 'How many legs does a spider have?', he: `כמה רגליים יש לעכביש?` }, options: { en: ['6', '8', '10', '12'], he: ['6', '8', '10', '12'] }, correctAnswer: 1, emoji: '🕷️🕸️' },
    { category: 'animals', level: 1, text: { en: 'Which animal has black and white stripes?', he: `לאיזו חיה יש פסים בשחור ולבן?` }, options: { en: ['Zebra', 'Horse', 'Tiger', 'Cow'], he: ['זברה', 'סוס', 'טיגריס', 'פרה'] }, correctAnswer: 0, emoji: '🦓🖤' },
    { category: 'animals', level: 1, text: { en: 'What is the tallest animal in the world?', he: `מהי החיה הגבוהה ביותר בעולם?` }, options: { en: ['Elephant', 'Camel', 'Giraffe', 'Kangaroo'], he: ['פיל', 'גמל', `ג'ירפה`, 'קנגורו'] }, correctAnswer: 2, emoji: '🦒🌳' },
    { category: 'animals', level: 1, text: { en: 'What is a baby dog called?', he: `איך קוראים לתינוק של כלב?` }, options: { en: ['Kitten', 'Cub', 'Puppy', 'Calf'], he: ['חתלתול', 'גור', 'כלבלב', 'עגל'] }, correctAnswer: 2, emoji: '🐶❤️' },
    { category: 'animals', level: 1, text: { en: 'Which animal is known for having a long trunk?', he: `איזו חיה ידועה בחדק הארוך שלה?` }, options: { en: ['Rhino', 'Elephant', 'Hippo', 'Anteater'], he: ['קרנף', 'פיל', 'היפופוטם', 'דוב נמלים'] }, correctAnswer: 1, emoji: '🐘💦' },
    { category: 'animals', level: 1, text: { en: 'What sound does a cow make?', he: `איזה קול פרה עושה?` }, options: { en: ['Baa', 'Oink', 'Meow', 'Moo'], he: ['מההה', 'אוינק', 'מיאו', 'מוו'] }, correctAnswer: 3, emoji: '🐄🗣️' },
    // Level 2 (Medium)
    { category: 'animals', level: 2, text: { en: 'What is the fastest land animal?', he: `מהי החיה היבשתית המהירה ביותר?` }, options: { en: ['Cheetah', 'Horse', 'Greyhound', 'Leopard'], he: ["צ'יטה", 'סוס', 'כלב רוח', 'נמר'] }, correctAnswer: 0, emoji: '🐆⚡' },
    { category: 'animals', level: 2, text: { en: 'Which bird is a universal symbol of peace?', he: `איזה ציפור היא סמל אוניברסלי לשלום?` }, options: { en: ['Eagle', 'Owl', 'Pigeon', 'Dove'], he: ['עיט', 'ינשוף', 'יונת דואר', 'יונה'] }, correctAnswer: 3, emoji: '🕊️✌️' },
    { category: 'animals', level: 2, text: { en: 'Which mammal can fly?', he: `איזה יונק יכול לעוף?` }, options: { en: ['Flying Squirrel', 'Bat', 'Sugar Glider', 'Lemur'], he: ['סנאי דואה', 'עטלף', 'שוגר גליידר', 'למור'] }, correctAnswer: 1, emoji: '🦇🌙' },
    { category: 'animals', level: 2, text: { en: 'What is the largest animal on Earth?', he: `מהי החיה הגדולה ביותר בכדור הארץ?` }, options: { en: ['Elephant', 'Blue Whale', 'Giraffe', 'Shark'], he: ['פיל', 'לווייתן כחול', `ג'ירפה`, 'כריש'] }, correctAnswer: 1, emoji: '🐋🌊' },
    { category: 'animals', level: 2, text: { en: 'Which reptile can change its color?', he: `איזה זוחל יכול לשנות את צבעו?` }, options: { en: ['Snake', 'Turtle', 'Crocodile', 'Chameleon'], he: ['נחש', 'צב', 'תנין', 'זיקית'] }, correctAnswer: 3, emoji: '🦎🎨' },
    { category: 'animals', level: 2, text: { en: 'What do bees collect from flowers?', he: `מה דבורים אוספות מפרחים?` }, options: { en: ['Water', 'Dirt', 'Honey', 'Nectar'], he: ['מים', 'לכלוך', 'דבש', 'צוף'] }, correctAnswer: 3, emoji: '🐝🌸' },
    { category: 'animals', level: 2, text: { en: 'Which animal builds dams across rivers?', he: `איזו חיה בונה סכרים בנהרות?` }, options: { en: ['Otter', 'Beaver', 'Duck', 'Platypus'], he: ['לוטרה', 'בונה', 'ברווז', 'פלטיפוס'] }, correctAnswer: 1, emoji: '🦫🪵' },
    // Level 3 (Hard)
    { category: 'animals', level: 3, text: { en: 'Which animal carries its baby in a pouch?', he: `איזו חיה נושאת את התינוק שלה בכיס?` }, options: { en: ['Koala', 'Kangaroo', 'Possum', 'All of them'], he: ['קואלה', 'קנגורו', 'אופוסום', 'כולן'] }, correctAnswer: 3, emoji: '🦘👶' },
    { category: 'animals', level: 3, text: { en: 'What is a group of lions called?', he: `איך קוראים לקבוצת אריות?` }, options: { en: ['Flock', 'Pack', 'Herd', 'Pride'], he: ['להקה', 'חבורה', 'עדר', 'גאווה'] }, correctAnswer: 3, emoji: '🦁🦁' },
    { category: 'animals', level: 3, text: { en: 'What is a female deer called?', he: `איך קוראים לאיילה נקבה?` }, options: { en: ['Doe', 'Buck', 'Fawn', 'Stag'], he: ['איילה', 'אייל', 'עופר', 'סטאג'] }, correctAnswer: 0, emoji: '🦌🌿' },
    { category: 'animals', level: 3, text: { en: 'What bird has the largest wingspan?', he: `לאיזו ציפור יש את מוטת הכנפיים הגדולה ביותר?` }, options: { en: ['Eagle', 'Albatross', 'Condor', 'Pelican'], he: ['עיט', 'אלבטרוס', 'קונדור', 'שקנאי'] }, correctAnswer: 1, emoji: '🦅📏' },
    { category: 'animals', level: 3, text: { en: 'What is a baby kangaroo called?', he: `איך קוראים לגור קנגורו?` }, options: { en: ['Calf', 'Cub', 'Joey', 'Foal'], he: ['עגל', 'גור', 'גואי', 'סייח'] }, correctAnswer: 2, emoji: '🦘🍼' },

    // --- COUNTRIES (20) ---
    // Level 1 (Easy)
    { category: 'countries', level: 1, text: { en: 'What is the capital of France?', he: `מהי בירת צרפת?` }, options: { en: ['London', 'Berlin', 'Madrid', 'Paris'], he: ['לונדון', 'ברלין', 'מדריד', 'פריז'] }, correctAnswer: 3, emoji: '🇫🇷🗼' },
    { category: 'countries', level: 1, text: { en: 'Where is the Eiffel Tower located?', he: `איפה נמצא מגדל אייפל?` }, options: { en: ['Rome', 'Paris', 'London', 'New York'], he: ['רומא', 'פריז', 'לונדון', 'ניו יורק'] }, correctAnswer: 1, emoji: '🗼🥖' },
    { category: 'countries', level: 1, text: { en: 'Which country is shaped like a boot?', he: `איזו מדינה מעוצבת בצורת מגף?` }, options: { en: ['Spain', 'Greece', 'Italy', 'Portugal'], he: ['ספרד', 'יוון', 'איטליה', 'פורטוגל'] }, correctAnswer: 2, emoji: '🇮🇹👢' },
    { category: 'countries', level: 1, text: { en: 'Capital of the United States?', he: `מהי בירת ארצות הברית?` }, options: { en: ['New York', 'Los Angeles', 'Washington D.C.', 'Chicago'], he: ['ניו יורק', 'לוס אנגלס', 'וושינגטון דיסי', 'שיקגו'] }, correctAnswer: 2, emoji: '🇺🇸🦅' },
    { category: 'countries', level: 1, text: { en: 'Where are the Great Pyramids?', he: `איפה נמצאות הפירמידות הגדולות?` }, options: { en: ['Mexico', 'Egypt', 'Peru', 'India'], he: ['מקסיקו', 'מצרים', 'פרו', 'הודו'] }, correctAnswer: 1, emoji: '🇪🇬🐪' },
    { category: 'countries', level: 1, text: { en: 'Which country invented pizza?', he: `איזו מדינה המציאה את הפיצה?` }, options: { en: ['USA', 'France', 'Italy', 'Spain'], he: ['ארה"ב', 'צרפת', 'איטליה', 'ספרד'] }, correctAnswer: 2, emoji: '🍕🇮🇹' },
    { category: 'countries', level: 1, text: { en: 'What country is the Taj Mahal in?', he: `באיזו מדינה נמצא הטאג' מהאל?` }, options: { en: ['China', 'India', 'Egypt', 'Turkey'], he: ['סין', 'הודו', 'מצרים', 'טורקיה'] }, correctAnswer: 1, emoji: '🇮🇳🕌' },
    // Level 2 (Medium)
    { category: 'countries', level: 2, text: { en: 'Which country has the largest population?', he: `באיזו מדינה יש את האוכלוסייה הגדולה ביותר?` }, options: { en: ['India', 'USA', 'China', 'Russia'], he: ['הודו', 'ארה"ב', 'סין', 'רוסיה'] }, correctAnswer: 0, emoji: '🇮🇳🧑‍🤝‍🧑' },
    { category: 'countries', level: 2, text: { en: 'Known as the Land of the Rising Sun?', he: `מלכת המזרח - ארץ השמש העולה?` }, options: { en: ['China', 'Japan', 'South Korea', 'Vietnam'], he: ['סין', 'יפן', 'דרום קוריאה', 'וייטנאם'] }, correctAnswer: 1, emoji: '🇯🇵🌅' },
    { category: 'countries', level: 2, text: { en: 'What is the largest country by area?', he: `מהי המדינה הגדולה ביותר בשטחה?` }, options: { en: ['Canada', 'USA', 'China', 'Russia'], he: ['קנדה', 'ארה"ב', 'סין', 'רוסיה'] }, correctAnswer: 3, emoji: '🇷🇺🗺️' },
    { category: 'countries', level: 2, text: { en: 'What is the capital of Japan?', he: `מהי בירת יפן?` }, options: { en: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], he: ['סיאול', 'בייג\'ינג', 'טוקיו', 'בנגקוק'] }, correctAnswer: 2, emoji: '🇯🇵🗾' },
    { category: 'countries', level: 2, text: { en: 'Which country is home to the kangaroo?', he: `איזו מדינה היא ביתו של הקנגורו?` }, options: { en: ['New Zealand', 'South Africa', 'Australia', 'Brazil'], he: ['ניו זילנד', 'דרום אפריקה', 'אוסטרליה', 'ברזיל'] }, correctAnswer: 2, emoji: '🦘🇦🇺' },
    { category: 'countries', level: 2, text: { en: 'What is the capital of Spain?', he: `מהי בירת ספרד?` }, options: { en: ['Lisbon', 'Barcelona', 'Madrid', 'Seville'], he: ['ליסבון', 'ברצלונה', 'מדריד', 'סביליה'] }, correctAnswer: 2, emoji: '🇪🇸💃' },
    { category: 'countries', level: 2, text: { en: 'Which ocean lies to the east of the USA?', he: `איזה אוקיינוס נמצא ממזרח לארה"ב?` }, options: { en: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], he: ['השקט', 'האטלנטי', 'ההודי', 'הארקטי'] }, correctAnswer: 1, emoji: '🌊🗺️' },
    // Level 3 (Hard)
    { category: 'countries', level: 3, text: { en: 'What is the smallest country in the world?', he: `מהי המדינה הקטנה ביותר בעולם?` }, options: { en: ['Monaco', 'Vatican City', 'Malta', 'San Marino'], he: ['מונקו', 'קריית הוותיקן', 'מלטה', 'סן מרינו'] }, correctAnswer: 1, emoji: '🇻🇦⛪' },
    { category: 'countries', level: 3, text: { en: 'What is the capital of Australia?', he: `מהי בירת אוסטרליה?` }, options: { en: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'], he: ['סידני', 'מלבורן', 'בריסביין', 'קנברה'] }, correctAnswer: 3, emoji: '🇦🇺��️' },
    { category: 'countries', level: 3, text: { en: 'Which continent has the most countries?', he: `באיזו יבשת יש הכי הרבה מדינות?` }, options: { en: ['Asia', 'Africa', 'Europe', 'South America'], he: ['אסיה', 'אפריקה', 'אירופה', 'דרום אמריקה'] }, correctAnswer: 1, emoji: '🌍📊' },
    { category: 'countries', level: 3, text: { en: 'What is the capital of Canada?', he: `מהי בירת קנדה?` }, options: { en: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], he: ['טורונטו', 'ונקובר', 'מונטריאול', 'אוטווה'] }, correctAnswer: 3, emoji: '🇨🇦🍁' },
    { category: 'countries', level: 3, text: { en: 'Which country is known as the Land of Fire and Ice?', he: `איזו מדינה ידועה כארץ האש והקרח?` }, options: { en: ['Greenland', 'Iceland', 'Norway', 'Finland'], he: ['גרינלנד', 'איסלנד', 'נורווגיה', 'פינלנד'] }, correctAnswer: 1, emoji: '🇮🇸🌋' },
    { category: 'countries', level: 3, text: { en: 'What is the currency of Japan?', he: `מהו המטבע של יפן?` }, options: { en: ['Yuan', 'Won', 'Yen', 'Ringgit'], he: ['יואן', 'וון', 'ין', 'רינגיט'] }, correctAnswer: 2, emoji: '💴🇯🇵' },

    // --- MOVIES (Pixar/Disney) (20) ---
    // Level 1 (Easy)
    { category: 'movies', level: 1, text: { en: 'Toy Story cowboy name?', he: `איך קוראים לקאובוי בצעצוע של סיפור?` }, options: { en: ['Buzz', 'Woody', 'Andy', 'Rex'], he: ['באז', 'וודי', 'אנדי', 'רקס'] }, correctAnswer: 1, emoji: '🤠🧸' },
    { category: 'movies', level: 1, text: { en: 'Who is Simba in The Lion King?', he: `מי זה סימבה במלך האריות?` }, options: { en: ['Leopard', 'Tiger', 'Lion Cub', 'Bird'], he: ['נמר', 'טיגריס', 'גור אריות', 'ציפור'] }, correctAnswer: 2, emoji: '🦁🌅' },
    { category: 'movies', level: 1, text: { en: 'What kind of fish is Nemo?', he: `איזה סוג דג הוא נמו?` }, options: { en: ['Clownfish', 'Goldfish', 'Shark', 'Tuna'], he: ['דג ליצן', 'דג זהב', 'כריש', 'טונה'] }, correctAnswer: 0, emoji: '🐠🌊' },
    { category: 'movies', level: 1, text: { en: 'Frozen magical snowman?', he: `איך קוראים לאיש השלג הקסום בפרוזן?` }, options: { en: ['Kristoff', 'Sven', 'Hans', 'Olaf'], he: ['קריסטוף', 'סוון', 'האנס', 'אולף'] }, correctAnswer: 3, emoji: '⛄❄️' },
    { category: 'movies', level: 1, text: { en: 'Little Mermaid name?', he: `איך קוראים לבת הים הקטנה?` }, options: { en: ['Belle', 'Ariel', 'Jasmine', 'Aurora'], he: ['בל', 'אריאל', "ג'סמין", 'אורורה'] }, correctAnswer: 1, emoji: '🧜‍♀️🦀' },
    { category: 'movies', level: 1, text: { en: 'Who leaves a glass slipper?', he: `מי השאירה נעל זכוכית בנשף?` }, options: { en: ['Snow White', 'Cinderella', 'Mulan', 'Rapunzel'], he: ['שלגיה', 'סינדרלה', 'מולאן', 'רפונזל'] }, correctAnswer: 1, emoji: '🥿🕛' },
    { category: 'movies', level: 1, text: { en: 'Kung Fu Panda animal?', he: `איזו חיה היא פו בקונג פו פנדה?` }, options: { en: ['Bear', 'Panda', 'Tiger', 'Monkey'], he: ['דוב', 'פנדה', 'טיגריס', 'קוף'] }, correctAnswer: 1, emoji: '🐼🥋' },
    // Level 2 (Medium)
    { category: 'movies', level: 2, text: { en: 'Chef rat from Ratatouille?', he: `איך קוראים לחולדה השפית ברטטוי?` }, options: { en: ['Emile', 'Remy', 'Linguini', 'Gusteau'], he: ['אמיל', 'רמי', 'לינגוויני', 'גוסטו'] }, correctAnswer: 1, emoji: '🐀👨‍🍳' },
    { category: 'movies', level: 2, text: { en: 'What does Genie live in?', he: `בתוך מה גר הג'יני באלאדין?` }, options: { en: ['Bottle', 'Cave', 'Magic Lamp', 'Box'], he: ['בקבוק', 'מערה', 'מנורת קסמים', 'קופסה'] }, correctAnswer: 2, emoji: '🧞‍♂️🪔' },
    { category: 'movies', level: 2, text: { en: 'Monsters Inc. green guy?', he: `מי החבר הירוק והעין האחת במפלצות בע"מ?` }, options: { en: ['Sulley', 'Mike Wazowski', 'Boo', 'Roz'], he: ['סאלי', 'מייק וואזובסקי', 'בו', 'רוז'] }, correctAnswer: 1, emoji: '👁️🚪' },
    { category: 'movies', level: 2, text: { en: 'What is the name of the flying house movie?', he: `איך קוראים לסרט עם הבית המעופף מבלונים?` }, options: { en: ['Down', 'Fly', 'Up', 'High'], he: ['למטה', 'לעוף', 'למעלה (UP)', 'גבוה'] }, correctAnswer: 2, emoji: '🎈🏠' },
    { category: 'movies', level: 2, text: { en: 'Who is the villain in The Lion King?', he: `מי הנבל במלך האריות?` }, options: { en: ['Jafar', 'Scar', 'Ursula', 'Hook'], he: ['ג\'פאר', 'סקאר', 'אורסולה', 'הוק'] }, correctAnswer: 1, emoji: '🦁😈' },
    { category: 'movies', level: 2, text: { en: 'What is the princess in Aladdin named?', he: `איך קוראים לנסיכה באלאדין?` }, options: { en: ['Belle', 'Jasmine', 'Ariel', 'Mulan'], he: ['בל', 'יסמין', 'אריאל', 'מולאן'] }, correctAnswer: 1, emoji: '👸🐅' },
    { category: 'movies', level: 2, text: { en: 'What animal is Dumbo?', he: `איזו חיה הוא דמבו?` }, options: { en: ['Dog', 'Cat', 'Elephant', 'Horse'], he: ['כלב', 'חתול', 'פיל', 'סוס'] }, correctAnswer: 2, emoji: '🐘🎪' },
    // Level 3 (Hard)
    { category: 'movies', level: 3, text: { en: 'What is the name of Andy\'s neighbor in Toy Story 1?', he: `מה שם השכן ההורס צעצועים של אנדי?` }, options: { en: ['Sid', 'Max', 'Tom', 'Rex'], he: ['סיד', 'מקס', 'טום', 'רקס'] }, correctAnswer: 0, emoji: '💀🛹' },
    { category: 'movies', level: 3, text: { en: 'What type of trailing fish is Dory?', he: `איזה סוג דג היא דורי?` }, options: { en: ['Clownfish', 'Blue Tang', 'Shark', 'Pufferfish'], he: ['דג ליצן', 'בלוטנג חקיין', 'כריש', 'אבו נפחא'] }, correctAnswer: 1, emoji: '🐟🐠' },
    { category: 'movies', level: 3, text: { en: 'What is the city in Zootopia called?', he: `איך קוראים לעיר בסרט "זוטרופוליס"?` }, options: { en: ['Zootopia', 'Animal City', 'Mammalton', 'Wildville'], he: ['זוטופיה', 'עיר החיות', 'מאמלטון', 'פראוויל'] }, correctAnswer: 0, emoji: '🦊🐰' },
    { category: 'movies', level: 3, text: { en: 'In Coco, what is Miguel\'s family business?', he: `בסרט קוקו, מהו העסק המשפחתי של מיגל?` }, options: { en: ['Music', 'Baking', 'Shoemaking', 'Farming'], he: ['מוזיקה', 'אפייה', 'הכנת נעליים', 'חקלאות'] }, correctAnswer: 2, emoji: '🎸👞' },
    { category: 'movies', level: 3, text: { en: 'Which emotion is NOT in Inside Out 1?', he: `איזה רגש *לא* מופיע בהקול בראש הראשון?` }, options: { en: ['Joy', 'Anger', 'Anxiety', 'Disgust'], he: ['שמחה', 'כעס', 'חרדה', 'גועל'] }, correctAnswer: 2, emoji: '🧠🎭' },
    { category: 'movies', level: 3, text: { en: 'What is the name of the boy in Coco?', he: `איך קוראים לילד בסרט קוקו?` }, options: { en: ['Hector', 'Miguel', 'Julio', 'Ernesto'], he: ['הקטור', 'מיגל', 'חוליו', 'ארנסטו'] }, correctAnswer: 1, emoji: '👦🎤' },

    // --- MATH (20) ---
    // Level 1 (Easy)
    { category: 'math', level: 1, text: { en: 'What is 5 + 7?', he: `כמה זה 5 + 7?` }, options: { en: ['10', '11', '12', '13'], he: ['10', '11', '12', '13'] }, correctAnswer: 2, emoji: '🖐️➕��' },
    { category: 'math', level: 1, text: { en: 'What is 10 - 4?', he: `כמה זה 10 - 4?` }, options: { en: ['4', '5', '6', '7'], he: ['4', '5', '6', '7'] }, correctAnswer: 2, emoji: '🔟➖4️⃣' },
    { category: 'math', level: 1, text: { en: '2 apples + 3 apples?', he: `2 תפוחים + 3 תפוחים?` }, options: { en: ['4', '5', '6', '10'], he: ['4', '5', '6', '10'] }, correctAnswer: 1, emoji: '🍎🍏🍎' },
    { category: 'math', level: 1, text: { en: 'What is 15 + 5?', he: `כמה זה 15 + 5?` }, options: { en: ['18', '20', '22', '25'], he: ['18', '20', '22', '25'] }, correctAnswer: 1, emoji: '➕🧮' },
    { category: 'math', level: 1, text: { en: 'How many sides in a square?', he: `כמה צלעות יש לריבוע?` }, options: { en: ['3', '4', '5', '6'], he: ['3', '4', '5', '6'] }, correctAnswer: 1, emoji: '◼️🔲' },
    { category: 'math', level: 1, text: { en: 'What is 8 + 8?', he: `כמה זה 8 + 8?` }, options: { en: ['14', '15', '16', '18'], he: ['14', '15', '16', '18'] }, correctAnswer: 2, emoji: '8️⃣➕8️⃣' },
    { category: 'math', level: 1, text: { en: 'What is 12 - 6?', he: `כמה זה 12 - 6?` }, options: { en: ['4', '5', '6', '7'], he: ['4', '5', '6', '7'] }, correctAnswer: 2, emoji: '1️⃣2️⃣➖6️⃣' },
    // Level 2 (Medium)
    { category: 'math', level: 2, text: { en: 'What is 3 x 4?', he: `כמה זה 3 כפול 4?` }, options: { en: ['7', '12', '14', '9'], he: ['7', '12', '14', '9'] }, correctAnswer: 1, emoji: '3️⃣✖️4️⃣' },
    { category: 'math', level: 2, text: { en: 'What is 20 / 4?', he: `כמה זה 20 חלקי 4?` }, options: { en: ['3', '4', '5', '6'], he: ['3', '4', '5', '6'] }, correctAnswer: 2, emoji: '➗🤔' },
    { category: 'math', level: 2, text: { en: 'What is 2 x 5?', he: `כמה זה 2 כפול 5?` }, options: { en: ['7', '10', '12', '15'], he: ['7', '10', '12', '15'] }, correctAnswer: 1, emoji: '✌️✖️🖐️' },
    { category: 'math', level: 2, text: { en: 'What is 5 x 5?', he: `כמה זה 5 כפול 5?` }, options: { en: ['15', '20', '25', '30'], he: ['15', '20', '25', '30'] }, correctAnswer: 2, emoji: '🖐️✖️🖐️' },
    { category: 'math', level: 2, text: { en: 'What is 18 - 9?', he: `כמה זה 18 - 9?` }, options: { en: ['8', '9', '10', '11'], he: ['8', '9', '10', '11'] }, correctAnswer: 1, emoji: '➖🧮' },
    { category: 'math', level: 2, text: { en: 'What is 30 / 5?', he: `כמה זה 30 חלקי 5?` }, options: { en: ['5', '6', '7', '8'], he: ['5', '6', '7', '8'] }, correctAnswer: 1, emoji: '➗🖐️' },
    { category: 'math', level: 2, text: { en: 'What is 7 + 8?', he: `כמה זה 7 + 8?` }, options: { en: ['14', '15', '16', '13'], he: ['14', '15', '16', '13'] }, correctAnswer: 1, emoji: '➕✨' },
    // Level 3 (Hard)
    { category: 'math', level: 3, text: { en: 'What is 7 x 8?', he: `כמה זה 7 כפול 8?` }, options: { en: ['54', '56', '58', '60'], he: ['54', '56', '58', '60'] }, correctAnswer: 1, emoji: '✖️🤯' },
    { category: 'math', level: 3, text: { en: 'What is 100 / 4?', he: `כמה זה 100 חלקי 4?` }, options: { en: ['20', '25', '30', '35'], he: ['20', '25', '30', '35'] }, correctAnswer: 1, emoji: '💯➗' },
    { category: 'math', level: 3, text: { en: 'What is 9 x 9?', he: `כמה זה 9 כפול 9?` }, options: { en: ['81', '80', '82', '88'], he: ['81', '80', '82', '88'] }, correctAnswer: 0, emoji: '✖️🔥' },
    { category: 'math', level: 3, text: { en: 'What is 45 + 55?', he: `כמה זה 45 + 55?` }, options: { en: ['90', '95', '100', '110'], he: ['90', '95', '100', '110'] }, correctAnswer: 2, emoji: '💯➕' },
    { category: 'math', level: 3, text: { en: 'What is 144 / 12?', he: `כמה זה 144 חלקי 12?` }, options: { en: ['10', '11', '12', '14'], he: ['10', '11', '12', '14'] }, correctAnswer: 2, emoji: '➗🎓' },
    { category: 'math', level: 3, text: { en: 'What is 15 x 3?', he: `כמה זה 15 כפול 3?` }, options: { en: ['30', '35', '45', '50'], he: ['30', '35', '45', '50'] }, correctAnswer: 2, emoji: '✖️🚀' },
];
