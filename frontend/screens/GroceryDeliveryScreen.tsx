import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Platform, Linking
} from 'react-native';

interface GroceryDeliveryScreenProps {
  onBack: () => void;
  initialItem?: string;
}

export default function GroceryDeliveryScreen({ onBack, initialItem = '' }: GroceryDeliveryScreenProps) {
  const [searchItem, setSearchItem] = useState(initialItem);

  const popularIngredients = [
    { name: 'Fresh Chicken', emoji: '🍗' },
    { name: 'Paneer', emoji: '🧀' },
    { name: 'Red Tomatoes', emoji: '🍅' },
    { name: 'Whole Milk', emoji: '🥛' },
    { name: 'Fresh Eggs', emoji: '🥚' },
    { name: 'Cow Ghee', emoji: '🧈' },
    { name: 'Red Onions', emoji: '🧅' },
    { name: 'Fresh Garlic Cloves', emoji: '🧄' },
    { name: 'Basmati Rice', emoji: '🍚' },
    { name: 'Ragi Flour', emoji: '🌾' },
    { name: 'Amul Butter', emoji: '🧈' },
    { name: 'Fresh Mint & Coriander', emoji: '🌿' },
  ];

  const stores = [
    {
      id: 'blinkit',
      name: 'Blinkit',
      speed: '⚡ 10 MINS',
      tagline: 'Instant Grocery & Fresh Produce',
      accentColor: '#FACC15',
      badgeBg: 'rgba(250, 204, 21, 0.15)',
      cardBg: '#131924',
      borderColor: 'rgba(250, 204, 21, 0.4)',
      icon: '🟡',
      description: 'Opens Blinkit directly with your selected ingredient pre-searched.',
      getUrl: (query: string) => `https://blinkit.com/s/?q=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'zepto',
      name: 'Zepto',
      speed: '🚀 10 MINS',
      tagline: 'Superfast Grocery Delivery',
      accentColor: '#C084FC',
      badgeBg: 'rgba(192, 132, 252, 0.15)',
      cardBg: '#18122B',
      borderColor: 'rgba(192, 132, 252, 0.4)',
      icon: '🟣',
      description: 'Opens Zepto app or website directly with item pre-filled.',
      getUrl: (query: string) => `https://www.zeptonow.com/search?query=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'bigbasket',
      name: 'BigBasket',
      speed: '🥬 FRESH & PANTRY',
      tagline: 'Farm-Fresh Veggies & Daily Staples',
      accentColor: '#34D399',
      badgeBg: 'rgba(52, 211, 153, 0.15)',
      cardBg: '#0F231C',
      borderColor: 'rgba(52, 211, 153, 0.4)',
      icon: '🟢',
      description: 'Opens BigBasket website with fresh items pre-searched.',
      getUrl: (query: string) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'instamart',
      name: 'Swiggy Instamart',
      speed: '⚡ 10-15 MINS',
      tagline: 'Instant Doorstep Delivery',
      accentColor: '#FB923C',
      badgeBg: 'rgba(251, 146, 60, 0.15)',
      cardBg: '#231510',
      borderColor: 'rgba(251, 146, 60, 0.4)',
      icon: '🟠',
      description: 'Opens Swiggy Instamart directly for 10-minute grocery delivery.',
      getUrl: (query: string) => `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'amazon',
      name: 'Amazon Fresh',
      speed: '🟧 SAME DAY',
      tagline: 'Pantry, Milk & Daily Grocery Essentials',
      accentColor: '#FBBF24',
      badgeBg: 'rgba(251, 191, 36, 0.15)',
      cardBg: '#1C1917',
      borderColor: 'rgba(251, 191, 36, 0.4)',
      icon: '🟧',
      description: 'Opens Amazon Fresh directly with your item pre-searched.',
      getUrl: (query: string) => `https://www.amazon.in/s?k=${encodeURIComponent(query || 'Groceries')}+grocery`
    }
  ];

  const handleOpenStoreWebsite = (store: typeof stores[0], targetItemName?: string) => {
    const query = (targetItemName || searchItem).trim() || 'Groceries';
    const targetUrl = store.getUrl(query);
    if (Platform.OS === 'web') {
      window.open(targetUrl, '_blank');
    } else {
      Linking.openURL(targetUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F17" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnTxt}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBadge}>🛒 10-MIN INSTANT GROCERY HUB</Text>
          <Text style={styles.headerTitle}>Direct Grocery Launcher</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIconBadge}>
            <Text style={{ fontSize: 24 }}>⚡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Order Ingredients in 10 Minutes</Text>
            <Text style={styles.bannerSub}>
              Select any missing ingredient or type what you need. Tap a delivery store below to jump straight to their app with your search pre-filled!
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Type ingredient to buy (e.g., Paneer, Chicken, Tomatoes)..."
            placeholderTextColor="#64748B"
            value={searchItem}
            onChangeText={setSearchItem}
          />
          {searchItem.length > 0 && (
            <TouchableOpacity onPress={() => setSearchItem('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnTxt}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Select Ingredient Cards */}
        <Text style={styles.sectionHeading}>Tap Ingredient to Select</Text>
        <View style={styles.chipsGrid}>
          {popularIngredients.map((item) => {
            const isSelected = searchItem.toLowerCase() === item.name.toLowerCase();
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.chipCard, isSelected && styles.chipCardActive]}
                onPress={() => setSearchItem(isSelected ? '' : item.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.chipEmoji}>{item.emoji}</Text>
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Official Delivery Apps / Websites List */}
        <Text style={styles.sectionHeading}>
          Launch Store App {searchItem ? `for "${searchItem}"` : ''}
        </Text>

        <View style={styles.storeList}>
          {stores.map((store) => (
            <View
              key={store.id}
              style={[styles.storeCard, { backgroundColor: store.cardBg, borderColor: store.borderColor }]}
            >
              <View style={styles.storeTopRow}>
                <View style={styles.storeBrandRow}>
                  <Text style={styles.storeIcon}>{store.icon}</Text>
                  <View>
                    <Text style={[styles.storeName, { color: store.accentColor }]}>{store.name}</Text>
                    <Text style={styles.storeTagline}>{store.tagline}</Text>
                  </View>
                </View>
                <View style={[styles.speedBadge, { backgroundColor: store.badgeBg, borderColor: store.accentColor + '44' }]}>
                  <Text style={[styles.speedBadgeTxt, { color: store.accentColor }]}>{store.speed}</Text>
                </View>
              </View>

              <Text style={styles.storeDesc}>{store.description}</Text>

              <TouchableOpacity
                style={[styles.openWebsiteBtn, { backgroundColor: store.accentColor }]}
                onPress={() => handleOpenStoreWebsite(store)}
                activeOpacity={0.85}
              >
                <Text style={styles.openWebsiteBtnTxt}>
                  {searchItem ? `Open ${store.name} for "${searchItem}" ↗` : `Open ${store.name} Store Directly ↗`}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#1E293B' },
  backBtnTxt: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  headerCenter: { alignItems: 'center' },
  headerBadge: { color: '#38BDF8', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  headerTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 60 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131C2E',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bannerIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  bannerSub: { color: '#94A3B8', fontSize: 12.5, lineHeight: 18 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131C2E',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginBottom: 20,
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, color: '#F8FAFC', fontSize: 15, fontWeight: '500' },
  clearBtn: { padding: 6 },
  clearBtnTxt: { color: '#94A3B8', fontSize: 16, fontWeight: '800' },

  sectionHeading: { color: '#E2E8F0', fontSize: 15, fontWeight: '800', marginBottom: 14 },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 26 },
  chipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131C2E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  chipCardActive: { backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38BDF8' },
  chipEmoji: { fontSize: 16, marginRight: 6 },
  chipText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#38BDF8', fontWeight: '800' },

  storeList: { gap: 18 },
  storeCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  storeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  storeBrandRow: { flexDirection: 'row', alignItems: 'center' },
  storeIcon: { fontSize: 28, marginRight: 12 },
  storeName: { fontSize: 20, fontWeight: '900', marginBottom: 2 },
  storeTagline: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  speedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  speedBadgeTxt: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  storeDesc: { color: '#CBD5E1', fontSize: 13, lineHeight: 19, marginBottom: 16 },

  openWebsiteBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  openWebsiteBtnTxt: { color: '#0F172A', fontSize: 14, fontWeight: '900', letterSpacing: 0.3 }
});
