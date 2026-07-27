const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// ── Sanitize user text to prevent Stored XSS (Fixes M-008, TC-COMM-003,004,012)
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ── Validate imageUrl only allows https:// (Fixes TC-INPUT-002)
function isValidImageUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Seed Dataset with Authentic High-Quality Chef Recipes
const AUTHENTIC_INITIAL_POSTS = [
  {
    username: 'sree',
    recipeTitle: "Sree's Special Hyderabadi Chicken Biryani",
    caption: "My family's authentic Hyderabadi secret dum chicken biryani! Slow-cooked to perfection with fragrant basmati rice, saffron, and homemade spices.",
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
    chefTip: 'Secret Tip: Never stir biryani with a sharp spoon; scoop gently from the sides using a flat plate so the long rice grains do not break!',
    likes: 248,
    likedBy: [],
    comments: [
      { username: 'Navya', text: 'This looks absolutely mouthwatering, Sree! Can you share the exact brand of basmati rice you used?' },
      { username: 'arjun_cooks', text: 'That saffron aroma recommendation is spot on!' }
    ]
  },
  {
    username: 'Navya',
    recipeTitle: 'Authentic Creamy Garlic Fettuccine Alfredo',
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
    chefTip: 'Secret Tip: Always remove the pan from direct heat before adding cheese, otherwise the protein in cheese separates into clumps!',
    likes: 182,
    likedBy: [],
    comments: [
      { username: 'sree', text: 'This is my go-to comfort food! Love the garlic addition.' }
    ]
  },
  {
    username: 'sree',
    recipeTitle: 'Pillowy Soft Paneer Butter Masala',
    caption: 'Restaurant style rich tomato gravy with soft paneer cubes. The trick is soaking paneer in warm water first so it stays melt-in-the-mouth soft!',
    imageOrVideoUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    category: 'North Indian',
    prepTime: '25 mins',
    ingredients: [
      '300g Fresh Paneer Cubes',
      '4 Ripe Tomatoes (pureed)',
      '2 Onions (finely chopped)',
      '2 tbsp Kasuri Methi (crushed)',
      '3 tbsp Butter & 1 tbsp Oil',
      'Fresh Cream & Garam Masala'
    ],
    instructions: [
      'Soak paneer cubes in lukewarm salted water for 10 minutes to make them melt-in-mouth soft.',
      'Saute onions until deep golden, add ginger-garlic paste and spices.',
      'Pour tomato puree and cook until butter separates from sides.',
      'Add paneer cubes, heavy cream, and roasted kasuri methi. Simmer for 5 minutes.'
    ],
    chefTip: 'Secret Tip: Rub kasuri methi between your palms before sprinkling to unlock essential fragrant oils!',
    likes: 310,
    likedBy: [],
    comments: [
      { username: 'Navya', text: 'Perfect paneer texture! Tried this today.' }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET ALL POSTS — public read (by design)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/feed', async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });

    if (posts.length === 0) {
      await Post.insertMany(AUTHENTIC_INITIAL_POSTS);
      posts = await Post.find().sort({ createdAt: -1 });
    }

    res.json({ status: 'success', posts });
  } catch (error) {
    console.error('Error loading community feed:', error);
    res.status(500).json({ status: 'error', message: 'Failed to load community feed.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CREATE POST — requires authentication (Fixes C-002, TC-COMM-002)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const {
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

    // Validate imageUrl — must be https:// (Fixes TC-INPUT-002)
    if (!isValidImageUrl(imageUrl)) {
      return res.status(400).json({ status: 'error', message: 'Image URL must use HTTPS.' });
    }

    const newPost = new Post({
      // Username from verified JWT, not req.body (Fixes C-002 / IDOR)
      username: req.user.username,
      userId: req.user.id,
      // Sanitize all text fields (Fixes M-008, TC-COMM-003, TC-COMM-004)
      recipeTitle: sanitizeText(recipeTitle),
      caption: sanitizeText(caption || ''),
      imageOrVideoUrl: imageUrl,
      category: sanitizeText(category || 'Secret Recipe'),
      prepTime: sanitizeText(prepTime || '20 mins'),
      ingredients: Array.isArray(ingredients)
        ? ingredients.map(i => sanitizeText(i))
        : (ingredients ? ingredients.split('\n').filter(Boolean).map(i => sanitizeText(i)) : []),
      instructions: Array.isArray(instructions)
        ? instructions.map(i => sanitizeText(i))
        : (instructions ? instructions.split('\n').filter(Boolean).map(i => sanitizeText(i)) : []),
      chefTip: sanitizeText(chefTip || ''),
      likes: 0,
      comments: []
    });

    await newPost.save();
    res.status(201).json({ status: 'success', message: 'Recipe published to the community!', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to publish post.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. LIKE / UNLIKE POST — requires authentication (Fixes C-002, TC-COMM-005)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    // Identity from JWT (Fixes IDOR - username from body)
    const username = req.user.username;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found.' });

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
    res.status(500).json({ status: 'error', message: 'Like toggle failed.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADD COMMENT — requires authentication (Fixes C-002, TC-COMM-006)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ status: 'error', message: 'Comment text cannot be empty!' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found.' });

    const newComment = {
      // Username from verified JWT, never from body (Fixes IDOR)
      username: req.user.username,
      // Sanitize comment text (Fixes M-008, TC-COMM-012)
      text: sanitizeText(text.trim()),
      createdAt: new Date()
    };
    post.comments.push(newComment);
    await post.save();

    res.json({ status: 'success', comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ status: 'error', message: 'Comment creation failed.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. EDIT POST — requires authentication + ownership (Fixes H-001, TC-COMM-007,008)
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:postId/edit', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found.' });

    // Ownership check: compare JWT identity to stored userId (Fixes IDOR H-001)
    const postOwnerId = post.userId ? post.userId.toString() : null;
    const isOwner = postOwnerId
      ? postOwnerId === req.user.id
      : post.username === req.user.username;   // fallback for seeded posts

    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Not authorised to edit this post.' });
    }

    const { recipeTitle, caption, imageUrl, category, prepTime, ingredients, instructions, chefTip } = req.body;

    if (recipeTitle !== undefined) post.recipeTitle = sanitizeText(recipeTitle);
    if (caption !== undefined) post.caption = sanitizeText(caption);
    if (imageUrl !== undefined) {
      if (!isValidImageUrl(imageUrl)) {
        return res.status(400).json({ status: 'error', message: 'Image URL must use HTTPS.' });
      }
      post.imageOrVideoUrl = imageUrl;
    }
    if (category !== undefined) post.category = sanitizeText(category);
    if (prepTime !== undefined) post.prepTime = sanitizeText(prepTime);
    if (ingredients !== undefined) {
      post.ingredients = Array.isArray(ingredients)
        ? ingredients.map(i => sanitizeText(i))
        : ingredients.split('\n').filter(Boolean).map(i => sanitizeText(i));
    }
    if (instructions !== undefined) {
      post.instructions = Array.isArray(instructions)
        ? instructions.map(i => sanitizeText(i))
        : instructions.split('\n').filter(Boolean).map(i => sanitizeText(i));
    }
    if (chefTip !== undefined) post.chefTip = sanitizeText(chefTip);

    await post.save();
    res.json({ status: 'success', post });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to edit post.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. DELETE POST — requires authentication + ownership (Fixes H-001, TC-COMM-009,010)
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found.' });

    // Ownership check: compare JWT identity (Fixes IDOR H-001)
    const postOwnerId = post.userId ? post.userId.toString() : null;
    const isOwner = postOwnerId
      ? postOwnerId === req.user.id
      : post.username === req.user.username;

    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Not authorised to delete this post.' });
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ status: 'success', message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete post.' });
  }
});

module.exports = router;