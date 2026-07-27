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

    const fetchRecipesData = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        try {
            const baseUrl = getApiBaseUrl();
            const response = await fetch(`${baseUrl}/api/recipes/search-recipes?dish=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setRecipesList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Connection error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.mainContainer}>
                <Text style={styles.appHeader}>🍲 Discover Global Recipes</Text>
                <Text style={styles.subHeader}>Search any dish to view ingredients and step-by-step cooking guide.</Text>

                <View style={styles.searchSection}>
                    <TextInput
                        placeholder="Search dish (e.g., Paneer Butter Masala, Tacos, Pasta...)"
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
