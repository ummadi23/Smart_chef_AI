import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
  Linking,
  Image,
  Alert,
} from 'react-native';
import { getApiBaseUrl } from '../config';

// ── Categorized Grocery Database ──────────────────────────────────────────────
export interface CategorizedIngredients {
  category: string;
  icon: string;
  items: string[];
}

export const CATEGORIZED_INGREDIENTS: CategorizedIngredients[] = [
  {
    category: 'Vegetables & Greens',
    icon: '🥬',
    items: [
      'Tomato', 'Potato', 'Red Onion', 'White Onion', 'Garlic', 'Ginger',
      'Spinach (Palak)', 'Capsicum (Bell Pepper)', 'Red Bell Pepper', 'Yellow Bell Pepper',
      'Broccoli', 'Carrot', 'Cauliflower (Gobi)', 'Cucumber', 'Green Chili', 'Red Chili',
      'Green Peas', 'Button Mushroom', 'Portobello Mushroom', 'Eggplant (Brinjal)',
      'Zucchini', 'Coriander / Cilantro', 'Mint (Pudina)', 'Cabbage', 'Sweet Potato',
      'Pumpkin', 'Bottle Gourd (Lauki)', 'Ridge Gourd (Turai)', 'Bitter Gourd (Karela)',
      'Drumstick (Moringa)', 'Okra (Lady Finger / Bhindi)', 'Radish (Mooli)', 'Turnip',
      'Beetroot', 'Curry Leaves', 'Methi (Fenugreek Leaves)', 'Spring Onion',
      'Baby Corn', 'Corn / Maize', 'Asparagus', 'Celery', 'Lettuce', 'Kale',
      'French Beans', 'Cluster Beans (Gavar)', 'Taro / Arbi', 'Yam'
    ]
  },
  {
    category: 'Dairy & Plant Proteins',
    icon: '🧀',
    items: [
      'Milk', 'Full Cream Milk', 'Skimmed Milk', 'Paneer (Cottage Cheese)',
      'Butter', 'Unsalted Butter', 'Curd / Yogurt', 'Greek Yogurt',
      'Cheddar Cheese', 'Mozzarella Cheese', 'Parmesan Cheese', 'Cheese Slices',
      'Eggs', 'Tofu (Soy Paneer)', 'Heavy Cream', 'Fresh Cream', 'Sour Cream',
      'Ghee (Clarified Butter)', 'Coconut Milk', 'Coconut Cream', 'Almond Milk',
      'Soy Milk', 'Oat Milk', 'Buttermilk (Chaas)', 'Khoya / Mawa', 'Condensed Milk'
    ]
  },
  {
    category: 'Spices, Herbs & Seasonings',
    icon: '🌶️',
    items: [
      'Salt', 'Rock Salt (Kala Namak)', 'Turmeric (Haldi)', 'Cumin Seeds (Jeera)',
      'Cumin Powder', 'Red Chili Powder', 'Kashmiri Chili Powder', 'Coriander Powder (Dhania)',
      'Garam Masala', 'Black Pepper', 'Mustard Seeds (Rai)', 'Cardamom (Elaichi)',
      'Black Cardamom', 'Cinnamon (Dalchini)', 'Cloves (Laung)', 'Star Anise',
      'Bay Leaf (Tejpatta)', 'Asafoetida (Hing)', 'Oregano', 'Dried Basil',
      'Fresh Basil', 'Rosemary', 'Thyme', 'Parsley', 'Carom Seeds (Ajwain)',
      'Fennel Seeds (Saunf)', 'Fenugreek Seeds (Methi)', 'Nutmeg (Jaiphal)', 'Paprika',
      'Chili Flakes', 'Soy Sauce', 'Dark Soy Sauce', 'Vinegar', 'Apple Cider Vinegar',
      'Hot Sauce', 'Sriracha', 'Tomato Ketchup', 'Tamarind Paste', 'Garlic Powder',
      'Chaat Masala', 'Amchur (Dry Mango)', 'Kasuri Methi', 'Curry Powder', 'Italian Seasoning'
    ]
  },
  {
    category: 'Meat, Poultry & Seafood',
    icon: '🥩',
    items: [
      'Chicken', 'Chicken Breast', 'Chicken Thighs', 'Chicken Wings',
      'Ground Chicken (Keema)', 'Mutton / Lamb', 'Mutton Keema', 'Beef Steak',
      'Pork Chops', 'Bacon', 'Sausages', 'Ham', 'Eggs (Hen)',
      'Fish Fillet', 'Salmon', 'Tuna', 'Tilapia', 'Mackerel', 'Pomfret',
      'Prawns / Shrimp', 'Crab', 'Lobster', 'Squid / Calamari'
    ]
  },
  {
    category: 'Grains, Pulses & Staples',
    icon: '🌾',
    items: [
      'White Rice', 'Basmati Rice', 'Brown Rice', 'Sona Masoori Rice',
      'Poha (Flaked Rice)', 'Atta (Whole Wheat Flour)', 'Maida (All-Purpose Flour)',
      'Besan (Gram Flour)', 'Sooji / Rava (Semolina)', 'Cornflour / Cornstarch',
      'Rice Flour', 'Ragi Flour', 'Oats', 'Quinoa', 'Bread (White)',
      'Brown Bread', 'Pav / Buns', 'Pasta (Penne)', 'Pasta (Spaghetti)',
      'Macaroni', 'Noodles / Maggi', 'Vermicelli (Sevai)', 'Chickpeas (Kabuli Chana)',
      'Kala Chana', 'Toor Dal (Arhar)', 'Moong Dal (Yellow)', 'Moong Dal (Green)',
      'Masoor Dal (Red)', 'Urad Dal', 'Rajma (Kidney Beans)', 'Soybeans',
      'Cooking Oil', 'Sunflower Oil', 'Olive Oil', 'Mustard Oil', 'Coconut Oil', 'Groundnut Oil', 'Sesame Oil'
    ]
  },
  {
    category: 'Fruits, Nuts & Extras',
    icon: '🍎',
    items: [
      'Lemon / Lime', 'Apple', 'Green Apple', 'Banana', 'Orange',
      'Sweet Lime (Mosambi)', 'Mango', 'Strawberry', 'Blueberry', 'Grapes',
      'Watermelon', 'Pineapple', 'Papaya', 'Pomegranate', 'Guava',
      'Kiwi', 'Dates (Khajoor)', 'Cashews (Kaju)', 'Almonds (Badam)',
      'Walnuts', 'Pistachios', 'Peanuts', 'Raisins (Kishmish)', 'Pumpkin Seeds',
      'Chia Seeds', 'Flaxseeds', 'Sesame Seeds', 'Honey', 'Maple Syrup',
      'Sugar', 'Brown Sugar', 'Jaggery (Gud)', 'Grated Coconut', 'Dark Chocolate', 'Vanilla Extract'
    ]
  }
];

