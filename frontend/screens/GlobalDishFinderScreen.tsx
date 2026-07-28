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

    const generateDishVarieties = (queryStr: string): Recipe[] => {
        const q = queryStr.trim();
        const qLower = q.toLowerCase();
        const titleCase = q.charAt(0).toUpperCase() + q.slice(1);

        if (qLower.includes('paneer')) {
            return [
                {
                    id: 'p1',
                    title: 'Paneer Butter Masala (Rich & Creamy)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: ['250g Paneer cubes', '2 Tomatoes (pureed)', '1 Onion (chopped)', '1 tbsp Butter', '2 tbsp Heavy Cream', '1 tsp Kasuri Methi', '1 tsp Garam Masala', '½ tsp Red Chilli Powder'],
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
                    ingredients: ['250g Fresh Paneer', '10 Cashews (ground to paste)', '1 Onion', '2 tbsp Yoghurt / Curd', '½ cup Milk', '2 Cardamoms', '1 Bay Leaf', 'Saffron strands'],
                    instructions: [
                        'Step 1: Boil onions and cashew nuts in water for 10 minutes, then blend into a fine white paste.',
                        'Step 2: Heat ghee in a pan, add whole cardamoms and bay leaf, then sauté the cashew-onion paste.',
                        'Step 3: Whisk curd with milk and saffron; pour into the pan on low heat while stirring continuously.',
                        'Step 4: Add soft paneer cubes and simmer gently for 4 minutes.',
                        'Step 5: Garnish with saffron strands and silver leaf for a royal dining experience!'
                    ]
                },
                {
                    id: 'p3',
                    title: 'Kadhai Paneer (Spicy Dhaba Style)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: ['250g Paneer', '1 Diced Bell Pepper (Capsicum)', '1 Diced Onion', '2 tbsp Kadhai Masala', '2 Tomatoes', '1 tbsp Ghee'],
                    instructions: [
                        'Step 1: Dry roast coriander seeds and whole red chillies, then coarsely grind to make fresh Kadhai Masala.',
                        'Step 2: Heat ghee in a kadhai and toss diced capsicum and onions on high flame for 2 minutes.',
                        'Step 3: Add tomato gravy and 2 tbsp Kadhai Masala; cook until fragrant.',
                        'Step 4: Fold in paneer cubes and toss well so spices coat every piece.',
                        'Step 5: Garnish with fresh ginger juliennes and cilantro!'
                    ]
                },
                {
                    id: 'p4',
                    title: 'Paneer Tikka Masala (Smoky Tandoori Gravy)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: ['250g Paneer', '3 tbsp Hung Curd', '1 tbsp Mustard Oil', '1 tsp Chaat Masala', 'Tomato Onion Gravy base'],
                    instructions: [
                        'Step 1: Marinate paneer cubes in hung curd, mustard oil, ginger-garlic paste, and tandoori masala for 30 minutes.',
                        'Step 2: Sear paneer cubes on a hot tawa or grill until charred and golden.',
                        'Step 3: Prepare a rich tomato-onion gravy in a separate pan.',
                        'Step 4: Drop grilled paneer tikka into the gravy and simmer for 3 minutes.',
                        'Step 5: Serve hot with mint chutney and garlic butter naan!'
                    ]
                },
                {
                    id: 'p5',
                    title: 'Palak Paneer (Healthy Spinach Curry)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: ['250g Paneer', '2 bunches Fresh Spinach (Blanched)', '2 Green Chillies', '4 Garlic cloves', '1 tsp Cumin seeds', '1 tbsp Cream'],
                    instructions: [
                        'Step 1: Blanch spinach leaves in boiling water for 2 minutes, then shock in ice water to retain vibrant green color.',
                        'Step 2: Blend blanched spinach with green chillies into a smooth puree.',
                        'Step 3: Sauté minced garlic and cumin seeds in ghee until aromatic.',
                        'Step 4: Pour in spinach puree, season with salt and garam masala, and simmer for 5 minutes.',
                        'Step 5: Add paneer cubes, swirl in fresh cream, and serve warm with roti!'
                    ]
                },
                {
                    id: 'p6',
                    title: 'Paneer Bhurji (Quick 10-Min Scramble)',
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
                    ingredients: ['200g Crumbled Paneer', '1 Finely Chopped Onion', '1 Chopped Tomato', '2 Green Chillies', '½ tsp Turmeric', 'Fresh Coriander'],
                    instructions: [
                        'Step 1: Heat oil in a pan, sauté green chillies and chopped onions until soft.',
                        'Step 2: Add tomatoes, turmeric, chilli powder, and salt; cook until tomatoes turn soft.',
                        'Step 3: Toss in fresh crumbled paneer and mix well on medium heat for 3 minutes.',
                        'Step 4: Sprinkle fresh coriander leaves and a squeeze of lemon juice.',
                        'Step 5: Serve hot with butter toast or paratha for a quick delicious meal!'
                    ]
                }
            ];
        }

        if (qLower.includes('dosa')) {
            return [
                {
                    id: 'd1',
                    title: 'Classic Mysuru Masala Dosa',
                    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
                    ingredients: ['Fermented Dosa Batter', 'Red Spicy Garlic Chutney', 'Spiced Potato Filling (Potato Palya)', 'Butter / Ghee'],
                    instructions: [
                        'Step 1: Pour a ladle of fermented dosa batter onto a hot tawa and spread outward in concentric circles.',
                        'Step 2: Spread 1 tbsp red garlic chutney inside the crepes and drizzle generous butter around edges.',
                        'Step 3: Place a scoop of warm potato palya in the center.',
                        'Step 4: Roast until golden brown and crispy.',
                        'Step 5: Fold into a half-moon shape and serve with coconut chutney and hot sambar!'
                    ]
                },
                {
                    id: 'd2',
                    title: 'Crispy Onion Rava Dosa',
                    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
                    ingredients: ['½ cup Rava (Semolina)', '½ cup Rice Flour', '¼ cup Maida', 'Finely chopped Onions & Green Chillies', 'Cumin seeds', 'Curry leaves'],
                    instructions: [
                        'Step 1: Mix rava, rice flour, maida, chopped onions, green chillies, cumin, and water to make a thin watery batter.',
                        'Step 2: Pour the thin batter from a height onto a hot tawa so lacy perforations form.',
                        'Step 3: Drizzle oil along the edges and cook on medium-high flame until crispy.',
                        'Step 4: Flip gently and cook for another 30 seconds.',
                        'Step 5: Serve golden crispy rava dosa hot with tomato chutney!'
                    ]
                },
                {
                    id: 'd3',
                    title: 'Cheese Garlic Butter Dosa (Street Style)',
                    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
                    ingredients: ['Dosa Batter', '1 cup Shredded Mozzarella Cheese', '1 tbsp Garlic Butter', 'Chilli Flakes & Oregano', 'Chopped Capsicum & Onions'],
                    instructions: [
                        'Step 1: Spread dosa batter thinly on tawa.',
                        'Step 2: Apply garlic butter all over the surface.',
                        'Step 3: Top with chopped capsicum, onions, chilli flakes, oregano, and a mountain of grated cheese.',
                        'Step 4: Cover with a lid for 2 minutes until cheese melts completely.',
                        'Step 5: Cut into rolls or triangles and serve hot!'
                    ]
                },
                {
                    id: 'd4',
                    title: 'Paneer Butter Masala Dosa',
                    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
                    ingredients: ['Dosa Batter', '1 cup Grated Spiced Paneer', 'Tomato Chutney', 'Butter'],
                    instructions: [
                        'Step 1: Make a crisp golden dosa on tawa.',
                        'Step 2: Spread a layer of tangy tomato chutney.',
                        'Step 3: Load the center with seasoned grated paneer stuffing.',
                        'Step 4: Roll tightly and slice into bite-sized pinwheels.',
                        'Step 5: Serve with mint chutney!'
                    ]
                }
            ];
        }

        return [
            {
                id: `var_1_${Date.now()}`,
                title: `Classic Home-Style ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Fresh key ingredients for ${titleCase}`, '1 Chopped Onion', '2 Tomatoes', '1 tsp Ginger-Garlic Paste', '1 tsp Cumin & Mustard seeds', 'Fresh Coriander', 'Cooking Oil / Ghee'],
                instructions: [
                    `Step 1: Wash and prepare all fresh ingredients required for ${titleCase}.`,
                    'Step 2: Heat 2 tbsp oil or ghee in a pan and add cumin seeds until they crackle.',
                    'Step 3: Sauté onions and ginger-garlic paste until golden brown.',
                    `Step 4: Add main components of ${titleCase} with salt, turmeric, and Indian spices.`,
                    `Step 5: Simmer for 10-15 minutes until tender and fragrant. Garnish with coriander and serve hot!`
                ]
            },
            {
                id: `var_2_${Date.now()}`,
                title: `Spicy Dhaba-Style ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Primary ingredients for ${titleCase}`, '2 Green Chillies', '1 tsp Red Chilli Powder', '1 tsp Garam Masala', '1 tbsp Mustard Oil', 'Kasuri Methi'],
                instructions: [
                    `Step 1: Heat mustard oil in a heavy-bottom kadhai until smoky.`,
                    'Step 2: Fry green chillies, onions, and spicy tomato paste on high flame.',
                    `Step 3: Toss in ${titleCase} with bold dhaba spices and roast until well coated.`,
                    'Step 4: Add half a cup of hot water and simmer for a rich spicy gravy.',
                    'Step 5: Finish with crushed Kasuri Methi and fresh ginger juliennes!'
                ]
            },
            {
                id: `var_3_${Date.now()}`,
                title: `Creamy Butter Masala ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Main ingredients for ${titleCase}`, '2 tbsp Butter', '2 tbsp Fresh Cream', '10 Cashews (ground)', 'Tomato Puree', 'Kashmiri Red Chilli'],
                instructions: [
                    'Step 1: Sauté tomato puree with cashew paste and butter until silky and smooth.',
                    `Step 2: Season gravy with Kashmiri chilli powder for vibrant natural color.`,
                    `Step 3: Add ${titleCase} pieces into the rich gravy and gently fold.`,
                    'Step 4: Swirl in fresh heavy cream and simmer on low heat for 4 minutes.',
                    'Step 5: Serve rich and creamy with warm naan or jeera rice!'
                ]
            },
            {
                id: `var_4_${Date.now()}`,
                title: `Crispy Tawa Fry ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Fresh ${titleCase}`, '1 tbsp Cornflour / Rice Flour', '1 tsp Chaat Masala', '1 Lemon', 'Curry leaves', 'Oil for tawa frying'],
                instructions: [
                    `Step 1: Coat ${titleCase} with rice flour, cornflour, chilli powder, and salt.`,
                    'Step 2: Heat 2 tbsp oil on a flat tawa.',
                    `Step 3: Place coated ${titleCase} on the tawa and shallow fry until golden and extra crispy.`,
                    'Step 4: Flip halfway and sprinkle chaat masala and fresh curry leaves.',
                    'Step 5: Squeeze fresh lemon juice over the top and serve hot as a crispy starter!'
                ]
            },
            {
                id: `var_5_${Date.now()}`,
                title: `Royal Shahi / Mughlai ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Selected ${titleCase}`, 'Saffron strands', '1 tbsp Ghee', 'Whole Cardamom & Cloves', 'Almond-Cashew paste', 'Kewra water'],
                instructions: [
                    'Step 1: Heat pure ghee in a pan and temper whole cloves, cardamom, and bay leaf.',
                    'Step 2: Add almond-cashew white gravy base and simmer on low heat.',
                    `Step 3: Incorporate ${titleCase} into the smooth fragrant sauce.`,
                    'Step 4: Infuse with saffron milk and a drop of kewra water.',
                    'Step 5: Garnish with sliced almonds and serve for a royal feast!'
                ]
            },
            {
                id: `var_6_${Date.now()}`,
                title: `Healthy Steamed / Roasted ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Fresh ${titleCase}`, '1 tsp Olive Oil', 'Crushed Black Pepper', 'Himalayan Pink Salt', 'Lemon Juice', 'Fresh Herbs'],
                instructions: [
                    `Step 1: Toss ${titleCase} with olive oil, black pepper, and Himalayan salt.`,
                    'Step 2: Arrange on a baking tray or steamer basket.',
                    `Step 3: Roast at 200°C for 15 minutes or steam for 10 minutes until tender.`,
                    'Step 4: Drizzle with extra virgin olive oil and lemon juice.',
                    'Step 5: Enjoy a light, nutritious, guilt-free meal!'
                ]
            }
        ];
    };

    const fetchRecipesData = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        const fallbackVarieties = generateDishVarieties(searchQuery);

        try {
            const baseUrl = getApiBaseUrl();
            const response = await fetch(`${baseUrl}/api/recipes/search-recipes?dish=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                // If API returned some items, combine API items with full varieties set so user sees ALL varieties!
                const combined = [...data];
                fallbackVarieties.forEach(v => {
                    if (!combined.some(c => c.title.toLowerCase() === v.title.toLowerCase())) {
                        combined.push(v);
                    }
                });
                setRecipesList(combined);
            } else {
                setRecipesList(fallbackVarieties);
            }
        } catch (err) {
            console.error("Connection error fallback ->", err);
            setRecipesList(fallbackVarieties);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.mainContainer}>
                <Text style={styles.appHeader}>🍲 Discover Global Recipes</Text>
                <Text style={styles.subHeader}>Search any dish to view all its mouth-watering varieties, ingredients, and step-by-step guides.</Text>

                <View style={styles.searchSection}>
                    <TextInput
                        placeholder="Search dish (e.g., Paneer, Dosa, Biryani, Chicken, Pasta...)"
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

                                <Text style={styles.popupSectionHeadingTitle}>📋 Ingredients Required</Text>
                                <View style={styles.dataCardBlockContainer}>
                                    {selectedDish.ingredients.map((ingredientItem, indexId) => (
                                        <Text key={indexId} style={styles.bulletPointTextLine}>• {ingredientItem}</Text>
                                    ))}
                                </View>

                                <Text style={styles.popupSectionHeadingTitle}>🍳 Step-by-Step Instructions</Text>
                                <View style={styles.dataCardBlockContainer}>
                                    {selectedDish.instructions.map((cookingStepText, indexId) => (
                                        <View key={indexId} style={styles.cookingStepRowContainer}>
                                            <Text style={styles.cookingStepNumberBadge}>{indexId + 1}</Text>
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
