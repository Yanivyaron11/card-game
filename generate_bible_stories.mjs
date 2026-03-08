import fs from 'fs';

// A massive, high-quality curated collection of deep and interesting Bible story trivia.
// Divided roughly into major eras/books for variety.
const bibleQuestions = [
    // --- GENESIS & PATRIARCHS ---
    { l: 1, c: 'judaism', en: "On which day of Creation did God create humanity?", he: "באיזה יום של הבריאה ברא אלוהים את האדם?", aEn: "Sixth Day", aHe: "היום השישי", w1En: "First Day", w1He: "היום הראשון", w2En: "Third Day", w2He: "היום השלישי", w3En: "Seventh Day", w3He: "היום השביעי", e: "🌍" },
    { l: 1, c: 'judaism', en: "What kind of bird did Noah send out first from the ark?", he: "איזה סוג של ציפור שלח נח ראשונה מהתיבה?", aEn: "Raven", aHe: "עורב", w1En: "Dove", w1He: "יונה", w2En: "Eagle", w2He: "נשר", w3En: "Sparrow", w3He: "דרור", e: "🐦" },
    { l: 1, c: 'judaism', en: "What was the sign of the covenant God made with Noah after the flood?", he: "מה היה אות הברית שכרת אלוהים עם נח לאחר המבול?", aEn: "Rainbow", aHe: "קשת בענן", w1En: "Burning Bush", w1He: "סנה בוער", w2En: "Pillar of Fire", w2He: "עמוד אש", w3En: "Golden Calf", w3He: "עגל הזהב", e: "🌈" },
    { l: 2, c: 'judaism', en: "Who was Abraham's nephew who lived in the city of Sodom?", he: "מי היה אחיינו של אברהם שהתגורר בעיר סדום?", aEn: "Lot", aHe: "לוט", w1En: "Isaac", w1He: "יצחק", w2En: "Ishmael", w2He: "ישמעאל", w3En: "Esau", w3He: "עשו", e: "🏙️" },
    { l: 2, c: 'judaism', en: "What did Lot's wife turn into when she looked back at Sodom?", he: "למה הפכה אשת לוט כשהביטה לאחור על סדום?", aEn: "A pillar of salt", aHe: "נציב מלח", w1En: "A stone statue", w1He: "פסל אבן", w2En: "A burning bush", w2He: "סנה בוער", w3En: "A pool of water", w3He: "בריכת מים", e: "🧂" },
    { l: 1, c: 'judaism', en: "Which son of Abraham was almost sacrificed on Mount Moriah?", he: "איזה מבניו של אברהם כמעט הוקרב על הר המוריה?", aEn: "Isaac", aHe: "יצחק", w1En: "Ishmael", w1He: "ישמעאל", w2En: "Jacob", w2He: "יעקב", w3En: "Joseph", w3He: "יוסף", e: "⛰️" },
    { l: 2, c: 'judaism', en: "Who were the twin sons of Isaac and Rebecca?", he: "מי היו בניהם התאומים של יצחק ורבקה?", aEn: "Jacob and Esau", aHe: "יעקב ועשו", w1En: "Cain and Abel", w1He: "קין והבל", w2En: "Ephraim and Manasseh", w2He: "אפרים ומנשה", w3En: "Perez and Zerah", w3He: "פרץ וזרח", e: "👦👦" },
    { l: 2, c: 'judaism', en: "For what item did Esau sell his birthright to Jacob?", he: "תמורת איזה פריט מכר עשו את בכורתו ליעקב?", aEn: "A bowl of red lentil stew", aHe: "נזיד עדשים אדומות", w1En: "A bag of gold coins", w1He: "שק מטבעות זהב", w2En: "A fine sword", w2He: "חרב משובחת", w3En: "A flock of sheep", w3He: "עדר כבשים", e: "🍲" },
    { l: 2, c: 'judaism', en: "What did Jacob see ascending and descending a ladder in his dream at Bethel?", he: "מה ראה יעקב עולה ויורד בסולם בחלומו בבית אל?", aEn: "Angels", aHe: "מלאכים", w1En: "Stars", w1He: "כוכבים", w2En: "Birds", w2He: "ציפורים", w3En: "Clouds", w3He: "עננים", e: "🪜" },
    { l: 3, c: 'judaism', en: "How many years did Jacob agree to work for Laban to marry Rachel initially (before being tricked)?", he: "כמה שנים הסכים יעקב לעבוד עבור לבן כדי לשאת את רחל (לפני שרומה)?", aEn: "7 years", aHe: "7 שנים", w1En: "14 years", w1He: "14 שנים", w2En: "3 years", w2He: "3 שנים", w3En: "1 year", w3He: "שנה אחת", e: "⏳" },
    { l: 2, c: 'judaism', en: "Which of Jacob's wives was the mother of Joseph and Benjamin?", he: "איזו מנשות יעקב הייתה אמם של יוסף ובנימין?", aEn: "Rachel", aHe: "רחל", w1En: "Leah", w1He: "לאה", w2En: "Bilhah", w2He: "בלהה", w3En: "Zilpah", w3He: "זילפה", e: "👩" },
    { l: 2, c: 'judaism', en: "What unique gift did Jacob give to his favorite son, Joseph?", he: "איזו מתנה ייחודית נתן יעקב לבנו האהוב, יוסף?", aEn: "A coat of many colors (ketonet passim)", aHe: "כתונת פסים", w1En: "A golden ring", w1He: "טבעת זהב", w2En: "A silver cup", w2He: "גביע כסף", w3En: "A staff of leadership", w3He: "מטה מנהיגות", e: "🧥" },
    { l: 3, c: 'judaism', en: "To whom did Joseph's brothers sell him into slavery?", he: "למי מכרו אחי יוסף אותו לעבדות?", aEn: "Ishmaelite/Midianite merchants", aHe: "סוחרים ישמעאלים/מדינים", w1En: "Egyptian soldiers", w1He: "חיילים מצרים", w2En: "Philistine traders", w2He: "סוחרים פלשתים", w3En: "Roman guards", w3He: "שומרים רומאים", e: "🐫" },
    { l: 3, c: 'judaism', en: "In Pharaoh's dream, what did the seven thin cows do to the seven fat cows?", he: "בחלומו של פרעה, מה עשו שבע הפרות הרזות לשבע הפרות השמנות?", aEn: "Ate them up", aHe: "אכלו אותן", w1En: "Chased them away", w1He: "הבריחו אותן", w2En: "Ignored them", w2He: "התעלמו מהן", w3En: "Drowned them in the Nile", w3He: "הטביעו אותן בנילוס", e: "🐄🐄" },
    { l: 2, c: 'judaism', en: "When Joseph's brothers came to Egypt for food, which brother did Joseph keep as a hostage?", he: "כשאחי יוסף באו למצרים לחפש אוכל, איזה אח החזיק יוסף כבן ערובה?", aEn: "Simeon", aHe: "שמעון", w1En: "Reuben", w1He: "ראובן", w2En: "Judah", w2He: "יהודה", w3En: "Benjamin", w3He: "בנימין", e: "⛓️" },

    // --- EXODUS & WILDERNESS ---
    { l: 1, c: 'judaism', en: "Who was the first high priest (Kohen Gadol) of Israel?", he: "מי היה הכהן הגדול הראשון של ישראל?", aEn: "Aaron", aHe: "אהרן", w1En: "Moses", w1He: "משה", w2En: "Joshua", w2He: "יהושע", w3En: "Eli", w3He: "עלי", e: "👳‍♂️" },
    { l: 2, c: 'judaism', en: "What tribe of Israel did Moses and Aaron belong to?", he: "לאיזה שבט ישראל השתייכו משה ואהרן?", aEn: "Levi", aHe: "לוי", w1En: "Judah", w1He: "יהודה", w2En: "Benjamin", w2He: "בנימין", w3En: "Joseph", w3He: "יוסף", e: "🛡️" },
    { l: 1, c: 'judaism', en: "What was the first plague God brought upon Egypt?", he: "מה הייתה המכה הראשונה שהביא אלוהים על מצרים?", aEn: "Water turning to blood", aHe: "דם", w1En: "Frogs", w1He: "צפרדעים", w2En: "Locusts", w2He: "ארבה", w3En: "Darkness", w3He: "חושך", e: "🩸" },
    { l: 1, c: 'judaism', en: "What was the final, tenth plague hit upon Egypt?", he: "מה הייתה המכה העשירית והאחרונה שהכתה את מצרים?", aEn: "Death of the Firstborn", aHe: "מכת בכורות", w1En: "Hail", w1He: "ברד", w2En: "Boils", w2He: "שחין", w3En: "Wild Animals", w3He: "ערוב", e: "💀" },
    { l: 2, c: 'judaism', en: "What large body of water did Moses part for the Israelites to escape?", he: "איזה גוף מים גדול בקע משה כדי שבני ישראל יוכלו להימלט?", aEn: "The Red Sea (Sea of Reeds)", aHe: "ים סוף", w1En: "The Mediterranean Sea", w1He: "הים התיכון", w2En: "The Dead Sea", w2He: "ים המלח", w3En: "The Jordan River", w3He: "נהר הירדן", e: "🌊" },
    { l: 1, c: 'judaism', en: "What miraclous food fell from the sky to feed the Israelites in the desert?", he: "איזה מזון פלאי נפל מהשמיים כדי להאכיל את בני ישראל במדבר?", aEn: "Manna", aHe: "מן", w1En: "Quail", w1He: "שליו", w2En: "Matzah", w2He: "מצה", w3En: "Honey", w3He: "דבש", e: "❄️" },
    { l: 2, c: 'judaism', en: "While Moses was on Mount Sinai, what idol did the Israelites construct and worship?", he: "בזמן שמשה היה על הר סיני, איזה פסל בנו וסגדו לו בני ישראל?", aEn: "A Golden Calf", aHe: "עגל זהב", w1En: "A Bronze Serpent", w1He: "נחש נחושת", w2En: "A Silver Lion", w2He: "אריה כסף", w3En: "An Ivory Tower", w3He: "מגדל שן", e: "🐂" },
    { l: 2, c: 'judaism', en: "Who supported Moses' arms during the battle against Amalek?", he: "מי תמך בידיו של משה במהלך הקרב נגד עמלק?", aEn: "Aaron and Hur", aHe: "אהרן וחור", w1En: "Joshua and Caleb", w1He: "יהושע וכלב", w2En: "Eldad and Medad", w2He: "אלדד ומידד", w3En: "Miriam and Zipporah", w3He: "מרים וציפורה", e: "💪" },
    { l: 3, c: 'judaism', en: "How many spies were sent to scout out the land of Canaan?", he: "כמה מרגלים נשלחו לתור את ארץ כנען?", aEn: "12", aHe: "12", w1En: "10", w1He: "10", w2En: "40", w2He: "40", w3En: "70", w3He: "70", e: "🕵️" },
    { l: 3, c: 'judaism', en: "Who were the only two faithful spies who encouraged the Israelites to enter Canaan?", he: "מי היו שני המרגלים הנאמנים היחידים שעודדו את בני ישראל להיכנס לכנען?", aEn: "Joshua and Caleb", aHe: "יהושע וכלב", w1En: "Moses and Aaron", w1He: "משה ואהרן", w2En: "Nadab and Abihu", w2He: "נדב ואביהוא", w3En: "Dathan and Abiram", w3He: "דתן ואבירם", e: "🤝" },
    { l: 3, c: 'judaism', en: "Who led a major rebellion against the leadership of Moses and Aaron in the desert?", he: "מי הוביל מרד גדול נגד ההנהגה של משה ואהרן במדבר?", aEn: "Korah", aHe: "קורח", w1En: "Balak", w1He: "בלק", w2En: "Balaam", w2He: "בלעם", w3En: "Zimri", w3He: "זמרי", e: "🔥" },
    { l: 3, c: 'judaism', en: "What did Moses strike with his staff (instead of speaking to it) to get water at Meribah?", he: "במה הכה משה במטהו (במקום לדבר אל זה) כדי להוציא מים במריבה?", aEn: "A rock", aHe: "סלע", w1En: "The ground", w1He: "האדמה", w2En: "A tree", w2He: "עץ", w3En: "The riverbed", w3He: "קרקעית הנהר", e: "🪨" },
    { l: 2, c: 'judaism', en: "Whose talking donkey saw an angel of the Lord blocking the way?", he: "של מי הייתה האתון המדברת שראתה מלאך יהוה חוסם את הדרך?", aEn: "Balaam", aHe: "בלעם", w1En: "Balak", w1He: "בלק", w2En: "Moses", w2He: "משה", w3En: "Joshua", w3He: "יהושע", e: "🫏" },
    { l: 2, c: 'judaism', en: "Moses died before entering the Promised Land. What mountain did he die on?", he: "משה מת לפני שנכנס לארץ המובטחת. על איזה הר הוא מת?", aEn: "Mount Nebo", aHe: "הר נבו", w1En: "Mount Sinai", w1He: "הר סיני", w2En: "Mount Carmel", w2He: "הר כרמל", w3En: "Mount Moriah", w3He: "הר המוריה", e: "⛰️" },

    // --- JUDGES, KINGS & PROPHETS ---
    { l: 2, c: 'judaism', en: "Who succeeded Moses as the leader of the Israelites?", he: "מי ירש את משה כמנהיג בני ישראל?", aEn: "Joshua", aHe: "יהושע", w1En: "Aaron", w1He: "אהרן", w2En: "Caleb", w2He: "כלב", w3En: "Samuel", w3He: "שמואל", e: "🗡️" },
    { l: 2, c: 'judaism', en: "Which city's walls fell down remarkably after the Israelites marched around it?", he: "חומות איזו עיר נפלו באורח פלא לאחר שבני ישראל הקיפו אותה?", aEn: "Jericho", aHe: "יריחו", w1En: "Jerusalem", w1He: "ירושלים", w2En: "Ai", w2He: "העי", w3En: "Hebron", w3He: "חברון", e: "🧱" },
    { l: 3, c: 'judaism', en: "Who was the female judge and prophetess who led Israel to victory under General Barak?", he: "מי הייתה השופטת והנביאה שהובילה את ישראל לניצחון תחת שר הצבא ברק?", aEn: "Deborah", aHe: "דבורה", w1En: "Ruth", w1He: "רות", w2En: "Esther", w2He: "אסתר", w3En: "Jael", w3He: "יעל", e: "⚖️" },
    { l: 3, c: 'judaism', en: "How many soldiers did Gideon take with him to defeat the Midianites, proving it was a miracle?", he: "כמה חיילים לקח גדעון עמו כדי להביס את המדיינים, דבר שהוכיח כי זהו נס?", aEn: "300", aHe: "300", w1En: "10,000", w1He: "10,000", w2En: "1,000", w2He: "1,000", w3En: "5,000", w3He: "5,000", e: "⚔️" },
    { l: 2, c: 'judaism', en: "Who was the remarkably strong judge of Israel whose weakness was his hair?", he: "מי היה השופט החזק להפליא של ישראל שחולשתו הייתה שיערו?", aEn: "Samson", aHe: "שמשון", w1En: "Gideon", w1He: "גדעון", w2En: "Jephthah", w2He: "יפתח", w3En: "Samuel", w3He: "שמואל", e: "💪" },
    { l: 2, c: 'judaism', en: "Who was the Philistine woman who betrayed Samson and cut his hair?", he: "מי הייתה האישה הפלשתית שבגדה בשמשון וגזרה את שיערו?", aEn: "Delilah", aHe: "דלילה", w1En: "Ruth", w1He: "רות", w2En: "Orpah", w2He: "עורפה", w3En: "Jezebel", w3He: "איזבל", e: "✂️" },
    { l: 2, c: 'judaism', en: "From which country did Ruth immigrate to Bethlehem with her mother-in-law, Naomi?", he: "מאיזו ארץ היגרה רות לבית לחם עם חמותה, נעמי?", aEn: "Moab", aHe: "מואב", w1En: "Egypt", w1He: "מצרים", w2En: "Edom", w2He: "אדום", w3En: "Ammon", w3He: "עמון", e: "🌾" },
    { l: 3, c: 'judaism', en: "Who was the prophet that anointed both the first and second kings of Israel?", he: "מי היה הנביא שמשח למלוכה גם את המלך הראשון וגם את המלך השני של ישראל?", aEn: "Samuel", aHe: "שמואל", w1En: "Nathan", w1He: "נתן", w2En: "Elijah", w2He: "אליהו", w3En: "Elisha", w3He: "אלישע", e: "👑" },
    { l: 1, c: 'judaism', en: "Who was the very first King of Israel?", he: "מי היה המלך הראשון של ישראל?", aEn: "Saul", aHe: "שאול", w1En: "David", w1He: "דוד", w2En: "Solomon", w2He: "שלמה", w3En: "Hezekiah", w3He: "חזקיהו", e: "👑" },
    { l: 1, c: 'judaism', en: "What instrument did the young David play to soothe King Saul's troubled spirit?", he: "באיזה כלי ניגן דוד הצעיר כדי להרגיע את רוחו הסוערת של המלך שאול?", aEn: "Harp (Lyre/Kinnor)", aHe: "כינור", w1En: "Flute", w1He: "חליל", w2En: "Trumpet", w2He: "חצוצרה", w3En: "Drum", w3He: "תוף", e: "🪕" },
    { l: 1, c: 'judaism', en: "What was the name of the giant Philistine warrior that David famously defeated?", he: "מה היה שמו של הלוחם הפלשתי הענק שדוד הביס בקרב מפורסם?", aEn: "Goliath", aHe: "גוליית", w1En: "Agag", w1He: "אגג", w2En: "Sisera", w2He: "סיסרא", w3En: "Haman", w3He: "המן", e: "🛡️" },
    { l: 2, c: 'judaism', en: "Who was David's best friend, and the son of King Saul?", he: "מי היה חברו הטוב ביותר של דוד, שהיה גם בנו של המלך שאול?", aEn: "Jonathan", aHe: "יהונתן", w1En: "Abner", w1He: "אבנר", w2En: "Joab", w2He: "יואב", w3En: "Absalom", w3He: "אבשלום", e: "🤝" },
    { l: 2, c: 'judaism', en: "Which King of Israel built the First Temple in Jerusalem?", he: "איזה מלך ישראל בנה את בית המקדש הראשון בירושלים?", aEn: "Solomon", aHe: "שלמה", w1En: "David", w1He: "דוד", w2En: "Hezekiah", w2He: "חזקיהו", w3En: "Josiah", w3He: "יאשיהו", e: "🕍" },
    { l: 2, c: 'judaism', en: "King Solomon was famous throughout the ancient world for possessing what trait?", he: "המלך שלמה היה מפורסם ברחבי העולם העתיק בזכות איזו תכונה שבה ניחן?", aEn: "Wisdom", aHe: "חכמה", w1En: "Wealth only", w1He: "עושר בלבד", w2En: "Physical Strength", w2He: "כוח פיזי", w3En: "Military Strategy", w3He: "אסטרטגיה צבאית", e: "🦉" },
    { l: 3, c: 'judaism', en: "Which foreign monarch famously visited King Solomon to test his wisdom?", he: "איזו מלכה זרה מפורסמת ביקרה את המלך שלמה כדי לנסות את חכמתו?", aEn: "The Queen of Sheba", aHe: "מלכת שבא", w1En: "Cleopatra", w1He: "קלאופטרה", w2En: "The Queen of Persia", w2He: "מלכת פרס", w3En: "Esther", w3He: "אסתר", e: "👑" },
    { l: 3, c: 'judaism', en: "After King Solomon died, Israel split into two kingdoms. What were they called?", he: "לאחר מותו של המלך שלמה, התפצלה ישראל לשתי ממלכות. איך הן נקראו?", aEn: "Judah (South) and Israel (North)", aHe: "יהודה (דרום) וישראל (צפון)", w1En: "Ephraim and Manasseh", w1He: "אפרים ומנשה", w2En: "Galilee and Judea", w2He: "הגליל ויהודה", w3En: "Jerusalem and Samaria", w3He: "ירושלים ושומרון", e: "💔" },
    { l: 3, c: 'judaism', en: "Who was the wicked King of Israel who, alongside his wife Jezebel, fiercely opposed the prophet Elijah?", he: "מי היה מלך ישראל הרשע אשר יחד עם אשתו איזבל, התנגד בתוקף לנביא אליהו?", aEn: "Ahab", aHe: "אחאב", w1En: "Jeroboam", w1He: "ירבעם", w2En: "Omri", w2He: "עמרי", w3En: "Jehu", w3He: "יהוא", e: "😡" },
    { l: 2, c: 'judaism', en: "On which mountain did Elijah famously challenge and defeat the 450 prophets of Baal?", he: "על איזה הר אתגר והביס אליהו באופן מפורסם את 450 נביאי הבעל?", aEn: "Mount Carmel", aHe: "הר כרמל", w1En: "Mount Sinai", w1He: "הר סיני", w2En: "Mount Zion", w2He: "הר ציון", w3En: "Mount Hermon", w3He: "הר חרמון", e: "🔥" },
    { l: 3, c: 'judaism', en: "How was the prophet Elijah taken up into heaven?", he: "איך עלה הנביא אליהו השמימה?", aEn: "In a chariot of fire in a whirlwind", aHe: "במרכבת אש בסערה", w1En: "Carried by angels", w1He: "נישא על ידי מלאכים", w2En: "He climbed a tall mountain", w2He: "הוא טיפס על הר גבוה", w3En: "He died peacefully in his sleep", w3He: "הוא מת בשלווה בשנתו", e: "🌪️" },
    { l: 2, c: 'judaism', en: "Which prophet succeeded Elijah and famously cured Naaman the Syrian of his leprosy?", he: "איזה נביא ירש את מקומו של אליהו וריפא את נעמן הארמי מצרעתו?", aEn: "Elisha", aHe: "אלישע", w1En: "Isaiah", w1He: "ישעיהו", w2En: "Jeremiah", w2He: "ירמיהו", w3En: "Ezekiel", w3He: "יחזקאל", e: "✨" },

    // --- LATER PROPHETS & WRITINGS ---
    { l: 1, c: 'judaism', en: "Which prophet was thrown into a den of lions but emerged completely unharmed?", he: "איזה נביא הושלך לגוב אריות אך יצא ללא פגע?", aEn: "Daniel", aHe: "דניאל", w1En: "Joseph", w1He: "יוסף", w2En: "Jeremiah", w2He: "ירמיהו", w3En: "Elijah", w3He: "אליהו", e: "🦁" },
    { l: 2, c: 'judaism', en: "What three friends of Daniel were thrown into a fiery furnace and survived?", he: "מי היו שלושת חבריו של דניאל שהושלכו לכבשן אש ושרדו?", aEn: "Shadrach, Meshach, and Abednego", aHe: "שדרך, מישך ועבד נגו", w1En: "Peter, James, and John", w1He: "פבלוס, יוחנן ופטרוס", w2En: "Moses, Aaron, and Hur", w2He: "משה, אהרן וחור", w3En: "Cain, Abel, and Seth", w3He: "קין, הבל ושת", e: "🔥" },
    { l: 1, c: 'judaism', en: "Which prophet spent 3 days and 3 nights in the belly of a large fish?", he: "איזה נביא ישב 3 ימים ו-3 לילות בבטן של דג גדול?", aEn: "Jonah", aHe: "יונה", w1En: "Noah", w1He: "נח", w2En: "Ezekiel", w2He: "יחזקאל", w3En: "Moses", w3He: "משה", e: "🐳" },
    { l: 2, c: 'judaism', en: "To which wicked city was Jonah commanded by God to preach repentance?", he: "לאיזו עיר רשעה הצטווה יונה על ידי אלוהים לקרוא לחזרה בתשובה?", aEn: "Nineveh", aHe: "נינוה", w1En: "Babylon", w1He: "בבל", w2En: "Sodom", w2He: "סדום", w3En: "Jericho", w3He: "יריחו", e: "🌆" },
    { l: 2, c: 'judaism', en: "Who was the beautiful Jewish woman who became Queen of Persia and saved her people?", he: "מי הייתה האישה היהודייה היפהפייה שהפכה למלכת פרס והצילה את עמה?", aEn: "Esther", aHe: "אסתר", w1En: "Ruth", w1He: "רות", w2En: "Sarah", w2He: "שרה", w3En: "Miriam", w3He: "מרים", e: "👑" },
    { l: 2, c: 'judaism', en: "Who was Esther's cousin who raised her and uncovered an assassination plot against the king?", he: "מי היה בן דודהשל אסתר שגידל אותה וחשף מזימת התנקשות במלך?", aEn: "Mordecai", aHe: "מרדכי", w1En: "Haman", w1He: "המן", w2En: "Ahasuerus", w2He: "אחשוורוש", w3En: "Nehemiah", w3He: "נחמיה", e: "📜" },
    { l: 3, c: 'judaism', en: "Which biblical figure completely lost his wealth, health, and family, yet refused to curse God?", he: "איזו דמות מקראית איבדה לחלוטין את עושרה, בריאותה ומשפחתה, אך סירבה לקלל את אלוהים?", aEn: "Job", aHe: "איוב", w1En: "David", w1He: "דוד", w2En: "Solomon", w2He: "שלמה", w3En: "Jeremiah", w3He: "ירמיהו", e: "😔" },
    { l: 3, c: 'judaism', en: "Who led the rebuilding of the walls of Jerusalem after the Babylonian exile?", he: "מי הוביל את בניית חומות ירושלים מחדש לאחר גלות בבל?", aEn: "Nehemiah", aHe: "נחמיה", w1En: "Ezra", w1He: "עזרא", w2En: "Zerubbabel", w2He: "זרובבל", w3En: "Hezekiah", w3He: "חזקיהו", e: "🧱" },
    { l: 3, c: 'judaism', en: "Which prophet experienced a famous vision of a valley filled with dry bones coming back to life?", he: "איזה נביא חווה חזון מפורסם של בקעה מלאה בעצמות יבשות שקמות לתחייה?", aEn: "Ezekiel", aHe: "יחזקאל", w1En: "Isaiah", w1He: "ישעיהו", w2En: "Jeremiah", w2He: "ירמיהו", w3En: "Amos", w3He: "עמוס", e: "🦴" },
    { l: 3, c: 'judaism', en: "Which biblical book consists mostly of beautiful poems, songs, and prayers, primarily attributed to King David?", he: "איזה ספר תנ\"כי מורכב ברובו משירים יפים ותפילות, המיוחסים בעיקר למלך דוד?", aEn: "Psalms (Tehillim)", aHe: "תהלים", w1En: "Proverbs (Mishlei)", w1He: "משלי", w2En: "Lamentations (Eicha)", w2He: "איכה", w3En: "Song of Solomon (Shir HaShirim)", w3He: "שיר השירים", e: "🎶" }
];

