import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Animated, Image, SafeAreaView, StatusBar
} from 'react-native';
import { getApiBaseUrl } from '../config';

interface RemedyResult {
  condition: string; medicine: string; emoji: string; color: string;
  ingredients: string[]; ingredientCards: { name: string; image: string; quantity: string }[]; steps: string[];
}
interface FusionResult { dish: string; steps: string[]; tags: string[]; }

function AnimBar({ pct, color }: { pct: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(anim, { toValue: pct, duration: 900, useNativeDriver: false }).start(); }, []);
  return (
    <View style={bar.track}>
      <Animated.View style={[bar.fill, { backgroundColor: color, width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}
const bar = StyleSheet.create({
  track: { height: 8, borderRadius: 8, backgroundColor: '#1E293B', overflow: 'hidden', marginVertical: 8 },
  fill: { height: '100%', borderRadius: 8 }
});

const QUICK_PROBLEMS = [
  { label: '🌡️ Fever', value: 'fever' }, { label: '🤧 Cough', value: 'cough' },
  { label: '🤒 Cold', value: 'cold' }, { label: '🧠 Headache', value: 'headache' },
  { label: '🫃 Acidity', value: 'acidity' }, { label: '😴 Insomnia', value: 'insomnia' },
  { label: '🦴 Joint Pain', value: 'joint pain' }, { label: '🧘 Stress', value: 'stress' },
  { label: '🌿 Skin', value: 'acne' }, { label: '💆 Hair Fall', value: 'hair fall' },
  { label: '⚡ Weakness', value: 'weakness' }, { label: '🩸 Diabetes', value: 'diabetes' },
];

function HerbCardImage({ uri, name, color }: { uri: string; name: string; color: string }) {
  const [hasError, setHasError] = useState(false);

  const getEmoji = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.includes('honey') || lower.includes('shehad')) return '🍯';
    if (lower.includes('ginger') || lower.includes('saunth') || lower.includes('adrak')) return '🫚';
    if (lower.includes('pepper') || lower.includes('mirch') || lower.includes('pippali')) return '🖤';
    if (lower.includes('turmeric') || lower.includes('haldi')) return '🟡';
    if (lower.includes('tulsi') || lower.includes('mint') || lower.includes('basil') || lower.includes('pudina')) return '🍃';
    if (lower.includes('water') || lower.includes('jal')) return '💧';
    if (lower.includes('milk') || lower.includes('doodh')) return '🥛';
    if (lower.includes('oil') || lower.includes('tel')) return '🫙';
    if (lower.includes('ghee')) return '🧈';
    if (lower.includes('lemon') || lower.includes('nimbu')) return '🍋';
    if (lower.includes('garlic') || lower.includes('lahsun')) return '🧄';
    if (lower.includes('almond') || lower.includes('badam')) return '🥜';
    if (lower.includes('clove') || lower.includes('lavang')) return '🪵';
    if (lower.includes('saffron') || lower.includes('kesar')) return '🌺';
    if (lower.includes('seed') || lower.includes('ajwain') || lower.includes('jeera') || lower.includes('methi')) return '🌾';
    return '🌿';
  };

  const imgUri = uri ? (uri.includes('?') ? `${uri}&v=2` : `${uri}?v=2`) : '';

  if (hasError || !imgUri) {
    return (
      <View style={[s.ingImg, s.fallbackImgBox, { backgroundColor: color + '22' }]}>
        <Text style={s.fallbackEmoji}>{getEmoji(name)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imgUri }}
      style={s.ingImg}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function HealthAndLeftoverScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'ayurveda' | 'leftover'>('ayurveda');

  // Ayurveda tab state
  const [problem, setProblem] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [remedy, setRemedy] = useState<RemedyResult | null>(null);

  // Leftover tab state
  const [leftoverText, setLeftoverText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fusion, setFusion] = useState<FusionResult | null>(null);

  const getFallbackRemedy = (query: string): RemedyResult => {
    const q = query.toLowerCase();

    // 1. FEVER
    if (q.includes('fever') || q.includes('temperature') || q.includes('pyrexia')) {
      return {
        condition: 'Fever & High Body Heat',
        medicine: 'Coriander-Cumin Cooling Infusion (Jwara Shamaka)',
        emoji: '🌡️',
        color: '#EF4444',
        ingredients: [
          '1 tsp Coriander Seeds (Dhania)',
          '½ tsp Cumin Seeds (Jeera)',
          '½ tsp Dry Ginger Powder (Saunth)',
          '2 cups Water',
          '½ tsp Rock Sugar / Mishri'
        ],
        ingredientCards: [
          { name: 'Coriander Seeds', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '1 tsp' },
          { name: 'Cumin Seeds', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '½ tsp' },
          { name: 'Ginger Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '½ tsp' },
          { name: 'Rock Sugar', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500', quantity: '½ tsp' }
        ],
        steps: [
          '🥣 Step 1: Lightly crush 1 tsp coriander seeds and ½ tsp cumin seeds in a small mortar.',
          '🫖 Step 2: Add the crushed seeds and ½ tsp ginger powder to 2 cups of boiling water.',
          '🔥 Step 3: Simmer on low-medium heat for 8 minutes until water reduces to 1 cup.',
          '🍵 Step 4: Strain into a clean cup, add ½ tsp rock sugar (Mishri), and let cool to lukewarm.',
          '⏱️ Step 5: Drink half a cup twice daily to help bring down fever and cool internal body heat.'
        ]
      };
    }

    // 2. COUGH
    if (q.includes('cough') || q.includes('khansi') || q.includes('phlegm')) {
      return {
        condition: 'Cough & Throat Congestion',
        medicine: 'Sitopaladi & Tulsi-Ginger Black Pepper Kadha',
        emoji: '🤧',
        color: '#F97316',
        ingredients: [
          '8 Fresh Tulsi / Holy Basil Leaves',
          '1 inch Fresh Grated Ginger (Adrak)',
          '4 Coarsely Crushed Black Peppercorns',
          '½ tsp Turmeric Powder',
          '1 tbsp Pure Organic Honey'
        ],
        ingredientCards: [
          { name: 'Tulsi Leaves', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '8 leaves' },
          { name: 'Fresh Ginger', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 inch' },
          { name: 'Black Pepper', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '4 peppercorns' },
          { name: 'Organic Honey', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500', quantity: '1 tbsp' }
        ],
        steps: [
          '💧 Step 1: Boil 2 cups of clean water in a small pan.',
          '🍃 Step 2: Add 8 torn Tulsi leaves, grated fresh ginger, and crushed black peppercorns.',
          '🟡 Step 3: Add ½ tsp turmeric powder and simmer on low heat for 10 minutes until water halves.',
          '🍯 Step 4: Strain into a cup, let cool until warm (not boiling hot), and mix in 1 tbsp organic honey.',
          '☕ Step 5: Sip slowly 3 times a day for fast cough and throat relief!'
        ]
      };
    }

    // 3. COLD
    if (q.includes('cold') || q.includes('sardi') || q.includes('runny nose') || q.includes('sinus')) {
      return {
        condition: 'Common Cold & Sinus Relief',
        medicine: 'Cinnamon-Clove Warm Kadha & Steam Inhalation',
        emoji: '🤒',
        color: '#3B82F6',
        ingredients: [
          '1 Cinnamon Stick (Dalchini)',
          '3 Whole Cloves (Laung)',
          '1 inch Crushed Ginger',
          '1 tbsp Jaggery / Gur',
          '2 cups Water'
        ],
        ingredientCards: [
          { name: 'Cinnamon Stick', image: 'https://images.unsplash.com/photo-1509358271058-acd02cc93898?w=500', quantity: '1 stick' },
          { name: 'Cloves', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '3 cloves' },
          { name: 'Jaggery / Gur', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tbsp' }
        ],
        steps: [
          '🪵 Step 1: Lightly crush 1 cinnamon stick, 3 cloves, and 1 inch ginger.',
          '🫖 Step 2: Boil 2 cups water, add all crushed spices, and simmer for 7 minutes.',
          '🟤 Step 3: Add 1 tbsp jaggery and stir until completely dissolved.',
          '🍵 Step 4: Strain and drink hot twice daily to clear blocked nose and chest congestion.',
          '💨 Step 5: Inhale steam from hot water with a pinch of turmeric before sleep for instant relief!'
        ]
      };
    }

    // 4. HEADACHE
    if (q.includes('headache') || q.includes('head pain') || q.includes('migraine') || q.includes('sir dard')) {
      return {
        condition: 'Headache & Tension Relief',
        medicine: 'Soothing Ginger Paste & Elaichi Cooling Drink',
        emoji: '🧠',
        color: '#8B5CF6',
        ingredients: [
          '1 tbsp Dry Ginger Powder (Saunth)',
          '2 tbsp Warm Water (for paste)',
          '2 Green Cardamoms (Elaichi)',
          '1 tsp Pure Cow Ghee'
        ],
        ingredientCards: [
          { name: 'Ginger Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tbsp' },
          { name: 'Cardamom', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '2 pods' },
          { name: 'Pure Ghee', image: 'https://images.unsplash.com/photo-1631700611307-37dbab89ef7e?w=500', quantity: '1 tsp' }
        ],
        steps: [
          '🥣 Step 1: Mix 1 tbsp dry ginger powder with 2 tbsp warm water to form a smooth paste.',
          '💆 Step 2: Apply the ginger paste gently over your forehead and temples.',
          '⏳ Step 3: Lie down in a quiet, dark room for 15 minutes as ginger relaxes forehead blood vessels.',
          '🍵 Step 4: Boil 1 cup water with 2 crushed cardamoms and ½ tsp ghee; sip warm.',
          '🚿 Step 5: Gently wipe off dry paste with warm water for complete headache relief!'
        ]
      };
    }

    // 5. ACIDITY
    if (q.includes('acidity') || q.includes('heartburn') || q.includes('gas') || q.includes('bloating') || q.includes('indigestion')) {
      return {
        condition: 'Acidity, Gas & Heartburn',
        medicine: 'Cooling Fennel-Cumin Overnight Water (Pitta Shanti)',
        emoji: '🫃',
        color: '#06B6D4',
        ingredients: [
          '1 tsp Fennel Seeds (Saunf)',
          '1 tsp Cumin Seeds (Jeera)',
          '1 tsp Coriander Seeds (Dhania)',
          '1 cup Water',
          '1 tsp Rock Sugar / Mishri'
        ],
        ingredientCards: [
          { name: 'Fennel Seeds', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '1 tsp' },
          { name: 'Cumin Seeds', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '1 tsp' },
          { name: 'Rock Sugar', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500', quantity: '1 tsp' }
        ],
        steps: [
          '🥣 Step 1: Soak 1 tsp fennel seeds, 1 tsp cumin seeds, and 1 tsp coriander seeds in 1 cup water overnight.',
          '🥄 Step 2: In the morning, crush the seeds gently inside the water using a spoon.',
          '🍵 Step 3: Strain the clear herbal water into a glass.',
          '🧊 Step 4: Add 1 tsp rock sugar (Mishri) and stir until dissolved.',
          '🥛 Step 5: Drink on empty stomach first thing in the morning to instantly cool acid reflux!'
        ]
      };
    }

    // 6. INSOMNIA
    if (q.includes('insomnia') || q.includes('sleep') || q.includes('sleepless') || q.includes('night')) {
      return {
        condition: 'Insomnia & Sleep Support',
        medicine: 'Warm Nutmeg-Ashwagandha Sleep Milk (Nidra Bhojana)',
        emoji: '😴',
        color: '#6366F1',
        ingredients: [
          '1 cup Fresh Cow Milk / Almond Milk',
          '¼ tsp Nutmeg Powder (Jaiphal)',
          '1 tsp Ashwagandha Powder',
          '½ tsp Pure Cow Ghee',
          '1 tsp Raw Honey'
        ],
        ingredientCards: [
          { name: 'Warm Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500', quantity: '1 cup' },
          { name: 'Nutmeg Powder', image: 'https://images.unsplash.com/photo-1509358271058-acd02cc93898?w=500', quantity: '¼ tsp' },
          { name: 'Ashwagandha', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tsp' }
        ],
        steps: [
          '🥛 Step 1: Pour 1 cup of milk into a small saucepan and warm on low flame.',
          '🌿 Step 2: Stir in 1 tsp Ashwagandha powder, ¼ tsp freshly grated nutmeg, and ½ tsp ghee.',
          '🔥 Step 3: Simmer gently on low heat for 4 minutes so herbs blend into the milk.',
          '🍯 Step 4: Turn off heat, let cool to warm, and stir in 1 tsp raw honey.',
          '🌙 Step 5: Sip slowly 20 minutes before bedtime for deep, natural, unbroken sleep!'
        ]
      };
    }

    // 7. JOINT PAIN
    if (q.includes('joint') || q.includes('arthritis') || q.includes('knee') || q.includes('back pain')) {
      return {
        condition: 'Joint Pain & Arthritis Relief',
        medicine: 'Garlic-Turmeric Golden Milk & Warm Sesame Oil Massage',
        emoji: '🦴',
        color: '#D97706',
        ingredients: [
          '3 Garlic Cloves (Crushed)',
          '½ tsp Turmeric Powder',
          '1 cup Fresh Milk',
          '2 tbsp Pure Sesame Oil (Til Tel)',
          '½ tsp Dry Ginger Powder'
        ],
        ingredientCards: [
          { name: 'Garlic Cloves', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500', quantity: '3 cloves' },
          { name: 'Turmeric Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '½ tsp' },
          { name: 'Sesame Oil', image: 'https://images.unsplash.com/photo-1631700611307-37dbab89ef7e?w=500', quantity: '2 tbsp' }
        ],
        steps: [
          '🧄 Step 1: Crush 3 garlic cloves and boil in 1 cup milk with ½ tsp turmeric for 6 minutes.',
          '🥛 Step 2: Drink this warm Garlic-Turmeric Milk every evening to reduce joint stiffness.',
          '🫙 Step 3: Warm 2 tbsp sesame oil with ½ tsp dry ginger powder on low heat.',
          '💆 Step 4: Gently massage the warm oil over aching knees/joints for 10 minutes.',
          '♨️ Step 5: Apply a warm hot-water bag or warm towel for 5 minutes for deep pain relief!'
        ]
      };
    }

    // 8. STRESS
    if (q.includes('stress') || q.includes('anxiety') || q.includes('tension') || q.includes('mind')) {
      return {
        condition: 'Stress, Anxiety & Mental Fatigue',
        medicine: 'Brahmi-Shankhpushpi Calm Tonic & Deep Breathing',
        emoji: '🧘',
        color: '#10B981',
        ingredients: [
          '1 tsp Brahmi Powder',
          '½ tsp Shankhpushpi Powder',
          '2 Green Cardamom Pods',
          '1 cup Water',
          '½ tsp Honey'
        ],
        ingredientCards: [
          { name: 'Brahmi Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tsp' },
          { name: 'Cardamom', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '2 pods' },
          { name: 'Honey', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500', quantity: '½ tsp' }
        ],
        steps: [
          '🫖 Step 1: Boil 1 cup water with 2 crushed cardamom pods.',
          '🌿 Step 2: Stir in 1 tsp Brahmi powder and ½ tsp Shankhpushpi powder.',
          '🔥 Step 3: Simmer for 5 minutes on low flame.',
          '🍯 Step 4: Strain into a cup and mix with ½ tsp honey.',
          '🧠 Step 5: Sip once daily in the evening while practicing 10 minutes of deep Pranayama breathing!'
        ]
      };
    }

    // 9. SKIN
    if (q.includes('skin') || q.includes('acne') || q.includes('pimple') || q.includes('glow')) {
      return {
        condition: 'Skin Pimples, Acne & Facial Glow',
        medicine: 'Neem-Turmeric Detox Tea & Sandalwood Pack',
        emoji: '🌿',
        color: '#059669',
        ingredients: [
          '6-8 Clean Neem Leaves',
          '½ tsp Turmeric Powder',
          '1 tsp Sandalwood Powder (Chandan)',
          '1 tbsp Pure Rose Water',
          '1 cup Water'
        ],
        ingredientCards: [
          { name: 'Neem Leaves', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '6-8 leaves' },
          { name: 'Turmeric Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '½ tsp' },
          { name: 'Rose Water', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500', quantity: '1 tbsp' }
        ],
        steps: [
          '💧 Step 1: Boil 6-8 Neem leaves in 1 cup water for 7 minutes; strain and drink as a blood purifier.',
          '🥣 Step 2: Mix 1 tsp sandalwood powder with ½ tsp turmeric and 1 tbsp rose water into a smooth paste.',
          '✨ Step 3: Apply the cooling paste over your face and acne spots.',
          '⏱️ Step 4: Leave on for 15 minutes until dry.',
          '🚿 Step 5: Rinse off with cool water for clear, glowing, pimple-free skin!'
        ]
      };
    }

    // 10. HAIR FALL
    if (q.includes('hair') || q.includes('dandruff') || q.includes('hairfall') || q.includes('scalp')) {
      return {
        condition: 'Hair Fall & Scalp Health',
        medicine: 'Bhringraj-Amla Vitalizer & Curry Leaf Hair Oil',
        emoji: '💆',
        color: '#4F46E5',
        ingredients: [
          '1 tsp Amla Powder (Indian Gooseberry)',
          '1 tsp Bhringraj Powder',
          '10 Fresh Curry Leaves',
          '3 tbsp Pure Coconut Oil',
          '1 cup Warm Water'
        ],
        ingredientCards: [
          { name: 'Amla Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tsp' },
          { name: 'Curry Leaves', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '10 leaves' },
          { name: 'Coconut Oil', image: 'https://images.unsplash.com/photo-1631700611307-37dbab89ef7e?w=500', quantity: '3 tbsp' }
        ],
        steps: [
          '🍵 Step 1: Mix 1 tsp Amla powder in 1 cup warm water and drink every morning on empty stomach.',
          '🥥 Step 2: Heat 3 tbsp coconut oil with 10 curry leaves and 1 tsp Bhringraj powder for 5 minutes.',
          '💆 Step 3: Let the oil cool to lukewarm, then massage gently into scalp using fingertips.',
          '⏳ Step 4: Leave on for at least 45 minutes (or overnight).',
          '🧼 Step 5: Wash hair with a mild herbal shampoo 2-3 times a week for strong roots!'
        ]
      };
    }

    // 11. WEAKNESS
    if (q.includes('weakness') || q.includes('fatigue') || q.includes('tired') || q.includes('stamina')) {
      return {
        condition: 'General Weakness & Low Stamina',
        medicine: 'Ashwagandha & Date Energy Tonic (Balya Rasayana)',
        emoji: '⚡',
        color: '#EAB308',
        ingredients: [
          '1 tsp Ashwagandha Powder',
          '2 Seeded Medjool Dates / Khajur',
          '1 cup Warm Pure Cow Milk',
          '½ tsp Cow Ghee',
          'Pinch of Cardamom Powder'
        ],
        ingredientCards: [
          { name: 'Ashwagandha', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tsp' },
          { name: 'Dates / Khajur', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500', quantity: '2 pieces' },
          { name: 'Warm Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500', quantity: '1 cup' },
          { name: 'Pure Ghee', image: 'https://images.unsplash.com/photo-1631700611307-37dbab89ef7e?w=500', quantity: '½ tsp' }
        ],
        steps: [
          '🥛 Step 1: Warm 1 cup of fresh milk in a small pan on low flame.',
          '🌴 Step 2: Deseed 2 dates, chop finely, and add to the milk.',
          '🌿 Step 3: Stir in 1 tsp Ashwagandha powder, ½ tsp ghee, and a pinch of crushed cardamom.',
          '🔥 Step 4: Simmer gently on low heat for 5 minutes so dates soften into the milk.',
          '🌙 Step 5: Drink warm every night 30 minutes before sleep to rebuild muscle and stamina!'
        ]
      };
    }

    // 12. DIABETES
    if (q.includes('diabetes') || q.includes('sugar') || q.includes('glucose') || q.includes('diabetic')) {
      return {
        condition: 'Diabetes & High Blood Sugar',
        medicine: 'Jamun-Karela Glucose Balancer & Methi Water',
        emoji: '🩸',
        color: '#DC2626',
        ingredients: [
          '1 tsp Fenugreek Seeds (Methi Dana)',
          '½ tsp Jamun Seed Powder',
          '½ tsp Cinnamon Powder (Dalchini)',
          '1 cup Water'
        ],
        ingredientCards: [
          { name: 'Methi Seeds', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', quantity: '1 tsp' },
          { name: 'Jamun Powder', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '½ tsp' },
          { name: 'Cinnamon Powder', image: 'https://images.unsplash.com/photo-1509358271058-acd02cc93898?w=500', quantity: '½ tsp' }
        ],
        steps: [
          '🥣 Step 1: Soak 1 tsp Methi seeds in 1 cup water overnight.',
          '🌅 Step 2: In the morning, chew the soaked seeds and drink the infused water on an empty stomach.',
          '🫖 Step 3: Mix ½ tsp Jamun seed powder + ½ tsp cinnamon in 1 cup warm water before lunch.',
          '🏃 Step 4: Take a 20-minute brisk walk after lunch and dinner to help insulin absorption.',
          '🩸 Step 5: Repeat daily to help regulate fasting blood glucose levels naturally!'
        ]
      };
    }

    // Default universal Ayurvedic remedy
    return {
      condition: query.charAt(0).toUpperCase() + query.slice(1),
      medicine: 'Triphala & Golden Herbal Immunity Brew',
      emoji: '🌿',
      color: '#10B981',
      ingredients: [
        '1 tsp Triphala Powder',
        '½ tsp Dry Ginger (Saunth)',
        '½ tsp Turmeric Powder',
        '1 tsp Raw Honey',
        '1 cup Warm Water'
      ],
      ingredientCards: [
        { name: 'Triphala', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', quantity: '1 tsp' },
        { name: 'Honey', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500', quantity: '1 tsp' }
      ],
      steps: [
        '💧 Step 1: Mix 1 tsp Triphala powder and ½ tsp turmeric in 1 cup of warm water.',
        '🍯 Step 2: Add 1 tsp raw honey and stir well until completely dissolved.',
        '🍵 Step 3: Sip warm on an empty stomach in the morning or before bedtime for natural balance!'
      ]
    };
  };

  const getFallbackFusion = (text: string): FusionResult => {
    return {
      dish: 'Golden Crisp Tawa Leftover Stir-Fry',
      tags: ['Quick 10-Min', 'Zero Waste', 'Kid Friendly'],
      steps: [
        `🍳 Step 1: Heat 1 spoon of oil/butter in a tawa or pan.`,
        `🧅 Step 2: Toss in chopped onions, tomatoes, and your available leftovers (${text.slice(0, 30)}).`,
        '🌶️ Step 3: Sprinkle salt, turmeric, cumin powder, and chat masala.',
        '🔥 Step 4: Sauté on medium-high heat for 5 minutes until crispy and fragrant.',
        '🍽️ Step 5: Serve hot with lemon juice and enjoy your zero-waste makeover meal!'
      ]
    };
  };

  const findRemedy = async (q?: string) => {
    const query = (q ?? problem).trim();
    if (!query) return;
    setIsFinding(true);
    setRemedy(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/recipes/ayurvedic-remedy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: query }),
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        setRemedy({ condition: json.condition, medicine: json.medicine, emoji: json.emoji, color: json.color, ingredients: json.ingredients, ingredientCards: json.ingredientCards || [], steps: json.steps });
      } else {
        setRemedy(getFallbackRemedy(query));
      }
    } catch {
      setRemedy(getFallbackRemedy(query));
    } finally {
      setIsFinding(false);
    }
  };

  const handleGenerate = async () => {
    if (!leftoverText.trim()) return;
    setIsProcessing(true);
    setFusion(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/recipes/leftover-makeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: leftoverText.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        setFusion({ dish: json.dish, steps: json.steps, tags: json.tags });
      } else {
        setFusion(getFallbackFusion(leftoverText.trim()));
      }
    } catch {
      setFusion(getFallbackFusion(leftoverText.trim()));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <TouchableOpacity onPress={onBack} style={s.backBtn}>
        <Text style={s.backBtnTxt}>← Back</Text>
      </TouchableOpacity>


      <View style={s.tabBar}>
        {([['ayurveda', '🌿 Ayurvedic Remedy'], ['leftover', '♻️ Leftover Makeover']] as const).map(([id, label]) => (
          <TouchableOpacity key={id} style={[s.tab, activeTab === id && s.activeTab]} onPress={() => setActiveTab(id)}>
            <Text style={[s.tabTxt, activeTab === id && s.activeTabTxt]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ══════════ AYURVEDA TAB ══════════ */}
        {activeTab === 'ayurveda' && (
          <View>
            {/* Hero */}
            <View style={s.heroBanner}>
              <Text style={s.heroTitle}>🌿 Ancient Ayurvedic Medicine</Text>
              <Text style={s.heroSub}>Tell us your health problem. We'll find the exact ancient Ayurvedic remedy and how to prepare it — step by step.</Text>
            </View>

            {/* Quick Select Chips */}
            <Text style={s.chipHeading}>Select a common problem or type your own:</Text>
            <View style={s.chipRow}>
              {QUICK_PROBLEMS.map(qp => (
                <TouchableOpacity key={qp.value} style={[s.chip, problem === qp.value && s.chipActive]}
                  onPress={() => { setProblem(qp.value); setRemedy(null); }}>
                  <Text style={[s.chipTxt, problem === qp.value && s.chipActiveTxt]}>{qp.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Text Input */}
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="e.g., fever, cough, joint pain, diabetes, anxiety..."
                placeholderTextColor="#64748B"
                value={problem}
                onChangeText={(t) => { setProblem(t); setRemedy(null); }}
              />
            </View>

            <TouchableOpacity style={[s.genBtn, isFinding && { opacity: 0.7 }]} onPress={() => findRemedy()} disabled={isFinding}>
              {isFinding ? <ActivityIndicator color="#FFF" /> : <Text style={s.genBtnTxt}>🔍 Find Ancient Remedy</Text>}
            </TouchableOpacity>

            {/* Result Card */}
            {remedy && (
              <View style={[s.remedyCard, { borderColor: remedy.color + '55' }]}>
                {/* Header */}
                <View style={[s.remedyHeader, { backgroundColor: remedy.color + '22' }]}>
                  <Text style={s.remedyEmoji}>{remedy.emoji}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.remedyCondition}>{remedy.condition}</Text>
                    <Text style={[s.remedyMedicineName, { color: remedy.color }]}>{remedy.medicine}</Text>
                  </View>
                </View>

                {/* Ingredient Names (Text Only) */}
                <Text style={s.sectionTitle}>🧪 Ingredients Required:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.ingScroll} contentContainerStyle={s.ingScrollContent}>
                  {remedy.ingredientCards.map((card, i) => (
                    <View key={i} style={[s.ingCard, { borderColor: remedy.color + '44' }]}>
                      <Text style={[s.ingCardName, { color: remedy.color }]} numberOfLines={2}>{card.name}</Text>
                      <Text style={s.ingCardQty} numberOfLines={2}>{card.quantity}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Steps */}
                <Text style={[s.sectionTitle, { marginTop: 18 }]}>📋 Step-by-Step Preparation:</Text>
                {remedy.steps.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    {step.startsWith('⚠️') ? (
                      <View style={s.warningBox}>
                        <Text style={s.warningTxt}>{step}</Text>
                      </View>
                    ) : (
                      <>
                        <View style={[s.stepNum, { backgroundColor: remedy.color }]}><Text style={s.stepNumTxt}>{i + 1}</Text></View>
                        <Text style={s.stepTxt}>{step}</Text>
                      </>
                    )}
                  </View>
                ))}

                <View style={s.disclaimerBox}>
                  <Text style={s.disclaimerTxt}>🏥 These are traditional Ayurvedic remedies for reference. Always consult a qualified Ayurvedic physician (Vaidya) before starting any herbal treatment, especially if you are on medication.</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ══════════ LEFTOVER TAB ══════════ */}
        {activeTab === 'leftover' && (
          <View>
            <View style={s.leftoverHero}>
              <Text style={s.leftoverHeroTitle}>♻️ Leftover Makeover</Text>
              <Text style={s.leftoverHeroSub}>Enter prepared food (e.g., Rasam, Dal, Rice, Roti) OR ingredients (e.g., Paneer, Eggs, Tomatoes). We'll turn them into a delicious zero-waste fusion dish!</Text>
            </View>

            <Text style={s.inputLabel}>What leftover food or ingredients do you have?</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={[s.input, { minHeight: 60 }]}
                placeholder="e.g., Rasam, leftover dal, stale roti, cooked rice, boiled eggs..."
                placeholderTextColor="#64748B"
                value={leftoverText}
                onChangeText={setLeftoverText}
                multiline
              />
            </View>

            <TouchableOpacity style={[s.genBtn, isProcessing && { opacity: 0.7 }]} onPress={handleGenerate} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={s.genBtnTxt}>✨ Generate Fusion Dish</Text>}
            </TouchableOpacity>

            {fusion && (
              <View style={s.fusionCard}>
                <Text style={s.fusionTitle}>🍽️ {fusion.dish}</Text>
                <View style={s.tagRow}>
                  {fusion.tags.map(t => <View key={t} style={s.tag}><Text style={s.tagTxt}>{t}</Text></View>)}
                </View>
                <Text style={s.stepsHeading}>Step-by-Step Recipe:</Text>
                {fusion.steps.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    <View style={s.stepNum}><Text style={s.stepNumTxt}>{i + 1}</Text></View>
                    <Text style={s.stepTxt}>{step}</Text>
                  </View>
                ))}
                <View style={s.zeroWasteTag}>
                  <Text style={s.zeroWasteTxt}>♻️ Zero Food Waste • AI-Powered Fusion Cooking</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  // ⬇️ ADJUST marginTop BELOW TO MOVE BACK BUTTON UP OR DOWN (for status bar / camera notch) ⬇️
  backBtn: { alignSelf: 'flex-start', marginTop: 45, marginLeft: 16, marginRight: 16, marginBottom: 10, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#1E293B', flexDirection: 'row', alignItems: 'center' },
  backBtnTxt: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1E293B', marginHorizontal: 20, marginTop: 16, borderRadius: 14, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#334155' },
  tabTxt: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  activeTabTxt: { color: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 60 },

  // Hero
  heroBanner: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 20 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#F8FAFC', marginBottom: 8 },
  heroSub: { fontSize: 14, color: '#94A3B8', lineHeight: 22 },

  // Quick chips
  chipHeading: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  chipActive: { backgroundColor: '#4ADE80', borderColor: '#4ADE80' },
  chipTxt: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  chipActiveTxt: { color: '#0F172A' },

  // Input
  inputWrap: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  input: { fontSize: 15, color: '#F8FAFC' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#CBD5E1', marginBottom: 10 },

  // Button
  genBtn: { backgroundColor: '#4ADE80', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  genBtnTxt: { color: '#0F172A', fontSize: 16, fontWeight: '800' },

  // Remedy card
  remedyCard: { backgroundColor: '#1E293B', borderRadius: 24, overflow: 'hidden', borderWidth: 1, marginBottom: 20 },
  remedyHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 16 },
  remedyEmoji: { fontSize: 40 },
  remedyCondition: { fontSize: 13, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  remedyMedicineName: { fontSize: 18, fontWeight: '900' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#CBD5E1', marginBottom: 10, paddingHorizontal: 20 },

  // Ingredient image cards (horizontal scroll)
  ingScroll: { marginBottom: 8 },
  ingScrollContent: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  ingCard: { minWidth: 120, backgroundColor: '#0B132B', borderRadius: 14, borderWidth: 1, overflow: 'hidden', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  ingImg: { width: 114, height: 90, borderRadius: 12, marginBottom: 8, backgroundColor: '#1E293B' },
  fallbackImgBox: { justifyContent: 'center', alignItems: 'center' },
  fallbackEmoji: { fontSize: 36 },
  ingCardName: { fontSize: 12, fontWeight: '700', color: '#F8FAFC', textAlign: 'center', lineHeight: 16, marginBottom: 4 },
  ingCardQty: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 15 },

  ingRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 8 },
  ingDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 12, flexShrink: 0 },
  ingTxt: { color: '#94A3B8', fontSize: 13, flex: 1, lineHeight: 20 },
  stepRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start', paddingHorizontal: 20 },
  stepNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12, flexShrink: 0 },
  stepNumTxt: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  stepTxt: { flex: 1, color: '#CBD5E1', fontSize: 14, lineHeight: 22 },
  warningBox: { flex: 1, backgroundColor: '#7C3AED22', borderRadius: 12, padding: 12, borderLeftWidth: 3, borderLeftColor: '#7C3AED', marginBottom: 4 },
  warningTxt: { color: '#A78BFA', fontSize: 13, lineHeight: 20, fontWeight: '600' },
  disclaimerBox: { backgroundColor: '#0F172A', margin: 16, borderRadius: 14, padding: 14 },
  disclaimerTxt: { color: '#64748B', fontSize: 12, lineHeight: 20 },

  // Leftover tab
  leftoverHero: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 20 },
  leftoverHeroTitle: { fontSize: 22, fontWeight: '900', color: '#F8FAFC', marginBottom: 6 },
  leftoverHeroSub: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },
  fusionCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20 },
  fusionTitle: { fontSize: 20, fontWeight: '900', color: '#F8FAFC', marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  tag: { backgroundColor: '#334155', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  tagTxt: { color: '#CBD5E1', fontSize: 11, fontWeight: '700' },
  stepsHeading: { fontSize: 14, fontWeight: '800', color: '#94A3B8', marginBottom: 12 },
  zeroWasteTag: { marginTop: 16, backgroundColor: '#14532D33', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#166534' },
  zeroWasteTxt: { color: '#4ADE80', fontSize: 12, fontWeight: '700', textAlign: 'center' },
});
