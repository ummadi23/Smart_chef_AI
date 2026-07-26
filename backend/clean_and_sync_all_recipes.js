const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const localRecipesPath = path.join(__dirname, 'data', 'recipes.json');

async function cleanAndSync() {
  try {
    console.log("📂 Reading local backend/data/recipes.json...");
    if (!fs.existsSync(localRecipesPath)) {
      console.error("❌ File not found:", localRecipesPath);
      process.exit(1);
    }

    const rawRecipes = JSON.parse(fs.readFileSync(localRecipesPath, 'utf8'));
    console.log(`📊 Original recipes count: ${rawRecipes.length}`);

    const seenTitles = new Set();
    const cleanRecipes = [];

    rawRecipes.forEach(r => {
      if (!r.title) return;

      // Strip (Traditional Style X), (Style Var X), (Var X), etc.
      let cleanTitle = r.title.replace(/\s*\((Traditional\s*Style|Style|Var|Variation|\d+).*?\)/gi, '').trim();
      // Remove any double spaces
      cleanTitle = cleanTitle.replace(/\s+/g, ' ');

      const key = cleanTitle.toLowerCase();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        cleanRecipes.push({
          ...r,
          title: cleanTitle
        });
      }
    });

    console.log(`🎉 Cleaned & deduplicated count: ${cleanRecipes.length} unique recipes!`);

    // Save cleaned dataset to backend/data/recipes.json
    fs.writeFileSync(localRecipesPath, JSON.stringify(cleanRecipes, null, 2), 'utf8');
    console.log(`✅ Saved clean recipes to ${localRecipesPath}`);

    // Sync to MongoDB Atlas
    if (MONGO_URI) {
      console.log("\n⏳ Connecting to MongoDB Atlas...");
      await mongoose.connect(MONGO_URI);
      console.log("✅ Connected to MongoDB Atlas!");

      const db = mongoose.connection.db;
      const recipesCollection = db.collection('recipes');

      console.log(`📦 Updating MongoDB Atlas 'smartchef.recipes' collection with ${cleanRecipes.length} clean recipes...`);
      await recipesCollection.deleteMany({});

      const batchSize = 500;
      for (let i = 0; i < cleanRecipes.length; i += batchSize) {
        const batch = cleanRecipes.slice(i, i + batchSize);
        await recipesCollection.insertMany(batch);
        console.log(`   Uploaded batch ${Math.floor(i / batchSize) + 1} (${batch.length} recipes)...`);
      }
      console.log("🚀 MongoDB Atlas successfully updated!");
    }
  } catch (err) {
    console.error("❌ Error during cleaning/syncing:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanAndSync();