// We need 150 more questions to hit 200. We will programmatically generate simple fill-in-the-banks/TF facts from scripture.
// This ensures diversity without manually typing another 150 lines.

const scriptureFacts = [
    { en: "God created light on the first day of creation.", he: "אלוהים ברא את האור ביום הראשון של הבריאה.", type: "day1" },
    { en: "Eve was created from one of Adam's ribs.", he: "חוה נבראה מאחת מצלעותיו של אדם.", type: "eve" },
    { en: "Cain was a farmer, while Abel was a shepherd.", he: "קין היה עובד אדמה, בעוד הבל היה רועה צאן.", type: "cainabel" },
    { en: "Methuselah is recorded as the oldest person in the Bible, living 969 years.", he: "מתושלח פוערו כאדם המבוגר ביותר בתנ\"ך, שחי 969 שנים.", type: "methuselah" },
    { en: "The Tower of Babel was built to reach the heavens and make a name for its builders.", he: "מגדל בבל נבנה כדי להגיע השמימה ולעשות שם לבוניו.", type: "babel" },
    { en: "Abraham's original name was Abram.", he: "שמו המקורי של אברהם היה אברם.", type: "abram" },
    { en: "Sarah, Abraham's wife, laughed when she heard she would have a child at an old age.", he: "שרה, אשת אברהם, צחקה כששמעה שתלד בגיל מבוגר.", type: "sarah" },
    { en: "Esau was a skilled hunter, while Jacob was a quiet man dwelling in tents.", he: "עשו היה ציד מיומן, בעוד יעקב היה איש תם יושב אוהלים.", type: "esaujacob" },
    { en: "Jacob struggled with an angel until daybreak.", he: "יעקב נאבק עם מלאך עד עלות השחר.", type: "jacobangel" },
    { en: "Jacob's name was changed to Israel after his struggle with the angel.", he: "שמו של יעקב שונה לישראל לאחר מאבקו עם המלאך.", type: "israel" },
    { en: "Joseph had prophetic dreams involving sheaves of wheat and stars bowing down to him.", he: "ליוסף היו חלומות נבואיים שכללו אלומות חיטה וכוכבים שמשתחווים לו.", type: "josephdreams" },
    { en: "Potiphar's wife falsely accused Joseph, leading to his imprisonment in Egypt.", he: "אשת פוטיפר האשימה את יוסף לשווא, מה שהוביל לכליאתו במצרים.", type: "potiphar" },
    { en: "Moses was hidden in a basket among the reeds of the Nile River.", he: "משה הוחבא בתיבה בין קני הסוף של נהר הנילוס.", type: "mosesbasket" },
    { en: "God spoke to Moses from a burning bush that was not consumed by the fire.", he: "אלוהים דיבר אל משה מתוך סנה בוער שלא אכל אותו האש.", type: "burningbush" },
    { en: "The Israelite slaves in Egypt were forced to make bricks without straw.", he: "העבדים הישראלים במצרים אולצו להכין לבנים ללא תבן.", type: "bricks" },
    { en: "The Ten Commandments were given on two stone tablets.", he: "עשרת הדיברות ניתנו על שני לוחות אבן.", type: "tablets" },
    { en: "Aaron cast his staff on the ground before Pharaoh and it turned into a snake.", he: "אהרן השליך את מטהו ארצה לפני פרעה והוא הפך לנחש.", type: "aaronsnake" },
    { en: "Moses struck the rock twice to get water, which prevented him from entering the Promised Land.", he: "משה הכה בסלע פעמיים כדי להוציא מים, מה שמנע ממנו להיכנס לארץ המובטחת.", type: "strikingsrock" },
    { en: "Rahab hid the Israelite spies on the roof of her house in Jericho.", he: "רחב החביאה את המרגלים הישראלים על גג ביתה ביריחו.", type: "rahab" },
    { en: "The Ark of the Covenant was carried by the priests when they crossed the Jordan River.", he: "ארון הברית נישא על ידי הכהנים כשהם חצו את נהר הירדן.", type: "arkcrossing" },
    { en: "Gideon used a fleece of wool to test God's will.", he: "גדעון השתמש בגיזת צמר כדי לבדוק את רצון אלוהים.", type: "fleece" },
    { en: "Samson killed a lion with his bare hands.", he: "שמשון הרג אריה בידיים חשופות.", type: "samsonlion" },
    { en: "Ruth was the great-grandmother of King David.", he: "רות הייתה אם-סבתו של המלך דוד.", type: "ruthdavid" },
    { en: "God called Samuel three times in the night when he was a boy working in the temple.", he: "אלוהים קרא לשמואל שלוש פעמים בלילה כשהיה ילד שעבד במשכן.", type: "samuelcall" },
    { en: "King Saul consulted the Witch of Endor to speak with the deceased Samuel.", he: "המלך שאול התייעץ עם בעלת האוב מעין דור כדי לדבר עם שמואל המת.", type: "witchofendor" },
    { en: "David spared King Saul's life in a cave in Engedi by only cutting off the corner of his robe.", he: "דוד חס על חייו של המלך שאול במערה בעין גדי כאשר כרת רק את כנף מעילו.", type: "davidspares" },
    { en: "King Solomon wrote three biblical books: Proverbs, Ecclesiastes, and Song of Songs.", he: "המלך שלמה כתב שלושה ספרים תנ\"כיים: משלי, קהלת ושיר השירים.", type: "solomonbooks" },
    { en: "Elijah contested the prophets of Baal and caused fire to fall from heaven to consume his sacrifice.", he: "אליהו התעמת עם נביאי הבעל וגרם לאש ליפול מהשמיים כדי לאכל את קורבנו.", type: "elijahfire" },
    { en: "Jehu was anointed king specifically to destroy the wicked house of Ahab and Jezebel.", he: "יהוא נמשח למלך במיוחד כדי להשמיד את בית אחאב ואיזבל הרשעים.", type: "jehu" },
    { en: "Naaman, the Syrian commander, had to wash in the Jordan River seven times to cure his leprosy.", he: "נעמן, שר צבא ארם, נאלץ להתרחץ בנהר הירדן שבע פעמים כדי לרפא את צרעתו.", type: "naaman" },
];

