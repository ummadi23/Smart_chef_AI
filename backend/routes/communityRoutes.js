const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Seed Dataset with Authentic High-Quality Chef Recipes
const AUTHENTIC_INITIAL_POSTS = [
  {
    username: 'sree',
    recipeTitle: "Sree's Special Hyderabadi Chicken Biryani 🍛",
    caption: 'My family\'s authentic Hyderabadi secret dum chicken biryani! Slow-cooked to perfection with fragrant basmati rice, saffron, and homemade spices.',
    imageOrVideoUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    category: 'Main Course',
    prepTime: '50 mins',
    ingredients: [
      '1kg Aged Long-grain Basmati Rice',
      '1kg Fresh Chicken chunks',
      '2 cups Thick Curd (Yogurt)',
      'Fried Onions (Birista)',
      'Saffron milk & Cardamom powder',
      'Whole spices (Star anise, shahi jeera, cloves)'
    ],
    instructions: [
      'Marinate chicken with yogurt, ginger-garlic paste, chili powder, and birista for at least 2 hours.',
      'Parboil basmati rice with whole spices until 70% cooked.',
      'Layer marinated chicken at the bottom of the pot, top with parboiled rice, saffron milk, ghee, and fried onions.',
      'Seal the pot rim with dough/foil and cook on dum for 40 mins (10 mins medium heat, 30 mins low heat).'
    ],
    chefTip: '💡 Secret Tip: Never stir biryani with a sharp spoon; scoop gently from the sides using a flat plate so the long rice grains don\'t break!',
    likes: 248,
    likedBy: [],
    comments: [
      { username: 'Navya', text: 'This looks absolutely mouthwatering, Sree! Can you share the exact brand of basmati rice you used? 🔥' },
      { username: 'arjun_cooks', text: 'That saffron aroma recommendation is spot on!' }
    ]
  },
  {
    username: 'Navya',
    recipeTitle: 'Authentic Creamy Garlic Fettuccine Alfredo 🍝',
    caption: 'Zero shortcuts! Fresh pasta tossed in a creamy garlic butter sauce with plenty of grated Parmigiano-Reggiano and black pepper.',
    imageOrVideoUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80',
    category: 'Italian',
    prepTime: '20 mins',
    ingredients: [
      '400g Fresh Fettuccine pasta',
      '150g Aged Parmigiano-Reggiano (finely grated)',
      '100g Unsalted Butter',
      '4 cloves Garlic (minced)',
      'Fresh Cracked Black Pepper',
      '1 cup Reserved Pasta Starch Water'
    ],
    instructions: [
      'Boil fettuccine in salted water until 1 minute before al dente.',
      'Melt butter in a pan on ultra-low heat with minced garlic until fragrant.',
      'Transfer pasta directly to the pan with 1/2 cup hot pasta water.',
      'Remove from heat, shower in grated Parmigiano, and vigorously toss until a silky sauce forms.'
    ],
    chefTip: '💡 Secret Tip: Always remove the pan from direct heat before adding cheese, otherwise the protein in cheese separates into clumps!',
    likes: 182,
    likedBy: [],
    comments: [
      { username: 'sree', text: 'This is my go-to comfort food! Love the garlic addition.' }
    ]
  },
  {
    username: 'sree',
    recipeTitle: 'Pillowy Soft Paneer Butter Masala 🧀',
    caption: 'Restaurant style rich tomato gravy with soft paneer cubes. The trick is soaking paneer in warm water first so it stays melt-in-the-mouth soft!',
    imageOrVideoUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    category: 'North Indian',
    prepTime: '25 mins',
    ingredients: [
      '300g Fresh Paneer Cubes',
      '4 Ripe Tomatoes (puréed)',
      '2 Onions (finely chopped)',
      '2 tbsp Kasuri Methi (crushed)',
      '3 tbsp Butter & 1 tbsp Oil',
      'Fresh Cream & Garam Masala'
    ],
    instructions: [
      'Soak paneer cubes in lukewarm salted water for 10 minutes to make them melt-in-mouth soft.',
      'Sauté onions until deep golden, add ginger-garlic paste and spices.',
      'Pour tomato puree and cook until butter separates from sides.',
      'Add paneer cubes, heavy cream, and roasted kasuri methi. Simmer for 5 minutes.'
    ],
    chefTip: '💡 Secret Tip: Rub kasuri methi between your palms before sprinkling to unlock essential fragrant oils!',
    likes: 310,
    likedBy: [],
    comments: [
      { username: 'Navya', text: 'Perfect paneer texture! Tried this today.' }
    ]
  }
];