// Flat list of master ingredients dynamically constructed from all categories
export const MASTER_SUGGESTIONS: string[] = Array.from(
  new Set(CATEGORIZED_INGREDIENTS.flatMap(cat => cat.items))
).sort((a, b) => a.localeCompare(b));

const getIngredientEmoji = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('tomato')) return '🍅';
  if (lower.includes('onion')) return '🧅';
  if (lower.includes('garlic')) return '🧄';
  if (lower.includes('spinach') || lower.includes('mint') || lower.includes('coriander') || lower.includes('cabbage') || lower.includes('lettuce') || lower.includes('kale') || lower.includes('methi')) return '🥬';
  if (lower.includes('capsicum') || lower.includes('bell pepper') || lower.includes('pepper')) return '🫑';
  if (lower.includes('broccoli')) return '🥦';
  if (lower.includes('carrot')) return '🥕';
  if (lower.includes('cauliflower') || lower.includes('gobi')) return '🥦';
  if (lower.includes('cucumber') || lower.includes('zucchini') || lower.includes('gourd')) return '🥒';
  if (lower.includes('potato') || lower.includes('yam') || lower.includes('arbi')) return '🥔';
  if (lower.includes('corn')) return '🌽';
  if (lower.includes('eggplant') || lower.includes('brinjal') || lower.includes('baingan')) return '🍆';
  if (lower.includes('mushroom')) return '🍄';
  if (lower.includes('lemon') || lower.includes('lime')) return '🍋';
  if (lower.includes('chicken') || lower.includes('mutton') || lower.includes('beef') || lower.includes('pork') || lower.includes('meat') || lower.includes('sausage') || lower.includes('bacon')) return '🍗';
  if (lower.includes('fish') || lower.includes('salmon') || lower.includes('tuna') || lower.includes('prawn') || lower.includes('crab') || lower.includes('lobster') || lower.includes('squid')) return '🐟';
  if (lower.includes('egg')) return '🥚';
  if (lower.includes('milk') || lower.includes('curd') || lower.includes('yogurt') || lower.includes('cream')) return '🥛';
  if (lower.includes('cheese') || lower.includes('paneer') || lower.includes('tofu')) return '🧀';
  if (lower.includes('butter') || lower.includes('ghee')) return '🧈';
  if (lower.includes('bread') || lower.includes('pasta') || lower.includes('noodle') || lower.includes('bun') || lower.includes('macaroni')) return '🍝';
  if (lower.includes('rice') || lower.includes('poha')) return '🍚';
  if (lower.includes('chili') || lower.includes('paprika') || lower.includes('spice') || lower.includes('masala') || lower.includes('sauce') || lower.includes('salt') || lower.includes('turmeric') || lower.includes('cumin')) return '🌶️';
  if (lower.includes('apple') || lower.includes('banana') || lower.includes('mango') || lower.includes('orange') || lower.includes('berry') || lower.includes('grape') || lower.includes('melon') || lower.includes('pineapple') || lower.includes('fruit')) return '🍎';
  if (lower.includes('cashew') || lower.includes('almond') || lower.includes('walnut') || lower.includes('pistachio') || lower.includes('peanut') || lower.includes('seed') || lower.includes('raisin')) return '🥜';
  return '🥗';
};

interface Dish {
  title: string;
  category: string;
  cuisine: string;
  prepTime: string;
  usedIngredients: string[];
  missingIngredients: string[];
  instructions: string[];
  calories?: string;
  difficulty?: string;
}

interface SuggestResult {
  status: string;
  message?: string;
  dishes: Dish[];
}

