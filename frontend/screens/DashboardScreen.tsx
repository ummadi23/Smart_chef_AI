import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  ActivityIndicator
} from 'react-native';
import { getApiBaseUrl } from '../config';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  userProfile: any;
  userPreferences: any;
  onNavigate: (screen: 'scan_landing' | 'scanner' | 'community' | 'voice' | 'health' | 'ayurveda' | 'recipes' | 'profile' | 'edit_preferences' | 'grocery') => void;
}

export default function DashboardScreen({
  userProfile,
  userPreferences,
  onNavigate
}: DashboardScreenProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  // Extract clean display name from user name or email address
  const getCleanDisplayName = () => {
    let raw = userProfile?.username || userProfile?.name || '';
    const emailStr = userProfile?.email || '';

    if (!raw || raw.includes('@')) {
      if (emailStr && emailStr.includes('@')) {
        raw = emailStr.split('@')[0];
      } else if (raw.includes('@')) {
        raw = raw.split('@')[0];
      }
    }
    if (!raw.trim()) return 'Chef';

    return raw
      .replace(/[._-]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const userName = getCleanDisplayName();
  const initial = userName.charAt(0).toUpperCase();

  const recommendedRecipes = [
    {
      id: '1',
      title: 'Creamy Spinach & Garlic Pasta',
      time: '15 mins',
      difficulty: 'Easy',
      calories: '420 kcal',
      dosha: 'Vata Balancing 🌀',
      bg: '#ECFDF5',
      accent: '#10B981',
      emoji: '🍝'
    },
    {
      id: '2',
      title: 'Cooling Mint & Cucumber Salad',
      time: '10 mins',
      difficulty: 'Quick',
      calories: '180 kcal',
      dosha: 'Pitta Cooling 🌿',
      bg: '#F0F9FF',
      accent: '#0284C7',
      emoji: '🥗'
    },
    {
      id: '3',
      title: 'Golden Turmeric Lentil Soup',
      time: '25 mins',
      difficulty: 'Medium',
      calories: '350 kcal',
      dosha: 'Kapha Warming 🍲',
      bg: '#FFFBEB',
      accent: '#D97706',
      emoji: '🥣'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.userNameText}>
                {userName === 'Smart Chef' ? 'Smart Chef' : (userName.toLowerCase().includes('chef') ? userName : `Chef ${userName}`)} ✨
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => onNavigate('profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>



        {/* 3. AI FRIDGE SCANNER HERO BANNER */}
        <TouchableOpacity
          style={styles.heroBanner}
          activeOpacity={0.9}
          onPress={() => onNavigate('scanner')}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🤖 AI INGREDIENT PHOTO VISION</Text>
            </View>
            <Text style={styles.heroTitle}>Snap your available ingredients</Text>
            <Text style={styles.heroSubtitle}>
              Place all your available ingredients together in one spot and snap a photo to get instant recipes.
            </Text>

            <View style={styles.heroCtaBtn}>
              <Text style={styles.heroCtaText}>📸 Snap Ingredients Photo</Text>
            </View>
          </View>
          <Text style={styles.heroBgEmoji}>🥑</Text>
        </TouchableOpacity>

        {/* GLOBAL RECIPE SEARCH BANNER CARD */}
        <TouchableOpacity 
          style={styles.heroBanner} 
          activeOpacity={0.9}
          onPress={() => onNavigate('recipes')}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🍲 GLOBAL CHEF VISION</Text>
            </View>
            <Text style={styles.heroTitle}>Search Global Recipes</Text>
            <Text style={styles.heroSubtitle}>
              Type any dish name to discover authentic ingredients and images.
            </Text>
            <View style={styles.heroCtaBtn}>
              <Text style={styles.heroCtaText}>Explore Recipes Now ➔</Text>
            </View>
          </View>
        </TouchableOpacity>



        {/* 5. BENTO GRID QUICK ACTION MODULES */}
        <Text style={styles.sectionHeading}>Smart Kitchen Modules</Text>

        <View style={styles.bentoGrid}>
          {/* Module 1: Ayurvedic Remedies */}
          <TouchableOpacity
            style={[styles.bentoCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}
            onPress={() => onNavigate('health')}
            activeOpacity={0.85}
          >
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoEmoji}>🌿</Text>
              <Text style={styles.bentoArrow}>›</Text>
            </View>
            <Text style={styles.bentoTitle}>Ayurvedic Remedies</Text>
            <Text style={styles.bentoSub}>Ancient Cures for Cough, Cold & Health</Text>
          </TouchableOpacity>

          {/* Module 2: Leftovers Rescue */}
          <TouchableOpacity
            style={[styles.bentoCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}
            onPress={() => onNavigate('health')}
            activeOpacity={0.85}
          >
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoEmoji}>♻️</Text>
              <Text style={styles.bentoArrow}>›</Text>
            </View>
            <Text style={styles.bentoTitle}>Leftovers Rescue</Text>
            <Text style={styles.bentoSub}>Zero Waste Meal Transformer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bentoGrid}>
          {/* Module 3: YouTube Recipe AI */}
          <TouchableOpacity
            style={[styles.bentoCard, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}
            onPress={() => onNavigate('voice')}
            activeOpacity={0.85}
          >
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoEmoji}>📹</Text>
              <Text style={styles.bentoArrow}>›</Text>
            </View>
            <Text style={styles.bentoTitle}>YouTube Recipe AI</Text>
            <Text style={styles.bentoSub}>Extract Ingredients & Steps from YouTube</Text>
          </TouchableOpacity>

          {/* Module 4: Community Feed */}
          <TouchableOpacity
            style={[styles.bentoCard, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}
            onPress={() => onNavigate('community')}
            activeOpacity={0.85}
          >
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoEmoji}>📸</Text>
              <Text style={styles.bentoArrow}>›</Text>
            </View>
            <Text style={styles.bentoTitle}>Chef Community</Text>
            <Text style={styles.bentoSub}>Trending Foodie Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* 6. GROCERY DELIVERY HUB BANNER */}
        <TouchableOpacity
          style={[styles.heroBanner, { backgroundColor: '#064E3B', borderColor: '#059669', marginTop: 10 }]}
          activeOpacity={0.9}
          onPress={() => onNavigate('grocery')}
        >
          <View style={styles.heroContent}>
            <View style={[styles.heroBadge, { backgroundColor: '#10B98122' }]}>
              <Text style={[styles.heroBadgeText, { color: '#34D399' }]}>🛒 INSTANT GROCERY STORE</Text>
            </View>
            <Text style={styles.heroTitle}>Purchase Missing Groceries</Text>
            <Text style={styles.heroSubtitle}>
              Order missing ingredients directly via Blinkit, Zepto, Swiggy Instamart, BigBasket & Amazon Fresh!
            </Text>
            <View style={[styles.heroCtaBtn, { backgroundColor: '#10B981' }]}>
              <Text style={[styles.heroCtaText, { color: '#FFF' }]}>Order Groceries Now ➔</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 7. PREFERENCES BANNER */}
        <TouchableOpacity
          style={styles.prefBanner}
          onPress={() => onNavigate('edit_preferences')}
          activeOpacity={0.85}
        >
          <View style={styles.prefLeft}>
            <Text style={styles.prefEmoji}>⚙️</Text>
            <View>
              <Text style={styles.prefTitle}>Kitchen Skill & Dietary Goals</Text>
              <Text style={styles.prefSub}>Tap to customize dietary preferences & goals</Text>
            </View>
          </View>
          <Text style={styles.prefArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>



      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <Modal visible={!!selectedRecipe} animationType="slide" transparent={true}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
                <TouchableOpacity onPress={() => setSelectedRecipe(null)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.badgeRow}>
                  <View style={styles.modalBadge}>
                    <Text style={styles.modalBadgeText}>🇮🇳 {selectedRecipe.cuisine || 'Indian'}</Text>
                  </View>
                  <View style={styles.modalBadge}>
                    <Text style={styles.modalBadgeText}>🏷️ {selectedRecipe.category || 'Main Course'}</Text>
                  </View>
                  <View style={styles.modalBadge}>
                    <Text style={styles.modalBadgeText}>⏱️ {selectedRecipe.prepTime || '20 mins'}</Text>
                  </View>
                </View>

                <Text style={styles.subHeading}>🛒 Ingredients Required</Text>
                {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ing: any, idx: number) => (
                  <Text key={idx} style={styles.ingredientItem}>
                    • {typeof ing === 'string' ? ing : (ing.name ? `${ing.name} ${ing.quantity ? `(${ing.quantity})` : ''}` : JSON.stringify(ing))}
                  </Text>
                ))}

                <Text style={styles.subHeading}>👨‍🍳 Step-by-Step Instructions</Text>
                {selectedRecipe.instructions && selectedRecipe.instructions.map((step: string, idx: number) => (
                  <View key={idx} style={styles.stepRow}>
                    <Text style={styles.stepNum}>{idx + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 44) + 16 : 56,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  streakBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  heroBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  heroContent: {
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: '#4ADE80',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  heroCtaBtn: {
    backgroundColor: '#4ADE80',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  heroCtaText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  heroBgEmoji: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    fontSize: 110,
    opacity: 0.25,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  metricEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  seeAllText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bentoEmoji: {
    fontSize: 26,
  },
  bentoArrow: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: 'bold',
  },
  bentoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  bentoSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 15,
  },
  carouselContainer: {
    gap: 14,
    paddingRight: 20,
    marginBottom: 24,
  },
  recipeCard: {
    width: 220,
    borderRadius: 20,
    padding: 18,
    justifyContent: 'space-between',
  },
  recipeEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  doshaTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  doshaTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 12,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  prefBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefEmoji: {
    fontSize: 22,
  },
  prefTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  prefSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  prefArrow: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  searchResultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchResultsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  noResultsBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  noResultsSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  searchResultCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  searchCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  searchCardCuisine: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  searchCardMeta: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 6,
  },
  tapToView: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  closeBtn: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#64748B',
    padding: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  modalBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 8,
  },
  ingredientItem: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});
