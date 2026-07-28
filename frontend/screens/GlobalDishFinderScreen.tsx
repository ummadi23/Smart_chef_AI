import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator, SafeAreaView } from 'react-native';
import { getApiBaseUrl } from '../config';

interface Recipe {
    id: string;
    title: string;
    image: string;
    ingredients: string[];
    instructions: string[];
}

export default function GlobalDishFinderScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipesList, setRecipesList] = useState<Recipe[]>([]);
    const [selectedDish, setSelectedDish] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateIndianDishVarieties = (queryStr: string): Recipe[] => {
        const q = queryStr.trim();
        const qLower = q.toLowerCase();
        const titleCase = q.charAt(0).toUpperCase() + q.slice(1);

        // 1. BIRYANI VARIETIES
        if (qLower.includes('biryani') || qLower.includes('briyani') || qLower.includes('pulao')) {
            return [
                {
                    id: 'b1',
                    title: 'Hyderabadi Chicken Dum Biryani',
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
                    ingredients: [
                        '500g Chicken (curry cut)',
                        '2 cups Long-grain Basmati Rice',
                        '1 cup Thick Curd / Yoghurt',
                        '2 tbsp Desi Ghee',
                        '2 Sliced Onions (fried golden)',
                        '1 tbsp Ginger-Garlic Paste',
                        '1 tsp Biryani Masala',
                        'Saffron milk & Mint leaves'
                    ],
                    instructions: [
                        'Step 1: Marinate chicken with curd, ginger-garlic paste, biryani masala, red chilli, and salt for 45 minutes.',
                        'Step 2: Boil 2 cups Basmati rice with whole spices (bay leaf, cloves, cardamom) until 70% cooked; drain water.',
                        'Step 3: Layer marinated chicken at the bottom of a heavy handi, top with cooked rice, golden fried onions, saffron milk, and mint leaves.',
                        'Step 4: Seal the vessel with dough or a tight lid and cook on low dum heat for 25 minutes.',
                        'Step 5: Mix gently from the bottom and serve piping hot with Mirchi Ka Salan and Raita!'
                    ]
                },
                {
                    id: 'b2',
                    title: 'Lucknowi Awadhi Chicken Biryani',
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
                    ingredients: [
                        '500g Chicken',
                        '2 cups Aged Basmati Rice',
                        '½ cup Warm Milk with Kewra water',
                        '2 tbsp Pure Ghee',
                        'Whole Spices (Mace, Star Anise, Cardamom)',
                        'Golden Fried Onions'
                    ],
                    instructions: [
                        'Step 1: Parboil chicken in aromatic spiced stock until 80% tender.',
                        'Step 2: Layer fragrant Basmati rice over the tender chicken in a clay handi.',
                        'Step 3: Drizzle pure ghee, milk infused with saffron, and a drop of Kewra water.',
                        'Step 4: Seal handi with dough and dum-cook on low flame for 20 minutes.',
                        'Step 5: Serve delicate, aromatic Awadhi biryani with cucumber raita!'
                    ]
                },
                {
                    id: 'b3',
                    title: 'Kolkata Mutton Biryani (with Egg & Potato)',
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
                    ingredients: [
                        '500g Mutton',
                        '2 Large Potatoes (halved & fried)',
                        '2 Boiled Eggs',
                        '2 cups Basmati Rice',
                        'Meetha Attar (Biryani aroma)',
                        'Ghee & Golden Onions'
                    ],
                    instructions: [
                        'Step 1: Pressure cook mutton with yoghurt, ginger, garlic, and Kolkata biryani spices until soft.',
                        'Step 2: Fry large potato halves and boiled eggs in ghee until golden.',
                        'Step 3: Layer mutton gravy, golden potatoes, boiled eggs, and parboiled rice in a vessel.',
                        'Step 4: Drizzle Meetha Attar, saffron, and ghee; dum cook for 20 minutes.',
                        'Step 5: Enjoy authentic Kolkata style biryani with soft flavorful potatoes!'
                    ]
                }
            ];
        }

        // 2. CHICKEN VARIETIES
        if (qLower.includes('chicken') || qLower.includes('murg')) {
            return [
                {
                    id: 'c1',
                    title: 'Butter Chicken (Murgh Makhani)',
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
                    ingredients: [
                        '500g Chicken (grilled tikka)',
                        '3 tbsp Butter',
                        '2 tbsp Fresh Cream',
                        '2 cups Tomato Puree',
                        '1 tbsp Cashew Paste',
                        '1 tsp Kasuri Methi',
                        '1 tsp Garam Masala'
                    ],
                    instructions: [
                        'Step 1: Marinate chicken in curd and tandoori masala; grill or pan-sear until golden.',
                        'Step 2: Melt butter in a pan, add tomato puree and cashew paste; simmer for 10 minutes.',
                        'Step 3: Add grilled chicken pieces into the creamy gravy.',
                        'Step 4: Swirl in heavy cream and crushed Kasuri Methi.',
                        'Step 5: Serve rich butter chicken hot with butter naan!'
                    ]
                },
                {
                    id: 'c2',
                    title: 'Chicken Tikka Masala (Smoky Tandoori Curry)',
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
                    ingredients: [
                        '500g Boneless Chicken',
                        '1 cup Hung Curd',
                        '1 Onion (chopped)',
                        '1 Tomato Puree',
                        '1 tbsp Mustard Oil',
                        'Tandoori & Garam Masala'
                    ],
                    instructions: [
                        'Step 1: Marinate chicken cubes in hung curd and mustard oil for 1 hour; sear on tawa.',
                        'Step 2: Prepare a thick onion-tomato spiced gravy in a skillet.',
                        'Step 3: Add seared chicken tikka into the gravy and simmer for 5 minutes.',
                        'Step 4: Infuse with charcoal smoke for authentic tandoori aroma.',
                        'Step 5: Garnish with fresh coriander and serve hot!'
                    ]
                }
            ];
        }

        // 3. PANEER VARIETIES
        if (qLower.includes('paneer')) {
            return [
                {
                    id: 'p1',
                    title: 'Paneer Butter Masala (Rich & Creamy)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: [
                        '250g Paneer cubes',
                        '2 Tomatoes (pureed)',
                        '1 Onion (chopped)',
                        '1 tbsp Butter',
                        '2 tbsp Heavy Cream',
                        '1 tsp Kasuri Methi',
                        '1 tsp Garam Masala'
                    ],
                    instructions: [
                        'Step 1: Melt 1 tbsp butter in a pan and sauté chopped onions until golden brown.',
                        'Step 2: Add tomato puree, ginger-garlic paste, red chilli powder, and salt. Cook for 6 minutes until oil separates.',
                        'Step 3: Stir in 2 tbsp fresh cream and 1 cup warm water to create a silky gravy.',
                        'Step 4: Gently drop in fresh paneer cubes and simmer on low heat for 5 minutes.',
                        'Step 5: Crush Kasuri Methi between palms, sprinkle over the curry with garam masala, and serve hot with naan!'
                    ]
                },
                {
                    id: 'p2',
                    title: 'Shahi Paneer (Royal Mughlai Style)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: [
                        '250g Fresh Paneer',
                        '10 Cashews (ground to paste)',
                        '1 Onion',
                        '2 tbsp Yoghurt / Curd',
                        '½ cup Milk',
                        '2 Cardamoms',
                        '1 Bay Leaf',
                        'Saffron strands'
                    ],
                    instructions: [
                        'Step 1: Boil onions and cashew nuts in water for 10 minutes, then blend into a fine white paste.',
                        'Step 2: Heat ghee in a pan, add whole cardamoms and bay leaf, then sauté the cashew-onion paste.',
                        'Step 3: Whisk curd with milk and saffron; pour into the pan on low heat while stirring continuously.',
                        'Step 4: Add soft paneer cubes and simmer gently for 4 minutes.',
                        'Step 5: Garnish with saffron strands and silver leaf for a royal dining experience!'
                    ]
                }
            ];
        }

        // 4. DOSA VARIETIES
        if (qLower.includes('dosa') || qLower.includes('dosai')) {
            return [
                {
                    id: 'd1',
                    title: 'Classic Mysuru Masala Dosa',
                    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
                    ingredients: [
                        'Fermented Dosa Batter',
                        'Red Spicy Garlic Chutney',
                        'Spiced Potato Filling (Potato Palya)',
                        'Desi Butter / Ghee'
                    ],
                    instructions: [
                        'Step 1: Pour a ladle of fermented dosa batter onto a hot tawa and spread outward in concentric circles.',
                        'Step 2: Spread 1 tbsp red garlic chutney inside the crepe and drizzle generous butter around edges.',
                        'Step 3: Place a scoop of warm potato palya in the center.',
                        'Step 4: Roast until golden brown and crispy.',
                        'Step 5: Fold into a half-moon shape and serve with coconut chutney and hot sambar!'
                    ]
                }
            ];
        }

        // 5. UPMA VARIETIES
        if (qLower.includes('upma') || qLower.includes('uppuma') || qLower.includes('uppittu')) {
            return [
                {
                    id: 'u1',
                    title: 'Classic South Indian Rava Upma (Sooji Upma)',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
                    ingredients: [
                        '1 cup Rava / Sooji (Semolina)',
                        '2.5 cups Water',
                        '2 tbsp Desi Ghee / Oil',
                        '1 tsp Mustard seeds (Rai)',
                        '1 tsp Chana Dal',
                        '1 tsp Urad Dal',
                        '10 Cashew nuts (split)',
                        '1 inch Fine Ginger (minced)',
                        '2 Green Chillies (slit)',
                        '1 Onion (finely chopped)',
                        '1 sprig Curry Leaves',
                        'A pinch of Hing (Asafoetida)',
                        'Salt to taste',
                        'Fresh Coriander & Lemon juice'
                    ],
                    instructions: [
                        'Step 1: Dry roast 1 cup Rava (semolina) in a pan on medium heat for 4-5 minutes until aromatic (do not brown); set aside in a plate.',
                        'Step 2: Heat 2 tbsp ghee/oil in the pan. Add 1 tsp mustard seeds, 1 tsp chana dal, 1 tsp urad dal, and split cashews; sauté until golden.',
                        'Step 3: Add 1 sprig curry leaves, minced ginger, slit green chillies, a pinch of hing, and chopped onions. Sauté until onions turn translucent.',
                        'Step 4: Pour 2.5 cups water and add 1 tsp salt. Bring water to a rolling boil over high flame.',
                        'Step 5: Reduce flame to low. Gradually pour roasted rava with one hand while continuously stirring with a spoon to prevent any lumps.',
                        'Step 6: Cover the pan with a lid and steam on low heat for 3 minutes until rava absorbs water and becomes light and fluffy.',
                        'Step 7: Sprinkle fresh coriander leaves, squeeze 1 tsp lemon juice, and serve warm with Coconut Chutney or Sambar!'
                    ]
                },
                {
                    id: 'u2',
                    title: 'Vegetable Masala Rava Upma',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
                    ingredients: [
                        '1 cup Roasted Rava',
                        '¼ cup Finely Chopped Carrots',
                        '¼ cup Green Peas',
                        '¼ cup French Beans',
                        '1 Chopped Tomato',
                        '1 Onion (chopped)',
                        '2.5 cups Water',
                        '2 tbsp Ghee',
                        '1 tsp Mustard seeds & Curry leaves'
                    ],
                    instructions: [
                        'Step 1: Dry roast rava until aromatic and set aside.',
                        'Step 2: Heat ghee in a pan, temper mustard seeds, chana dal, urad dal, curry leaves, and green chillies.',
                        'Step 3: Sauté onions, carrots, green peas, beans, and tomatoes with a pinch of turmeric for 4 minutes.',
                        'Step 4: Pour 2.5 cups water, add salt, and bring to a boil so vegetables become tender.',
                        'Step 5: Slowly add roasted rava while stirring continuously. Cover and steam for 3 minutes.',
                        'Step 6: Garnish with fresh grated coconut and cilantro; serve hot!'
                    ]
                },
                {
                    id: 'u3',
                    title: 'Semya Upma (Vermicelli Upma)',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
                    ingredients: [
                        '1 cup Roasted Vermicelli (Semya)',
                        '2 cups Water',
                        '1 Finely Chopped Onion',
                        '2 Green Chillies',
                        '1 tsp Mustard seeds',
                        '1 tsp Chana Dal',
                        '10 Peanuts / Cashews',
                        'Curry leaves & 2 tbsp Oil'
                    ],
                    instructions: [
                        'Step 1: Roast vermicelli in 1 tsp ghee until golden brown if unroasted.',
                        'Step 2: Sauté mustard seeds, peanuts, chana dal, curry leaves, ginger, and green chillies in 2 tbsp oil.',
                        'Step 3: Add chopped onions, sauté until soft, then pour 2 cups water and salt; bring to a rolling boil.',
                        'Step 4: Add roasted vermicelli, stir well, cover and cook on medium-low heat for 5-6 minutes until water is absorbed.',
                        'Step 5: Fluff gently with a fork, sprinkle lemon juice, and serve warm!'
                    ]
                },
                {
                    id: 'u4',
                    title: 'Bread Upma (Quick 10-Min Snack)',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
                    ingredients: [
                        '6 Bread Slices (cubed)',
                        '1 Chopped Onion',
                        '1 Chopped Tomato',
                        '½ tsp Turmeric powder',
                        '½ tsp Red Chilli powder',
                        '1 tsp Mustard seeds',
                        'Curry leaves & 1 tbsp Butter'
                    ],
                    instructions: [
                        'Step 1: Cut 6 bread slices into small 1-inch square cubes.',
                        'Step 2: Heat 1 tbsp butter or oil in a pan, splutter mustard seeds and curry leaves.',
                        'Step 3: Add chopped onions, green chillies, and tomatoes; sauté until soft and mushy.',
                        'Step 4: Add turmeric, red chilli powder, salt, and 2 tbsp water to make a moist masala base.',
                        'Step 5: Toss in bread cubes, coat well for 2 minutes on high heat, garnish with coriander and serve hot!'
                    ]
                },
                {
                    id: 'u5',
                    title: 'Oats Veggie Upma (Low Calorie & Fiber Rich)',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
                    ingredients: [
                        '1 cup Rolled / Instant Oats',
                        '1.5 cups Water',
                        '¼ cup Mixed Veggies (Carrot, Peas, Corn)',
                        '1 Chopped Onion',
                        '1 tsp Mustard seeds',
                        '1 tsp Minced Ginger',
                        'Ghee & Lemon juice'
                    ],
                    instructions: [
                        'Step 1: Dry roast oats in a pan for 2 minutes until warm; set aside.',
                        'Step 2: Temper mustard seeds, urad dal, green chillies, ginger, and curry leaves in 1 tbsp ghee.',
                        'Step 3: Sauté onions and mixed vegetables for 3 minutes.',
                        'Step 4: Add 1.5 cups water, salt, bring to a boil, then stir in roasted oats.',
                        'Step 5: Cook on low flame for 2-3 minutes until soft and moist. Serve warm!'
                    ]
                }
            ];
        }

        // 6. POHA VARIETIES
        if (qLower.includes('poha') || qLower.includes('pohe')) {
            return [
                {
                    id: 'po1',
                    title: 'Classic Maharashtrian Kanda Poha',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
                    ingredients: [
                        '2 cups Thick Poha (flattened rice)',
                        '¼ cup Raw Peanuts',
                        '1 Onion (finely chopped)',
                        '2 Green Chillies (chopped)',
                        '1 tsp Mustard seeds',
                        '½ tsp Turmeric powder',
                        '1 sprig Curry Leaves',
                        '2 tbsp Oil',
                        '1 tbsp Lemon juice',
                        'Fresh Coriander & Grated Coconut'
                    ],
                    instructions: [
                        'Step 1: Wash poha in a colander under running water for 30 seconds; drain completely and toss with ½ tsp turmeric and 1 tsp salt.',
                        'Step 2: Heat 2 tbsp oil in a pan, fry raw peanuts until crunchy and golden; remove and set aside.',
                        'Step 3: In the same oil, add 1 tsp mustard seeds, curry leaves, green chillies, and chopped onions. Sauté until onions turn soft.',
                        'Step 4: Add rinsed poha and fried peanuts to the pan. Toss gently on low heat for 3 minutes until warm.',
                        'Step 5: Squeeze lemon juice, garnish with fresh coriander and grated coconut, and serve warm with hot chai!'
                    ]
                }
            ];
        }

        // UNIVERSAL DYNAMIC VARIETY ENGINE FOR ANY INDIAN DISH QUERY (`[Dish]`)
        return [
            {
                id: `ind_var_1_${Date.now()}`,
                title: `Classic Indian-Style ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [
                    `Fresh main ingredients for ${titleCase}`,
                    '1 Chopped Onion',
                    '1 Chopped Tomato',
                    '1 tsp Ginger-Garlic Paste',
                    '1 tsp Mustard seeds & Cumin seeds',
                    '1 sprig Curry Leaves',
                    '½ tsp Turmeric & Red Chilli powder',
                    '2 tbsp Cooking Oil / Desi Ghee',
                    'Salt & Fresh Coriander'
                ],
                instructions: [
                    `Step 1: Wash and prepare all fresh ingredients required for ${titleCase}.`,
                    'Step 2: Heat 2 tbsp oil or ghee in a pan; splutter mustard seeds, cumin seeds, and curry leaves.',
                    'Step 3: Sauté finely chopped onions and ginger-garlic paste until golden brown.',
                    'Step 4: Add tomatoes, turmeric, red chilli powder, and salt; cook until tomatoes turn soft.',
                    `Step 5: Add main ${titleCase} ingredients, sprinkle 2 tbsp water if needed, cover and cook on medium flame for 8-10 minutes until tender.`,
                    'Step 6: Garnish with fresh coriander leaves, a dash of lemon juice, and serve piping hot!'
                ]
            },
            {
                id: `ind_var_2_${Date.now()}`,
                title: `Punjabi Dhaba-Style ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [
                    `Fresh ingredients for ${titleCase}`,
                    '2 Onions (chopped)',
                    '2 Tomatoes (pureed)',
                    '1 tbsp Ginger-Garlic Paste',
                    '1 tbsp Desi Ghee',
                    '1 tsp Punjabi Garam Masala',
                    '1 tsp Kasuri Methi'
                ],
                instructions: [
                    'Step 1: Heat 1 tbsp desi ghee in a heavy kadhai and sauté onions until golden brown.',
                    'Step 2: Add ginger-garlic paste, tomato puree, red chilli powder, turmeric, and coriander powder.',
                    'Step 3: Cook masala on medium flame for 7 minutes until oil separates from sides.',
                    `Step 4: Add ${titleCase} components into the rich masala gravy with 1 cup warm water.`,
                    'Step 5: Simmer for 12 minutes, finish with crushed Kasuri Methi, and serve hot with naan or paratha!'
                ]
            },
            {
                id: `ind_var_3_${Date.now()}`,
                title: `South Indian Spiced ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [
                    `Main ingredient for ${titleCase}`,
                    '1 tsp Mustard Seeds',
                    '1 tsp Chana Dal & Urad Dal',
                    '2 sprigs Fresh Curry Leaves',
                    '2 Green Chillies (slit)',
                    '2 tbsp Coconut Oil / Ghee',
                    'Fresh Grated Coconut'
                ],
                instructions: [
                    'Step 1: Heat 2 tbsp coconut oil in a pan; add mustard seeds, chana dal, urad dal, and curry leaves.',
                    'Step 2: Add green chillies and onions; sauté until translucent.',
                    `Step 3: Add prepared ${titleCase} ingredients, turmeric, and salt; toss gently.`,
                    'Step 4: Cover and steam on low flame for 6-8 minutes until cooked through.',
                    'Step 5: Top with fresh grated coconut and serve hot!'
                ]
            }
        ];
    };

    const fetchRecipesData = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        const indianVarieties = generateIndianDishVarieties(searchQuery);

        try {
            const baseUrl = getApiBaseUrl();
            const response = await fetch(`${baseUrl}/api/recipes/search-recipes?dish=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                const combined = [...data];
                indianVarieties.forEach(v => {
                    if (!combined.some(c => c.title.toLowerCase() === v.title.toLowerCase())) {
                        combined.push(v);
                    }
                });
                setRecipesList(combined);
            } else {
                setRecipesList(indianVarieties);
            }
        } catch (err) {
            console.error("Connection error fallback ->", err);
            setRecipesList(indianVarieties);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.mainContainer}>
                <Text style={styles.appHeader}>🍲 Discover Global & Indian Recipes</Text>
                <Text style={styles.subHeader}>Search any dish to view all authentic Indian regional varieties, required ingredients, and clear step-by-step guides.</Text>

                <View style={styles.searchSection}>
                    <TextInput
                        placeholder="Search dish (e.g., Biryani, Chicken, Paneer, Dosa, Upma, Poha...)"
                        placeholderTextColor="#7f8c8d"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.textInputField}
                        onSubmitEditing={fetchRecipesData}
                    />
                    <TouchableOpacity style={styles.searchActionButton} onPress={fetchRecipesData}>
                        <Text style={styles.searchActionText}>Search</Text>
                    </TouchableOpacity>
                </View>

                {isLoading && <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 30 }} />}

                <FlatList
                    data={recipesList}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollListPadding}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedDish(item)} style={styles.recipeDataCard} activeOpacity={0.9}>
                            <View style={styles.recipeCardDetails}>
                                <Text style={styles.recipeCardTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.actionPromptText}>Tap to open ingredients & step instructions ➔</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        !isLoading && searchQuery ? <Text style={styles.emptyStateMessage}>No recipes found. Try another keyword!</Text> : null
                    }
                />

                <Modal visible={!!selectedDish} animationType="slide">
                    <View style={styles.popupModalContainer}>
                        <TouchableOpacity style={styles.popupCloseButton} onPress={() => setSelectedDish(null)}>
                            <Text style={styles.popupCloseButtonText}>✕ Close Recipe Window</Text>
                        </TouchableOpacity>

                        {selectedDish && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                                <Text style={styles.popupMainDishTitle}>{selectedDish.title}</Text>

                                <Text style={styles.popupSectionHeadingTitle}>📋 Ingredients Required:</Text>
                                <View style={styles.dataCardBlockContainer}>
                                    {selectedDish.ingredients.map((ingredientItem, indexId) => (
                                        <Text key={indexId} style={styles.bulletPointTextLine}>• {ingredientItem}</Text>
                                    ))}
                                </View>

                                <Text style={styles.popupSectionHeadingTitle}>🍳 Clear Step-by-Step Instructions:</Text>
                                <View style={styles.dataCardBlockContainer}>
                                    {selectedDish.instructions.map((cookingStepText, indexId) => (
                                        <View key={indexId} style={styles.cookingStepRowContainer}>
                                            <Text style={styles.cookingStepParagraphText}>{cookingStepText}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: '#fcfcfc' },
    mainContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
    appHeader: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
    subHeader: { fontSize: 13, color: '#7f8c8d', marginBottom: 20 },
    searchSection: { flexDirection: 'row', width: '100%', marginBottom: 15 },
    textInputField: { flex: 1, height: 50, borderWidth: 1, borderColor: '#dcdde1', borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#fff', fontSize: 16, color: '#2c3e50' },
    searchActionButton: { backgroundColor: '#2ecc71', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginLeft: 10, borderRadius: 10, height: 50 },
    searchActionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    scrollListPadding: { paddingBottom: 30, paddingTop: 5 },
    recipeDataCard: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f2f6', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    recipeCardThumbnail: { width: '100%', height: 190, backgroundColor: '#f1f2f6' },
    recipeCardDetails: { padding: 15 },
    recipeCardTitle: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginBottom: 6 },
    actionPromptText: { fontSize: 13, color: '#2ecc71', fontWeight: '600' },
    emptyStateMessage: { textAlign: 'center', color: '#95a5a6', fontSize: 15, marginTop: 40 },
    popupModalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
    popupCloseButton: { backgroundColor: '#e74c3c', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
    popupCloseButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    popupHeroBannerImage: { width: '100%', height: 230, borderRadius: 15 },
    popupMainDishTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginVertical: 15 },
    popupSectionHeadingTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginTop: 22, marginBottom: 10 },
    dataCardBlockContainer: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#f1f2f6' },
    bulletPointTextLine: { fontSize: 15, color: '#34495e', marginVertical: 5, lineHeight: 22 },
    cookingStepRowContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 },
    cookingStepNumberBadge: { backgroundColor: '#2ecc71', color: '#fff', fontWeight: 'bold', width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, fontSize: 13, overflow: 'hidden', marginRight: 12, marginTop: 2 },
    cookingStepParagraphText: { flex: 1, fontSize: 15, color: '#34495e', lineHeight: 22 }
});
