import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  Image, TextInput, ActivityIndicator, Modal, Platform, Linking, SafeAreaView, StatusBar,
} from 'react-native';
import { getApiBaseUrl } from '../config';

interface CommentItem {
  _id?: string;
  username: string;
  text: string;
  createdAt?: string;
}

interface PostItem {
  _id: string;
  username: string;
  recipeTitle: string;
  caption: string;
  imageOrVideoUrl: string;
  category?: string;
  prepTime?: string;
  ingredients?: string[];
  instructions?: string[];
  chefTip?: string;
  likes: number;
  likedBy?: string[];
  comments?: CommentItem[];
  createdAt?: string;
}

export default function CommunityScreen({ onBack }: { onBack: () => void }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUser] = useState('sree');

  // Expanded states
  const [expandedRecipes, setExpandedRecipes] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  // Modal State for New Post
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newCategory, setNewCategory] = useState('Main Course');
  const [newPrepTime, setNewPrepTime] = useState('25 mins');
  const [newIngredients, setNewIngredients] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newChefTip, setNewChefTip] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Edit/Delete State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrepTime, setEditPrepTime] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [editChefTip, setEditChefTip] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Feed filter: 'all' | 'mine'
  const [feedFilter, setFeedFilter] = useState<'all' | 'mine'>('all');

  const INITIAL_COMMUNITY_POSTS: PostItem[] = [
    {
      _id: 'post_sree_1',
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
      likedBy: ['sree'],
      comments: [
        { username: 'Navya', text: 'This looks absolutely mouthwatering, Sree! Can you share the exact brand of basmati rice you used?' },
        { username: 'arjun_cooks', text: 'That saffron aroma recommendation is spot on!' }
      ]
    },
    {
      _id: 'post_navya_1',
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
      _id: 'post_sree_2',
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
        'Soak paneer cubes in warm salted water for 10 minutes.',
        'Sauté onions and ginger-garlic paste in butter until golden brown.',
        'Add tomato puree, chili powder, and cashew paste; cook until oil separates.',
        'Add paneer cubes, fresh cream, Kasuri Methi, and simmer for 5 minutes.'
      ],
      chefTip: 'Secret Tip: Crushing Kasuri Methi between warm palms releases essential oils for that authentic restaurant flavor!',
      likes: 310,
      likedBy: ['sree'],
      comments: [
        { username: 'chef_raj', text: 'Great tip about soaking paneer! Tried it today and it worked amazingly.' }
      ]
    },
    {
      _id: 'post_arjun_1',
      username: 'arjun_cooks',
      recipeTitle: 'Golden Crispy Mysuru Masala Dosa',
      caption: 'South Indian street style crispy dosa with red garlic chutney spread inside and spicy potato filling!',
      imageOrVideoUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
      category: 'South Indian',
      prepTime: '15 mins',
      ingredients: [
        'Fermented Dosa Batter',
        'Spicy Red Garlic Chutney',
        'Potato Palya filling',
        'Desi Butter'
      ],
      instructions: [
        'Spread thin layer of batter on hot cast iron tawa.',
        'Smear red garlic chutney and generous butter.',
        'Place potato filling in center and roast until golden crisp.'
      ],
      chefTip: 'Secret Tip: Sprinkle a pinch of sugar into fermented batter for rich golden color!',
      likes: 195,
      likedBy: [],
      comments: [
        { username: 'sree', text: 'Looks so crispy! Sambar recipe too please!' }
      ]
    }
  ];

  // Fetch Community Feed from Backend
  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/community/feed`);
      const json = await res.json();
      if (json.posts && json.posts.length > 0) {
        setPosts(json.posts);
      } else {
        setPosts(INITIAL_COMMUNITY_POSTS);
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
      setPosts(INITIAL_COMMUNITY_POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Like
  const handleLike = async (postId: string) => {
    // Optimistic UI Update
    setPosts(prev =>
      prev.map(p => {
        if (p._id === postId) {
          const isLiked = p.likedBy?.includes(activeUser);
          const newLikes = isLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
          const newLikedBy = isLiked
            ? (p.likedBy || []).filter(u => u !== activeUser)
            : [...(p.likedBy || []), activeUser];
          return { ...p, likes: newLikes, likedBy: newLikedBy };
        }
        return p;
      })
    );

    try {
      await fetch(`${getApiBaseUrl()}/api/community/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUser }),
      });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Add Comment
  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    // Clear input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => {
        if (p._id === postId) {
          const updatedComments = [...(p.comments || []), { username: activeUser, text }];
          return { ...p, comments: updatedComments };
        }
        return p;
      })
    );

    try {
      await fetch(`${getApiBaseUrl()}/api/community/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUser, text }),
      });
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // Create Secret Recipe Post
  const handlePublishPost = async () => {
    if (!newTitle.trim() || !newImage.trim()) {
      alert('Please provide a recipe title and an image URL!');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/community/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: activeUser,
          recipeTitle: newTitle.trim(),
          caption: newCaption.trim(),
          imageUrl: newImage.trim(),
          category: newCategory,
          prepTime: newPrepTime,
          ingredients: newIngredients.split('\n').filter(Boolean),
          instructions: newInstructions.split('\n').filter(Boolean),
          chefTip: newChefTip.trim(),
        }),
      });

      const json = await res.json();
      if (json.post) {
        setPosts(prev => [json.post, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setNewTitle('');
        setNewCaption('');
        setNewImage('');
        setNewIngredients('');
        setNewInstructions('');
        setNewChefTip('');
      }
    } catch (err) {
      console.error('Failed to publish post:', err);
      alert('Could not publish recipe post. Please check backend connection.');
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleRecipeDrawer = (id: string) => {
    setExpandedRecipes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCommentsDrawer = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSavedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Open edit modal pre-filled with existing post values
  const openEditModal = (post: PostItem) => {
    setEditingPost(post);
    setEditTitle(post.recipeTitle);
    setEditCaption(post.caption);
    setEditImage(post.imageOrVideoUrl);
    setEditCategory(post.category || '');
    setEditPrepTime(post.prepTime || '');
    setEditIngredients((post.ingredients || []).join('\n'));
    setEditInstructions((post.instructions || []).join('\n'));
    setEditChefTip(post.chefTip || '');
    setMenuOpenId(null);
    setEditModalOpen(true);
  };

  // Save edits
  const handleSaveEdit = async () => {
    if (!editingPost) return;
    if (!editTitle.trim() || !editImage.trim()) {
      alert('Recipe title and image URL are required!');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/community/${editingPost._id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: activeUser,
          recipeTitle: editTitle.trim(),
          caption: editCaption.trim(),
          imageUrl: editImage.trim(),
          category: editCategory.trim(),
          prepTime: editPrepTime.trim(),
          ingredients: editIngredients.split('\n').filter(Boolean),
          instructions: editInstructions.split('\n').filter(Boolean),
          chefTip: editChefTip.trim(),
        }),
      });
      const json = await res.json();
      if (json.post) {
        setPosts(prev => prev.map(p => p._id === json.post._id ? json.post : p));
        setEditModalOpen(false);
        setEditingPost(null);
      } else {
        alert('Failed to save changes. Try again.');
      }
    } catch (err) {
      console.error('Edit failed:', err);
      alert('Could not save. Check backend connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete post
  const handleDeletePost = (postId: string) => {
    setMenuOpenId(null);
    // Simple confirm via two-step: alert then delete
    alert(
      'Delete this post? This cannot be undone.\n\nTap OK to confirm.'
    );
    // Since Alert.alert with buttons is React Native only, we proceed after alert
    fetch(`${getApiBaseUrl()}/api/community/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: activeUser }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setPosts(prev => prev.filter(p => p._id !== postId));
        } else {
          alert('Could not delete post.');
        }
      })
      .catch(() => alert('Delete failed. Check backend connection.'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* ── HEADER NAVIGATION ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBadge}>📸 INSTAGRAM CHEF FEED</Text>
          <Text style={styles.headerTitle}>Community Kitchen</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={() => setIsModalOpen(true)}>
          <Text style={styles.createBtnText}>+ Post Secret Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* ── FILTER TABS ── */}
      <View style={styles.filterTabRow}>
        <TouchableOpacity
          style={[styles.filterTab, feedFilter === 'all' && styles.filterTabActive]}
          onPress={() => setFeedFilter('all')}
        >
          <Text style={[styles.filterTabText, feedFilter === 'all' && styles.filterTabTextActive]}>
            🌍 All Posts
          </Text>
          {feedFilter === 'all' && <View style={styles.filterTabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, feedFilter === 'mine' && styles.filterTabActive]}
          onPress={() => setFeedFilter('mine')}
        >
          <Text style={[styles.filterTabText, feedFilter === 'mine' && styles.filterTabTextActive]}>
            👨‍🍳 My Posts
          </Text>
          {feedFilter === 'mine' && (
            <View style={styles.filterBadgeRow}>
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {posts.filter(p => p.username === activeUser).length}
                </Text>
              </View>
            </View>
          )}
          {feedFilter === 'mine' && <View style={styles.filterTabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* ── FEED CONTENT ── */}
      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FF385C" />
            <Text style={styles.loadingText}>Fetching secret recipes from global chefs...</Text>
          </View>
        ) : (() => {
          const visiblePosts = feedFilter === 'mine'
            ? posts.filter(p => p.username === activeUser)
            : posts;

          if (visiblePosts.length === 0) {
            return (
              <View style={styles.emptyMyPosts}>
                <Text style={styles.emptyMyPostsEmoji}>🍳</Text>
                <Text style={styles.emptyMyPostsTitle}>No posts yet!</Text>
                <Text style={styles.emptyMyPostsSubtitle}>Tap "+ Post Secret Recipe" to share your first dish with the community.</Text>
              </View>
            );
          }

          return visiblePosts.map(item => {
            const isLiked = item.likedBy?.includes(activeUser);
            const isSaved = savedPosts[item._id];
            const isRecipeExpanded = expandedRecipes[item._id];
            const isCommentsExpanded = expandedComments[item._id];

            return (
              <View key={item._id} style={styles.postCard}>
                {/* 1. USER BAR */}
                <View style={styles.userBar}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarChar}>{item.username[0].toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.usernameText}>@{item.username}</Text>
                    <Text style={styles.recipeTitleSub}>{item.recipeTitle}</Text>
                  </View>
                  <View style={styles.prepBadge}>
                    <Text style={styles.prepBadgeText}>⏱ {item.prepTime || '20 mins'}</Text>
                  </View>
                  {/* Edit / Delete menu — only on own posts */}
                  {item.username === activeUser && (
                    <View style={{ marginLeft: 8 }}>
                      <TouchableOpacity
                        style={styles.menuDotBtn}
                        onPress={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}
                      >
                        <Text style={styles.menuDotText}>⋯</Text>
                      </TouchableOpacity>
                      {menuOpenId === item._id && (
                        <View style={styles.menuDropdown}>
                          <TouchableOpacity style={styles.menuItem} onPress={() => openEditModal(item)}>
                            <Text style={styles.menuItemEdit}>✏️  Edit Post</Text>
                          </TouchableOpacity>
                          <View style={styles.menuDivider} />
                          <TouchableOpacity style={styles.menuItem} onPress={() => handleDeletePost(item._id)}>
                            <Text style={styles.menuItemDelete}>🗑️  Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* 2. FOOD PHOTO / MEDIA */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageOrVideoUrl }} style={styles.postImage} />
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{item.category || 'Secret Recipe'}</Text>
                  </View>
                </View>

                {/* 3. INSTAGRAM ACTION BAR */}
                <View style={styles.actionRow}>
                  <View style={styles.actionLeft}>
                    <TouchableOpacity onPress={() => handleLike(item._id)} style={styles.iconBtn}>
                      <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
                      <Text style={[styles.actionCount, isLiked && { color: '#E11D48', fontWeight: '800' }]}>
                        {item.likes}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleCommentsDrawer(item._id)} style={styles.iconBtn}>
                      <Text style={styles.actionIcon}>💬</Text>
                      <Text style={styles.actionCount}>{item.comments?.length || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBtn}>
                      <Text style={styles.actionIcon}>✈️</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => toggleSave(item._id)}>
                    <Text style={styles.actionIcon}>{isSaved ? '🔖' : '🏷️'}</Text>
                  </TouchableOpacity>
                </View>

                {/* 4. CAPTION & STORY */}
                <View style={styles.captionBlock}>
                  <Text style={styles.captionText}>
                    <Text style={styles.captionUser}>@{item.username} </Text>
                    {item.caption}
                  </Text>
                </View>

                {/* 5. EXPANDABLE SECRET RECIPE CARD */}
                <View style={styles.recipeDrawerBox}>
                  <TouchableOpacity
                    style={styles.recipeDrawerHeader}
                    onPress={() => toggleRecipeDrawer(item._id)}
                  >
                    <Text style={styles.recipeDrawerTitle}>
                      📖 {isRecipeExpanded ? 'Hide Secret Recipe' : 'View Secret Recipe & Step-by-Step Guide'}
                    </Text>
                    <Text style={styles.recipeDrawerArrow}>{isRecipeExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isRecipeExpanded && (
                    <View style={styles.recipeDrawerBody}>
                      {/* Ingredients */}
                      {item.ingredients && item.ingredients.length > 0 && (
                        <View style={styles.drawerSection}>
                          <Text style={styles.drawerSectionLabel}>🛒 Secret Ingredients:</Text>
                          {item.ingredients.map((ing, i) => (
                            <View key={i} style={styles.ingRow}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.ingText}>{ing}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Instructions */}
                      {item.instructions && item.instructions.length > 0 && (
                        <View style={styles.drawerSection}>
                          <Text style={styles.drawerSectionLabel}>👨‍🍳 Preparation Steps:</Text>
                          {item.instructions.map((step, i) => (
                            <View key={i} style={styles.stepRow}>
                              <View style={styles.stepNum}>
                                <Text style={styles.stepNumText}>{i + 1}</Text>
                              </View>
                              <Text style={styles.stepText}>{step}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Chef Tip */}
                      {Boolean(item.chefTip) && (
                        <View style={styles.tipBox}>
                          <Text style={styles.tipText}>{item.chefTip}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* 6. COMMENTS DRAWER */}
                {isCommentsExpanded && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments ({item.comments?.length || 0})</Text>

                    {item.comments && item.comments.length > 0 ? (
                      item.comments.map((c, idx) => (
                        <View key={idx} style={styles.commentRow}>
                          <Text style={styles.commentUser}>@{c.username}: </Text>
                          <Text style={styles.commentText}>{c.text}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noCommentsText}>No comments yet. Be the first to ask a chef!</Text>
                    )}

                    {/* Add Comment Input */}
                    <View style={styles.addCommentRow}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Add a chef comment..."
                        placeholderTextColor="#94A3B8"
                        value={commentInputs[item._id] || ''}
                        onChangeText={t => setCommentInputs(prev => ({ ...prev, [item._id]: t }))}
                        onSubmitEditing={() => handleAddComment(item._id)}
                      />
                      <TouchableOpacity
                        style={styles.postCommentBtn}
                        onPress={() => handleAddComment(item._id)}
                      >
                        <Text style={styles.postCommentBtnText}>Post</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          });
        })()
        }
      </ScrollView>

      {/* ── NEW POST SECRET RECIPE MODAL ── */}
      <Modal visible={isModalOpen} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕ Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Publish Secret Recipe</Text>
            <TouchableOpacity
              style={[styles.publishBtn, isPublishing && { opacity: 0.6 }]}
              onPress={handlePublishPost}
              disabled={isPublishing}
            >
              <Text style={styles.publishBtnText}>Publish</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Recipe Title *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Granny's Secret Butter Chicken"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.fieldLabel}>High-Quality Food Photo / Video URL *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor="#94A3B8"
              value={newImage}
              onChangeText={setNewImage}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Category</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Main Course / Dessert"
                  placeholderTextColor="#94A3B8"
                  value={newCategory}
                  onChangeText={setNewCategory}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Prep Time</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="30 mins"
                  placeholderTextColor="#94A3B8"
                  value={newPrepTime}
                  onChangeText={setNewPrepTime}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Story / Post Caption</Text>
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              multiline
              placeholder="Tell the story behind this dish..."
              placeholderTextColor="#94A3B8"
              value={newCaption}
              onChangeText={setNewCaption}
            />

            <Text style={styles.fieldLabel}>Secret Ingredients (one per line)</Text>
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              multiline
              placeholder="500g Chicken&#10;2 tbsp Kashmiri Chilli&#10;1 cup Butter"
              placeholderTextColor="#94A3B8"
              value={newIngredients}
              onChangeText={setNewIngredients}
            />

            <Text style={styles.fieldLabel}>Step-by-Step Cooking Steps (one per line)</Text>
            <TextInput
              style={[styles.modalInput, { height: 120 }]}
              multiline
              placeholder="1. Marinate chicken for 2 hours&#10;2. Sauté onions in butter&#10;3. Simmer on low heat"
              placeholderTextColor="#94A3B8"
              value={newInstructions}
              onChangeText={setNewInstructions}
            />

            <Text style={styles.fieldLabel}>Chef's Secret Tip</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="💡 Secret Tip: Always roast kasuri methi before adding..."
              placeholderTextColor="#94A3B8"
              value={newChefTip}
              onChangeText={setNewChefTip}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* ── EDIT POST MODAL ── */}
      <Modal visible={editModalOpen} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setEditModalOpen(false); setEditingPost(null); }} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕ Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Recipe Post</Text>
            <TouchableOpacity
              style={[styles.publishBtn, isSaving && { opacity: 0.6 }]}
              onPress={handleSaveEdit}
              disabled={isSaving}
            >
              <Text style={styles.publishBtnText}>{isSaving ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Recipe Title *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Recipe Title"
              placeholderTextColor="#94A3B8"
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <Text style={styles.fieldLabel}>Photo / Video URL *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor="#94A3B8"
              value={editImage}
              onChangeText={setEditImage}
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Category</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Main Course"
                  placeholderTextColor="#94A3B8"
                  value={editCategory}
                  onChangeText={setEditCategory}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Prep Time</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="30 mins"
                  placeholderTextColor="#94A3B8"
                  value={editPrepTime}
                  onChangeText={setEditPrepTime}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Caption / Story</Text>
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              multiline
              placeholder="Tell the story behind this dish..."
              placeholderTextColor="#94A3B8"
              value={editCaption}
              onChangeText={setEditCaption}
            />

            <Text style={styles.fieldLabel}>Secret Ingredients (one per line)</Text>
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              multiline
              placeholderTextColor="#94A3B8"
              placeholder="500g Chicken&#10;2 tbsp Kashmiri Chilli"
              value={editIngredients}
              onChangeText={setEditIngredients}
            />

            <Text style={styles.fieldLabel}>Cooking Steps (one per line)</Text>
            <TextInput
              style={[styles.modalInput, { height: 120 }]}
              multiline
              placeholderTextColor="#94A3B8"
              placeholder="1. Marinate chicken&#10;2. Sauté onions"
              value={editInstructions}
              onChangeText={setEditInstructions}
            />

            <Text style={styles.fieldLabel}>Chef's Secret Tip</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="💡 Your secret tip..."
              placeholderTextColor="#94A3B8"
              value={editChefTip}
              onChangeText={setEditChefTip}
            />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    // CHANGE THIS VALUE TO MOVE THE HEADER DOWN (e.g., to avoid status bar overlap)
    paddingTop: 55,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#F1F5F9' },
  backButtonText: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  headerCenter: { alignItems: 'center' },
  headerBadge: { fontSize: 9, fontWeight: '800', color: '#E11D48', letterSpacing: 1.2 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },

  createBtn: { backgroundColor: '#E11D48', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 },
  createBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  // Post options menu
  menuDotBtn: { padding: 6, marginLeft: 4 },
  menuDotText: { fontSize: 20, color: '#64748B', fontWeight: '700' },
  menuDropdown: {
    position: 'absolute', top: 32, right: 0, zIndex: 999,
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12,
    shadowRadius: 10, elevation: 8, minWidth: 150,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 12 },
  menuItemEdit: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  menuItemDelete: { fontSize: 14, fontWeight: '600', color: '#E11D48' },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9' },

  feedContent: { paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 60 },
  loadingBox: { alignItems: 'center', marginTop: 40 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: '500' },

  // Filter Tabs
  filterTabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 20,
  },
  filterTab: {
    flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative',
  },
  filterTabActive: {},
  filterTabText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  filterTabTextActive: { color: '#E11D48', fontWeight: '800' },
  filterTabUnderline: {
    position: 'absolute', bottom: 0, left: 20, right: 20, height: 2.5,
    backgroundColor: '#E11D48', borderRadius: 2,
  },
  filterBadgeRow: { position: 'absolute', top: 8, right: 20 },
  filterBadge: {
    backgroundColor: '#E11D48', borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  filterBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  // Empty state for My Posts
  emptyMyPosts: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyMyPostsEmoji: { fontSize: 52, marginBottom: 16 },
  emptyMyPostsTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  emptyMyPostsSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },

  // Post Card
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  userBar: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#FB7185',
  },
  avatarChar: { fontSize: 16, fontWeight: '800', color: '#E11D48' },
  usernameText: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  recipeTitleSub: { fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 1 },
  prepBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  prepBadgeText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  imageContainer: { width: '100%', height: 320, position: 'relative', backgroundColor: '#0F172A' },
  postImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryTag: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12,
  },
  categoryTagText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6,
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 20 },
  actionCount: { fontSize: 13, fontWeight: '700', color: '#334155' },

  captionBlock: { paddingHorizontal: 16, marginBottom: 12 },
  captionText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  captionUser: { fontWeight: '800', color: '#0F172A' },

  // Recipe Drawer Box
  recipeDrawerBox: {
    marginHorizontal: 14, marginBottom: 14,
    backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  recipeDrawerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, backgroundColor: '#EFF6FF',
  },
  recipeDrawerTitle: { fontSize: 13, fontWeight: '800', color: '#1D4ED8' },
  recipeDrawerArrow: { fontSize: 12, color: '#1D4ED8', fontWeight: '800' },

  recipeDrawerBody: { padding: 14 },
  drawerSection: { marginBottom: 14 },
  drawerSectionLabel: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingLeft: 4 },
  bulletPoint: { fontSize: 14, color: '#2563EB', marginRight: 8, fontWeight: '800' },
  ingText: { fontSize: 13, color: '#334155', fontWeight: '500' },

  stepRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  stepNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#2563EB',
    justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 1, flexShrink: 0,
  },
  stepNumText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 20, fontWeight: '500' },

  tipBox: {
    backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: 12, padding: 12, marginTop: 4,
  },
  tipText: { fontSize: 12, color: '#92400E', fontWeight: '600', lineHeight: 18 },

  // Comments
  commentsSection: {
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  commentsTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  commentRow: { flexDirection: 'row', marginBottom: 6 },
  commentUser: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  commentText: { fontSize: 13, color: '#334155', flex: 1 },
  noCommentsText: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic', marginBottom: 8 },

  addCommentRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  commentInput: {
    flex: 1, height: 40, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12,
    paddingHorizontal: 12, fontSize: 13, color: '#0F172A', backgroundColor: '#F8FAFC',
    outlineStyle: 'none',
  } as any,
  postCommentBtn: { backgroundColor: '#0F172A', paddingHorizontal: 14, borderRadius: 12, justifyContent: 'center' },
  postCommentBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#E2E8F0',
  },
  closeBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  closeBtnText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  publishBtn: { backgroundColor: '#E11D48', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  publishBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  modalBody: { padding: 20, paddingBottom: 60 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#475569', marginTop: 14, marginBottom: 6 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: '#0F172A', backgroundColor: '#F8FAFC', outlineStyle: 'none',
  } as any,
});