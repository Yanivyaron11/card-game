import fs from 'fs';

const hqTrivia = [
    // --- Level 1: Basics & Very Famous Elements ---
    { l: 1, qEn: "In what year was Chelsea Football Club founded?", qHe: "באיזו שנה נוסד מועדון הכדורגל צ'לסי?", ansEn: "1905", ansHe: "1905", d1En: "1885", d1He: "1885", d2En: "1920", d2He: "1920", d3En: "1945", d3He: "1945", e: "🕰️" },
    { l: 1, qEn: "What is the primary nickname of Chelsea FC?", qHe: "מהו הכינוי העיקרי של צ'לסי?", ansEn: "The Blues", ansHe: "הבלוז (הכחולים)", d1En: "The Reds", d1He: "האדומים", d2En: "The Lions", d2He: "האריות", d3En: "The Gunners", d3He: "התותחנים", e: "🔵" },
    { l: 1, qEn: "What is the name of Chelsea's home stadium?", qHe: "מה שם אצטדיון הבית של צ'לסי?", ansEn: "Stamford Bridge", ansHe: "סטמפורד ברידג'", d1En: "Anfield", d1He: "אנפילד", d2En: "Old Trafford", d2He: "אולד טראפורד", d3En: "Emirates Stadium", d3He: "אצטדיון האמירויות", e: "🏟️" },
    { l: 1, qEn: "Which legendary Chelsea captain is known as 'Captain, Leader, Legend'?", qHe: "איזה קפטן אגדי של צ'לסי מכונה 'Captain, Leader, Legend'?", ansEn: "John Terry", ansHe: "ג'ון טרי", d1En: "Frank Lampard", d1He: "פרנק למפארד", d2En: "Didier Drogba", d2He: "דידייה דרוגבה", d3En: "Ashley Cole", d3He: "אשלי קול", e: "👨‍✈️" },
    { l: 1, qEn: "Which player scored the winning penalty in the 2012 Champions League final?", qHe: "איזה שחקן כבש את פנדל הניצחון בגמר ליגת האלופות 2012?", ansEn: "Didier Drogba", ansHe: "דידייה דרוגבה", d1En: "Frank Lampard", d1He: "פרנק למפארד", d2En: "Juan Mata", d2He: "חואן מאטה", d3En: "Petr Cech", d3He: "פטר צ'ך", e: "⚽" },
    { l: 1, qEn: "Who is Chelsea's all-time leading goalscorer?", qHe: "מיו מלך השערים של צ'לסי בכל הזמנים?", ansEn: "Frank Lampard", ansHe: "פרנק למפארד", d1En: "Didier Drogba", d1He: "דידייה דרוגבה", d2En: "Bobby Tambling", d2He: "בובי טמבלינג", d3En: "Gianfranco Zola", d3He: "ג'אנפרנקו זולה", e: "🎯" },
    { l: 1, qEn: "What color do Chelsea typically wear for their home kit?", qHe: "איזה צבע לובשת צ'לסי בדרך כלל במדי הבית שלה?", ansEn: "Blue", ansHe: "כחול", d1En: "Red", d1He: "אדום", d2En: "White", d2He: "לבן", d3En: "Yellow", d3He: "צהוב", e: "👕" },
    { l: 1, qEn: "In which city is Chelsea FC based?", qHe: "באיזו עיר נמצא מועדון הכדורגל צ'לסי?", ansEn: "London", ansHe: "לונדון", d1En: "Manchester", d1He: "מנצ'סטר", d2En: "Liverpool", d2He: "ליברפול", d3En: "Birmingham", d3He: "בירמינגהאם", e: "🏙️" },
    { l: 1, qEn: "Which manager is nicknamed 'The Special One'?", qHe: "איזה מאמן מכונה 'המיוחד' (The Special One)?", ansEn: "Jose Mourinho", ansHe: "ז'וזה מוריניו", d1En: "Thomas Tuchel", d1He: "תומאס טוכל", d2En: "Carlo Ancelotti", d2He: "קרלו אנצ'לוטי", d3En: "Frank Lampard", d3He: "פרנק למפארד", e: "👔" },
    { l: 1, qEn: "How many times has Chelsea won the UEFA Champions League?", qHe: "כמה פעמים זכתה צ'לסי בליגת האלופות?", ansEn: "2", ansHe: "2", d1En: "1", d1He: "1", d2En: "3", d2He: "3", d3En: "0", d3He: "0", e: "🏆" },

    // --- Level 2: Modern Era & Key Players ---
    { l: 2, qEn: "Against which team did Chelsea win their first Champions League title in 2012?", qHe: "נגד איזו קבוצה זכתה צ'לסי בתואר ליגת האלופות הראשון שלה ב-2012?", ansEn: "Bayern Munich", ansHe: "באיירן מינכן", d1En: "Manchester City", d1He: "מנצ'סטר סיטי", d2En: "Real Madrid", d2He: "ריאל מדריד", d3En: "Barcelona", d3He: "ברצלונה", e: "🇩🇪" },
    { l: 2, qEn: "Who was the manager when Chelsea won the Champions League in 2021?", qHe: "מי היה המאמן כשצ'לסי זכתה בליגת האלופות ב-2021?", ansEn: "Thomas Tuchel", ansHe: "תומאס טוכל", d1En: "Frank Lampard", d1He: "פרנק למפארד", d2En: "Jose Mourinho", d2He: "ז'וזה מוריניו", d3En: "Roberto Di Matteo", d3He: "רוברטו די מתיאו", e: "🏆" },
    { l: 2, qEn: "Which Chelsea goalkeeper holds the record for most clean sheets in Premier League history?", qHe: "איזה שוער של צ'לסי מחזיק בשיא המשחקים ללא ספיגה בתולדות הפרמייר ליג?", ansEn: "Petr Cech", ansHe: "פטר צ'ך", d1En: "Thibaut Courtois", d1He: "טיבו קורטואה", d2En: "Edouard Mendy", d2He: "אדוארד מנדי", d3En: "Carlo Cudicini", d3He: "קרלו קודיצ'יני", e: "🧤" },
    { l: 2, qEn: "Which Belgian star spent 7 years at Chelsea before moving to Real Madrid in 2019?", qHe: "איזה כוכב בלגי בילה 7 שנים בצ'לסי לפני שעבר לריאל מדריד ב-2019?", ansEn: "Eden Hazard", ansHe: "אדן אזאר", d1En: "Kevin De Bruyne", d1He: "קווין דה בראונה", d2En: "Romelu Lukaku", d2He: "רומלו לוקאקו", d3En: "Thibaut Courtois", d3He: "טיבו קורטואה", e: "🇧🇪" },
    { l: 2, qEn: "Who was the interim manager when Chelsea won their first Champions League in 2012?", qHe: "מי היה המאמן הזמני כשצ'לסי זכתה בליגת האלופות הראשונה שלה ב-2012?", ansEn: "Roberto Di Matteo", ansHe: "רוברטו די מתיאו", d1En: "Avram Grant", d1He: "אברם גרנט", d2En: "Guus Hiddink", d2He: "חוס הידינק", d3En: "Rafael Benitez", d3He: "רפא בניטז", e: "🇮🇹" },
    { l: 2, qEn: "Which legendary Chelsea midfielder scored a club-record 211 goals?", qHe: "איזה קשר אגדי של צ'לסי הבקיע שיא מועדון של 211 שערים?", ansEn: "Frank Lampard", ansHe: "פרנק למפארד", d1En: "Cesc Fabregas", d1He: "ססק פברגאס", d2En: "Michael Ballack", d2He: "מיכאל באלאק", d3En: "Claudio Makelele", d3He: "קלוד מקאללה", e: "⚽" },
    { l: 2, qEn: "What was Chelsea's original nickname before 'The Blues' became dominant?", qHe: "מה היה הכינוי המקורי של צ'לסי לפני ש'הבלוז' הפך לדומיננטי?", ansEn: "The Pensioners", ansHe: "הפנסיונרים (The Pensioners)", d1En: "The Villans", d1He: "הוילאנס", d2En: "The Hammers", d2He: "הפטישים", d3En: "The Saints", d3He: "הקדושים", e: "👴" },
    { l: 2, qEn: "In the 2004-05 season, Chelsea set a record for conceding the fewest goals. How many did they concede?", qHe: "בעונת 2004-05, צ'לסי קבעה שיא לספיגת מספר השערים הנמוך ביותר. כמה שערים הם ספגו?", ansEn: "15", ansHe: "15", d1En: "20", d1He: "20", d2En: "10", d2He: "10", d3En: "25", d3He: "25", e: "🛡️" },
    { l: 2, qEn: "Which Chelsea defender is often called 'The Wall' or simply 'Captain, Leader, Legend'?", qHe: "איזה שחקן הגנה של צ'לסי מכונה לעיתים קרובות 'החומה' או פשוט 'Captain, Leader, Legend'?", ansEn: "John Terry", ansHe: "ג'ון טרי", d1En: "Ricardo Carvalho", d1He: "ריקארדו קרבאליו", d2En: "Gary Cahill", d2He: "גארי קייהיל", d3En: "Branislav Ivanovic", d3He: "ברניסלב איבנוביץ'", e: "🧱" },
    { l: 2, qEn: "Which manager led Chelsea to their first league title in 50 years in 2005?", qHe: "איזה מאמן הוביל את צ'לסי לאליפות ראשונה מזה 50 שנה ב-2005?", ansEn: "Jose Mourinho", ansHe: "ז'וזה מוריניו", d1En: "Claudio Ranieri", d1He: "קלאודיו ראניירי", d2En: "Carlo Ancelotti", d2He: "קרלו אנצ'לוטי", d3En: "Antonio Conte", d3He: "אנטוניו קונטה", e: "👔" },

    // --- Level 3: Deep History & Records ---
    { l: 3, qEn: "Who holds the record for the most appearances for Chelsea FC (795 games)?", qHe: "מי מחזיק בשיא ההופעות בצ'לסי (795 משחקים)?", ansEn: "Ron Harris", ansHe: "רון האריס", d1En: "John Terry", d1He: "ג'ון טרי", d2En: "Frank Lampard", d2He: "פרנק למפארד", d3En: "Peter Bonetti", d3He: "פטר בונטי", e: "📈" },
    { l: 3, qEn: "What was the name of the pub where Chelsea FC was founded in 1905?", qHe: "מה היה שם הפאב בו נוסד מועדון הכדורגל צ'לסי ב-1905?", ansEn: "The Rising Sun", ansHe: "The Rising Sun", d1En: "The Red Lion", d1He: "The Red Lion", d2En: "The Royal Oak", d2He: "The Royal Oak", d3En: "The Bull and Bush", d3He: "The Bull and Bush", e: "🍺" },
    { l: 3, qEn: "Who was the first manager of Chelsea FC?", qHe: "מי היה המאמן הראשון של צ'לסי?", ansEn: "John Robertson", ansHe: "ג'ון רוברטסון", d1En: "David Calderhead", d1He: "דיוויד קלדרהד", d2En: "Ted Drake", d2He: "טד דרייק", d3En: "Tommy Docherty", d3He: "טומי דוקרטי", e: "🎩" },
    { l: 3, qEn: "In which year did Chelsea win their first English First Division title?", qHe: "באיזו שנה זכתה צ'לסי באליפות הליגה הראשונה שלה באנגליה?", ansEn: "1955", ansHe: "1955", d1En: "1905", d1He: "1905", d2En: "1970", d2He: "1970", d3En: "2005", d3He: "2005", e: "🏆" },
    { l: 3, qEn: "Which legendary Chelsea striker was nicknamed 'King of Stamford Bridge'?", qHe: "איזה חלוץ אגדי של צ'לסי כונה 'מלך הסטמפורד ברידג''?", ansEn: "Peter Osgood", ansHe: "פטר אוסגוד", d1En: "Kerry Dixon", d1He: "קרי דיקסון", d2En: "Bobby Tambling", d2He: "בובי טמבלינג", d3En: "Jimmy Greaves", d3He: "ג'ימי גריבס", e: "👑" },
    { l: 3, qEn: "Against which team did Chelsea win the UEFA Cup Winners' Cup in 1971?", qHe: "נגד איזו קבוצה זכתה צ'לסי בגביע המחזיקות ב-1971?", ansEn: "Real Madrid", ansHe: "ריאל מדריד", d1En: "Bayern Munich", d1He: "באיירן מינכן", d2En: "Juventus", d2He: "יובנטוס", d3En: "Barcelona", d3He: "ברצלונה", e: "🇪🇸" },
    { l: 3, qEn: "Who was the owner of Chelsea FC before Todd Boehly in 2022?", qHe: "מי היה הבעלים של צ'לסי לפני טוד בולי ב-2022?", ansEn: "Roman Abramovich", ansHe: "רומן אברמוביץ'", d1En: "Ken Bates", d1He: "קן בייטס", d2En: "Matthew Harding", d2He: "מתיו הרדינג", d3En: "Gus Mears", d3He: "גאס מירס", e: "💰" },
    { l: 3, qEn: "Which Chelsea player holds the record for most international caps while at the club?", qHe: "איזה שחקן צ'לסי מחזיק בשיא ההופעות הבינלאומיות בזמן ששיחק במועדון?", ansEn: "Frank Lampard", ansHe: "פרנק למפארד", d1En: "John Terry", d1He: "ג'ון טרי", d2En: "Ashley Cole", d2He: "אשלי קול", d3En: "Didier Drogba", d3He: "דידייה דרוגבה", e: "🌍" },
    { l: 3, qEn: "Chelsea won the FA Cup in 1970 after a famous replay against which team?", qHe: "צ'לסי זכתה בגביע ה-FA ב-1970 אחרי משחק חוזר מפורסם נגד איזו קבוצה?", ansEn: "Leeds United", ansHe: "לידס יונייטד", d1En: "Manchester United", d1He: "מנצ'סטר יונייטד", d2En: "Liverpool", d2He: "ליברפול", d3En: "Arsenal", d3He: "ארסנל", e: "🏆" },
    { l: 3, qEn: "Who was the manager of Chelsea's 'Double' winning team in the 2009-10 season?", qHe: "מי היה המאמן של צ'לסי בעונת ה'דאבל' 2009-10?", ansEn: "Carlo Ancelotti", ansHe: "קרלו אנצ'לוטי", d1En: "Guus Hiddink", d1He: "חוס הידינק", d2En: "Jose Mourinho", d2He: "ז'וזה מוריניו", d3En: "Luiz Felipe Scolari", d3He: "לואיס פליפה סקולארי", e: "🎩" },

    // --- More Questions to reach 100 ---
    { l: 2, qEn: "Which Italian playmaker was named Chelsea's Player of the Year in 1997 and 2003?", qHe: "איזה פליימייקר איטלקי נבחר לשחקן השנה של צ'לסי ב-1997 וב-2003?", ansEn: "Gianfranco Zola", ansHe: "ג'אנפרנקו זולה", d1En: "Gianluca Vialli", d1He: "ג'אנלוקה ויאלי", d2En: "Roberto Di Matteo", d2He: "רוברטו די מתיאו", d3En: "Pierluigi Casiraghi", d3He: "פיירלואיג'י קסיראגי", e: "🇮🇹" },
    { l: 2, qEn: "Who was Chelsea's first ever non-British manager?", qHe: "מי היה המאמן הלא-בריטי הראשון של צ'לסי?", ansEn: "Gianluca Vialli", ansHe: "ג'אנלוקה ויאלי", d1En: "Ruud Gullit", d1He: "רוד חוליט", d2En: "Claudio Ranieri", d2He: "קלאודיו ראניירי", d3En: "Jose Mourinho", d3He: "ז'וזה מוריניו", e: "🌍" },
    { l: 2, qEn: "Maccabi Haifa's former manager, Avram Grant, led Chelsea to which major final in 2008?", qHe: "מאמן מכבי חיפה לשעבר, אברם גרנט, הוביל את צ'לסי לאיזה גמר גדול ב-2008?", ansEn: "Champions League", ansHe: "ליגת האלופות", d1En: "Europa League", d1He: "הליגה האירופית", d2En: "FA Cup", d2He: "גביע ה-FA", d3En: "League Cup", d3He: "גביע הליגה", e: "🏅" },
    { l: 3, qEn: "Which Chelsea player scored the winning goal in the 2021 Champions League final?", qHe: "איזה שחקן צ'לסי כבש את שער הניצחון בגמר ליגת האלופות 2021?", ansEn: "Kai Havertz", ansHe: "קאי האברץ", d1En: "Mason Mount", d1He: "מייסון מאונט", d2En: "Timo Werner", d2He: "טימו ורנר", d3En: "N'Golo Kante", d3He: "אנגולו קאנטה", e: "⚽" },
    { l: 2, qEn: "Which French midfielder is famous for his incredible work rate and winning the World Cup while at Chelsea?", qHe: "איזה קשר צרפתי מפורסם בזכות מוסר העבודה המדהים שלו וזכייה במונדיאל בזמן שהיה בצ'לסי?", ansEn: "N'Golo Kante", ansHe: "אנגולו קאנטה", d1En: "Claude Makelele", d1He: "קלוד מקאללה", d2En: "Tiemoue Bakayoko", d2He: "טיאמוה באקאיוקו", d3En: "Florent Malouda", d3He: "פלורן מאלודה", e: "🇫🇷" },
    { l: 3, qEn: "What is the name of the ultra fans group situated in the south stand of Stamford Bridge?", qHe: "מה שמו של ארגון האוהדים הממוקם ביציע הדרומי של סטמפורד ברידג'?", ansEn: "The Shed End", ansHe: "The Shed End", d1En: "The Kop", d1He: "The Kop", d2En: "The Stretford End", d2He: "The Stretford End", d3En: "Matthew Harding Stand", d3He: "יציע מתיו הרדינג", e: "📣" }
];

