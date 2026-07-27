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

function OrderSheet({
  ingredient,
  isTelugu,
  onClose,
}: {
  ingredient: IngredientItem;
  isTelugu: boolean;
  onClose: () => void;
}) {
  const rawName = ingredient.name;
  const englishName = rawName.includes('(')
    ? rawName.slice(rawName.lastIndexOf('(') + 1, rawName.lastIndexOf(')'))
    : rawName;
  const searchQuery = encodeURIComponent(englishName.trim());

  const stores = [
    { name: 'Blinkit', icon: 'BLINKIT', color: '#FCE83A', bg: '#1A1A1A', url: `https://blinkit.com/s/?q=${searchQuery}` },
    { name: 'BigBasket', icon: 'BIGBASKET', color: '#FFFFFF', bg: '#84C225', url: `https://www.bigbasket.com/ps/?q=${searchQuery}` },
    { name: 'Zepto', icon: 'ZEPTO', color: '#FFFFFF', bg: '#8B5CF6', url: `https://www.zeptonow.com/search?query=${searchQuery}` },
    { name: 'Amazon Fresh', icon: 'AMAZON', color: '#FFFFFF', bg: '#FF9900', url: `https://www.amazon.in/s?k=${searchQuery}+grocery` },
  ];

  const openStore = (url: string) => {
    if (Platform.OS === 'web') { window.open(url, '_blank'); }
    else { Linking.openURL(url); }
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={orderStyles.overlay}>
        <View style={orderStyles.sheet}>
          <View style={orderStyles.handle} />
          <Text style={orderStyles.sheetTitle}>{isTelugu ? 'ఎక్కడ కొనాలి?' : 'Order Ingredient'}</Text>
          <Text style={orderStyles.sheetSub}>"{ingredient.name}" – {ingredient.quantity}</Text>
          {stores.map((store) => (
            <TouchableOpacity key={store.name} style={[orderStyles.storeBtn, { backgroundColor: store.bg }]} onPress={() => openStore(store.url)}>
              <View style={{ flex: 1 }}>
                <Text style={[orderStyles.storeName, { color: store.color }]}>{store.name}</Text>
                <Text style={[orderStyles.storeHint, { color: store.color }]}>{isTelugu ? 'నొక్కి ఆర్డర్ చేయండి' : 'Tap to order now'} →</Text>
              </View>
              <Text style={{ fontSize: 22, color: store.color }}>→</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={orderStyles.closeBtn} onPress={onClose}>
            <Text style={orderStyles.closeBtnText}>{isTelugu ? 'మూసివేయి' : 'Close'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function VoiceAssistantScreen({ onBack }: { onBack: () => void }) {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Telugu'>('English');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<YouTubeAnalysisResult | null>(null);
  const [orderIngredient, setOrderIngredient] = useState<IngredientItem | null>(null);

  const isTelugu = selectedLanguage === 'Telugu';

  const handleTranslateLink = async () => {
    if (!youtubeLink.trim()) {
      Alert.alert(
        isTelugu ? 'లింక్ అవసరం' : 'Input Required',
        isTelugu ? 'దయచేసి ముందు YouTube రెసిపీ లింక్ పేస్ట్ చేయండి.' : 'Please paste a valid YouTube recipe link first.'
      );
      return;
    }
    setIsProcessing(true);
    setAnalysisResult(null);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/recipes/analyze-youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: youtubeLink.trim(), language: selectedLanguage }),
      });
      const json = await response.json();
      if (response.ok && (json.data || json.videoId)) {
        setAnalysisResult(json.data || json);
      } else {
        alert(json.message || (isTelugu ? 'వీడియో విశ్లేషించడం సాధ్యం కాలేదు.' : 'Could not analyze YouTube video.'));
      }
    } catch {
      alert(isTelugu ? 'బ్యాకెండ్ సర్వర్కి కనెక్ట్ కాలేదు! (Port 5000)' : 'Cannot connect to backend server on port 5000!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {orderIngredient && (
        <OrderSheet ingredient={orderIngredient} isTelugu={isTelugu} onClose={() => setOrderIngredient(null)} />
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YouTube Recipe AI</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          {isTelugu
            ? 'ఏదైనా YouTube రెసిపీ లింక్ అతికించండి. మా AI ఆ వీడియో నుండి పదార్థాలు మరియు దశల వారీ వంట విధానాన్ని అందిస్తుంది!'
            : 'Paste any YouTube recipe link below. Our AI will extract ingredients with exact quantities and step-by-step cooking instructions!'}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder={isTelugu ? 'YouTube లింక్ పేస్ట్ చేయండి...' : 'Paste YouTube Link (e.g., https://youtu.be/...)'}
            placeholderTextColor="#8E8E93"
            value={youtubeLink}
            onChangeText={setYoutubeLink}
          />
        </View>

        <Text style={styles.sectionLabel}>{isTelugu ? 'భాష ఎంచుకోండి:' : 'Select Recipe Output Language:'}</Text>
        <View style={styles.languageContainer}>
          {(['English', 'Telugu'] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.languagePill, selectedLanguage === lang && styles.activePill]}
              onPress={() => setSelectedLanguage(lang)}
            >
              <Text style={[styles.pillText, selectedLanguage === lang && styles.activePillText]}>
                {lang === 'Telugu' ? 'తెలుగు (Telugu)' : 'English'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.processButton, isProcessing && styles.processButtonDisabled]}
          onPress={handleTranslateLink}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.processButtonText}>
              {isTelugu ? 'రెసిపీ తయారు చేయి' : 'Extract & Translate Recipe'}
            </Text>
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
                  🛒 {isTelugu ? 'కావలసిన పదార్థాలు & కొలతలు:' : 'Ingredients & Exact Quantities Required:'}
                </Text>
                <View style={styles.ingredientsGrid}>
                  {analysisResult.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientCard}>
                      <View style={styles.ingredientInfo}>
                        <Text style={styles.ingredientNameText}>{ing.name}</Text>
                        <View style={styles.quantityBadge}>
                          <Text style={styles.quantityBadgeText}>📏 {ing.quantity}</Text>
                        </View>
                        <TouchableOpacity style={styles.orderBtn} onPress={() => setOrderIngredient(ing)}>
                          <Text style={styles.orderBtnText}>
                            {isTelugu ? '🛍️ ఆర్డర్ చేయండి' : '🛍️ Not available? Order'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <Text style={styles.sheetHeading}>
              🍳 {isTelugu ? 'తయారీ విధానం (Step-by-Step Guide):' : 'Step-by-Step Cooking Guidance:'}
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
});

const orderStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 48 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  sheetSub: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  storeBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12 },
  storeName: { fontSize: 17, fontWeight: '800' },
  storeHint: { fontSize: 12, fontWeight: '500', marginTop: 2, opacity: 0.8 },
  closeBtn: { backgroundColor: '#F5F5F5', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
});