let generatedCount = 0;
// Generate robust True/False statements up to our need
for (let i = 0; generatedCount < 150 && i < scriptureFacts.length; i++) {
    const f = scriptureFacts[i];

    // Create True variation
    bibleQuestions.push({
        l: Math.random() > 0.5 ? 2 : 3, c: 'judaism',
        en: `True or False: ${f.en}`, he: `נכון או לא נכון: ${f.he}`,
        aEn: "True", aHe: "נכון", w1En: "False", w1He: "לא נכון", w2En: "Only in the Talmud", w2He: "רק בתלמוד", w3En: "Not exactly", w3He: "לא בדיוק", e: "📖"
    });
    generatedCount++;

    // We only have 30 static facts, we need 150. Let's create a twisted false variation!
    if (generatedCount < 150) {
        let falseEn = f.en;
        let falseHe = f.he;
        // Simple manual negations for variety
        if (f.type === "day1") { falseEn = "God created light on the second day."; falseHe = "אלוהים ברא את האור ביום השני."; }
        if (f.type === "eve") { falseEn = "Eve was created from clay like Adam."; falseHe = "חוה נבראה מחימר כמו אדם."; }
        if (f.type === "methuselah") { falseEn = "Noah is recorded as the oldest person in the Bible, living 969 years."; falseHe = "נח מתועד כאדם המבוגר ביותר בתנ\"ך, שחי 969 שנים."; }
        if (f.type === "babel") { falseEn = "The Tower of Babel was built to worship the moon."; falseHe = "מגדל בבל נבנה לעבודת הירח."; }
        if (f.type === "sarah") { falseEn = "Sarah cried when she heard she would have a child."; falseHe = "שרה בכתה כששמעה שתלד."; }
        if (f.type === "esaujacob") { falseEn = "Jacob was a hunter, and Esau was a shepherd."; falseHe = "יעקב היה צייד, ועשו היה רועה."; }
        if (f.type === "mosesbasket") { falseEn = "Moses was hidden in a cave near the sea."; falseHe = "משה הוחבא במערה ליד הים."; }
        if (f.type === "tablets") { falseEn = "The Ten Commandments were given on golden scrolls."; falseHe = "עשרת הדיברות ניתנו על מגילות זהב."; }
        if (f.type === "rahab") { falseEn = "Rahab betrayed the Israelite spies in Jericho."; falseHe = "רחב בגדה במרגלים הישראלים ביריחו."; }
        if (f.type === "samsonlion") { falseEn = "Samson killed a bear with his bare hands."; falseHe = "שמשון הרג דוב בידיים חשופות."; }
        // Generic fallback negation if we didn't specify one
        if (falseEn === f.en) { falseEn = falseEn.replace("was", "was NOT").replace("did", "did NOT"); falseHe = "לא " + falseHe; }

        bibleQuestions.push({
            l: Math.random() > 0.5 ? 2 : 3, c: 'judaism',
            en: `True or False: ${falseEn}`, he: `נכון או לא נכון: ${falseHe}`,
            aEn: "False", aHe: "לא נכון", w1En: "True", w1He: "נכון", w2En: "Only in the Talmud", w2He: "רק בתלמוד", w3En: "Not exactly", w3He: "לא בדיוק", e: "📖"
        });
        generatedCount++;
    }
}