// 1. ROUTE: GET ALL POSTS (With automatic database seeding)
router.get('/feed', async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });

    // Seed database if empty so feed is never blank
    if (posts.length === 0) {
      await Post.insertMany(AUTHENTIC_INITIAL_POSTS);
      posts = await Post.find().sort({ createdAt: -1 });
    }

    res.json({ status: 'success', posts });
  } catch (error) {
    console.error('Error loading community feed:', error);
    res.status(500).json({ status: 'error', message: 'Failed to load community feed' });
  }
});

// 2. ROUTE: CREATE A SECRET RECIPE POST
router.post('/create', async (req, res) => {
  try {
    const {
      username,
      recipeTitle,
      caption,
      imageUrl,
      category,
      prepTime,
      ingredients,
      instructions,
      chefTip
    } = req.body;

    if (!recipeTitle || !imageUrl) {
      return res.status(400).json({ status: 'error', message: 'Recipe title and image are required!' });
    }

    const newPost = new Post({
      username: username || 'Chef User',
      recipeTitle,
      caption: caption || '',
      imageOrVideoUrl: imageUrl,
      category: category || 'Secret Recipe',
      prepTime: prepTime || '20 mins',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split('\n').filter(Boolean) : []),
      instructions: Array.isArray(instructions) ? instructions : (instructions ? instructions.split('\n').filter(Boolean) : []),
      chefTip: chefTip || '',
      likes: 0,
      comments: []
    });

    await newPost.save();
    res.status(201).json({ status: 'success', message: 'Secret recipe published to the community!', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to publish post' });
  }
});

// 3. ROUTE: LIKE / UNLIKE POST
router.post('/:postId/like', async (req, res) => {
  try {
    const { username } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });

    const userIndex = post.likedBy.indexOf(username);
    if (userIndex === -1) {
      post.likedBy.push(username);
      post.likes += 1;
    } else {
      post.likedBy.splice(userIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
    }

    await post.save();
    res.json({ status: 'success', likes: post.likes, isLiked: userIndex === -1 });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ status: 'error', message: 'Like toggle failed' });
  }
});

// 4. ROUTE: ADD COMMENT TO POST
router.post('/:postId/comment', async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ status: 'error', message: 'Comment text cannot be empty!' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });

    const newComment = { username: username || 'Chef User', text: text.trim(), createdAt: new Date() };
    post.comments.push(newComment);
    await post.save();

    res.json({ status: 'success', comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ status: 'error', message: 'Comment creation failed' });
  }
});

// 5. ROUTE: EDIT A POST (only by original author)
router.put('/:postId/edit', async (req, res) => {
  try {
    const { username, recipeTitle, caption, imageUrl, category, prepTime, ingredients, instructions, chefTip } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });
    if (post.username !== username) return res.status(403).json({ status: 'error', message: 'Not authorised to edit this post' });

    if (recipeTitle !== undefined) post.recipeTitle = recipeTitle;
    if (caption !== undefined) post.caption = caption;
    if (imageUrl !== undefined) post.imageOrVideoUrl = imageUrl;
    if (category !== undefined) post.category = category;
    if (prepTime !== undefined) post.prepTime = prepTime;
    if (ingredients !== undefined) post.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split('\n').filter(Boolean);
    if (instructions !== undefined) post.instructions = Array.isArray(instructions) ? instructions : instructions.split('\n').filter(Boolean);
    if (chefTip !== undefined) post.chefTip = chefTip;

    await post.save();
    res.json({ status: 'success', post });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to edit post' });
  }
});

// 6. ROUTE: DELETE A POST (only by original author)
router.delete('/:postId', async (req, res) => {
  try {
    const { username } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });
    if (post.username !== username) return res.status(403).json({ status: 'error', message: 'Not authorised to delete this post' });

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ status: 'success', message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete post' });
  }
});

module.exports = router;