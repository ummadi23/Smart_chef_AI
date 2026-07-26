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

async function syncToMongoDB() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas (smartchefCluster)...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const db = mongoose.connection.db;

    // 1. Sync Users
    const usersPath = path.join(__dirname, 'data', 'users.json');
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      if (users.length > 0) {
        console.log(`📦 Uploading ${users.length} users...`);
        const usersCollection = db.collection('users');
        await usersCollection.deleteMany({});
        await usersCollection.insertMany(users);
        console.log(`✅ Uploaded ${users.length} users to 'smartchef.users' collection!`);
      }
    }

    // 2. Sync Recipes
    const recipesPath = path.join(__dirname, 'data', 'recipes.json');
    if (fs.existsSync(recipesPath)) {
      const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
      if (recipes.length > 0) {
        console.log(`📦 Uploading ${recipes.length} recipes...`);
        const recipesCollection = db.collection('recipes');
        await recipesCollection.deleteMany({});
        await recipesCollection.insertMany(recipes);
        console.log(`✅ Uploaded ${recipes.length} recipes to 'smartchef.recipes' collection!`);
      }
    }

    // 3. Sync Posts
    const postsPath = path.join(__dirname, 'data', 'posts.json');
    if (fs.existsSync(postsPath)) {
      const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
      if (posts.length > 0) {
        console.log(`📦 Uploading ${posts.length} posts...`);
        const postsCollection = db.collection('posts');
        await postsCollection.deleteMany({});
        await postsCollection.insertMany(posts);
        console.log(`✅ Uploaded ${posts.length} posts to 'smartchef.posts' collection!`);
      }
    }

    console.log("\n🎉 ALL LOCAL APP DATA HAS BEEN SUCCESSFULLY SYNCED TO MONGODB ATLAS!");
    console.log("👉 Now refresh your MongoDB Atlas Data Explorer screen to see your databases and collections!");
  } catch (err) {
    console.error("❌ Sync Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

syncToMongoDB();
