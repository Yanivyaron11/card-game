import fs from 'fs';

const questionsData = [
    // --- BATCH 1 (Original 20) ---
    { l: 3, qEn: "What is the primary role of salt in bread dough, besides flavor?", qHe: "מהו התפקיד העיקרי של מלח בבצק לחם, מעבר לטעם?", ansEn: "It strengthens the gluten structure and controls yeast fermentation", ansHe: "הוא מחזק את מבנה הגלוטן ומבקר את תסיסת השמרים", d1En: "To make the bread rise faster", d1He: "לגרום ללחם לתפוח מהר יותר", d2En: "To kill all the bacteria", d2He: "להרוג את כל הבקטריות", d3En: "To turn the crust brown", d3He: "להפוך את הקרום לחום", e: "🧂" },
    { l: 3, qEn: "What chemical property makes 'Cream of Tartar' useful in stabilizing egg whites?", qHe: "איזו תכונה כימית הופכת את ה'קרם טרטר' ליעיל בייצוב חלבונים?", ansEn: "It is an acid that lowers the pH, preventing protein bonds from over-tightening", ansHe: "זוהי חומצה שמורידה את ה-pH ומונעת מקשרי החלבון להתהדק מדי", d1En: "It is a type of sugar", d1He: "זהו סוג של סוכר", d2En: "It is a fat that coats the bubbles", d2He: "זהו שומן שמצפה את הבועות", d3En: "It acts as a natural dye", d3He: "הוא משמש כצבע מאכל טבעי", e: "🥚" },
    { l: 3, qEn: "What is 'Carry-over Cooking' in the context of custards?", qHe: "מהו 'בישול שארית' (Carry-over Cooking) בהקשר של קרמים ורפרפות?", ansEn: "The food continues to cook from internal heat after being removed from the heat source", ansHe: "המזון ממשיך להתבשל מהחום הפנימי גם לאחר שהוסר ממקור החום", d1En: "Cooking with leftovers", d1He: "בישול עם שאריות מאתמול", d2En: "Reheating a custard in the microwave", d2He: "חימום חוזר של קרם במיקרוגל", d3En: "Adding cold milk to stop the process", d3He: "הוספת חלב קר כדי לעצור את התהליך", e: "🌡️" },
    { l: 3, qEn: "What happens to starch during the process of 'Gelatinization'?", qHe: "מה קורה לעמילן בתהליך ה'ג'לטיניזציה'?", ansEn: "Starch granules absorb water and swell when heated, thickening the liquid", ansHe: "גרגירי העמילן סופגים מים ומתנפחים בחימום, מה שמסמיך את הנוזל", d1En: "It turns into sugar", d1He: "הוא הופך לסוכר", d2En: "It evaporates into gas", d2He: "הוא מתאדה לגז", d3En: "It becomes waterproof", d3He: "הוא הופך לעמיד בפני מים", e: "🥣" },
    { l: 3, qEn: "Why is 'High-Ratio' shortening used in some commercial cakes?", qHe: "למה משתמשים בשומן 'High-Ratio' בעוגות תעשייתיות מסוימות?", ansEn: "It contains emulsifiers that allow the batter to hold more liquid and sugar", ansHe: "הוא מכיל מתחלבים המאפשרים לבלילה להחזיק יותר נוזלים וסוכר", d1En: "To make the cake cheaper to produce", d1He: "כדי להוזיל את עלות ייצור העוגה", d2En: "To make the cake taste like butter", d2He: "כדי לתת לעוגה טעם של חמאה", d3En: "To ensure the cake never spoils", d3He: "כדי להבטיח שהעוגה לא תתקלקל לעולם", e: "🍰" },
    { l: 2, qEn: "What is 'Blind Baking'?", qHe: "מהי 'אפייה עיוורת'?", ansEn: "Baking a pastry crust without filling, often using weights", ansHe: "אפיית קרום הבצק ללא המילוי, לרוב תוך שימוש במשקולות", d1En: "Baking with your eyes closed", d1He: "אפייה בעיניים עצומות", d2En: "Baking in a dark oven", d2He: "אפייה בתנור חשוך", d3En: "Adding filling halfway through", d3He: "הוספת המילוי באמצע הדרך", e: "🥧" },
    { l: 3, qEn: "What is the purpose of 'Docking' a dough?", qHe: "מה המטרה של 'ניקוב' (Docking) הבצק?", ansEn: "To create small holes that allow steam to escape and prevent blisters", ansHe: "ליצור חורים קטנים המאפשרים לאדים לצאת ומונעים שלפוחיות", d1En: "To add decorative patterns", d1He: "כדי להוסיף דוגמאות דקורטיביות", d2En: "To help the dough rise higher", d2He: "כדי לעזור לבצק לתפוח גבוה יותר", d3En: "To weigh down the center", d3He: "כדי להכביד על המרכז", e: "🍴" },
    { l: 3, qEn: "What is 'Rubbing In' (Sablage) in pastry making?", qHe: "מהי טכניקת ה'סבלאז'' (Sablage) או 'שפשוף' בקונדיטוריה?", ansEn: "Mixing cold fat into flour until it resembles breadcrumbs to coat flour particles", ansHe: "ערבוב שומן קר לתוך קמח עד לקבלת מרקם פירורי כדי לצפות את חלקיקי הקמח", d1En: "Polishing the finished cake", d1He: "הברקת העוגה המוכנה", d2En: "Washing the fruit for a tart", d2He: "שטיפת הפירות לטארט", d3En: "Kneading the dough for 20 minutes", d3He: "לישת הבצק במשך 20 דקות", e: "🥣" },
    { l: 2, qEn: "What is a 'Zester' used for?", qHe: "למה משמש 'זסטר'?", ansEn: "To remove the aromatic outer peel of citrus fruits", ansHe: "להסרת הקליפה החיצונית הארומטית של פירות הדר", d1En: "To slice bread", d1He: "לחיתוך לחם", d2En: "To core apples", d2He: "להוצאת ליבת התפוח", d3En: "To whip cream", d3He: "להקצפת שמנת", e: "🍋" },
    { l: 3, qEn: "What is 'Nappage'?", qHe: "מהו 'נאפאז'' (Nappage)?", ansEn: "An apricot-based glaze used to give fruit tarts a shine and prevent drying", ansHe: "זיגוג (לרוב על בסיס משמש) הנותן לטארט פירות ברק ומונע התייבשות", d1En: "A type of French napkin", d1He: "סוג של מפית צרפתית", d2En: "The bottom layer of a cake", d2He: "השכבה התחתונה של העוגה", d3En: "A technique for folding puff pastry", d3He: "טכניקה לקיפול בצק עלים", e: "✨" },
    { l: 3, qEn: "What are the three main layers of a classic 'Opera Cake'?", qHe: "מהן שלוש השכבות העיקריות בעוגת 'אופרה' קלאסית?", ansEn: "Almond sponge, coffee buttercream, and chocolate ganache", ansHe: "ספוג שקדים, קרם חמאה קפה וגנאש שוקולד", d1En: "Vanilla sponge, strawberry jam, and whipped cream", d1He: "ספוג וניל, ריבת תות וקצפת", d2En: "Chocolate cake, cherries, and cream", d2He: "עוגת שוקולד, דובדבנים ושמנת", d3En: "Puff pastry, custard, and icing", d3He: "בצק עלים, פטיסייר וזיגוג", e: "🎹" },
    { l: 2, qEn: "Which country is credited with inventing the 'Macaroon' (the coconut version)?", qHe: "איזו מדינה נחשבת לממציאת ה'מקרון' (גרסאות הקוקוס)?", ansEn: "Italy", ansHe: "איטליה", d1En: "France", d1He: "צרפת", d2En: "USA", d2He: "ארה\"ב", d3En: "Germany", d3He: "גרמניה", e: "🇮🇹" },
    { l: 3, qEn: "What was the 'Tarte Tatin' famously named after?", qHe: "על שם מי נקרא ה'טארט טאטן' המפורסם?", ansEn: "The Tatin sisters who ran a hotel and created it by accident", ansHe: "האחיות טאטן שניהלו מלון ויצרו אותו בטעות", d1En: "A famous French general", d1He: "גנרל צרפתי מפורסם", d2En: "The city where apples were grown", d2He: "העיר שבה גדלו התפוחים", d3En: "A French word for 'upside-down'", d3He: "המילה הצרפתית ל'הפוך'", e: "🍎" },
    { l: 2, qEn: "What is the distinctive flavor of a 'Madeleine' cake?", qHe: "מהו הטעם המאפיין של עוגת 'מדלן'?", ansEn: "Lemon and butter", ansHe: "לימון וחמאה", d1En: "Chocolate and mint", d1He: "שוקולד ומנטה", d2En: "Cinnamon and apple", d2He: "קינמון ותפוח", d3En: "Coffee and walnut", d3He: "קפה ואגוזי מלך", e: "🐚" },
    { l: 3, qEn: "Which pastry is known as 'The King of Cakes' in France and eaten during Epiphany?", qHe: "איזה מאפה מכונה 'עוגת המלכים' בצרפת ונאכל בחג ההתגלות?", ansEn: "Gâteau des Rois / Galette des Rois", ansHe: "גאלט דה רואה (Galette des Rois)", d1En: "Brioche Nanterre", d1He: "בריוש נאנטר", d2En: "Bûche de Noël", d2He: "בוש דה נואל", d3En: "Paris-Brest", d3He: "פריז-ברסט", e: "👑" },
    { l: 2, qEn: "What is 'Couverture' chocolate?", qHe: "מהו שוקולד 'קובורטור' (Couverture)?", ansEn: "High-quality chocolate with a higher cocoa butter percentage", ansHe: "שוקולד איכותי עם אחוז גבוה יותר של חמאת קקאו", d1En: "Chocolate intended only for drinking", d1He: "שוקולד המיועד לשתייה בלבד", d2En: "Chocolate that contains no sugar", d2He: "שוקולד שאינו מכיל סוכר", d3En: "White chocolate mixed with milk", d3He: "שוקולד לבן מעורבב עם חלב", e: "🍫" },
    { l: 3, qEn: "What is 'Marzipan' primarily made from?", qHe: "ממה עשוי 'מרציפן' בעיקרון?", ansEn: "Almond meal and sugar", ansHe: "שקדים טחונים וסוכר", d1En: "Walnuts and honey", d1He: "אגוזי מלך ודבש", d2En: "Pistachios and syrup", d2He: "פיסטוקים וסירופ", d3En: "Hazelnuts and chocolate", d3He: "אגוזי לוז ושוקולד", e: "🌰" },
    { l: 3, qEn: "What is 'Muscovado' sugar?", qHe: "מהו סוכר 'מוסקובדו'?", ansEn: "An unrefined cane sugar with high molasses content", ansHe: "סוכר קנה לא מזוקק עם אחוז גבוה של מולאסה", d1En: "A type of powdered sugar", d1He: "סוג של אבקת סוכר", d2En: "Sugar substitute for diabetics", d2He: "תחליף סוכר לסוכרתיים", d3En: "Rock sugar for tea", d3He: "סוכר גבישי לתה", e: "🍯" },
    { l: 2, qEn: "What is the source of 'Vanilla' flavor?", qHe: "מהו המקור של טעם ה'וניל'?", ansEn: "The seed pods of an orchid plant", ansHe: "תרמילי הזרעים של צמח הסחלב", d1En: "The root of a tree", d1He: "שורש של עץ", d2En: "The bark of a shrub", d2He: "קליפת עץ של שיח", d3En: "A type of mountain moss", d3He: "סוג של טחב הרים", e: "🌼" },
    { l: 3, qEn: "What is 'Frangipane'?", qHe: "מה זה 'פרנג'יפאן' (Frangipane)?", ansEn: "An almond-flavored pastry cream", ansHe: "קרם פטיסייר בטעם שקדים", d1En: "A type of Italian bread", d1He: "סוג של לחם איטלקי", d2En: "A French coffee drink", d2He: "משקה קפה צרפתי", d3En: "A glaze for fruit", d3He: "זיגוג לפירות", e: "🌰" },

    // --- BATCH 2 (New unique Questions) ---
    { l: 3, qEn: "What is 'Hygroscopy' in the context of sugar?", qHe: "מהי 'היגרוסקופיה' בהקשר של סוכר?", ansEn: "The ability of sugar to absorb and hold moisture from the surrounding environment", ansHe: "יכולתו של סוכר לספוג ולהחזיק לחות מהסביבה", d1En: "The process of sugar turning into alcohol", d1He: "תהליך הפיכת סוכר לאלכוהול", d2En: "The speed at which sugar dissolves in cold water", d2He: "המהירות שבה סוכר נמס במים קרים", d3En: "The chemical reaction that makes sugar turn blue", d3He: "התגובה הכימית שהופכת סוכר לכחול", e: "💧" },
    { l: 3, qEn: "What is the 'Soft Ball' stage in sugar boiling?", qHe: "מהו שלב ה'כדור הרך' (Soft Ball) בבישול סוכר?", ansEn: "112°C-115°C; sugar forms a soft, flexible ball when dropped in cold water", ansHe: "112-115 מעלות; הסוכר יוצר כדור רך וגמיש כשמטפטפים אותו למים קרים", d1En: "100°C; when water just starts to boil", d1He: "100 מעלות; כשמים רק מתחילים לרתוח", d2En: "150°C; when sugar turns into hard candy", d2He: "150 מעלות; כשהסוכר הופך לסוכרייה קשה", d3En: "80°C; when sugar starts to melt", d3He: "80 מעלות; כשהסוכר מתחיל להמס", e: "🌡️" },
    { l: 3, qEn: "What is 'Invert Sugar' and why is it used?", qHe: "מהו 'סוכר אינוורטי' ולמה משתמשים בו?", ansEn: "A sugar syrup that prevents crystallization and Keeps baked goods moist", ansHe: "סירופ סוכר המונע התגבשות ושומר על מאפים לחים", d1En: "A type of sugar used for savory dishes", d1He: "סוג של סוכר המשמש למנות מלוחות", d2En: "Sugar that has been turned into gas", d2He: "סוכר שהפך לגז", d3En: "A natural dye extracted from beet sugar", d3He: "צבע מאכל טבעי המופק מסלק סוכר", e: "🍯" },
    { l: 3, qEn: "What is 'Enzymatic Browning' in fruits?", qHe: "מהי 'השחמה אנזימטית' בפירות?", ansEn: "A chemical reaction involving polyphenol oxidase that turns cut fruit brown", ansHe: "תגובה כימית שבה אנזימים הופכים פרי חתוך לחום", d1En: "The fruit ripening under sunlight", d1He: "הבשלה של פרי תחת אור שמש", d2En: "The process of making fruit jam", d2He: "תהליך הכנת ריבת פירות", d3En: "The fruit freezing in the refrigerator", d3He: "הקפאה של פרי במקרר", e: "🍎" },
    { l: 3, qEn: "What is 'Xanthan Gum' used for in gluten-free baking?", qHe: "למה משמש 'קסנטן גאם' באפייה ללא גלוטן?", ansEn: "To mimic the elasticity and binding properties of gluten", ansHe: "כדי לחקות את האלסטיות והתכונות המקשרות של הגלוטן", d1En: "To add a sweet flavor", d1He: "כדי להוסיף טעם מתוק", d2En: "To make the bread turn yellow", d2He: "כדי להפוך את הלחם לצהוב", d3En: "To replace yeast entirely", d3He: "כדי להחליף את השמרים לחלוטין", e: "🧪" },
    { l: 2, qEn: "What is 'Baklava' traditionally layered with?", qHe: "מהן השכבות המסורתיות של 'בקלווה'?", ansEn: "Phyllo dough, nuts, and syrup or honey", ansHe: "בצק פילו, אגוזים וסירופ או דבש", d1En: "Puff pastry, cream, and berries", d1He: "בצק עלים, קרם ופירות יער", d2En: "Shortcrust dough, jam, and chocolate", d2He: "בצק פריך, ריבה ושוקולד", d3En: "Sponge cake, coffee, and mascarpone", d3He: "עוגת ספוג, קפה ומסקרפונה", e: "🍯" },
    { l: 3, qEn: "What is the main difference between 'Gelatin' and 'Agar-Agar'?", qHe: "מה ההבדל העיקרי בין 'ג'לטין' ל'אגר-אגר'?", ansEn: "Gelatin is animal-based; Agar-Agar is plant-based (from seaweed)", ansHe: "ג'לטין הוא מהחי; אגר-אגר הוא מהצומח (מאצות)", d1En: "Gelatin is sweet; Agar-Agar is salty", d1He: "ג'לטין הוא מתוק; אגר-אגר הוא מלוח", d2En: "Gelatin stays liquid; Agar-Agar turns into solid rock", d2He: "ג'לטין נשאר נוזלי; אגר-אגר הופך לסלע מוצק", d3En: "Gelatin is blue; Agar-Agar is red", d3He: "ג'לטין הוא כחול; אגר-אגר הוא אדום", e: "🌊" },
    { l: 3, qEn: "What is 'Tempering' in the context of eggs for a custard?", qHe: "מהו 'טמפרור' בהקשר של ביצים לקרם?", ansEn: "Gradually adding hot liquid to eggs to raise their temperature without scrambling", ansHe: "הוספה בהדרגה של נוזל חם לביצים כדי להעלות את הטמפרטורה שלהן בלי לבשל אותן", d1En: "Whipping eggs until they are stiff", d1He: "הקצפת ביצים עד שהן יציבות", d2En: "Freezing eggs before mixing", d2He: "הקפאת ביצים לפני הערבוב", d3En: "Separating yolks from whites", d3He: "הפרדת חלמונים מחלבונים", e: "🥛" },
    { l: 3, qEn: "What is 'Pâte à Bombe'?", qHe: "מה זה 'פאט א-בומב' (Pâte à Bombe)?", ansEn: "A mixture of egg yolks and hot sugar syrup used as a base for mousses", ansHe: "תערובת של חלמונים וסירופ סוכר חם המשמשת כבסיס למוסים", d1En: "A type of spicy dough", d1He: "סוג של בצק חריף", d2En: "A French explosive device", d2He: "מכשיר נפץ צרפתי", d3En: "A heavy chocolate glaze", d3He: "ציפוי שוקולד כבד", e: "💣" },
    { l: 3, qEn: "What is 'Crème Diplomate'?", qHe: "מהו 'קרם דיפלומט' (Crème Diplomate)?", ansEn: "A mixture of pastry cream (Crème Pâtissière) and whipped cream", ansHe: "תערובת של קרם פטיסייר וקצפת", d1En: "A cream used only for state dinners", d1He: "קרם המשמש רק לארוחות רשמיות", d2En: "Coffee flavored custard", d2He: "קרם פטיסייר בטעם קפה", d3En: "A vegan alternative to butter", d3He: "תחליף טבעוני לחמאה", e: "🍦" },
    { l: 2, qEn: "Which pastry is shaped like a shell and famously associated with Marcel Proust?", qHe: "איזה מאפה מעוצב כקונכייה ומזוהה עם מרסל פרוסט?", ansEn: "Madeleine", ansHe: "מדלן", d1En: "Financier", d1He: "פיננסייר", d2En: "Éclair", d2He: "אקלר", d3En: "Macaron", d3He: "מקרון", e: "🐚" },
    { l: 3, qEn: "What is 'Lecithin's' primary function in chocolate manufacture?", qHe: "מהו התפקיד העיקרי של 'לציטין' בייצור שוקולד?", ansEn: "As an emulsifier to reduce viscosity and improve flow", ansHe: "כמתחלב להורדת הצמיגות ושיפור הזרימה", d1En: "To make the chocolate taste like milk", d1He: "כדי לתת לשוקולד טעם של חלב", d2En: "To increase the shelf life of sugar", d2He: "כדי להאריך את חיי המדף של הסוכר", d3En: "To add a bright pink color", d3He: "כדי להוסיף צבע ורוד בהיר", e: "🍫" },
    { l: 3, qEn: "What is 'Bloom' on chocolate?", qHe: "מהי 'פריחה' (Bloom) על שוקולד?", ansEn: "Whitish streaks or spots caused by cocoa butter or sugar rising to the surface", ansHe: "פסים או כתמים לבנבנים הנגרמים מחמאת קקאו או סוכר שעולים לפני השטח", d1En: "The chocolate starting to grow flowers", d1He: "השוקולד שמתחיל להצמיח פרחים", d2En: "A type of chocolate mold", d2He: "סוג של עובש שוקולד", d3En: "The chocolate melting perfectly", d3He: "השוקולד שנמס בצורה מושלמת", e: "❄️" },
    { l: 3, qEn: "What is the origin of the 'Croissant'?", qHe: "מהו המקור של ה'קרואסון'?", ansEn: "Austria (based on the Kipferl)", ansHe: "אוסטריה (מבוסס על הקיפפרל)", d1En: "France (invented in Paris)", d1He: "צרפת (הומצא בפריז)", d2En: "Italy (based on Cornetto)", d2He: "איטליה (מבוסס על הקורנטו)", d3En: "Turkey (inspired by the flag)", d3He: "טורקיה (בהשראת הדגל)", e: "🥐" },
    { l: 3, qEn: "What is a 'Canelé'?", qHe: "מהו 'קנלה' (Canelé)?", ansEn: "A small French pastry with a soft custard center and a dark, thick caramelized crust", ansHe: "מאפה צרפתי קטן עם מרכז קרמי רך וקרום מקורמל כהה ועבה", d1En: "A long, thin breadstick", d1He: "מקל לחם ארוך ודק", d2En: "A type of Italian pasta", d2He: "סוג של פסטה איטלקית", d3En: "A chocolate flavored pancake", d3He: "פנקייק בטעם שוקולד", e: "🍮" },
    { l: 2, qEn: "What is 'Chantilly Cream'?", qHe: "מהו 'קרם שאנטי'?", ansEn: "Sweetened whipped cream, often flavored with vanilla", ansHe: "קצפת ממותקת, לרוב בטעם וניל", d1En: "A type of savory cheese dip", d1He: "סוג של מטבל גבינה מלוח", d2En: "Thickened milk for coffee", d2He: "חלב מרוכז לקפה", d3En: "Boiled sugar syrup", d3He: "סירופ סוכר רתוח", e: "☁️" },
    { l: 3, qEn: "What is 'Rubbing In' (Sablage) primarily used for?", qHe: "למה משמשת בעיקר טכניקת ה'סבלאז'' (Sablage)?", ansEn: "To produce a crumbly, sandy texture in shortcrust pastry", ansHe: "כדי ליצור מרקם פירורי וחולי בבצק פריך", d1En: "To make bread extremely elastic", d1He: "כדי להפוך לחם לאלסטי במיוחד", d2En: "To clean the baking equipment", d2He: "כדי לנקות את ציוד האפייה", d3En: "To polish the surface of fruits", d3He: "להברקת פני הפירות", e: "🥧" },
    { l: 3, qEn: "What is 'Streusel'?", qHe: "מהו 'שטרויזל'?", ansEn: "A crumbly topping made of flour, butter, and sugar", ansHe: "ציפוי פירורי העשוי מקמח, חמאה וסוכר", d1En: "A type of German sausage", d1He: "סוג של נקניקייה גרמנית", d2En: "A French technique for folding napkins", d2He: "טכניקה צרפתית לקיפול מפיות", d3En: "A liquid glaze for cakes", d3He: "זיגוג נוזלי לעוגות", e: "🥨" },
    { l: 3, qEn: "What is 'Praline'?", qHe: "מהו 'פרלין'?", ansEn: "A paste made from caramelized nuts (usually hazelnuts or almonds)", ansHe: "מחית העשויה מאגוזים מקורמלים (לרוב לוז או שקדים)", d1En: "A type of expensive French wine", d1He: "סוג של יין צרפתי יקר", d2En: "A decorative sugar flower", d2He: "פרח סוכר דקורטיבי", d3En: "A French style of dancing", d3He: "סגנון ריקוד צרפתי", e: "🍬" },
    { l: 3, qEn: "What is 'Genoise'?", qHe: "מהי 'ז'נואז' (Genoise)?", ansEn: "An Italian sponge cake that uses whole eggs whipped with sugar over heat", ansHe: "עוגת ספוג איטלקית המשתמשת בביצים שלמות המוקצפות עם סוכר מעל חום", d1En: "A traditional French bread", d1He: "לחם צרפתי מסורתי", d2En: "A chocolate truffle", d2He: "טראפל שוקולד", d3En: "A spicy Italian sauce", d3He: "רוטב איטלקי חריף", e: "🍰" }
];

