const fs = require('fs');
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');

// Inspect AYURVEDIC_REMEDIES from recipeRoutes
const recipeFile = fs.readFileSync(path.join(__dirname, 'routes', 'recipeRoutes.js'), 'utf8');

// Match all ingredients arrays in AYURVEDIC_REMEDIES
const regex = /ingredients:\s*\[([\s\S]*?)\]/g;
let match;
const allIngredients = new Set();

while ((match = regex.exec(recipeFile)) !== null) {
  const content = match[1];
  const items = content.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  items.forEach(item => allIngredients.add(item));
}

console.log(`Found ${allIngredients.size} unique raw ingredient strings across all remedies:`);
console.log(Array.from(allIngredients));
