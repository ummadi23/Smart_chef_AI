const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

const downloadedFilePath = 'C:/Users/ummad/Downloads/500_indian_dishes_mongodb.json';
const localRecipesPath = path.join(__dirname, 'data', 'recipes.json');

async function importAndSync() {
  try {
    console.log("📂 Reading downloaded 500 Indian dishes JSON...");
    if (!fs.existsSync(downloadedFilePath)) {
      console.error(`❌ Could not find file at ${downloadedFilePath}`);
      process.exit(1);
    }

    const rawDownloaded = JSON.parse(fs.readFileSync(downloadedFilePath, 'utf8'));
    console.log(`✅ Loaded ${rawDownloaded.length} dishes from ${downloadedFilePath}`);

    // Clean up _id field from $oid format if present
    const cleanedDownloaded = rawDownloaded.map((dish, index) => {
      const { _id, ...rest } = dish;
      return {
        ...rest,
        id: dish.id || `rec_ind_downloaded_${index + 1}`
      };
    });

    // Load existing recipes from local JSON
    let existingRecipes = [];
    if (fs.existsSync(localRecipesPath)) {
      existingRecipes = JSON.parse(fs.readFileSync(localRecipesPath, 'utf8'));
    }
    console.log(`📊 Existing recipes count: ${existingRecipes.length}`);

    // Merge strategy: map existing titles to avoid duplicate titles
    const existingTitlesMap = new Map();
    existingRecipes.forEach(r => {
      if (r.title) existingTitlesMap.set(r.title.toLowerCase().trim(), r);
    });

    let addedCount = 0;
    // Add downloaded dishes to the top of the list if not already present by title
    const finalMergedRecipes = [...cleanedDownloaded];

    existingRecipes.forEach(r => {
      if (!r.title || !cleanedDownloaded.some(d => d.title.toLowerCase().trim() === r.title.toLowerCase().trim())) {
        finalMergedRecipes.push(r);
      }
    });

    console.log(`🎉 Total combined recipes after merging: ${finalMergedRecipes.length}`);

    // 1. Save to local data/recipes.json
    fs.writeFileSync(localRecipesPath, JSON.stringify(finalMergedRecipes, null, 2), 'utf8');
    console.log(`✅ Saved all ${finalMergedRecipes.length} recipes to local backend/data/recipes.json`);

    // 2. Sync directly to MongoDB Atlas
    console.log("\n⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas!");

    const db = mongoose.connection.db;
    const recipesCollection = db.collection('recipes');

    console.log(`📦 Uploading ${finalMergedRecipes.length} recipes to MongoDB Atlas 'smartchef.recipes' collection...`);
    await recipesCollection.deleteMany({});
    
    // Insert in batches of 500 to avoid packet limits
    const batchSize = 500;
    for (let i = 0; i < finalMergedRecipes.length; i += batchSize) {
      const batch = finalMergedRecipes.slice(i, i + batchSize);
      await recipesCollection.insertMany(batch);
      console.log(`   Uploaded batch ${Math.floor(i / batchSize) + 1} (${batch.length} recipes)...`);
    }

    console.log(`\n🚀 SUCCESS! All ${finalMergedRecipes.length} recipes (including the 500 Indian dishes) are live in MongoDB Atlas and local storage!`);
  } catch (err) {
    console.error("❌ Import/Sync Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

importAndSync();