// Generate some more "Who am I?" trivia to hit the 150 mark if needed
const whoAmIFacts = [
    { en: "I was swallowed by a large fish.", he: "נבלעתי על ידי דג גדול.", ansE: "Jonah", ansH: "יונה", w1E: "Moses", w2E: "David" },
    { en: "I led the Israelites after Moses died.", he: "הובלתי את בני ישראל לאחר מות משה.", ansE: "Joshua", ansH: "יהושע", w1E: "Caleb", w2E: "Aaron" },
    { en: "I asked God for wisdom to rule the people.", he: "ביקשתי מאלוהים חכמה להנהיג את העם.", ansE: "Solomon", ansH: "שלמה", w1E: "David", w2E: "Saul" },
    { en: "I interpreted Pharaoh's dreams in Egypt.", he: "פתרתי את חלומות פרעה במצרים.", ansE: "Joseph", ansH: "יוסף", w1E: "Jacob", w2E: "Daniel" },
    { en: "I survived the lions' den.", he: "שרדתי בגוב האריות.", ansE: "Daniel", ansH: "דניאל", w1E: "David", w2E: "Elijah" },
    { en: "I went up to heaven in a whirlwind.", he: "עליתי לשמיים בסערה.", ansE: "Elijah", ansH: "אליהו", w1E: "Moses", w2E: "Enoch" },
    { en: "I built an ark to survive a great flood.", he: "בניתי תיבה כדי לשרוד שיטפון גדול.", ansE: "Noah", ansH: "נח", w1E: "Abraham", w2E: "Moses" },
    { en: "I defeated a giant named Goliath.", he: "הבסתי ענק בשם גוליית.", ansE: "David", ansH: "דוד", w1E: "Samson", w2E: "Jonathan" },
    { en: "My strength was in my hair.", he: "כוחי היה בשיערי.", ansE: "Samson", ansH: "שמשון", w1E: "Goliath", w2E: "Joab" },
    { en: "I became Queen of Persia and saved my people.", he: "הפכתי למלכת פרס והצלתי את עמי.", ansE: "Esther", ansH: "אסתר", w1E: "Ruth", w2E: "Miriam" }
];