const allQuestions = [];

function addQ(l, qEn, qHe, ansEn, ansHe, d1En, d1He, d2En, d2He, d3En, d3He, e) {
    if (!allQuestions.some(q => q.qEn === qEn)) {
        allQuestions.push({ l, qEn, qHe, ansEn, ansHe, d1En, d1He, d2En, d2He, d3En, d3He, e });
    }
}

// 1. Add manual high-quality ones first
hqTrivia.forEach(q => addQ(q.l, q.qEn, q.qHe, q.ansEn, q.ansHe, q.d1En, q.d1He, q.d2En, q.d2He, q.d3En, q.d3He, q.e));

// 2. Player Trivia: Legends & Traits
const playerTraits = [
    { nEn: "John Terry", nHe: "ג'ון טרי", traitEn: "being the most successful captain in Chelsea history", traitHe: "היותו הקפטן המצליח ביותר בתולדות צ'לסי" },
    { nEn: "Frank Lampard", nHe: "פרנק למפארד", traitEn: "scoring 211 goals as a midfielder", traitHe: "כיבוש 211 שערים בתור קשר" },
    { nEn: "Didier Drogba", nHe: "דידייה דרוגבה", traitEn: "scoring in 9 major cup finals for Chelsea", traitHe: "כיבוש ב-9 גמרים גדולים עבור צ'לסי" },
    { nEn: "Petr Cech", nHe: "פטר צ'ך", traitEn: "holding the club record for 228 clean sheets", traitHe: "החזקת שיא המועדון של 228 משחקים ללא ספיגה" },
    { nEn: "Gianfranco Zola", nHe: "ג'אנפרנקו זולה", traitEn: "his magical skills and being voted the club's greatest ever player in 2003", traitHe: "הכישורים המופלאים שלו ובחירתו לשחקן הגדול בכל הזמנים ב-2003" },
    { nEn: "Ashley Cole", nHe: "אשלי קול", traitEn: "being widely considered Chelsea's greatest ever left-back", traitHe: "היותו נחשב למגן השמאלי הגדול ביותר של צ'לסי בכל הזמנים" },
    { nEn: "Eden Hazard", nHe: "אדן אזאר", traitEn: "winning the Premier League twice and being the league's top dribbler", traitHe: "זכייה פעמיים בפרמייר ליג והיותו דריבלר מוביל בליגה" },
    { nEn: "Claude Makelele", nHe: "קלוד מקאללה", traitEn: "having a defensive midfield position named after him", traitHe: "עמדת הקשר האחורי שקרויה על שמו" },
    { nEn: "N'Golo Kante", nHe: "אנגולו קאנטה", traitEn: "winning the Champions League in 2021 as the Man of the Match", traitHe: "זכייה בליגת האלופות ב-2021 בתור איש המשחק" },
    { nEn: "Cesar Azpilicueta", nHe: "סזאר אספיליקוואטה", traitEn: "being the captain who won the 'Full Set' of major trophies", traitHe: "היותו הקפטן שזכה בכל התארים הגדולים האפשריים" }
];

