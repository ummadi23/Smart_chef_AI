import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Modal, Alert
} from 'react-native';

interface GroceryItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  category: string;
  emoji: string;
}

interface OrderReceipt {
  orderId: string;
  timestamp: string;
  platform: string;
  address: string;
  paymentMethod: string;
  items: { item: GroceryItem; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
}

interface GroceryDeliveryScreenProps {
  onBack: () => void;
  initialItem?: string;
}

const CATALOG: GroceryItem[] = [
  { id: '1', name: 'Fresh Chicken', weight: '500g cut pieces', price: 180, category: 'Meat & Poultry', emoji: '🍗' },
  { id: '2', name: 'Paneer (Cottage Cheese)', weight: '200g block', price: 95, category: 'Dairy', emoji: '🧀' },
  { id: '3', name: 'Organic Red Tomatoes', weight: '1 kg', price: 44, category: 'Vegetables', emoji: '🍅' },
  { id: '4', name: 'Fresh Whole Milk', weight: '1 Litre pouch', price: 64, category: 'Dairy', emoji: '🥛' },
  { id: '5', name: 'Farm Fresh White Eggs', weight: '6 pcs pack', price: 52, category: 'Dairy & Eggs', emoji: '🥚' },
  { id: '6', name: 'Pure Cow Ghee', weight: '500 ml jar', price: 320, category: 'Pantry', emoji: '🧈' },
  { id: '7', name: 'Red Onions', weight: '1 kg bag', price: 35, category: 'Vegetables', emoji: '🧅' },
  { id: '8', name: 'Fresh Garlic Cloves', weight: '250g', price: 45, category: 'Vegetables', emoji: '🧄' },
  { id: '9', name: 'Premium Basmati Rice', weight: '1 kg pack', price: 110, category: 'Grains', emoji: '🍚' },
  { id: '10', name: 'Ragi Flour (Finger Millet)', weight: '500g', price: 55, category: 'Grains', emoji: '🌾' },
  { id: '11', name: 'Amul Butter', weight: '100g pack', price: 58, category: 'Dairy', emoji: '🧈' },
  { id: '12', name: 'Fresh Mint & Coriander', weight: 'Bunch bundle', price: 20, category: 'Herbs', emoji: '🌿' },
];

const PLATFORMS = [
  { id: 'blinkit', name: 'Blinkit', time: '10 Mins', accent: '#FCE83A', icon: '🟡' },
  { id: 'zepto', name: 'Zepto', time: '10 Mins', accent: '#C084FC', icon: '🟣' },
  { id: 'bigbasket', name: 'BigBasket', time: '25 Mins', accent: '#4ADE80', icon: '🟢' },
  { id: 'instamart', name: 'Swiggy Instamart', time: '12 Mins', accent: '#FB923C', icon: '🟠' },
  { id: 'amazon', name: 'Amazon Fresh', time: 'Same Day', accent: '#F59E0B', icon: '🟧' },
];

export default function GroceryDeliveryScreen({ onBack, initialItem = '' }: GroceryDeliveryScreenProps) {
  const [searchItem, setSearchItem] = useState(initialItem);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('Home: Saveetha Engineering College, Kanchipuram Highway, Chennai');
  const [selectedPayment, setSelectedPayment] = useState<'COD' | 'UPI' | 'Card' | 'Netbanking'>('COD');

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<OrderReceipt | null>(null);

  // Cart Helpers
  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[id] > 1) {
        copy[id] -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const cartItemsList = CATALOG.filter(c => cart[c.id] > 0).map(c => ({
    item: c,
    quantity: cart[c.id]
  }));

  const cartTotalCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = cartItemsList.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 25;
  const taxes = subtotal > 0 ? 5 : 0;
  const grandTotal = subtotal + deliveryFee + taxes;

  const filteredCatalog = CATALOG.filter(item =>
    item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
    item.category.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handlePlaceOrder = () => {
    if (cartTotalCount === 0) {
      Alert.alert('Empty Cart', 'Please add at least one ingredient to your cart to place an order.');
      return;
    }

    const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    const receipt: OrderReceipt = {
      orderId,
      timestamp: formattedDate,
      platform: selectedPlatform.name,
      address: deliveryAddress,
      paymentMethod: selectedPayment === 'COD' ? 'Cash on Delivery (COD)' : selectedPayment === 'UPI' ? 'UPI (Google Pay / PhonePe)' : selectedPayment === 'Card' ? 'Credit / Debit Card' : 'Netbanking',
      items: cartItemsList,
      subtotal,
      deliveryFee,
      taxes,
      total: grandTotal
    };

    setActiveReceipt(receipt);
    setIsCheckoutOpen(false);
    setCart({}); // clear cart after order placement
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnTxt}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Grocery Store & Order</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Instant Grocery & Pantry Store</Text>
          <Text style={styles.bannerSub}>
            Select missing ingredients, pick your delivery partner (Blinkit, Zepto, BigBasket), and place your order directly!
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chicken, paneer, tomatoes, flour..."
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

        {/* Delivery Partner Selector */}
        <Text style={styles.sectionHeading}>Select Delivery Partner</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {PLATFORMS.map((p) => {
            const isSelected = selectedPlatform.id === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.platformPill, isSelected && { backgroundColor: '#1E293B', borderColor: p.accent }]}
                onPress={() => setSelectedPlatform(p)}
              >
                <Text style={styles.pillIcon}>{p.icon}</Text>
                <Text style={[styles.platformPillTxt, isSelected && { color: p.accent, fontWeight: '800' }]}>
                  {p.name} ({p.time})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Catalog List */}
        <Text style={styles.sectionHeading}>Available Ingredients & Groceries</Text>
        <View style={styles.catalogGrid}>
          {filteredCatalog.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemWeight}>{item.weight}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>

                {qty === 0 ? (
                  <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item.id)}>
                    <Text style={styles.addBtnTxt}>+ ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                      <Text style={styles.qtyBtnTxt}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)}>
                      <Text style={styles.qtyBtnTxt}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Cart Bar */}
      {cartTotalCount > 0 && (
        <View style={styles.stickyCartBar}>
          <View>
            <Text style={styles.cartBarCount}>🛒 {cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'} added</Text>
            <Text style={styles.cartBarTotal}>₹{grandTotal} <Text style={styles.cartBarSub}>(incl. taxes)</Text></Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={() => setIsCheckoutOpen(true)}>
            <Text style={styles.checkoutBtnTxt}>Checkout ➔</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CHECKOUT MODAL */}
      <Modal visible={isCheckoutOpen} transparent animationType="slide" onRequestClose={() => setIsCheckoutOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Checkout & Payment</Text>
            <Text style={styles.sheetSub}>Fulfillment via <Text style={{ color: selectedPlatform.accent, fontWeight: '800' }}>{selectedPlatform.name}</Text> ({selectedPlatform.time})</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Delivery Address */}
              <Text style={styles.modalSectionTitle}>📍 Delivery Address</Text>
              <View style={styles.addressBox}>
                <TextInput
                  style={styles.addressInput}
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                />
              </View>

              {/* Items Summary */}
              <Text style={styles.modalSectionTitle}>📦 Order Items ({cartTotalCount})</Text>
              <View style={styles.orderItemsBox}>
                {cartItemsList.map(({ item, quantity }) => (
                  <View key={item.id} style={styles.orderItemRow}>
                    <Text style={styles.orderItemName}>{item.emoji} {item.name} × {quantity}</Text>
                    <Text style={styles.orderItemPrice}>₹{item.price * quantity}</Text>
                  </View>
                ))}
              </View>

              {/* Select Payment Method */}
              <Text style={styles.modalSectionTitle}>💳 Select Payment Method</Text>
              <View style={styles.paymentGrid}>
                {[
                  { id: 'COD', label: '💵 Cash on Delivery (COD)' },
                  { id: 'UPI', label: '📱 UPI (GPay / PhonePe / Paytm)' },
                  { id: 'Card', label: '💳 Credit / Debit Card' },
                  { id: 'Netbanking', label: '🏦 Netbanking' }
                ].map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.paymentPill, selectedPayment === p.id && styles.paymentPillActive]}
                    onPress={() => setSelectedPayment(p.id as any)}
                  >
                    <Text style={[styles.paymentPillTxt, selectedPayment === p.id && styles.paymentPillTxtActive]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bill Details */}
              <Text style={styles.modalSectionTitle}>🧾 Bill Summary</Text>
              <View style={styles.billBox}>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Item Subtotal</Text>
                  <Text style={styles.billValue}>₹{subtotal}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Delivery Fee</Text>
                  <Text style={styles.billValue}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Taxes & Packaging</Text>
                  <Text style={styles.billValue}>₹{taxes}</Text>
                </View>
                <View style={[styles.billRow, styles.billTotalRow]}>
                  <Text style={styles.billTotalLabel}>Grand Total</Text>
                  <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.checkoutActionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsCheckoutOpen(false)}>
                <Text style={styles.cancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
                <Text style={styles.placeOrderBtnTxt}>Place Order ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ORDER CONFIRMATION & DETAILS RECEIPT MODAL */}
      <Modal visible={!!activeReceipt} transparent animationType="fade" onRequestClose={() => setActiveReceipt(null)}>
        <View style={styles.modalOverlay}>
          {activeReceipt && (
            <View style={styles.receiptSheet}>
              <View style={styles.successHeader}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                <Text style={styles.successSub}>Arriving in 12–15 Mins via {activeReceipt.platform}</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
                {/* Meta details */}
                <View style={styles.receiptMetaBox}>
                  <Text style={styles.metaRowText}>Order ID: <Text style={styles.metaHighlight}>{activeReceipt.orderId}</Text></Text>
                  <Text style={styles.metaRowText}>Date & Time: {activeReceipt.timestamp}</Text>
                  <Text style={styles.metaRowText}>Status: <Text style={{ color: '#4ADE80', fontWeight: '800' }}>Confirmed & Packing</Text></Text>
                </View>

                {/* Delivery Address */}
                <Text style={styles.receiptSectionHeader}>📍 Delivery Address</Text>
                <Text style={styles.receiptBodyText}>{activeReceipt.address}</Text>

                {/* Items Purchased List */}
                <Text style={styles.receiptSectionHeader}>🛍️ Items Purchased ({activeReceipt.items.reduce((a, b) => a + b.quantity, 0)})</Text>
                <View style={styles.receiptItemsBox}>
                  {activeReceipt.items.map(({ item, quantity }, idx) => (
                    <View key={idx} style={styles.receiptItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.receiptItemName}>{item.emoji} {item.name}</Text>
                        <Text style={styles.receiptItemWeight}>{item.weight} × {quantity}</Text>
                      </View>
                      <Text style={styles.receiptItemPrice}>₹{item.price * quantity}</Text>
                    </View>
                  ))}
                </View>

                {/* Payment & Bill Details */}
                <Text style={styles.receiptSectionHeader}>💳 Payment & Bill Details</Text>
                <View style={styles.receiptBillBox}>
                  <View style={styles.receiptBillRow}>
                    <Text style={styles.billLabel}>Payment Method</Text>
                    <Text style={styles.billValueBold}>{activeReceipt.paymentMethod}</Text>
                  </View>
                  <View style={styles.receiptBillRow}>
                    <Text style={styles.billLabel}>Items Subtotal</Text>
                    <Text style={styles.billValue}>₹{activeReceipt.subtotal}</Text>
                  </View>
                  <View style={styles.receiptBillRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={styles.billValue}>{activeReceipt.deliveryFee === 0 ? 'FREE' : `₹${activeReceipt.deliveryFee}`}</Text>
                  </View>
                  <View style={styles.receiptBillRow}>
                    <Text style={styles.billLabel}>Taxes & Handling</Text>
                    <Text style={styles.billValue}>₹{activeReceipt.taxes}</Text>
                  </View>
                  <View style={[styles.receiptBillRow, styles.receiptTotalRow]}>
                    <Text style={styles.receiptTotalLabel}>Total Amount Paid</Text>
                    <Text style={styles.receiptTotalValue}>₹{activeReceipt.total}</Text>
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.doneBtn} onPress={() => setActiveReceipt(null)}>
                <Text style={styles.doneBtnTxt}>Done & Return to Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#1E293B' },
  backBtnTxt: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 100 },

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
    height: 54,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, color: '#F8FAFC', fontSize: 15 },
  clearBtn: { padding: 6 },
  clearBtnTxt: { color: '#94A3B8', fontSize: 16, fontWeight: '800' },

  sectionHeading: { color: '#CBD5E1', fontSize: 15, fontWeight: '800', marginBottom: 12 },
  pillsScroll: { marginBottom: 20 },
  platformPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillIcon: { fontSize: 14, marginRight: 6 },
  platformPillTxt: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },

  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  itemCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  itemEmoji: { fontSize: 32, marginBottom: 8 },
  itemName: { color: '#F8FAFC', fontSize: 13, fontWeight: '800', textAlign: 'center', marginBottom: 2 },
  itemWeight: { color: '#94A3B8', fontSize: 11, marginBottom: 8 },
  itemPrice: { color: '#4ADE80', fontSize: 15, fontWeight: '900', marginBottom: 10 },

  addBtn: { backgroundColor: '#166534', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: '#4ADE80' },
  addBtnTxt: { color: '#F8FAFC', fontSize: 12, fontWeight: '900' },

  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 4 },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 2 },
  qtyBtnTxt: { color: '#4ADE80', fontSize: 16, fontWeight: '900' },
  qtyNum: { color: '#F8FAFC', fontSize: 13, fontWeight: '800', paddingHorizontal: 8 },

  // Sticky Cart Bar
  stickyCartBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#166534',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  cartBarCount: { color: '#DCFCE7', fontSize: 12, fontWeight: '700' },
  cartBarTotal: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  cartBarSub: { fontSize: 11, fontWeight: '600', opacity: 0.8 },
  checkoutBtn: { backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  checkoutBtnTxt: { color: '#166534', fontSize: 14, fontWeight: '900' },

  // Checkout Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#1E293B', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#475569', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '900' },
  sheetSub: { color: '#94A3B8', fontSize: 13, marginBottom: 16 },

  modalSectionTitle: { color: '#CBD5E1', fontSize: 13, fontWeight: '800', marginTop: 14, marginBottom: 8 },
  addressBox: { backgroundColor: '#0F172A', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155' },
  addressInput: { color: '#F8FAFC', fontSize: 13, lineHeight: 18 },

  orderItemsBox: { backgroundColor: '#0F172A', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155' },
  orderItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  orderItemName: { color: '#CBD5E1', fontSize: 13 },
  orderItemPrice: { color: '#F8FAFC', fontSize: 13, fontWeight: '800' },

  paymentGrid: { gap: 8 },
  paymentPill: { backgroundColor: '#0F172A', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  paymentPillActive: { backgroundColor: '#14532D', borderColor: '#4ADE80' },
  paymentPillTxt: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  paymentPillTxtActive: { color: '#F8FAFC', fontWeight: '800' },

  billBox: { backgroundColor: '#0F172A', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#334155' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billLabel: { color: '#94A3B8', fontSize: 13 },
  billValue: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  billTotalRow: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10, marginTop: 6 },
  billTotalLabel: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  billTotalValue: { color: '#4ADE80', fontSize: 18, fontWeight: '900' },

  checkoutActionsRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  cancelBtn: { flex: 1, backgroundColor: '#334155', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  cancelBtnTxt: { color: '#CBD5E1', fontSize: 14, fontWeight: '700' },
  placeOrderBtn: { flex: 2, backgroundColor: '#22C55E', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  placeOrderBtnTxt: { color: '#0F172A', fontSize: 15, fontWeight: '900' },

  // Receipt Modal
  receiptSheet: { backgroundColor: '#1E293B', marginHorizontal: 20, marginVertical: 60, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#4ADE80' },
  successHeader: { alignItems: 'center', marginBottom: 16 },
  successIcon: { fontSize: 44, marginBottom: 6 },
  successTitle: { color: '#4ADE80', fontSize: 20, fontWeight: '900' },
  successSub: { color: '#94A3B8', fontSize: 13, marginTop: 2 },

  receiptMetaBox: { backgroundColor: '#0F172A', padding: 12, borderRadius: 12, marginBottom: 14 },
  metaRowText: { color: '#CBD5E1', fontSize: 12, marginBottom: 4 },
  metaHighlight: { color: '#38BDF8', fontWeight: '800' },

  receiptSectionHeader: { color: '#F8FAFC', fontSize: 13, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  receiptBodyText: { color: '#CBD5E1', fontSize: 13, lineHeight: 18 },
  receiptItemsBox: { backgroundColor: '#0F172A', borderRadius: 12, padding: 12 },
  receiptItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  receiptItemName: { color: '#F8FAFC', fontSize: 13, fontWeight: '700' },
  receiptItemWeight: { color: '#94A3B8', fontSize: 11 },
  receiptItemPrice: { color: '#4ADE80', fontSize: 13, fontWeight: '900' },

  receiptBillBox: { backgroundColor: '#0F172A', borderRadius: 12, padding: 14, marginTop: 4 },
  receiptBillRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billValueBold: { color: '#F8FAFC', fontSize: 13, fontWeight: '800' },
  receiptTotalRow: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10, marginTop: 6 },
  receiptTotalLabel: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
  receiptTotalValue: { color: '#4ADE80', fontSize: 18, fontWeight: '900' },

  doneBtn: { backgroundColor: '#22C55E', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 18 },
  doneBtnTxt: { color: '#0F172A', fontSize: 15, fontWeight: '900' },
});
