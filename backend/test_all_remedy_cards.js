const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const recipeRoutes = require('./routes/recipeRoutes');

// Test all 25+ remedies to make sure every single ingredient returns a valid image file that exists on disk!
const remedies = [
  'fever', 'cough', 'cold', 'headache', 'sore throat', 'acidity',
  'joint pain', 'stress', 'insomnia', 'acne', 'hair fall', 'diabetes',
  'constipation', 'hypertension', 'weakness', 'memory', 'toothache',
  'weight', 'immunity', 'asthma', 'liver', 'kidney stone', 'ear pain', 'period pain'
];

async function testAll() {
  console.log('🧪 Testing all 24 remedy ingredient card images on disk...');
  let totalCards = 0;
  let missing = 0;

  for (const prob of remedies) {
    const res = await fetch('http://localhost:5000/api/recipes/ayurvedic-remedy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem: prob })
    });
    const data = await res.json();
    for (const card of data.ingredientCards) {
      totalCards++;
      const filename = card.image.replace('http://localhost:5000/images/', '').split('?')[0];
      const diskPath = path.join(imagesDir, filename);
      if (!fs.existsSync(diskPath) || fs.statSync(diskPath).size < 1000) {
        console.error(`  ❌ Missing/Empty image for "${card.name}": ${filename}`);
        missing++;
      }
    }
  }

  if (missing === 0) {
    console.log(`🎉 SUCCESS! Tested ${totalCards} ingredient cards across 24 remedies — 100% of images exist with valid size!`);
  } else {
    console.error(`⚠️ Found ${missing} missing/invalid images out of ${totalCards} cards.`);
  }
}

testAll();