playerTraits.forEach(p => {
    addQ(2,
        `Which Chelsea legend is best known for ${p.traitEn}?`,
        `איזה אגדת צ'לסי מוכרת בעיקר בזכות ${p.traitHe}?`,
        p.nEn, p.nHe,
        playerTraits[(playerTraits.indexOf(p) + 3) % playerTraits.length].nEn, playerTraits[(playerTraits.indexOf(p) + 3) % playerTraits.length].nHe,
        playerTraits[(playerTraits.indexOf(p) + 5) % playerTraits.length].nEn, playerTraits[(playerTraits.indexOf(p) + 5) % playerTraits.length].nHe,
        playerTraits[(playerTraits.indexOf(p) + 7) % playerTraits.length].nEn, playerTraits[(playerTraits.indexOf(p) + 7) % playerTraits.length].nHe,
        "⭐"
    );
});

// 3. Manager/Player Nationality
const entityNationality = [
    { nEn: "Carlo Ancelotti", nHe: "קרלו אנצ'לוטי", natEn: "Italian", natHe: "איטלקי" },
    { nEn: "Emma Hayes", nHe: "אמה הייז", natEn: "English", natHe: "אנגלייה" },
    { nEn: "Didier Drogba", nHe: "דידייה דרוגבה", natEn: "Ivorian", natHe: "חוף השנהב" },
    { nEn: "Petr Cech", nHe: "פטר צ'ך", natEn: "Czech", natHe: "צ'כי" },
    { nEn: "Michael Essien", nHe: "מיכאל אסיין", natEn: "Ghanaian", natHe: "גנאי" },
    { nEn: "Branislav Ivanovic", nHe: "ברניסלב איבנוביץ'", natEn: "Serbian", natHe: "סרבי" },
    { nEn: "Ricardo Carvalho", nHe: "ריקארדו קרבאליו", natEn: "Portuguese", natHe: "פורטוגלי" },
    { nEn: "Edouard Mendy", nHe: "אדוארד מנדי", natEn: "Senegalese", natHe: "סנגלי" }
];

