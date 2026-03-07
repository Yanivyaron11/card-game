import fs from 'fs';
const content = fs.readFileSync('src/data/questions.js', 'utf8');
const lines = content.split('\n');
const keywords = [
  'Eyal Golan', 'אייל גולן',
  'Zohar Argov', 'זוהר ארגוב',
  'Omer Adam', 'עומר אדם',
  'Itai Levi', 'איתי לוי',
  'Peer Tasi', 'פאר טסי',
  'Moshe Peretz', 'משה פרץ',
  'Dudu Aharon', 'דודו אהרון',
  'Margol', 'מרגול',
  'Avihu Medina', 'אביהו מדינה',
  'Daklon', 'דקלון',
  'Haim Moshe', 'חיים משה',
  'Zehava Ben', 'זהבה בן',
  'Eden Ben Zaken', 'עדן בן זקן',
  'Sarit Hadad', 'שרית חדד',
  'Yam Tichoni', 'ים-תיכונית', 'ים תיכוני',
  'Mizrahit', 'מזרחית', 'מזרחי'
];

const toRemove = [];
const newLines = lines.filter((line, i) => {
  if (line.includes('israeli_music')) {
      // Find what the question is asking
      const questionMatch = line.match(/en:\s*\'([^\']+)\'/);
      const isMizrahi = keywords.some(k => line.includes(k));
      if (isMizrahi && !line.includes('Million Dollar') && !line.includes('Static')) {
          toRemove.push(`L${i+1}: ${line.trim()}`);
          return false; // exclude from new lines
      }
  }
  return true;
});

console.log("Removed:", toRemove);
fs.writeFileSync('src/data/questions.js', newLines.join('\n'));
