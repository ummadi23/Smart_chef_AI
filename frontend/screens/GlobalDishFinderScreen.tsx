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
                    ingredients: ['500g Chicken (curry cut)', '2 cups Long-grain Basmati Rice', '1 cup Thick Curd / Yoghurt', '2 tbsp Desi Ghee', '2 Sliced Onions (fried golden)', '1 tbsp Ginger-Garlic Paste', '1 tsp Biryani Masala', 'Saffron milk & Mint leaves'],
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
                    ingredients: ['500g Chicken', '2 cups Aged Basmati Rice', '½ cup Warm Milk with Kewra water', '2 tbsp Pure Ghee', 'Whole Spices (Mace, Star Anise, Cardamom)', 'Golden Fried Onions'],
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
                    ingredients: ['500g Mutton', '2 Large Potatoes (halved & fried)', '2 Boiled Eggs', '2 cups Basmati Rice', 'Meetha Attar (Biryani aroma)', 'Ghee & Golden Onions'],
                    instructions: [
                        'Step 1: Pressure cook mutton with yoghurt, ginger, garlic, and Kolkata biryani spices until soft.',
                        'Step 2: Fry large potato halves and boiled eggs in ghee until golden.',
                        'Step 3: Layer mutton gravy, golden potatoes, boiled eggs, and parboiled rice in a vessel.',
                        'Step 4: Drizzle Meetha Attar, saffron, and ghee; dum cook for 20 minutes.',
                        'Step 5: Enjoy authentic Kolkata style biryani with soft flavorful potatoes!'
                    ]
                },
                {
                    id: 'b4',
                    title: 'Malabar Fish Biryani (Kerala Style)',
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
                    ingredients: ['400g King Fish / Seer Fish steaks', '2 cups Kaima / Jeerakasala Rice', '2 tbsp Coconut Oil', 'Fried Cashews & Raisins', 'Green Chilli Garlic Paste', 'Curry Leaves'],
                    instructions: [
                        'Step 1: Shallow fry fish steaks marinated in turmeric and chilli powder.',
                        'Step 2: Cook short-grain Kaima rice with ghee and whole spices.',
                        'Step 3: Prepare onion-tomato green chilli masala in coconut oil.',
                        'Step 4: Layer fried fish, onion masala, cooked rice, and top with golden cashews & raisins.',
                        'Step 5: Dum cook for 15 minutes and serve with Kerala coconut chammanthi!'
                    ]
                },
                {
                    id: 'b5',
                    title: 'Chettinad Spicy Veg Dum Biryani',
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
                    ingredients: ['1 cup Mixed Vegetables (Carrots, Beans, Peas, Potato)', '2 cups Basmati Rice', '2 tbsp Chettinad Masala (fennel, pepper, kapok bud)', '1 cup Coconut Milk', 'Ghee & Mint'],
                    instructions: [
                        'Step 1: Sauté mixed vegetables with freshly ground Chettinad spice masala.',
                        'Step 2: Cook Basmati rice in coconut milk and water until 75% done.',
                        'Step 3: Layer Chettinad veg gravy and coconut rice in a pan.',
                        'Step 4: Dum cook for 15 minutes on low flame.',
                        'Step 5: Serve hot with spicy onion pachadi!'
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
                    ingredients: ['500g Chicken (grilled tikka)', '3 tbsp Butter', '2 tbsp Fresh Cream', '2 cups Tomato Puree', '1 tbsp Cashew Paste', '1 tsp Kasuri Methi', '1 tsp Garam Masala'],
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
                    ingredients: ['500g Boneless Chicken', '1 cup Hung Curd', '1 Onion (chopped)', '1 Tomato Puree', '1 tbsp Mustard Oil', 'Tandoori & Garam Masala'],
                    instructions: [
                        'Step 1: Marinate chicken cubes in hung curd and mustard oil for 1 hour; sear on tawa.',
                        'Step 2: Prepare a thick onion-tomato spiced gravy in a skillet.',
                        'Step 3: Add seared chicken tikka into the gravy and simmer for 5 minutes.',
                        'Step 4: Infuse with charcoal smoke for authentic tandoori aroma.',
                        'Step 5: Garnish with fresh coriander and serve hot!'
                    ]
                },
                {
                    id: 'c3',
                    title: 'Kadhai Chicken (Spicy Dhaba Style)',
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
                    ingredients: ['500g Bone-in Chicken', '1 Diced Bell Pepper (Capsicum)', '1 Diced Onion', '2 tbsp Fresh Kadhai Masala', '2 Tomatoes', '1 tbsp Ghee'],
                    instructions: [
                        'Step 1: Coarsely grind roasted coriander seeds and whole red chillies to make Kadhai Masala.',
                        'Step 2: Sauté chicken in ghee until white; add tomato paste and Kadhai Masala.',
                        'Step 3: Toss in crunchy diced bell peppers and onions.',
                        'Step 4: Cook on high flame for 8 minutes until chicken is tender.',
                        'Step 5: Garnish with fresh ginger juliennes and serve with rumali roti!'
                    ]
                },
                {
                    id: 'c4',
                    title: 'Chettinad Spicy Pepper Chicken',
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
                    ingredients: ['500g Chicken', '2 tbsp Black Peppercorns (ground)', '1 tsp Fennel seeds', '10 Shallots (Small onions)', '2 Sprigs Curry Leaves', 'Gingelly Oil'],
                    instructions: [
                        'Step 1: Heat gingelly oil, temper fennel seeds, curry leaves, and small shallots.',
                        'Step 2: Add chicken, turmeric, salt, and freshly ground black pepper powder.',
                        'Step 3: Sauté on medium flame until chicken releases juices and turns dark brown.',
                        'Step 4: Cook dry or with slight gravy for 15 minutes.',
                        'Step 5: Serve hot with steamed rice or parotta!'
                    ]
                },
                {
                    id: 'c5',
                    title: 'Andhra Kodi Kura (Spicy Spicy Chicken Curry)',
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
                    ingredients: ['500g Chicken', '2 tbsp Guntur Red Chilli Powder', '1 tbsp Poppy seeds (Gasa Gasa paste)', '1 Coconut slice (grated)', 'Ghee & Curry Leaves'],
                    instructions: [
                        'Step 1: Make a paste of poppy seeds, coconut, and roasted spices.',
                        'Step 2: Sauté onions, green chillies, and ginger-garlic paste in ghee.',
                        'Step 3: Add chicken, Guntur red chilli powder, and poppy paste.',
                        'Step 4: Cook until chicken is tender and oil floats on top.',
                        'Step 5: Serve spicy Kodi Kura with steamed rice or ragi mudde!'
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
                    ingredients: ['250g Paneer cubes', '2 Tomatoes (pureed)', '1 Onion (chopped)', '1 tbsp Butter', '2 tbsp Heavy Cream', '1 tsp Kasuri Methi', '1 tsp Garam Masala'],
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

        // 4. DOSA / TIFFIN VARIETIES
        if (qLower.includes('dosa') || qLower.includes('dosai')) {
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

        // 5. DAL / LENTIL VARIETIES
        if (qLower.includes('dal') || qLower.includes('daal') || qLower.includes('lentil') || qLower.includes('pappu')) {
            return [
                {
                    id: 'dl1',
                    title: 'Punjabi Dal Tadka (Dhaba Style)',
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
                    ingredients: ['1 cup Toor Dal (Pigeon Peas)', '2 tbsp Desi Ghee', '1 tsp Cumin Seeds', '4 Garlic cloves (chopped)', '2 Whole Dry Red Chillies', '1 Pinch Hing (Asafoetida)', '1 Tomato'],
                    instructions: [
                        'Step 1: Pressure cook 1 cup Toor Dal with turmeric, salt, and water for 4 whistles until soft.',
                        'Step 2: Heat ghee in a pan, sauté chopped onions, ginger, and tomatoes until soft; mix into cooked dal.',
                        'Step 3: For authentic Tadka: heat 1 tbsp ghee in a small pan, add cumin seeds, hing, chopped garlic, and dry red chillies.',
                        'Step 4: Pour the sizzling tadka over the dal and cover with lid immediately to trap aromas.',
                        'Step 5: Garnish with fresh cilantro and serve hot with jeera rice!'
                    ]
                },
                {
                    id: 'dl2',
                    title: 'Dal Makhani (Velvet Slow-Cooked Black Dal)',
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
                    ingredients: ['1 cup Whole Black Urad Dal', '¼ cup Rajma (Kidney beans)', '3 tbsp Butter', '2 tbsp Fresh Cream', '1 cup Tomato Puree', '1 tsp Kashmiri Chilli', 'Kasuri Methi'],
                    instructions: [
                        'Step 1: Soak black urad dal and rajma overnight; pressure cook for 7-8 whistles until ultra soft.',
                        'Step 2: Mash lentils slightly with a whisk or back of a spoon.',
                        'Step 3: Heat butter in a pot, cook tomato puree with ginger-garlic paste and Kashmiri chilli powder.',
                        'Step 4: Add cooked lentils and simmer on low flame for 45 minutes, adding butter and water as needed.',
                        'Step 5: Swirl in heavy cream, crushed Kasuri Methi, and serve rich Dal Makhani with butter naan!'
                    ]
                },
                {
                    id: 'dl3',
                    title: 'Bengali Cholar Dal with Coconut',
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
                    ingredients: ['1 cup Chana Dal (Bengal Gram)', '¼ cup Fresh Coconut (fried bits)', '1 tsp Cumin seeds', '2 Bay Leaves', '1 Cinnamon stick', '1 tbsp Ghee', '1 tsp Sugar'],
                    instructions: [
                        'Step 1: Pressure cook Chana Dal with turmeric and salt until cooked but holding shape.',
                        'Step 2: Shallow fry small coconut pieces in ghee until golden brown; set aside.',
                        'Step 3: Temper cumin seeds, bay leaves, cinnamon, and cloves in ghee.',
                        'Step 4: Pour in cooked dal, add fried coconut bits, ginger paste, and sugar for characteristic Bengali sweetness.',
                        'Step 5: Simmer for 8 minutes and serve hot with fluffy Luchi (Puri)!'
                    ]
                },
                {
                    id: 'dl4',
                    title: 'Andhra Tomato Pappu (Tangy Lentils)',
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
                    ingredients: ['1 cup Toor Dal', '3 Tomatoes (chopped)', '3 Green Chillies', '1 tsp Mustard Seeds', '1 tsp Cumin', '2 sprigs Curry Leaves', '2 tbsp Ghee'],
                    instructions: [
                        'Step 1: Pressure cook Toor Dal together with tomatoes, green chillies, and turmeric for 4 whistles.',
                        'Step 2: Mash cooked dal and tomatoes smoothly with a wooden masher.',
                        'Step 3: Heat ghee in a vessel, add mustard seeds, cumin seeds, garlic, and fresh curry leaves.',
                        'Step 4: Pour the popping temper into the mashed dal and bring to a simmer.',
                        'Step 5: Serve hot with steamed rice and a spoonful of ghee!'
                    ]
                }
            ];
        }

        // UNIVERSAL DYNAMIC VARIETY ENGINE FOR ANY INDIAN DISH QUERY (`[Dish]`)
        return [
            {
                id: `ind_var_1_${Date.now()}`,
                title: `Punjabi Dhaba-Style ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`500g Primary ingredient for ${titleCase}`, '2 Onions (chopped)', '2 Tomatoes (pureed)', '1 tbsp Ginger-Garlic Paste', '1 tbsp Desi Ghee', '1 tsp Punjabi Garam Masala', '1 tsp Kasuri Methi'],
                instructions: [
                    `Step 1: Heat 1 tbsp desi ghee in a heavy kadhai and sauté onions until golden brown.`,
                    'Step 2: Add ginger-garlic paste, tomato puree, red chilli powder, turmeric, and coriander powder.',
                    'Step 3: Cook masala on medium flame for 7 minutes until oil separates from sides.',
                    `Step 4: Add ${titleCase} components into the rich masala gravy with 1 cup warm water.`,
                    'Step 5: Simmer for 12 minutes, finish with crushed Kasuri Methi, and serve hot with tandoori roti!'
                ]
            },
            {
                id: `ind_var_2_${Date.now()}`,
                title: `South Indian Chettinad Spiced ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Main ingredient for ${titleCase}`, '2 tbsp Chettinad Masala (Fennel, Black Pepper, Star Anise)', '10 Small Shallots', '2 sprigs Curry Leaves', '2 tbsp Gingelly / Coconut Oil'],
                instructions: [
                    'Step 1: Dry roast fennel seeds, peppercorns, coriander seeds, and dry red chillies; grind into fresh Chettinad spice powder.',
                    'Step 2: Heat coconut oil in a pan, temper mustard seeds, curry leaves, and small shallots.',
                    `Step 3: Toss in ${titleCase} with fresh Chettinad masala powder and turmeric.`,
                    'Step 4: Roast on low flame until rich black-brown spices coat every piece.',
                    'Step 5: Garnish with fresh curry leaves and serve hot with steamed rice or dosa!'
                ]
            },
            {
                id: `ind_var_3_${Date.now()}`,
                title: `Hyderabadi Royal Dum ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Selected ${titleCase}`, '1 cup Fried Golden Onions (Birista)', '1 cup Whisked Curd', '1 tbsp Mint Leaves', '1 tsp Shahi Jeera', 'Saffron Milk & Ghee'],
                instructions: [
                    `Step 1: Marinate ${titleCase} with curd, ginger-garlic paste, mint, fried onions, and Shahi biryani masala for 30 minutes.`,
                    'Step 2: Place marinated mixture in a heavy copper handi.',
                    'Step 3: Drizzle pure ghee and saffron infused milk over the top.',
                    'Step 4: Seal handi with dough and cook on slow dum heat for 20 minutes.',
                    'Step 5: Unseal and serve hot for a royal Hyderabadi feast!'
                ]
            },
            {
                id: `ind_var_4_${Date.now()}`,
                title: `Mughlai Shahi Creamy ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Fresh ${titleCase}`, '10 Cashews (ground to paste)', '2 tbsp Heavy Cream', '1 tbsp Ghee', 'Whole Cardamom & Cloves', 'Saffron strands'],
                instructions: [
                    'Step 1: Melt ghee in a pan and temper green cardamom, cloves, and bay leaf.',
                    'Step 2: Add smooth cashew paste, boiled onion paste, and white pepper powder.',
                    `Step 3: Fold in ${titleCase} and cook gently on low flame.`,
                    'Step 4: Swirl in heavy fresh cream and saffron milk.',
                    'Step 5: Garnish with slivered almonds and serve warm with garlic butter naan!'
                ]
            },
            {
                id: `ind_var_5_${Date.now()}`,
                title: `Crispy Street-Style Tawa Fry ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Portioned ${titleCase}`, '1 tbsp Rice Flour', '1 tbsp Cornflour', '1 tsp Chaat Masala', '1 Lemon', 'Oil for frying'],
                instructions: [
                    `Step 1: Coat ${titleCase} thoroughly with rice flour, cornflour, red chilli powder, salt, and lemon juice.`,
                    'Step 2: Heat 2 tbsp oil on a flat iron tawa.',
                    `Step 3: Shallow fry ${titleCase} on medium heat until outer crust turns golden and crispy.`,
                    'Step 4: Flip halfway and sprinkle chaat masala.',
                    'Step 5: Serve sizzling hot with green mint chutney and lemon wedges!'
                ]
            },
            {
                id: `ind_var_6_${Date.now()}`,
                title: `Rajasthani Spiced Kadai ${titleCase}`,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                ingredients: [`Prepared ${titleCase}`, '2 Mathania Dry Red Chillies', '1 tsp Coriander Seeds', '1 tbsp Ghee', '1 tsp Amchur (Dry Mango Powder)', 'Coriander'],
                instructions: [
                    'Step 1: Heat ghee in a kadai and add whole dry Mathania red chillies and crushed coriander seeds.',
                    `Step 2: Add ${titleCase} and sauté on high heat until aromatic.`,
                    'Step 3: Add tomato gravy, amchur powder, and salt.',
                    'Step 4: Cook until gravy thickens and coats the dish.',
                    'Step 5: Serve hot with bajra roti or missi roti!'
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
                        placeholder="Search dish (e.g., Biryani, Chicken, Paneer, Dosa, Dal, Fish...)"
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

                                <Text style={styles.popupSectionHeadingTitle}>🍳 Step-by-Step Cooking Instructions</Text>
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
