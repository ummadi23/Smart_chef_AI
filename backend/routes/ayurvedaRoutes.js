const express = require('express');
const router = express.Router();

/**
 * Helper function to analyze Ayurvedic properties of ingredients
 */
function analyzeAyurvedicDiet(ingredients = [], dosha = 'Pitta', healthGoal = 'Eat Healthier') {
  const lowerIngredients = ingredients.map(i => (typeof i === 'string' ? i : i.name).toLowerCase());
  
  // Categorize food properties (Virya: Heating vs Cooling)
  const coolingItems = [];
  const heatingItems = [];
  const neutralItems = [];

  lowerIngredients.forEach(item => {
    if (
      item.includes('mint') || item.includes('cucumber') || item.includes('coconut') ||
      item.includes('milk') || item.includes('coriander') || item.includes('melon') ||
      item.includes('spinach') || item.includes('zucchini') || item.includes('curd') ||
      item.includes('rice') || item.includes('fennel') || item.includes('apple')
    ) {
      coolingItems.push(item);
    } else if (
      item.includes('chili') || item.includes('garlic') || item.includes('ginger') ||
      item.includes('onion') || item.includes('pepper') || item.includes('mustard') ||
      item.includes('chicken') || item.includes('egg') || item.includes('tomato')
    ) {
      heatingItems.push(item);
    } else {
      neutralItems.push(item);
    }
  });

  // Dosha-specific recommendations & balance analysis
  let doshaInsight = '';
  let recommendedPairings = [];
  let eatMore = [];
  let eatLess = [];

  const targetDosha = dosha ? dosha.charAt(0).toUpperCase() + dosha.slice(1).toLowerCase() : 'Pitta';

  if (targetDosha === 'Pitta') {
    doshaInsight = 'Pitta governs digestion and metabolism (Fire & Water). Cooling, sweet, and bitter foods soothe internal body heat.';
    recommendedPairings = ['Cooling Mint Chutney', 'Fresh Cucumber & Coriander Salad', 'Steamed Rice with Ghee'];
    eatMore = ['Leafy greens', 'Cucumbers', 'Sweet fruits (Apples, Melons)', 'Dairy & Ghee', 'Cooling herbs (Mint, Coriander)'];
    eatLess = ['Spicy red chilies', 'Fried foods', 'Raw garlic & raw onions', 'Excessive salt & vinegar'];
  } else if (targetDosha === 'Vata') {
    doshaInsight = 'Vata governs movement and nerve impulses (Air & Ether). Warm, grounding, and gently spiced foods nourish dry Vata energy.';
    recommendedPairings = ['Warm Stewed Apples with Cinnamon', 'Creamy Vegetable Soup', 'Warm Milk with Nutmeg'];
    eatMore = ['Warm soups & stews', 'Cooked grains (Rice, Oats)', 'Healthy oils & Ghee', 'Root vegetables (Sweet Potatoes, Carrots)'];
    eatLess = ['Dry crackers', 'Cold raw salads', 'Iced beverages', 'Bitter raw leafy greens'];
  } else {
    // Kapha
    doshaInsight = 'Kapha governs structure and fluid balance (Earth & Water). Light, warm, and pungent foods stimulate metabolism and energy.';
    recommendedPairings = ['Spiced Ginger & Turmeric Tea', 'Light Lentil Soup with Black Pepper', 'Steamed Broccoli'];
    eatMore = ['Light legumes & lentils', 'Pungent spices (Ginger, Turmeric, Pepper)', 'Steamed green vegetables', 'Apples & Pomegranates'];
    eatLess = ['Heavy dairy & cheese', 'Fried snacks', 'Cold sweets', 'Excessive oils & butter'];
  }

  // Sattvic classification percentage
  const totalCount = lowerIngredients.length || 1;
  const sattvicScore = Math.min(100, Math.round(((coolingItems.length + neutralItems.length) / totalCount) * 100));

  return {
    dosha: targetDosha,
    healthGoal,
    sattvicScore: Math.max(65, sattvicScore),
    doshaInsight,
    properties: {
      coolingItems: coolingItems.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
      heatingItems: heatingItems.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
      neutralItems: neutralItems.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
    },
    recommendedPairings,
    guidelines: {
      eatMore,
      eatLess
    },
    disclaimer: '⚠️ Disclaimer: Ayurvedic insights provide traditional wellness & lifestyle guidance. This information is not intended as medical advice or clinical diagnosis.'
  };
}