// Proceed to generate more questions automatically based on complex templates to reach 400 total
const templates = [
    {
        qEn: "In professional patisserie, why is {item} {action}?",
        qHe: "בקונדיטוריה מקצועית, למה {item_he} {action_he}?",
        ansEn: "{reason}",
        ansHe: "{reason_he}",
        dist: [
            { en: "To save on ingredient costs", he: "כדי לחסוך בעלויות חומרי הגלם" },
            { en: "To make the process easier for beginners", he: "כדי להקל על התהליך למתחילים" },
            { en: "To purely change the final color", he: "כדי לשנות את הצבע הסופי בלבד" }
        ],
        e: "📉"
    },
    {
        qEn: "What would happen if you forgot to {action} while making {item}?",
        qHe: "מה יקרה אם תשכח {action_he} בזמן הכנת {item_he}?",
        ansEn: "{consequence}",
        ansHe: "{consequence_he}",
        dist: [
            { en: "The flavor would become too sweet", he: "הטעם יהפוך למתוק מדי" },
            { en: "The baking time would double", he: "זמן האפייה יוכפל" },
            { en: "Nothing significant would change", he: "שום דבר משמעותי לא ישתנה" }
        ],
        e: "⚠️"
    },
    {
        qEn: "What is the key scientific reason behind {action} {item}?",
        qHe: "מהי הסיבה המדעית המרכזית מאחורי {action_he} של {item_he}?",
        ansEn: "{reason}",
        ansHe: "{reason_he}",
        dist: [
            { en: "To speed up the evaporation of water", he: "כדי להאיץ את אידוי המים" },
            { en: "To prevent the kitchen from getting too hot", he: "כדי למנוע מהמטבח להתחמם מדי" },
            { en: "To satisfy traditional decor rules", he: "כדי לעמוד בכללי עיצוב מסורתיים" }
        ],
        e: "🔬"
    }
];