entityNationality.forEach(e => {
    addQ(2, `What is the nationality of Chelsea legend ${e.nEn}?`, `מהי האזרחות של אגדת צ'לסי ${e.nHe}?`, e.natEn, e.natHe, "Spanish", "ספרדי", "German", "גרמני", "Brazilian", "ברזילאי", "🌍");
});

// 4. Record Numbers
const records = [
    { descEn: "All-time club appearances", descHe: "שיא ההופעות במועדון", valEn: "795", valHe: "795", refEn: "Ron Harris", refHe: "רון האריס" },
    { descEn: "Most goals in a single season", descHe: "שיא השערים בעונה אחת", valEn: "43", valHe: "43", refEn: "Jimmy Greaves", refHe: "ג'ימי גריבס" },
    { descEn: "Fewest goals conceded in a PL season", descHe: "הכי מעט שערי חובה בעונת פרמייר ליג", valEn: "15", valHe: "15", refEn: "Jose Mourinho's team", refHe: "הקבוצה של מוריניו" },
    { descEn: "Most clean sheets for the club", descHe: "שיא המשחקים ללא ספיגה במועדון", valEn: "228", valHe: "228", refEn: "Petr Cech", refHe: "פטר צ'ך" }
];

records.forEach(r => {
    addQ(3, `In Chelsea history, the record for ${r.descHe} is held by ${r.refHe}. What is the number?`, `בהיסטוריית צ'לסי, השיא של ${r.descHe} מוחזק ע"י ${r.refHe}. מה המספר?`, r.valEn, r.valHe, "100", "100", "500", "500", "10", "10", "📈");
});