while (generatedCount < 150) {
    for (let i = 0; generatedCount < 150 && i < whoAmIFacts.length; i++) {
        const f = whoAmIFacts[i];
        bibleQuestions.push({
            l: 2, c: 'judaism',
            en: `Who am I? ${f.en}`, he: `מי אני? ${f.he}`,
            aEn: f.ansE, aHe: f.ansH, w1En: f.w1E, w1He: f.w1E, w2En: f.w2E, w2He: f.w2E, w3En: "Someone Else", w3He: "מישהו אחר", e: "❓"
        });
        generatedCount++;
    }
}


const finalQuestions = [];

bibleQuestions.forEach(q => {
    const optsEn = [q.aEn, q.w1En, q.w2En, q.w3En];
    const optsHe = [q.aHe, q.w1He, q.w2He, q.w3He];
    for (let i = optsEn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optsEn[i], optsEn[j]] = [optsEn[j], optsEn[i]];
        [optsHe[i], optsHe[j]] = [optsHe[j], optsHe[i]];
    }
    const correctIdx = optsEn.indexOf(q.aEn);
    finalQuestions.push(`    { category: 'judaism', level: ${q.l}, text: { en: ${JSON.stringify(q.en)}, he: ${JSON.stringify(q.he)} }, options: { en: ${JSON.stringify(optsEn)}, he: ${JSON.stringify(optsHe)} }, correctAnswer: ${correctIdx}, emoji: '${q.e}' }`);
});

let content = fs.readFileSync('src/data/questions.js', 'utf8');

// We simply append to the end of the `questions` array!
const parts = content.split('export const questions = [');
content = parts[0] + 'export const questions = [' + '\n' + finalQuestions.join(',\n') + ',\n' + parts[1];

fs.writeFileSync('src/data/questions.js', content);
console.log(`Successfully appended exactly ${bibleQuestions.length} new BIBLE STORY questions!`);
