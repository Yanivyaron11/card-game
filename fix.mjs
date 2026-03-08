import fs from 'fs';

let content = fs.readFileSync('src/data/questions.js', 'utf8');

// There's a messy injection somewhere. Let's just restore from git first.
// Wait, I will just rewrite the entire file from a clean state to be absolutely safe.
