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
    { name: 'Fresh Fish', emoji: '🐟' },
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
      tagline: '⚡ 10-Min Instant Grocery Delivery',
      bg: '#1A1A1A',
      accent: '#FCE83A',
      icon: '🟡',
      description: 'Opens Blinkit directly with your searched ingredient pre-filled.',
      getUrl: (query: string) => `https://blinkit.com/s/?q=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'zepto',
      name: 'Zepto',
      tagline: '🟣 10-Min Superfast Grocery Delivery',
      bg: '#3B0764',
      accent: '#C084FC',
      icon: '🟣',
      description: 'Opens Zepto directly with your searched item pre-filled.',
      getUrl: (query: string) => `https://www.zeptonow.com/search?query=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'bigbasket',
      name: 'BigBasket',
      tagline: '🟢 Fresh Groceries, Vegetables & Pantry',
      bg: '#14532D',
      accent: '#4ADE80',
      icon: '🟢',
      description: 'Opens BigBasket website with fresh items pre-searched.',
      getUrl: (query: string) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'instamart',
      name: 'Swiggy Instamart',
      tagline: '🟠 10-15 Min Instant Delivery',
      bg: '#7C2D12',
      accent: '#FB923C',
      icon: '🟠',
      description: 'Opens Swiggy Instamart directly for 10-minute grocery delivery.',
      getUrl: (query: string) => `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(query || 'Groceries')}`
    },
    {
      id: 'amazon',
      name: 'Amazon Fresh',
      tagline: '🟧 Same Day Pantry & Groceries',
      bg: '#1E293B',
      accent: '#F59E0B',
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
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnTxt}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Direct Grocery Store Launcher</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Order Directly on Blinkit, Zepto & BigBasket</Text>
          <Text style={styles.bannerSub}>
            Type or tap any missing ingredient below. Tap any delivery app to move directly to their official website/app to complete your purchase!
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Type ingredient to buy (e.g. Chicken, Paneer, Tomatoes)..."
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
        <Text style={styles.sectionHeading}>Tap Ingredient to Order</Text>
        <View style={styles.chipsGrid}>
          {popularIngredients.map((item) => {
            const isSelected = searchItem.toLowerCase() === item.name.toLowerCase();
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.chipCard, isSelected && styles.chipCardActive]}
                onPress={() => setSearchItem(isSelected ? '' : item.name)}
              >
                <Text style={styles.chipEmoji}>{item.emoji}</Text>
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Official Delivery Apps / Websites List */}
        <Text style={styles.sectionHeading}>
          Select Delivery App to Open Directly {searchItem ? `for "${searchItem}"` : ''}
        </Text>

        <View style={styles.storeList}>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[styles.storeCard, { backgroundColor: store.bg, borderColor: store.accent + '66' }]}
              onPress={() => handleOpenStoreWebsite(store)}
              activeOpacity={0.85}
            >
              <View style={styles.storeHeader}>
                <Text style={styles.storeIcon}>{store.icon}</Text>
                <View style={styles.storeInfo}>
                  <Text style={[styles.storeName, { color: store.accent }]}>{store.name}</Text>
                  <Text style={styles.storeTagline}>{store.tagline}</Text>
                  <Text style={styles.storeDesc}>{store.description}</Text>
                </View>
              </View>

              <View style={[styles.openWebsiteBtn, { backgroundColor: store.accent }]}>
                <Text style={styles.openWebsiteBtnTxt}>
                  {searchItem ? `Open ${store.name} Website for "${searchItem}" ↗` : `Open ${store.name} Website Directly ↗`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
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
  headerTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 60 },

  banner: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerTitle: { color: '#4ADE80', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  bannerSub: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, color: '#F8FAFC', fontSize: 15 },
  clearBtn: { padding: 6 },
  clearBtnTxt: { color: '#94A3B8', fontSize: 16, fontWeight: '800' },

  sectionHeading: { color: '#CBD5E1', fontSize: 15, fontWeight: '800', marginBottom: 14 },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipCardActive: { backgroundColor: '#14532D', borderColor: '#4ADE80' },
  chipEmoji: { fontSize: 16, marginRight: 6 },
  chipText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#F8FAFC', fontWeight: '800' },

  storeList: { gap: 16 },
  storeCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  storeHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  storeIcon: { fontSize: 36, marginRight: 14 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 20, fontWeight: '900', marginBottom: 2 },
  storeTagline: { color: '#F8FAFC', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  storeDesc: { color: '#94A3B8', fontSize: 12, lineHeight: 18 },

  openWebsiteBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openWebsiteBtnTxt: { color: '#0F172A', fontSize: 14, fontWeight: '900' },
});
