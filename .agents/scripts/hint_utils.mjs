import fs from 'fs';

export function injectHints(filePath, hintsMap) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updatedCount = 0;

    for (const [id, hintObj] of Object.entries(hintsMap)) {
        // Find the "id": "ID" pattern with flexible whitespace
        const idPatternRegex = new RegExp(`"id":\\s*"${id}"`);
        const match = idPatternRegex.exec(content);

        if (match) {
            const idIndex = match.index;
            const snapshot = content.slice(idIndex, idIndex + 500);
            if (snapshot.includes('"hint":')) continue;

            // Determine the indentation of the ID line
            const lineStart = content.lastIndexOf('\n', idIndex) + 1;
            const indentation = content.slice(lineStart, idIndex);

            const hintStr = `\n${indentation}"hint": { "en": "${hintObj.en}", "he": "${hintObj.he}" },`;

            // Find the END of the ID field (the comma or just the end of the line)
            const endOfIdField = content.indexOf(',', idIndex);
            const endOfLine = content.indexOf('\n', idIndex);

            let anchorIndex = -1;
            if (endOfIdField !== -1 && endOfIdField < endOfLine) {
                anchorIndex = endOfIdField + 1;
            } else {
                anchorIndex = endOfLine;
            }

            content = content.slice(0, anchorIndex) + hintStr + content.slice(anchorIndex);
            updatedCount++;
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${updatedCount} questions in ${filePath}`);
    } else {
        console.log(`No updates made to ${filePath}`);
    }
}