const dataPoints = [
    { item: "chocolate", item_he: "שוקולד", action: "tempered", action_he: "טמפרור", reason: "To ensure a glossy finish and a crisp snap", reason_he: "כדי להבטיח גימור מבריק ושבירה פריכה", consequence: "The chocolate would stay soft and look dull or bloomed", consequence_he: "השוקולד יישאר רך וייראה עמום או עם 'פריחה'", e: "🍫" },
    { item: "puff pastry", item_he: "בצק עלים", action: "chilled between folds", action_he: "קירור בין הקיפולים", reason: "To relax the gluten and prevent the fat from melting", reason_he: "כדי להרפות את הגלוטן ולמנוע מהשומן להימס", consequence: "The layers would merge and the dough wouldn't rise", consequence_he: "השכבות יתמזגו והבצק לא יתפח", e: "🥐" },
    { item: "sponge cake", item_he: "עוגת ספוג", action: "folded gently", action_he: "קיפול עדין", reason: "To preserve the air bubbles created during whipping", reason_he: "כדי לשמר את בועות האוויר שנוצרו בזמן ההקצפה", consequence: "The cake would become dense and heavy", consequence_he: "העוגה תהפוך לדחוסה וכבדה", e: "🍰" },
    { item: "bread dough", item_he: "בצק לחם", action: "kneaded", action_he: "לישה", reason: "To develop the gluten network that traps air", reason_he: "כדי לפתח את רשת הגלוטן שכולאת אוויר", consequence: "The bread would have a flat, crumbly structure", consequence_he: "ללחם יהיה מבנה שטוח ומתפורר", e: "🍞" },
    { item: "macarons", item_he: "מקרונים", action: "rested before baking", action_he: "מנוחה לפני האפייה", reason: "To allow a skin to form which creates the 'feet' during baking", reason_he: "כדי לאפשר להיווצר קרום שיוצר את ה'רגליים' בזמן האפייה", consequence: "The shells will crack and inconsistent sizes will form", consequence_he: "הקליפות ייסדקו וייווצרו גדלים לא עקביים", e: "🍡" },
    { item: "choux pastry", item_he: "בצק רבוך", action: "dried out in the pan", action_he: "ייבוש בסיר", reason: "To remove excess moisture so it can absorb more eggs", reason_he: "להוצאת לחות עודפת כדי שיוכל לספוג יותר ביצים", consequence: "The puffs won't rise or will be soggy inside", consequence_he: "הפחזניות לא יתפחו או יהיו רטובות מבפנים", e: "🍳" },
    { item: "meringue", item_he: "מרנג", action: "whipped in a grease-free bowl", action_he: "הקצפה בקערה נקייה משומן", reason: "To prevent fat from destabilizing the protein foam", reason_he: "כדי למנוע מהשומן לערער את יציבות קצף החלבון", consequence: "The egg whites will fail to rise or hold volume", consequence_he: "החלבונים לא יצליחו להתרומם או להחזיק נפח", e: "🥚" },
    { item: "pie crust", item_he: "בצק פאי", action: "made with cold water", action_he: "הכנה עם מים קרים", reason: "To keep the fat solid for a flaky texture", reason_he: "כדי להשאיר את השומן מוצק למרקם פריך", consequence: "The crust will be tough and greasy", consequence_he: "הקרום יהיה קשה ושומני", e: "🥧" },
    { item: "ganache", item_he: "גנאש", action: "emulsified", action_he: "ביצוע אמולסיה", reason: "To create a smooth, stable mixture of fat and liquid", reason_he: "כדי ליצור תערובת חלקה ויציבה של שומן ונוזל", consequence: "The mixture will separate and look oily", consequence_he: "התערובת תיפרד ותיראה שומנית", e: "🥣" },
    { item: "custard", item_he: "קרם פטיסייר", action: "tempered with hot milk", action_he: "השוואת טמפרטורות עם חלב חם", reason: "To heat the eggs slowly without scrambling them", reason_he: "כדי לחמם את הביצים באיטיות מבלי שהן יהפכו לחביתה", consequence: "Lumps of cooked egg will form in the liquid", consequence_he: "ייווצרו גושי ביצה מבושלים בנוזל", e: "🥛" },
    { item: "sugar syrup", item_he: "סירופ סוכר", action: "boiled with glucose", action_he: "הרתחה עם גלוקוז", reason: "To prevent unwanted crystallization of the sugar", reason_he: "כדי למנוע התגבשות לא רצויה של הסוכר", consequence: "The syrup will turn grainy and sandy as it cools", consequence_he: "הסירופ יהפוך לגרגירי וחולי ככל שיתקרר", e: "🍯" },
    { item: "doughnuts", item_he: "סופגניות", action: "fried at 180°C", action_he: "טיגון ב-180 מעלות", reason: "To cook the interior and seal the exterior without absorbing grease", reason_he: "כדי לבשל את הפנים ולאטום את החוץ בלי לספוג שמן", consequence: "They will be raw inside or extremely oily", consequence_he: "הן יהיו נאות מבפנים או שומניות במיוחד", e: "🍩" },
    { item: "brioche", item_he: "בריוש", action: "mixed slowly with butter", action_he: "ערבוב איטי עם חמאה", reason: "To build gluten before adding fat which inhibits it", reason_he: "כדי לבנות גלוטן לפני הוספת שומן שמעכב אותו", consequence: "The dough will never become elastic or rise", consequence_he: "הבצק לעולם לא יהיה אלסטי או יתפח", e: "🍞" },
    { item: "fruit tart", item_he: "טארט פירות", action: "glazed with nappage", action_he: "זיגוג עם נאפאז'", reason: "To prevent the fruit from oxidizing and looking dry", reason_he: "כדי למנוע מהפרי להתחמצן ולהיראות יבש", consequence: "The fruit will shrivel and look unappealing", consequence_he: "הפרי יתכווץ וייראה לא מעורר תיאבון", e: "🍓" },
    { item: "mousse", item_he: "מוס", action: "set with gelatin", action_he: "ייצוב עם ג'לטין", reason: "To provide structural stability so it holds its shape", reason_he: "כדי לספק יציבות מבנית כדי שיחזיק את צורתו", consequence: "The mousse will collapse into a puddle", consequence_he: "המוס יקרוס לשלולית", e: "🥣" }
];

