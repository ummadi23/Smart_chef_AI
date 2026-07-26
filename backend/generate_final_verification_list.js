const fs = require('fs');
const path = require('path');

const recipeRoutes = require('./routes/recipeRoutes');

// Fetch all remedy endpoints to compile the complete ingredient mapping list
const remedies = [
  'fever', 'cough', 'cold', 'headache', 'sore throat', 'acidity',
  'joint pain', 'stress', 'insomnia', 'acne', 'hair fall', 'diabetes',
  'constipation', 'hypertension', 'weakness', 'memory', 'toothache',
  'weight', 'immunity', 'asthma', 'liver', 'kidney stone', 'ear pain', 'period pain'
];

async function generateList() {
  const map = new Map();
  const imagesDir = path.join(__dirname, 'public', 'images');

  for (const prob of remedies) {
    const res = await fetch('http://localhost:5000/api/recipes/ayurvedic-remedy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem: prob })
    });
    const data = await res.json();
    for (const card of data.ingredientCards) {
      if (!map.has(card.name)) {
        const fname = card.image.replace('http://localhost:5000/images/', '').split('?')[0];
        const diskPath = path.join(imagesDir, fname);
        const exists = fs.existsSync(diskPath) && fs.statSync(diskPath).size > 1000;
        map.set(card.name, { url: card.image, exists, size: exists ? fs.statSync(diskPath).size : 0 });
      }
    }
  }

  console.log('📋 COMPLETE INGREDIENT MAPPING VERIFICATION TABLE:');
  console.log('--------------------------------------------------------------------------------');
  let idx = 1;
  for (const [name, info] of map.entries()) {
    console.log(`${idx++}. "${name}" -> ${info.url} [Status: ${info.exists ? 'OK (' + Math.round(info.size/1024) + ' KB)' : 'FAIL'}]`);
  }
  console.log('--------------------------------------------------------------------------------');
  console.log(`Total Unique Ingredient Names: ${map.size}`);
}

generateList();
