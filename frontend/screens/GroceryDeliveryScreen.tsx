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

  const popularItems = [
    'Fresh Chicken', 'Paneer', 'Milk', 'Eggs', 'Curd',
    'Tomatoes', 'Onions', 'Garlic', 'Ghee', 'Ragi Flour',
    'Basmati Rice', 'Butter', 'Coriander', 'Green Chillies'
  ];

  const stores = [
    {
      id: 'blinkit',
      name: 'Blinkit',
      tagline: '⚡ 10-Min Instant Delivery',
      bg: '#1A1A1A',
      accent: '#FCE83A',
      icon: '🟡',
      getUrl: (query: string) => `https://blinkit.com/s/?q=${encodeURIComponent(query)}`
    },
    {
      id: 'zepto',
      name: 'Zepto',
      tagline: '🟣 10-Min Superfast Groceries',
      bg: '#3B0764',
      accent: '#C084FC',
      icon: '🟣',
      getUrl: (query: string) => `https://www.zeptonow.com/search?query=${encodeURIComponent(query)}`
    },
    {
      id: 'bigbasket',
      name: 'BigBasket',
      tagline: '🟢 Fresh Groceries & Pantry Staples',
      bg: '#14532D',
      accent: '#4ADE80',
      icon: '🟢',
      getUrl: (query: string) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query)}`
    },
    {
      id: 'instamart',
      name: 'Swiggy Instamart',
      tagline: '🟠 10-15 Min Instant Grocery',
      bg: '#7C2D12',
      accent: '#FB923C',
      icon: '🟠',
      getUrl: (query: string) => `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(query)}`
    },
    {
      id: 'amazon',
      name: 'Amazon Fresh',
      tagline: '🟧 Same Day Pantry & Groceries',
      bg: '#1E293B',
      accent: '#F59E0B',
      icon: '🟧',
      getUrl: (query: string) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}+grocery`
    }
  ];

  const handleOpenStore = (store: typeof stores[0]) => {
    const query = searchItem.trim() || 'Groceries';
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
          <Text style={styles.backBtnTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Grocery Delivery Hub</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Order Missing Ingredients Instant</Text>
          <Text style={styles.bannerSub}>
            Search any ingredient and instantly compare or order from Blinkit, Zepto, BigBasket, Instamart & Amazon Fresh!
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Type ingredient (e.g. Tomatoes, Chicken, Paneer)..."
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

        {/* Quick Select Items */}
        <Text style={styles.sectionHeading}>Quick Select Ingredients</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {popularItems.map((item) => {
            const isSelected = searchItem.toLowerCase() === item.toLowerCase();
            return (
              <TouchableOpacity
                key={item}
                style={[styles.itemPill, isSelected && styles.itemPillActive]}
                onPress={() => setSearchItem(item)}
              >
                <Text style={[styles.itemPillTxt, isSelected && styles.itemPillTxtActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Payment & COD Troubleshooting Tip Card */}
        <View style={styles.paymentNoticeCard}>
          <Text style={styles.noticeHeading}>💡 Cash on Delivery (COD) & Payment Help</Text>
          <Text style={styles.noticeText}>
            • <Text style={styles.boldText}>Why is "Cash" grayed out?</Text> Platforms like Blinkit, Zepto, Swiggy Instamart & BigBasket allow <Text style={styles.boldText}>only 1 active COD order at a time</Text>. If an existing cash order is pending delivery, COD is automatically locked.
          </Text>
          <Text style={styles.noticeText}>
            • <Text style={styles.boldText}>Instant Workarounds:</Text>
            {"\n"}  1. Pay via <Text style={styles.highlightText}>UPI (GPay / PhonePe / Paytm)</Text> or Cards for 1-click order placement.
            {"\n"}  2. Switch to another app below (e.g., try <Text style={styles.highlightText}>Zepto, Swiggy Instamart, or BigBasket</Text> if Blinkit COD is blocked).
            {"\n"}  3. Use <Text style={styles.highlightText}>Pay Later (Simpl / LazyPay)</Text> for post-delivery payment.
          </Text>
        </View>

        {/* Platform Store Cards */}
        <Text style={styles.sectionHeading}>
          Select Delivery Platform {searchItem ? `for "${searchItem}"` : ''}
        </Text>

        <View style={styles.storeList}>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[styles.storeCard, { backgroundColor: store.bg, borderColor: store.accent + '44' }]}
              onPress={() => handleOpenStore(store)}
              activeOpacity={0.85}
            >
              <View style={styles.storeHeader}>
                <Text style={styles.storeIcon}>{store.icon}</Text>
                <View style={styles.storeInfo}>
                  <Text style={[styles.storeName, { color: store.accent }]}>{store.name}</Text>
                  <Text style={styles.storeTagline}>{store.tagline}</Text>
                </View>
              </View>

              <View style={styles.paymentMethodsRow}>
                <Text style={styles.paymentTag}>💳 UPI / Cards</Text>
                <Text style={styles.paymentTag}>💵 COD Allowed</Text>
                <Text style={styles.paymentTag}>⚡ Pay Later</Text>
              </View>

              <View style={[styles.orderActionBtn, { backgroundColor: store.accent }]}>
                <Text style={styles.orderActionTxt}>
                  {searchItem ? `Order "${searchItem}" on ${store.name} ➔` : `Open ${store.name} ➔`}
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
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
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
  bannerSub: { color: '#94A3B8', fontSize: 13, lineHeight: 20 },

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

  sectionHeading: { color: '#CBD5E1', fontSize: 15, fontWeight: '800', marginBottom: 12 },
  pillsScroll: { marginBottom: 24 },
  itemPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemPillActive: { backgroundColor: '#166534', borderColor: '#4ADE80' },
  itemPillTxt: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  itemPillTxtActive: { color: '#F8FAFC', fontWeight: '800' },

  storeList: { gap: 14 },
  storeCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  storeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  storeIcon: { fontSize: 32, marginRight: 14 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 18, fontWeight: '900', marginBottom: 2 },
  storeTagline: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },

  paymentNoticeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3B82F644',
  },
  noticeHeading: { color: '#60A5FA', fontSize: 14, fontWeight: '800', marginBottom: 8 },
  noticeText: { color: '#CBD5E1', fontSize: 12, lineHeight: 18, marginBottom: 6 },
  boldText: { fontWeight: '800', color: '#F8FAFC' },
  highlightText: { color: '#38BDF8', fontWeight: '700' },

  paymentMethodsRow: { flexDirection: 'row', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  paymentTag: { backgroundColor: '#ffffff22', color: '#F8FAFC', fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  orderActionBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderActionTxt: { color: '#0F172A', fontSize: 14, fontWeight: '900' },
});