export default function ScannerScreen({ onBack }: { onBack: () => void }) {
  const [inputText, setInputText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [language, setLanguage] = useState<'English' | 'Telugu'>('English');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestResult | null>(null);
  const [selectedDish, setSelectedDish] = useState(0);
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'selection' | 'recipes'>('selection');
  const [maxTime, setMaxTime] = useState<'all' | '5' | '10' | '15' | '30'>('all');
  const inputRef = useRef<TextInput>(null);

  // ── Smart Auto-Complete Filter ──────────────────────────────────────────────
  const autocompleteSuggestions = useMemo(() => {
    const query = inputText.trim().toLowerCase();
    if (!query) return [];

    const matches = MASTER_SUGGESTIONS.filter(item => {
      const itemLower = item.toLowerCase();
      const isAlreadySelected = ingredients.some(sel => sel.toLowerCase() === itemLower);
      return !isAlreadySelected && itemLower.includes(query);
    });

    return matches.sort((a, b) => {
      const aStartsWith = a.toLowerCase().startsWith(query);
      const bStartsWith = b.toLowerCase().startsWith(query);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.localeCompare(b);
    }).slice(0, 8);
  }, [inputText, ingredients]);

  // ── Add Ingredient Tag ─────────────────────────────────────────────────────
  const addIngredientByName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    if (!ingredients.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients(prev => [...prev, trimmed]);
    }
    setInputText('');
    setResult(null);
  };

  const toggleChecklistItem = (item: string) => {
    const existingIndex = ingredients.findIndex(i => i.toLowerCase() === item.toLowerCase());
    if (existingIndex >= 0) {
      setIngredients(prev => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      setIngredients(prev => [...prev, item]);
    }
    setResult(null);
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const clearAll = () => {
    setIngredients([]);
    setInputText('');
    setResult(null);
    setSelectedDish(0);
  };

  const toggleCategoryCollapse = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // ── Recipe Search ──────────────────────────────────────────────────────────
  const findRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert('No Ingredients Selected', 'Please select or search at least one ingredient you have in your kitchen.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setSelectedDish(0);
    setViewMode('recipes'); // Switch to Next Screen (Recipe Results Screen)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/recipes/suggest-by-ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, language, maxTime }),
      });

      if (response.ok) {
        const json = await response.json();
        const payload = json.data || json;
        if (payload && Array.isArray(payload.dishes) && payload.dishes.length > 0) {
          setResult(payload);
          setIsLoading(false);
          return;
        }
      }
      
      generateFallbackRecipes(ingredients, maxTime);
    } catch (err) {
      generateFallbackRecipes(ingredients, maxTime);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackRecipes = (selected: string[], timeLimit: string = maxTime) => {
    const lowerSelected = selected.map(i => i.toLowerCase());

    // ── 1. FIVE MINUTE DISHES (5 Mins) ─────────────────────────────────────────
    const fiveMinDishes: Dish[] = [
      {
        title: '5-Min South Indian Curd Rice (Daddojanam)',
        category: 'Quick Lunch / Snack',
        cuisine: 'South Indian',
        prepTime: '5 mins',
        calories: '210 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('rice') || l.includes('curd') || l.includes('mustard') || l.includes('salt');
        }),
        missingIngredients: ['Mustard Seeds', 'Curry Leaves', 'Salt'],
        instructions: [
          '🍚 Step 1: Put 1 bowl of cooked rice in a mixing bowl and gently mash with a spoon.',
          '🥛 Step 2: Pour 1 cup of fresh curd/yogurt over the rice and add a pinch of salt. Mix well.',
          '🧄 Step 3: Heat 1 tsp ghee/oil in a small pan. Add mustard seeds and curry leaves until crackling.',
          '💥 Step 4: Carefully pour the warm ghee tadka into the curd rice.',
          '😋 Step 5: Mix well and enjoy delicious 5-minute cool South Indian Curd Rice!'
        ]
      },
      {
        title: '5-Min Quick Tomato Masala Rice',
        category: 'Quick Lunch',
        cuisine: 'South Indian',
        prepTime: '5 mins',
        calories: '240 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('rice') || l.includes('tomato') || l.includes('onion') || l.includes('oil');
        }),
        missingIngredients: ['Mustard Seeds', 'Turmeric', 'Salt'],
        instructions: [
          '🍅 Step 1: Chop 1 tomato and 1/2 onion into small pieces.',
          '🍳 Step 2: Heat 1 spoon of oil in a pan for 30 seconds; sauté onions and tomatoes with salt.',
          '🔥 Step 3: Stir-fry for 2 minutes until tomatoes get soft.',
          '🍚 Step 4: Add your cooked rice, toss together for 1.5 minutes on medium heat.',
          '🍽️ Step 5: Enjoy hot 5-minute Tomato Rice!'
        ]
      },
      {
        title: '5-Min Dhaba Egg Bhurji (Scrambled Eggs)',
        category: 'Quick Breakfast',
        cuisine: 'Indian Street Food',
        prepTime: '5 mins',
        calories: '220 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('egg') || l.includes('onion') || l.includes('tomato') || l.includes('butter');
        }),
        missingIngredients: ['Butter / Oil', 'Salt', 'Black Pepper'],
        instructions: [
          '🥚 Step 1: Crack 2 eggs into a bowl, add salt and pepper, and whisk with a fork.',
          '🧈 Step 2: Melt 1 spoon of butter in a pan on medium heat.',
          '🧅 Step 3: Sauté diced onions and tomatoes for 1 minute.',
          '🍳 Step 4: Pour in beaten eggs and scramble with a spoon for 2 minutes until fluffy.',
          '🍞 Step 5: Serve hot 5-minute Egg Bhurji!'
        ]
      },
      {
        title: '5-Min Quick Tawa Paneer Bhurji',
        category: 'Quick Main Course',
        cuisine: 'North Indian',
        prepTime: '5 mins',
        calories: '290 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('paneer') || l.includes('onion') || l.includes('tomato') || l.includes('butter');
        }),
        missingIngredients: ['Butter / Ghee', 'Turmeric', 'Salt'],
        instructions: [
          '🧀 Step 1: Crumble soft paneer with your fingers into small pieces.',
          '🍳 Step 2: Heat 1 spoon of butter in a pan; sauté onions and tomatoes for 1.5 minutes.',
          '🥫 Step 3: Add a pinch of turmeric, salt, and red chili powder.',
          '🔥 Step 4: Toss in crumbled paneer and stir on medium heat for 2 minutes.',
          '🍽️ Step 5: Serve hot 5-minute Paneer Bhurji!'
        ]
      },
      {
        title: `5-Min Indian Kachumber Salad (${selected[0] || 'Veggie'} Special)`,
        category: 'Quick Healthy Snack',
        cuisine: 'Indian',
        prepTime: '5 mins',
        calories: '120 kcal',
        difficulty: 'Easy',
        usedIngredients: selected,
        missingIngredients: ['Lemon Juice', 'Chat Masala', 'Salt'],
        instructions: [
          `🔪 Step 1: Chop your available vegetables (${selected.slice(0, 4).join(', ')}) into small crunchy cubes.`,
          '🥣 Step 2: Put all chopped veggies in a clean salad bowl.',
          '🍋 Step 3: Squeeze fresh lemon juice over the veggies.',
          '🌶️ Step 4: Sprinkle a pinch of salt, chat masala, and black pepper.',
          '🥗 Step 5: Toss well with a spoon and enjoy instant fresh 5-minute Kachumber Salad!'
        ]
      }
    ];

    // ── 2. TEN MINUTE DISHES (10 Mins) ─────────────────────────────────────────
    const tenMinDishes: Dish[] = [
      {
        title: '10-Min Fast Tawa Paneer Masala Fry',
        category: 'Quick Dinner',
        cuisine: 'North Indian',
        prepTime: '10 mins',
        calories: '320 kcal',
        difficulty: 'Medium',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('paneer') || l.includes('onion') || l.includes('capsicum') || l.includes('tomato');
        }),
        missingIngredients: ['Kadhai Masala', 'Ghee', 'Kasuri Methi'],
        instructions: [
          '🧀 Step 1: Slice paneer into thin strips. Sauté onion and capsicum in 1 tbsp ghee for 2 mins.',
          '🍅 Step 2: Add tomato paste, turmeric, garlic, and chili powder; cook for 3 mins.',
          '🥘 Step 3: Toss in paneer strips and sizzle on high flame for 4 mins.',
          '🍽️ Step 4: Garnish with cilantro and serve warm 10-minute Tawa Paneer!'
        ]
      },
      {
        title: '10-Min Quick Egg Masala Fry',
        category: 'Quick Meal',
        cuisine: 'Indian Street Food',
        prepTime: '10 mins',
        calories: '260 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('egg') || l.includes('onion') || l.includes('tomato') || l.includes('garlic');
        }),
        missingIngredients: ['Garam Masala', 'Oil', 'Turmeric'],
        instructions: [
          '🥚 Step 1: Boil 2 eggs in hot water for 6 mins; peel and slice in half.',
          '🍳 Step 2: Sauté onions, garlic, and tomatoes in a pan for 2 mins.',
          '🌶️ Step 3: Add cumin, turmeric, and chili powder to make a thick gravy.',
          '🥣 Step 4: Place egg halves face-down into gravy and fry for 2 mins until golden!'
        ]
      },
      {
        title: '10-Min Instant Rava Uttapam / Dosa',
        category: 'Quick Breakfast',
        cuisine: 'South Indian',
        prepTime: '10 mins',
        calories: '210 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('curd') || l.includes('onion') || l.includes('tomato') || l.includes('rice');
        }),
        missingIngredients: ['Rava / Semolina', 'Salt', 'Oil'],
        instructions: [
          '🥣 Step 1: Mix 1 cup rava with 1/2 cup curd and water into a smooth batter.',
          '🧅 Step 2: Stir in finely chopped onions and tomatoes.',
          '🍳 Step 3: Pour a ladle on a hot tawa with oil; cook both sides for 4 mins until crispy brown.',
          '😋 Step 4: Serve hot 10-minute Instant Rava Uttapam!'
        ]
      },
      {
        title: '10-Min Aloo Pyaz Tawa Fry',
        category: 'Quick Side Dish',
        cuisine: 'North Indian',
        prepTime: '10 mins',
        calories: '230 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('potato') || l.includes('onion') || l.includes('turmeric');
        }),
        missingIngredients: ['Mustard Oil', 'Cumin Seeds', 'Amchur Powder'],
        instructions: [
          '🥔 Step 1: Thinly slice potatoes and onions into ribbons.',
          '🍳 Step 2: Heat 1.5 tbsp oil in a tawa; add cumin seeds, potatoes, and onions.',
          '🥘 Step 3: Sprinkle salt, turmeric, and chili powder; fry on medium-high flame for 7 mins.',
          '🍽️ Step 4: Serve crispy 10-minute Aloo Pyaz Fry!'
        ]
      }
    ];

    // ── 3. FIFTEEN MINUTE DISHES (15 Mins) ─────────────────────────────────────
    const fifteenMinDishes: Dish[] = [
      {
        title: '15-Min Quick Kadhai Paneer Subzi',
        category: 'Main Course',
        cuisine: 'North Indian',
        prepTime: '15 mins',
        calories: '340 kcal',
        difficulty: 'Medium',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('paneer') || l.includes('capsicum') || l.includes('onion') || l.includes('tomato');
        }),
        missingIngredients: ['Garam Masala', 'Butter / Ghee', 'Salt'],
        instructions: [
          '🔪 Step 1: Dice paneer, onions, and capsicum into medium cubes.',
          '🍳 Step 2: Heat 1 tbsp ghee in a karahi; sauté veggies for 3 mins.',
          '🍅 Step 3: Add tomatoes, ginger-garlic paste, and spices; simmer for 5 mins.',
          '🧀 Step 4: Add paneer cubes, cover pot, and steam for 5 mins until tender.',
          '🍽️ Step 5: Serve hot 15-minute Kadhai Paneer!'
        ]
      },
      {
        title: '15-Min Restaurant Style Dal Tadka',
        category: 'Main Course',
        cuisine: 'Indian',
        prepTime: '15 mins',
        calories: '260 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('dal') || l.includes('toor') || l.includes('moong') || l.includes('masoor') || l.includes('ghee');
        }),
        missingIngredients: ['Cumin Seeds', 'Hing (Asafoetida)', 'Garlic'],
        instructions: [
          '🥣 Step 1: Pressure cook yellow dal with turmeric and salt for 8 mins.',
          '🧄 Step 2: Fry cumin seeds, garlic, and red chili in 1 tbsp ghee for 2 mins.',
          '💥 Step 3: Pour sizzling ghee tadka into cooked dal.',
          '🌿 Step 4: Stir in cilantro and serve warm in 15 minutes!'
        ]
      },
      {
        title: '15-Min Punjabi Aloo Gobi Dry Fry',
        category: 'Main Course',
        cuisine: 'North Indian',
        prepTime: '15 mins',
        calories: '250 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('potato') || l.includes('cauliflower') || l.includes('gobi') || l.includes('onion');
        }),
        missingIngredients: ['Turmeric', 'Amchur Powder', 'Garam Masala'],
        instructions: [
          '🥔 Step 1: Cut potatoes and cauliflower into small bite-sized florets.',
          '🍳 Step 2: Sauté in 1 tbsp oil for 5 mins until light golden.',
          '🧅 Step 3: Add onions, ginger, turmeric, and chili powder; cover and steam on low for 8 mins.',
          '🍋 Step 4: Squeeze lemon juice and serve hot 15-minute Aloo Gobi!'
        ]
      },
      {
        title: '15-Min Comfort Moong Dal Khichdi',
        category: 'Comfort Meal',
        cuisine: 'Indian',
        prepTime: '15 mins',
        calories: '280 kcal',
        difficulty: 'Easy',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('rice') || l.includes('dal') || l.includes('ghee') || l.includes('turmeric');
        }),
        missingIngredients: ['Ghee', 'Cumin Seeds', 'Hing'],
        instructions: [
          '🍚 Step 1: Wash rice and moong dal together.',
          '🍳 Step 2: Sauté cumin seeds, ginger, and turmeric in ghee inside a cooker for 2 mins.',
          '🍲 Step 3: Add rice, dal, and 3 cups water; pressure cook for 10 mins.',
          '🥣 Step 4: Serve hot comforting 15-minute Khichdi with ghee!'
        ]
      }
    ];

    // ── 4. THIRTY MINUTE DISHES (30 Mins) ──────────────────────────────────────
    const thirtyMinDishes: Dish[] = [
      {
        title: '30-Min Authentic Hyderabadi Dum Biryani',
        category: 'Main Course',
        cuisine: 'South Indian',
        prepTime: '30 mins',
        calories: '420 kcal',
        difficulty: 'Medium',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('rice') || l.includes('basmati') || l.includes('onion') || l.includes('potato') || l.includes('chicken');
        }),
        missingIngredients: ['Biryani Masala', 'Saffron', 'Mint Leaves'],
        instructions: [
          '🍚 Step 1: Boil Basmati rice with whole spices until 80% cooked (8 mins).',
          '🥕 Step 2: Sauté mixed veggies/meat, fried onions, mint, and biryani masala in ghee (10 mins).',
          '🍲 Step 3: Layer rice over masala gravy, seal pot tightly, and dum cook on low flame for 12 mins.',
          '🥣 Step 4: Mix gently and serve hot 30-minute Dum Biryani with Raita!'
        ]
      },
      {
        title: '30-Min Shahi Paneer Butter Masala',
        category: 'Main Course',
        cuisine: 'North Indian',
        prepTime: '30 mins',
        calories: '410 kcal',
        difficulty: 'Medium',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('paneer') || l.includes('tomato') || l.includes('onion') || l.includes('butter') || l.includes('cream');
        }),
        missingIngredients: ['Kasuri Methi', 'Cashews', 'Fresh Cream'],
        instructions: [
          '🧅 Step 1: Blend tomatoes, onions, garlic, and cashews into a rich smooth puree (5 mins).',
          '🧈 Step 2: Cook puree in butter and ghee for 12 mins until oil separates.',
          '🧀 Step 3: Add paneer cubes, cream, kasuri methi, and simmer gently for 8 mins.',
          '🍽️ Step 4: Serve rich 30-minute Shahi Paneer with Naan!'
        ]
      },
      {
        title: '30-Min Desi Homestyle Chicken Curry',
        category: 'Main Course',
        cuisine: 'Indian',
        prepTime: '30 mins',
        calories: '450 kcal',
        difficulty: 'Medium',
        usedIngredients: selected.filter(i => {
          const l = i.toLowerCase();
          return l.includes('chicken') || l.includes('onion') || l.includes('tomato') || l.includes('garlic');
        }),
        missingIngredients: ['Garam Masala', 'Turmeric', 'Mustard Oil'],
        instructions: [
          '🍗 Step 1: Marinate chicken in yogurt, turmeric, and salt for 5 mins.',
          '🧅 Step 2: Sauté sliced onions and ginger-garlic paste until golden brown (8 mins).',
          '🍲 Step 3: Add chicken and tomatoes, cover pot, and simmer on low heat for 17 mins.',
          '🌿 Step 4: Serve delicious hot 30-minute Chicken Curry with Rice!'
        ]
      }
    ];

    // Select exact dishes based on user's maxTime selection
    let resultDishes: Dish[] = [];
    if (timeLimit === '5') {
      resultDishes = fiveMinDishes;
    } else if (timeLimit === '10') {
      resultDishes = tenMinDishes;
    } else if (timeLimit === '15') {
      resultDishes = fifteenMinDishes;
    } else if (timeLimit === '30') {
      resultDishes = thirtyMinDishes;
    } else {
      // 'all' -> return a balanced mixture of all times
      resultDishes = [
        fiveMinDishes[0],
        tenMinDishes[0],
        fifteenMinDishes[0],
        thirtyMinDishes[0],
        fiveMinDishes[1]
      ];
    }

    setResult({
      status: 'success',
      dishes: resultDishes
    });
  };

  const handleBuyIngredient = (item: string) => {
    const encoded = encodeURIComponent(item.split('/')[0].trim());
    const url = Platform.OS === 'web'
      ? `https://www.google.com/search?q=${encoded}+buy+online+india`
      : `https://blinkit.com/s/?q=${encoded}`;
    Linking.openURL(url).catch(() => { });
  };

  const activeDish = result?.dishes?.[selectedDish];

  // ── DEDICATED RECIPE RESULTS SCREEN VIEW ────────────────────────────────────
  if (viewMode === 'recipes') {
    return (
      <View style={styles.container}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setViewMode('selection')} 
            style={styles.backBtn} 
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>← Back to Ingredients</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerBadge}>🍲 INDIAN RECIPES</Text>
            <Text style={styles.headerTitle}>
              {result?.dishes ? `${result.dishes.length} Recipes Found` : 'Kid-Friendly Recipes'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.langToggleBtn}
            onPress={() => setLanguage(l => l === 'English' ? 'Telugu' : 'English')}
          >
            <Text style={styles.langToggleText}>{language === 'English' ? '🇬🇧 EN' : '🇮🇳 TE'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* KID & BEGINNER FRIENDLY GUIDANCE BANNER */}
          <View style={styles.kidFriendlyBanner}>
            <Text style={styles.kidFriendlyEmoji}>🧒</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.kidFriendlyTitle}>Super Easy & Kid-Friendly Cooking Guide</Text>
              <Text style={styles.kidFriendlySub}>
                Simple 1-2-3 step instructions designed for children and beginners to follow safely!
              </Text>
            </View>
          </View>

          {/* LOADING SPINNER */}
          {isLoading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#16A34A" />
              <Text style={styles.loadingTitle}>Preparing Child-Friendly Indian Recipes...</Text>
              <Text style={styles.loadingSub}>
                Matching your selected kitchen ingredients to simple, delicious step-by-step recipes...
              </Text>
            </View>
          )}

          {/* DISH RESULTS CONTENT */}
          {result && result.dishes && result.dishes.length > 0 && !isLoading && (
            <View style={styles.resultsContainer}>
              {/* COOKING TIME FILTER ON RECIPES PAGE */}
              <View style={styles.recipeTimeFilterRow}>
                <Text style={styles.recipeTimeFilterLabel}>⏱️ Cooking Time Filter:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timePillsScroll}>
                  {[
                    { id: 'all', label: 'All Times' },
                    { id: '5', label: '⚡ 5 Mins' },
                    { id: '10', label: '⏱️ 10 Mins' },
                    { id: '15', label: '⏰ 15 Mins' },
                    { id: '30', label: '🍲 30 Mins' },
                  ].map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.timeFilterPill, maxTime === t.id && styles.timeFilterPillActive]}
                      activeOpacity={0.75}
                      onPress={() => {
                        setMaxTime(t.id as any);
                        generateFallbackRecipes(ingredients, t.id);
                      }}
                    >
                      <Text style={[styles.timeFilterPillText, maxTime === t.id && styles.timeFilterPillTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Horizontal dish selector tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dishTabsRow}>
                {result.dishes.map((d, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dishTab, selectedDish === index && styles.dishTabActive]}
                    onPress={() => setSelectedDish(index)}
                  >
                    <Text style={[styles.dishTabText, selectedDish === index && styles.dishTabTextActive]}>
                      {d.title} ({d.prepTime})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Active Dish Detail Card */}
              {activeDish && (
                <View style={styles.dishCard}>
                  <View style={styles.dishCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dishCategoryTag}>{activeDish.category.toUpperCase()} • {activeDish.cuisine}</Text>
                      <Text style={styles.dishTitle}>{activeDish.title}</Text>
                    </View>
                    <View style={styles.dishTimeBadge}>
                      <Text style={styles.dishTimeText}>⏱️ {activeDish.prepTime}</Text>
                    </View>
                  </View>

                  {/* Used vs Missing Ingredients */}
                  <View style={styles.ingredientsSummaryBox}>
                    <Text style={styles.summaryBoxTitle}>✅ Ingredients Used from Your Kitchen:</Text>
                    <View style={styles.usedItemsWrap}>
                      {activeDish.usedIngredients.map((u, i) => (
                        <View key={i} style={styles.usedItemChip}>
                          <Text style={styles.usedItemChipText}>✓ {u}</Text>
                        </View>
                      ))}
                    </View>

                    {activeDish.missingIngredients && activeDish.missingIngredients.length > 0 && (
                      <>
                        <Text style={[styles.summaryBoxTitle, { marginTop: 12, color: '#D97706' }]}>
                          🛒 Extra Pantry Staples needed:
                        </Text>
                        <View style={styles.missingItemsWrap}>
                          {activeDish.missingIngredients.map((m, i) => (
                            <TouchableOpacity
                              key={i}
                              style={styles.missingItemChip}
                              onPress={() => handleBuyIngredient(m)}
                            >
                              <Text style={styles.missingItemChipText}>+ {m} (Buy)</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </>
                    )}
                  </View>

                  {/* Step-by-Step Cooking Instructions for Kids & Beginners */}
                  <Text style={styles.instructionsHeading}>👨‍🍳 Easy Step-by-Step Cooking Guide:</Text>
                  {activeDish.instructions.map((step, idx) => (
                    <View key={idx} style={styles.kidStepCard}>
                      <View style={styles.kidStepNumberBadge}>
                        <Text style={styles.kidStepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.kidStepText}>{step}</Text>
                    </View>
                  ))}

                  {/* Bottom Safety Reminder */}
                  <View style={styles.safetyReminderBox}>
                    <Text style={styles.safetyReminderText}>
                      ⚠️ Safety Tip for Kids: Always ask an adult to help when using sharp knives or hot stoves!
                    </Text>
                  </View>
                </View>
              )}

              {/* Action button to select different ingredients */}
              <TouchableOpacity
                style={styles.changeIngredientsBtn}
                activeOpacity={0.85}
                onPress={() => setViewMode('selection')}
              >
                <Text style={styles.changeIngredientsBtnText}>
                  ← Select Different Ingredients
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ── INGREDIENT SELECTION SCREEN VIEW ───────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBadge}>🛒 KITCHEN INVENTORY</Text>
          <Text style={styles.headerTitle}>Select Your Ingredients</Text>
        </View>
        <TouchableOpacity 
          style={styles.langToggleBtn}
          onPress={() => setLanguage(l => l === 'English' ? 'Telugu' : 'English')}
        >
          <Text style={styles.langToggleText}>{language === 'English' ? '🇬🇧 EN' : '🇮🇳 TE'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── FEATURE 1: SMART SEARCH BAR WITH AUTO-COMPLETE ── */}
        <View style={styles.searchSectionCard}>
          <Text style={styles.searchCardTitle}>⚡ Smart Auto-Complete Search</Text>
          <Text style={styles.searchCardSub}>
            Type what you have in your kitchen. As you type "pa", suggestions like Paneer, Pasta, or Paprika appear instantly!
          </Text>

          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Type ingredient (e.g. paneer, pasta, paprika)..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => {
                if (inputText.trim()) {
                  addIngredientByName(inputText);
                }
              }}
              returnKeyType="done"
            />
            {inputText.length > 0 && (
              <TouchableOpacity onPress={() => setInputText('')} style={styles.clearSearchInputBtn}>
                <Text style={styles.clearSearchInputText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* AUTO-COMPLETE INSTANT SUGGESTIONS DROPDOWN */}
          {autocompleteSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsHeader}>INSTANT MATCHES (TAP TO ADD):</Text>
              <View style={styles.suggestionsGrid}>
                {autocompleteSuggestions.map((sug, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestionPill}
                    activeOpacity={0.7}
                    onPress={() => addIngredientByName(sug)}
                  >
                    <Text style={styles.suggestionPillEmoji}>{getIngredientEmoji(sug)}</Text>
                    <Text style={styles.suggestionPillText}>{sug}</Text>
                    <Text style={styles.suggestionAddPlus}>+ Add</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* COOKING TIME LIMIT FILTER BAR */}
          <View style={styles.timeFilterSection}>
            <Text style={styles.timeFilterHeading}>⏱️ MAX COOKING TIME LIMIT:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timePillsScroll}>
              {[
                { id: 'all', label: 'All Times' },
                { id: '5', label: '⚡ 5 Mins (Ultra-Fast)' },
                { id: '10', label: '⏱️ 10 Mins (Quick)' },
                { id: '15', label: '⏰ 15 Mins (Fast)' },
                { id: '30', label: '🍲 30 Mins (Full Meal)' },
              ].map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.timeFilterPill, maxTime === t.id && styles.timeFilterPillActive]}
                  activeOpacity={0.75}
                  onPress={() => setMaxTime(t.id as any)}
                >
                  <Text style={[styles.timeFilterPillText, maxTime === t.id && styles.timeFilterPillTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ── ACTIVE GREEN TAG CHIPS CONTAINER (Only renders when ingredients are selected) ── */}
        {ingredients.length > 0 && (
          <View style={styles.chipsCard}>
            <View style={styles.chipsHeaderRow}>
              <View style={styles.chipsTitleBadge}>
                <Text style={styles.chipsTitleBadgeText}>
                  SELECTED INGREDIENTS ({ingredients.length})
                </Text>
              </View>

              <TouchableOpacity onPress={clearAll} activeOpacity={0.7}>
                <Text style={styles.clearAllBtnText}>Clear All ✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsWrapGrid}>
              {ingredients.map((item, index) => (
                <View key={index} style={styles.greenTagChip}>
                  <Text style={styles.greenTagEmoji}>{getIngredientEmoji(item)}</Text>
                  <Text style={styles.greenTagText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => removeIngredient(index)}
                    style={styles.greenTagRemoveBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.greenTagRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* MAIN CTA BUTTON TO FIND RECIPES */}
            <TouchableOpacity
              style={styles.findRecipesBtn}
              activeOpacity={0.85}
              onPress={findRecipes}
            >
              <Text style={styles.findRecipesBtnText}>
                ✨ Find Recipes with {ingredients.length} Selected Item{ingredients.length > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── FEATURE 2: MULTI-SELECT GROCERY CHECKLIST (MOST POPULAR) ── */}
        <View style={styles.checklistSection}>
          <View style={styles.checklistSectionHeader}>
            <View>
              <Text style={styles.checklistSectionTitle}>📋 Multi-Select Grocery Checklist</Text>
              <Text style={styles.checklistSectionSub}>
                100% accurate & fast. Grouped by categories — tap items to check what's in your kitchen!
              </Text>
            </View>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>🔥 MOST POPULAR</Text>
            </View>
          </View>

          {CATEGORIZED_INGREDIENTS.map((catGroup, catIdx) => {
            const isCollapsed = !!collapsedCategories[catGroup.category];
            const categorySelectedCount = catGroup.items.filter(it => 
              ingredients.some(sel => sel.toLowerCase() === it.toLowerCase())
            ).length;

            return (
              <View key={catIdx} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryCardHeader}
                  activeOpacity={0.8}
                  onPress={() => toggleCategoryCollapse(catGroup.category)}
                >
                  <View style={styles.categoryTitleRow}>
                    <Text style={styles.categoryIcon}>{catGroup.icon}</Text>
                    <Text style={styles.categoryName}>{catGroup.category}</Text>
                    {categorySelectedCount > 0 && (
                      <View style={styles.categoryCountBadge}>
                        <Text style={styles.categoryCountText}>{categorySelectedCount} selected</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.collapseArrowText}>{isCollapsed ? '▼' : '▲'}</Text>
                </TouchableOpacity>

                {!isCollapsed && (
                  <View style={styles.categoryGrid}>
                    {catGroup.items.map((item, itemIdx) => {
                      const isChecked = ingredients.some(i => i.toLowerCase() === item.toLowerCase());
                      return (
                        <TouchableOpacity
                          key={itemIdx}
                          style={[
                            styles.checkboxItemPill,
                            isChecked && styles.checkboxItemPillActive
                          ]}
                          activeOpacity={0.7}
                          onPress={() => toggleChecklistItem(item)}
                        >
                          <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxActive]}>
                            {isChecked && <Text style={styles.checkmarkIcon}>✓</Text>}
                          </View>
                          <Text style={[styles.checkboxItemText, isChecked && styles.checkboxItemTextActive]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── STICKY BOTTOM FLOATING SELECTED ITEMS BAR ── */}
      {ingredients.length > 0 && (
        <View style={styles.floatingStickyBar}>
          <View style={styles.floatingHeaderRow}>
            <View style={styles.floatingTitleBadge}>
              <Text style={styles.floatingTitleBadgeText}>
                🛒 SELECTED INGREDIENTS ({ingredients.length})
              </Text>
            </View>
            <TouchableOpacity onPress={clearAll} activeOpacity={0.7} style={styles.floatingClearBtn}>
              <Text style={styles.floatingClearText}>Clear All ✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.floatingChipsScroll}>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.floatingChipPill}>
                <Text style={styles.floatingChipEmoji}>{getIngredientEmoji(item)}</Text>
                <Text style={styles.floatingChipText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  style={styles.floatingChipRemoveBtn}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.floatingChipRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.floatingCtaBtn}
            activeOpacity={0.85}
            onPress={findRecipes}
          >
            <Text style={styles.floatingCtaText}>
              ✨ Find Matching Recipes ({ingredients.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  langToggleBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  langToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 180,
  },

  // ── STICKY BOTTOM FLOATING BAR STYLES ──────────────────────────────────────
  floatingStickyBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  floatingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  floatingTitleBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  floatingTitleBadgeText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  floatingClearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  floatingClearText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
  },
  floatingChipsScroll: {
    maxHeight: 38,
    marginBottom: 10,
  },
  floatingChipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
    gap: 4,
  },
  floatingChipEmoji: {
    fontSize: 12,
  },
  floatingChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  floatingChipRemoveBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  floatingChipRemoveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  floatingCtaBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCtaText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },

  // ── SEARCH CARD STYLES ──────────────────────────────────────────────────────
  searchSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  searchCardSub: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  clearSearchInputBtn: {
    padding: 6,
  },
  clearSearchInputText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '800',
  },
  suggestionsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  suggestionsHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },
  suggestionPillEmoji: {
    fontSize: 14,
  },
  suggestionPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  suggestionAddPlus: {
    fontSize: 11,
    fontWeight: '900',
    color: '#16A34A',
    marginLeft: 2,
  },

  // ── GREEN TAG CHIPS CONTAINER ──────────────────────────────────────────────
  chipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chipsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipsTitleBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipsTitleBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  clearAllBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  emptyChipsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyChipsEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyChipsText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  chipsWrapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  greenTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  greenTagEmoji: {
    fontSize: 14,
  },
  greenTagText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greenTagRemoveBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  greenTagRemoveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  findRecipesBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  findRecipesBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── MULTI-SELECT CHECKLIST STYLES ──────────────────────────────────────────
  checklistSection: {
    marginBottom: 20,
  },
  checklistSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  checklistSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  checklistSectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 240,
    lineHeight: 16,
  },
  popularBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D97706',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  categoryCountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  collapseArrowText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  checkboxItemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 8,
  },
  checkboxItemPillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  checkboxItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  checkboxItemTextActive: {
    color: '#14532D',
    fontWeight: '800',
  },

  // ── LOADING STYLES ─────────────────────────────────────────────────────────
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  loadingSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },

  // ── COOKING TIME LIMIT FILTER STYLES ─────────────────────────────────────────
  timeFilterSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeFilterHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  timePillsScroll: {
    flexDirection: 'row',
  },
  timeFilterPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 8,
  },
  timeFilterPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  timeFilterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  timeFilterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  recipeTimeFilterRow: {
    marginBottom: 14,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 12,
  },
  recipeTimeFilterLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 8,
  },

  // ── KID & BEGINNER FRIENDLY STYLES ──────────────────────────────────────────
  kidFriendlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  kidFriendlyEmoji: {
    fontSize: 28,
  },
  kidFriendlyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803D',
  },
  kidFriendlySub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  kidStepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  kidStepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  kidStepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  kidStepText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
    fontWeight: '600',
  },
  safetyReminderBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  safetyReminderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
  },
  changeIngredientsBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  changeIngredientsBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },

  // ── RESULTS RECIPE STYLES ───────────────────────────────────────────────────
  resultsContainer: {
    marginTop: 10,
  },
  resultsHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  dishTabsRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  dishTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 8,
  },
  dishTabActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  dishTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  dishTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  dishCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  dishCategoryTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.8,
  },
  dishTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  dishTimeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dishTimeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  ingredientsSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  summaryBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 8,
  },
  usedItemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  usedItemChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  usedItemChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  missingItemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  missingItemChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  missingItemChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  instructionsHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
  },
});
