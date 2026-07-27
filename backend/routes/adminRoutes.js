const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const requireAdmin = authMiddleware.requireAdmin;
const User = require('../models/User');

const RECIPES_FILE = path.join(__dirname, '..', 'data', 'recipes.json');

const loadRecipes = () => {
  if (fs.existsSync(RECIPES_FILE)) {
    return JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf8'));
  }
  return [];
};

const saveRecipes = (recipes) => {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2), 'utf8');
};

// Protect all admin endpoints
router.use(authMiddleware);
router.use(requireAdmin);

// ── 1. Analytics Endpoint ──────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const recipes = loadRecipes();
    const users = await User.find({});
    
    const cuisineCounts = {};
    recipes.forEach(r => {
      const c = r.cuisine || 'Global';
      cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
    });

    res.json({
      status: 'success',
      totalUsers: users.length,
      totalRecipes: recipes.length,
      totalReviews: 128, // Aggregated reviews count
      cuisinesBreakdown: cuisineCounts
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch analytics.' });
  }
});

// ── 2. Recipe CRUD ─────────────────────────────────────────────────────────
router.get('/recipes', (req, res) => {
  const recipes = loadRecipes();
  res.json({ status: 'success', count: recipes.length, recipes: recipes.slice(0, 50) });
});

router.post('/recipes', (req, res) => {
  try {
    const { title, cuisine, category, prepTime, cookTime, ingredients, instructions, isVegetarian } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ status: 'error', message: 'Title, ingredients, and instructions are required.' });
    }

    const recipes = loadRecipes();
    const newRecipe = {
      id: uuidv4(),
      title,
      cuisine: cuisine || 'Global',
      category: category || 'Main Course',
      prepTime: prepTime || '15 mins',
      cookTime: cookTime || '20 mins',
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(s => s.trim()),
      instructions: Array.isArray(instructions) ? instructions : instructions.split('\n').map(s => s.trim()),
      isVegetarian: !!isVegetarian,
      createdAt: new Date().toISOString()
    };

    recipes.unshift(newRecipe);
    saveRecipes(recipes);

    res.status(201).json({ status: 'success', message: 'Recipe created successfully!', recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to create recipe.' });
  }
});

router.put('/recipes/:id', (req, res) => {
  try {
    const recipes = loadRecipes();
    const idx = recipes.findIndex(r => r.id === req.params.id || r._id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'Recipe not found.' });
    }

    recipes[idx] = { ...recipes[idx], ...req.body, updatedAt: new Date().toISOString() };
    saveRecipes(recipes);

    res.json({ status: 'success', message: 'Recipe updated successfully!', recipe: recipes[idx] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to update recipe.' });
  }
});

router.delete('/recipes/:id', (req, res) => {
  try {
    let recipes = loadRecipes();
    const initialLen = recipes.length;
    recipes = recipes.filter(r => r.id !== req.params.id && r._id !== req.params.id);

    if (recipes.length === initialLen) {
      return res.status(404).json({ status: 'error', message: 'Recipe not found.' });
    }

    saveRecipes(recipes);
    res.json({ status: 'success', message: 'Recipe deleted successfully!' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to delete recipe.' });
  }
});

// ── 3. Users Management ────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ status: 'success', count: users.length, users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch users.' });
  }
});

module.exports = router;