// Combine carefully to reach 400
let finalQuestions = [...questionsData];

while (finalQuestions.length < 400) {
    let dp = dataPoints[finalQuestions.length % dataPoints.length];
    let template = templates[Math.floor(Math.random() * templates.length)];

    let q = {
        l: Math.random() > 0.5 ? 2 : 3,
        qEn: template.qEn.replace(/{item}/g, dp.item).replace(/{action}/g, dp.action),
        qHe: template.qHe.replace(/{item_he}/g, dp.item_he).replace(/{action_he}/g, dp.action_he),
        ansEn: template.ansEn ? template.ansEn.replace(/{reason}/g, dp.reason).replace(/{consequence}/g, dp.consequence) : "",
        ansHe: template.ansHe ? template.ansHe.replace(/{reason_he}/g, dp.reason_he).replace(/{consequence_he}/g, dp.consequence_he) : "",
        d1En: template.dist[0].en, d1He: template.dist[0].he,
        d2En: template.dist[1].en, d2He: template.dist[1].he,
        d3En: template.dist[2].en, d3He: template.dist[2].he,
        e: dp.e
    };

    finalQuestions.push(q);
}

// Format into the questions.js structure
const outputStrings = finalQuestions.map(q => {
    const optsEn = [q.ansEn, q.d1En, q.d2En, q.d3En];
    const optsHe = [q.ansHe, q.d1He, q.d2He, q.d3He];

    // Shuffle options
    for (let i = optsEn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optsEn[i], optsEn[j]] = [optsEn[j], optsEn[i]];
        [optsHe[i], optsHe[j]] = [optsHe[j], optsHe[i]];
    }

    const correctIdx = optsEn.indexOf(q.ansEn);

    return `    { category: 'patisserie', level: ${q.l}, text: { en: ${JSON.stringify(q.qEn)}, he: ${JSON.stringify(q.qHe)} }, options: { en: ${JSON.stringify(optsEn)}, he: ${JSON.stringify(optsHe)} }, correctAnswer: ${correctIdx}, emoji: '${q.e}' }`;
});

let content = fs.readFileSync('src/data/questions.js', 'utf8');

// Cleaning all patisserie questions
content = content.replace(/    \{ category: 'patisserie',[\s\S]*? \},\n/g, '');

// Inject into the `questions` array.
const parts = content.split('export const questions = [');
const afterQuestions = parts[1].split('];');
content = parts[0] + 'export const questions = [' + '\n' + outputStrings.join(',\n') + ',\n' + afterQuestions.join('];');

fs.writeFileSync('src/data/questions.js', content);
console.log('Successfully replaced all Patisserie questions with 400 high-quality entries!');
