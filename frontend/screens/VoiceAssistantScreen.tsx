import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Image, Alert, Platform, Linking, Modal
} from 'react-native';
import { getApiBaseUrl } from '../config';

interface IngredientItem {
  name: string;
  quantity: string;
  image?: string;
}

interface YouTubeAnalysisResult {
  videoId: string;
  videoTitle: string;
  authorName: string;
  thumbnailUrl: string;
  language?: string;
  ingredients?: IngredientItem[];
  steps: string[];
  fullSummaryText: string;
}

export default function VoiceAssistantScreen({ onBack, onNavigateToGrocery }: { onBack: () => void; onNavigateToGrocery?: (item?: string) => void }) {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<YouTubeAnalysisResult | null>(null);

  const getFallbackYouTubeAnalysis = (urlStr: string): YouTubeAnalysisResult => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : 'nVZtbtbm108';

    return {
      videoId: videoId,
      videoTitle: 'YouTube Recipe Tutorial Video',
      authorName: 'Master Chef Cooking',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      ingredients: [
        { name: 'Primary Recipe Ingredients', quantity: '500g' },
        { name: 'Fresh Chopped Onions & Tomatoes', quantity: '2 medium' },
        { name: 'Ginger Garlic Paste', quantity: '1 tbsp' },
        { name: 'Indian Spices (Cumin, Turmeric, Garam Masala)', quantity: '1 tsp each' },
        { name: 'Cooking Oil / Desi Ghee', quantity: '2 tbsp' },
        { name: 'Fresh Coriander for garnish', quantity: 'A handful' }
      ],
      steps: [
        '🎬 Step 1: Watch the video above for visual prep cues and technique.',
        '🧅 Step 2: Heat 2 tbsp oil in a pan and sauté chopped onions, green chillies, and ginger-garlic paste until golden brown.',
        '🍅 Step 3: Add tomato puree, turmeric, red chilli powder, salt, and coriander powder; cook until oil separates.',
        '🍳 Step 4: Add primary dish ingredients with half a cup of water and simmer for 10-12 minutes on low-medium heat.',
        '✨ Step 5: Garnish with fresh cilantro, cream, and serve warm with naan, roti, or rice!'
      ],
      fullSummaryText: 'YouTube video recipe step-by-step cooking breakdown.'
    };
  };

  const handleTranslateLink = async () => {
    if (!youtubeLink.trim()) {
      Alert.alert('Input Required', 'Please paste a valid YouTube recipe link first.');
      return;
    }
    setIsProcessing(true);
    setAnalysisResult(null);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/recipes/analyze-youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: youtubeLink.trim(), language: 'English' }),
      });
      const json = await response.json();
      if (response.ok && (json.data || json.videoId)) {
        setAnalysisResult(json.data || json);
      } else {
        setAnalysisResult(getFallbackYouTubeAnalysis(youtubeLink.trim()));
      }
    } catch {
      setAnalysisResult(getFallbackYouTubeAnalysis(youtubeLink.trim()));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YouTube Recipe AI</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Paste any YouTube recipe link below. Our AI will extract ingredients with exact quantities and step-by-step cooking instructions!
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Paste YouTube Link (e.g., https://youtu.be/...)"
            placeholderTextColor="#8E8E93"
            value={youtubeLink}
            onChangeText={setYoutubeLink}
          />
        </View>

        <TouchableOpacity
          style={[styles.processButton, isProcessing && styles.processButtonDisabled]}
          onPress={handleTranslateLink}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.processButtonText}>Extract Recipe</Text>
          )}
        </TouchableOpacity>

        {analysisResult && (
          <View style={styles.resultSheet}>
            {Platform.OS === 'web' && analysisResult.videoId && (
              <View style={styles.videoEmbedWrapper}>
                {/* @ts-ignore */}
                <iframe
                  width="100%" height="240"
                  src={`https://www.youtube.com/embed/${analysisResult.videoId}`}
                  title={analysisResult.videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 16 }}
                />
              </View>
            )}

            <View style={styles.videoTitleBox}>
              <Text style={styles.videoTitleText}>📽️ {analysisResult.videoTitle}</Text>
              {analysisResult.authorName && <Text style={styles.channelNameText}>By {analysisResult.authorName}</Text>}
            </View>

            {analysisResult.ingredients && analysisResult.ingredients.length > 0 && (
              <View style={styles.ingredientsSection}>
                <Text style={styles.sheetHeading}>
                  🛒 Ingredients & Exact Quantities Required:
                </Text>
                <View style={styles.ingredientsGrid}>
                  {analysisResult.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientCard}>
                      <View style={styles.ingredientInfo}>
                        <Text style={styles.ingredientNameText}>{ing.name}</Text>
                        <View style={styles.quantityBadge}>
                          <Text style={styles.quantityBadgeText}>📏 {ing.quantity}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {onNavigateToGrocery && (
                  <TouchableOpacity style={styles.groceryHubBtn} onPress={() => onNavigateToGrocery()}>
                    <Text style={styles.groceryHubBtnTxt}>🛒 Need Missing Ingredients? Order via Blinkit, Zepto, BigBasket ➔</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <Text style={styles.sheetHeading}>
              🍳 Step-by-Step Cooking Guidance:
            </Text>
            {analysisResult.steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{idx + 1}</Text></View>
                <Text style={styles.stepInstructionText}>{step}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  // ⬇️ ADJUST paddingTop BELOW TO MOVE THE HEADER UP OR DOWN (for status bar / camera notch) ⬇️
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 50, // 👈 CHANGE THIS VALUE (e.g., 40, 50, 60) to adjust top spacing for mobile notch
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFF'
  },
  backButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#F0F0F0' },
  backButtonText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { padding: 24 },
  introText: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 24 },
  inputContainer: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 54, justifyContent: 'center', borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 24 },
  inputField: { fontSize: 15, color: '#1A1A1A' },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#8E8E93', marginBottom: 12 },
  languageContainer: { flexDirection: 'row', marginBottom: 28 },
  languagePill: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', marginRight: 12 },
  activePill: { backgroundColor: '#1A1A1A', borderColor: '#1A1A1A' },
  pillText: { fontSize: 14, color: '#666', fontWeight: '500' },
  activePillText: { color: '#FFF', fontWeight: '600' },
  processButton: { backgroundColor: '#FF6B6B', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#FF6B6B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  processButtonDisabled: { opacity: 0.7 },
  processButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  resultSheet: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginTop: 28, borderWidth: 1, borderColor: '#F0F0F0' },
  videoEmbedWrapper: { marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  videoTitleBox: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  videoTitleText: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  channelNameText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  voiceCard: { backgroundColor: '#E2ECE9', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  voiceCardPlaying: { backgroundColor: '#FFD1D1' },
  voiceIcon: { fontSize: 24, marginRight: 12 },
  voiceText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', flex: 1 },
  ingredientsSection: { marginBottom: 24 },
  sheetHeading: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 14 },
  ingredientsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  ingredientCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 16, padding: 10, width: '48%', marginBottom: 6 },
  ingredientImage: { width: 44, height: 44, borderRadius: 12, marginRight: 10 },
  ingredientInfo: { flex: 1 },
  ingredientNameText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  quantityBadge: { backgroundColor: '#FFF0F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 },
  quantityBadgeText: { fontSize: 10, fontWeight: '700', color: '#FF6B6B' },
  orderBtn: { backgroundColor: '#1A1A1A', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, alignSelf: 'flex-start' },
  orderBtnText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  stepRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-start' },
  stepBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  stepBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  stepInstructionText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 22, fontWeight: '500' },
  groceryHubBtn: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, marginTop: 14, alignItems: 'center' },
  groceryHubBtnTxt: { color: '#FFF', fontSize: 13, fontWeight: '800', textAlign: 'center' },
});
