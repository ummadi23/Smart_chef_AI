const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const files = fs.readdirSync(imagesDir);

console.log(`Checking ${files.length} files in ${imagesDir}:`);
for (const f of files) {
  const p = path.join(imagesDir, f);
  const stat = fs.statSync(p);
  console.log(`- ${f}: ${stat.size} bytes`);
}