/**
 * POST /api/ayurveda/analyze
 * Body: { ingredients: string[], dosha: 'Vata'|'Pitta'|'Kapha', healthGoal: string }
 */
router.post('/analyze', (req, res) => {
  try {
    const { ingredients = [], dosha = 'Pitta', healthGoal = 'Eat Healthier' } = req.body;
    const result = analyzeAyurvedicDiet(ingredients, dosha, healthGoal);
    return res.json({
      status: 'success',
      data: result
    });
  } catch (err) {
    console.error('Ayurvedic route error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate Ayurvedic recommendations.'
    });
  }
});

/**
 * GET /api/ayurveda/remedy?symptom=cough
 */
router.get(['/remedy', '/api/ayurveda/remedy'], (req, res) => {
  const symptom = (req.query.symptom || '').toLowerCase();
  
  const remedies = {
    cough: {
      symptom: 'Cough & Cold',
      remedyName: 'Tulsi, Honey & Dry Ginger Decoction (Kada)',
      ingredients: ['Fresh Tulsi Leaves', 'Raw Honey', 'Dry Ginger (Saunth)', 'Black Pepper', 'Turmeric'],
      instructions: [
        'Boil 2 cups of water with crushed ginger, black pepper, and fresh tulsi leaves for 10 minutes.',
        'Strain into a cup and let it cool slightly until warm.',
        'Add 1 tsp of raw honey and a pinch of turmeric powder.',
        'Sip warm twice daily for rapid respiratory relief.'
      ],
      doshaEffect: 'Pacifies Kapha & Vata',
      precaution: 'Do not boil raw honey; add only after water cools to warm temperature.'
    },
    acidity: {
      symptom: 'Acidity & Heartburn',
      remedyName: 'Cumin, Coriander & Fennel Cooling Tea (CCF Tea)',
      ingredients: ['Cumin Seeds (Jeera)', 'Coriander Seeds (Dhania)', 'Fennel Seeds (Saunf)', 'Water'],
      instructions: [
        'Add 1/2 tsp each of cumin, coriander, and fennel seeds to 3 cups of water.',
        'Simmer on low flame for 5 to 7 minutes.',
        'Strain and drink warm or at room temperature after meals.'
      ],
      doshaEffect: 'Soothes Pitta & cools digestive fire',
      precaution: 'Drink after meals for best digestive relief.'
    },
    headache: {
      symptom: 'Headache & Mental Fatigue',
      remedyName: 'Brahmi & Nutmeg Warm Herbal Milk',
      ingredients: ['Warm Milk or Almond Milk', 'Brahmi Powder', 'Nutmeg (Jaiphal)', 'Ghee'],
      instructions: [
        'Warm 1 cup of milk with a pinch of nutmeg and 1/4 tsp of Brahmi powder.',
        'Add 1/2 tsp of pure cow ghee.',
        'Drink 30 minutes before bedtime.'
      ],
      doshaEffect: 'Calms Vata & promotes restful sleep',
      precaution: 'Best consumed in the evening.'
    }
  };

  const defaultRemedy = remedies[symptom] || {
    symptom: symptom || 'General Wellness',
    remedyName: 'Golden Turmeric & Cardamom Milk (Haldi Doodh)',
    ingredients: ['Warm Milk', 'Turmeric (Haldi)', 'Cardamom (Elaichi)', 'Black Pepper', 'Honey'],
    instructions: [
      'Warm milk on low flame with 1/2 tsp turmeric powder and crushed cardamom.',
      'Add a tiny pinch of black pepper to boost curcumin absorption.',
      'Serve warm before bedtime for general immunity and vitality.'
    ],
    doshaEffect: 'Tridoshic Balancer (Vata, Pitta, Kapha)',
    precaution: 'Enjoy fresh and warm.'
  };

  return res.json({
    status: 'success',
    data: defaultRemedy
  });
});

module.exports = router;