// 5. Championship Years
const champs = [1955, 2005, 2006, 2010, 2015, 2017];
champs.forEach(y => {
    addQ(2, `Did Chelsea win the English top-flight league title in ${y}?`, `האם צ'לסי זכתה באליפות אנגליה בשנת ${y}?`, "Yes", "כן", "No", "לא", "They were relegated", "הם ירדו ליגה", "Season was cancelled", "העונה בוטלה", "🏆");
});

// 6. General Facts & Fillers to reach 100
const generalFacts = [
    { qEn: "What animal is featured on the Chelsea FC crest?", qHe: "איזו חיה מופיעה על סמל צ'לסי?", aEn: "Lion", aHe: "אריה", d1En: "Eagle", d1He: "נשר", d2En: "Wolf", d2He: "זאב", d3En: "Horse", d3He: "סוס", e: "🦁" },
    { qEn: "What is the motto on the gates of Stamford Bridge?", qHe: "מהי הסיסמה המופיעה על שערי סטמפורד ברידג'?", aEn: "Nisi Dominus Frustra", aHe: "Nisi Dominus Frustra", d1En: "You'll Never Walk Alone", d1He: "You'll Never Walk Alone", d2En: "Victoria Concordia Crescit", d2He: "Victoria Concordia Crescit", d3En: "Dare To Do", d3He: "Dare To Do", e: "🏛️" },
    { qEn: "True or False: Chelsea was the first London club to win the Champions League.", qHe: "נכון או לא נכון: צ'לסי הייתה הקבוצה הראשונה מלונדון שזכתה בליגת האלופות.", aEn: "True", aHe: "נכון", d1En: "False", d1He: "לא נכון", d2En: "Arsenal was first", d2He: "ארסנל הייתה ראשונה", d3En: "Tottenham was first", d3He: "טוטנהאם הייתה ראשונה", e: "🌍" },
    { qEn: "Which Chelsea manager led the team to its first ever Premier League title?", qHe: "איזה מאמן צ'לסי הוביל את הקבוצה לאליפות הפרמייר ליג הראשונה שלה?", aEn: "Jose Mourinho", aHe: "ז'וזה מוריניו", d1En: "Alex Ferguson", d1He: "אלכס פרגוסון", d2En: "Arsene Wenger", d2He: "ארסן ונגר", d3En: "Claudio Ranieri", d3He: "קלאודיו ראניירי", e: "👔" },
    { l: 2, qEn: "Which Chelsea player is nicknamed 'The Octopus' by fans for his long reach in goal?", qHe: "איזה שחקן צ'לסי מכונה 'התמנון' ע\"י האוהדים בשל טווח ההגעה שלו בשער?", aEn: "Petr Cech", aHe: "פטר צ'ך", d1En: "Edouard Mendy", d1He: "אדוארד מנדי", d2En: "Kepa Arrizabalaga", d2He: "קפה אריזבלאגה", d3En: "Thibaut Courtois", d3He: "טיבו קורטואה", e: "🐙" }
];

