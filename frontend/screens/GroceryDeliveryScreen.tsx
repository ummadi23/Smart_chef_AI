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
    { name: 'Garlic Cloves', emoji: '🧄' },
    { name: 'Basmati Rice', emoji: '🍚' },
    { name: 'Ragi Flour', emoji: '🌾' },
    { name: 'Amul Butter', emoji: '🧈' },
    { name: 'Mint & Coriander', emoji: '🌿' },
  ];

  const stores = [
    {
      id: 'blinkit',
      name: 'Blinkit',
      speed: '⚡ 10 MINS',
      tagline: 'Instant Grocery & Fresh Produce',
      brandColor: '#EAB308',
      buttonBg: '#EAB308',
      buttonText: '#1E1B4B',
      badgeBg: '#FEF9C3',
      badgeText: '#854D0E',
      icon: '🟡',
      description: 'Opens Blinkit directly with your selected ingredient pre-searched.',
      getUrl: (query: string) => `https://blinkit.com/s/?q=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'zepto',
      name: 'Zepto',
      speed: '🚀 10 MINS',
      tagline: 'Superfast Grocery Delivery',
      brandColor: '#9333EA',
      buttonBg: '#9333EA',
      buttonText: '#FFFFFF',
      badgeBg: '#F3E8FF',
      badgeText: '#6B21A8',
      icon: '🟣',
      description: 'Opens Zepto app or website directly with item pre-filled.',
      getUrl: (query: string) => `https://www.zeptonow.com/search?query=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'bigbasket',
      name: 'BigBasket',
      speed: '🥬 FRESH & PANTRY',
      tagline: 'Farm-Fresh Veggies & Daily Staples',
      brandColor: '#059669',
      buttonBg: '#059669',
      buttonText: '#FFFFFF',
      badgeBg: '#D1FAE5',
      badgeText: '#065F46',
      icon: '🟢',
      description: 'Opens BigBasket website with fresh items pre-searched.',
      getUrl: (query: string) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'instamart',
      name: 'Swiggy Instamart',
      speed: '⚡ 10-15 MINS',
      tagline: 'Instant Doorstep Delivery',
      brandColor: '#EA580C',
      buttonBg: '#EA580C',
      buttonText: '#FFFFFF',
      badgeBg: '#FFEDD5',
      badgeText: '#9A3412',
      icon: '🟠',
      description: 'Opens Swiggy Instamart directly for 10-minute grocery delivery.',
      getUrl: (query: string) => `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'amazon',
      name: 'Amazon Fresh',
      speed: '🟧 SAME DAY',
      tagline: 'Pantry, Milk & Daily Grocery Essentials',
      brandColor: '#D97706',
      buttonBg: '#D97706',
      buttonText: '#FFFFFF',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnTxt}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBadge}>🛒 10-MIN INSTANT EXPRESS</Text>
          <Text style={styles.headerTitle}>Grocery Store Launcher</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Elegant Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadgeIcon}>
            <Text style={{ fontSize: 24 }}>⚡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Direct Store Express Launcher</Text>
            <Text style={styles.heroSub}>
              Type or select missing ingredients below. Tap any official store to launch their app instantly with your search pre-loaded.
            </Text>
          </View>
        </View>

        {/* Elegant Search Input */}
        <View style={styles.searchBox}>
          <Text style={styles.searchLens}>🔍</Text>
          <TextInput
            style={styles.searchInputField}
            placeholder="Type ingredient to buy (e.g. Paneer, Chicken, Tomatoes)..."
            placeholderTextColor="#94A3B8"
            value={searchItem}
            onChangeText={setSearchItem}
          />
          {searchItem.length > 0 && (
            <TouchableOpacity onPress={() => setSearchItem('')} style={styles.clearSearchBtn}>
              <Text style={styles.clearSearchTxt}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Ingredient Picker Chips */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Tap Ingredient to Pre-fill</Text>
          {searchItem ? (
            <TouchableOpacity onPress={() => setSearchItem('')}>
              <Text style={styles.resetLinkTxt}>Clear Selection</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.chipsContainer}>
          {popularIngredients.map((item) => {
            const isSelected = searchItem.toLowerCase() === item.name.toLowerCase();
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.chipItem, isSelected && styles.chipItemActive]}
                onPress={() => setSearchItem(isSelected ? '' : item.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.chipEmojiTxt}>{item.emoji}</Text>
                <Text style={[styles.chipLabelTxt, isSelected && styles.chipLabelActive]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Store Cards Grid / List */}
        <Text style={styles.sectionTitle}>
          Select Grocery App to Launch {searchItem ? `for "${searchItem}"` : ''}
        </Text>

        <View style={styles.storeCardsList}>
          {stores.map((store) => (
            <View key={store.id} style={styles.storeCardWrapper}>
              <View style={styles.storeCardTop}>
                <View style={styles.storeLogoTitleGroup}>
                  <Text style={styles.storeIconEmoji}>{store.icon}</Text>
                  <View>
                    <Text style={[styles.storeBrandTitle, { color: '#1E293B' }]}>{store.name}</Text>
                    <Text style={styles.storeTaglineTxt}>{store.tagline}</Text>
                  </View>
                </View>
                <View style={[styles.speedTagBadge, { backgroundColor: store.badgeBg }]}>
                  <Text style={[styles.speedTagTxt, { color: store.badgeText }]}>{store.speed}</Text>
                </View>
              </View>

              <Text style={styles.storeCardDescTxt}>{store.description}</Text>

              <TouchableOpacity
                style={[styles.launchAppButton, { backgroundColor: store.buttonBg }]}
                onPress={() => handleOpenStoreWebsite(store)}
                activeOpacity={0.88}
              >
                <Text style={[styles.launchAppBtnTxt, { color: store.buttonText }]}>
                  {searchItem ? `Launch ${store.name} for "${searchItem}" ↗` : `Launch ${store.name} Store ↗`}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#F1F5F9' },
  backBtnTxt: { color: '#334155', fontSize: 14, fontWeight: '700' },
  headerCenter: { alignItems: 'center' },
  headerBadge: { color: '#059669', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  headerTitle: { color: '#0F172A', fontSize: 17, fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 60 },

  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  heroBadgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  heroTitle: { color: '#0F172A', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  heroSub: { color: '#64748B', fontSize: 12.5, lineHeight: 18 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#10B981',
    marginBottom: 22,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchLens: { fontSize: 18, marginRight: 10 },
  searchInputField: { flex: 1, color: '#0F172A', fontSize: 15, fontWeight: '600' },
  clearSearchBtn: { padding: 6 },
  clearSearchTxt: { color: '#94A3B8', fontSize: 16, fontWeight: '800' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#1E293B', fontSize: 15, fontWeight: '800', marginBottom: 14 },
  resetLinkTxt: { color: '#10B981', fontSize: 13, fontWeight: '700' },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 26 },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  chipItemActive: { backgroundColor: '#10B981', borderColor: '#059669' },
  chipEmojiTxt: { fontSize: 16, marginRight: 6 },
  chipLabelTxt: { color: '#475569', fontSize: 13, fontWeight: '600' },
  chipLabelActive: { color: '#FFFFFF', fontWeight: '800' },

  storeCardsList: { gap: 18 },
  storeCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },
  storeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  storeLogoTitleGroup: { flexDirection: 'row', alignItems: 'center' },
  storeIconEmoji: { fontSize: 28, marginRight: 12 },
  storeBrandTitle: { fontSize: 19, fontWeight: '800', marginBottom: 2 },
  storeTaglineTxt: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  speedTagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  speedTagTxt: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  storeCardDescTxt: { color: '#475569', fontSize: 13, lineHeight: 19, marginBottom: 16 },

  launchAppButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  launchAppBtnTxt: { fontSize: 14, fontWeight: '800', letterSpacing: 0.3 }
});