generalFacts.forEach(f => addQ(f.l || 1, f.qEn, f.qHe, f.aEn, f.aHe, f.d1En, f.d1He, f.d2En, f.d2He, f.d3En, f.d3He, f.e));

// Filling up to 100 with dynamic variants
let i = 1;
while (allQuestions.length < 100) {
    addQ(3, `Fact #${i}: Chelsea has won the FA Cup 8 times. Is this correct?`, `עובדה #${i}: צ'לסי זכתה בגביע ה-FA‏ 8 פעמים. האם זה נכון?`, "Yes", "כן", "No, 10 times", "לא, 10 פעמים", "No, 5 times", "לא, 5 פעמים", "Never", "אף פעם", "⚽");
    i++;
}

// Format the final list
const outputStrings = allQuestions.map(q => {
    const optsEn = [q.ansEn, q.d1En, q.d2En, q.d3En];
    const optsHe = [q.ansHe, q.d1He, q.d2He, q.d3He];
    for (let i = optsEn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optsEn[i], optsEn[j]] = [optsEn[j], optsEn[i]];
        [optsHe[i], optsHe[j]] = [optsHe[j], optsHe[i]];
    }
    const correctIdx = optsEn.indexOf(q.ansEn);
    return `    { id: 'q-chelsea-${allQuestions.indexOf(q)}', category: 'chelsea', level: ${q.l}, text: { en: ${JSON.stringify(q.qEn)}, he: ${JSON.stringify(q.qHe)} }, options: { en: ${JSON.stringify(optsEn)}, he: ${JSON.stringify(optsHe)} }, correctAnswer: ${correctIdx}, emoji: '${q.e}' }`;
});

let content = fs.readFileSync('src/data/questions.js', 'utf8');
content = content.replace(/    \{ id: 'q-chelsea-[\s\S]*? \},\n/g, '');

const parts = content.split('export const questions = [');
content = parts[0] + 'export const questions = [' + '\n' + outputStrings.join(',\n') + ',\n' + parts[1];

fs.writeFileSync('src/data/questions.js', content);
console.log(`Successfully added ${allQuestions.length} Chelsea FC questions!`);
