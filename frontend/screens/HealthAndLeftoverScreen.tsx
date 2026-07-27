import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Animated, Image, SafeAreaView, StatusBar
} from 'react-native';
import { getApiBaseUrl } from '../config';

interface RemedyResult {
  condition: string; medicine: string; emoji: string; color: string;
  ingredients: string[]; ingredientCards: { name: string; image: string; quantity: string }[]; steps: string[];
}
interface FusionResult { dish: string; steps: string[]; tags: string[]; }

function AnimBar({ pct, color }: { pct: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(anim, { toValue: pct, duration: 900, useNativeDriver: false }).start(); }, []);
  return (
    <View style={bar.track}>
      <Animated.View style={[bar.fill, { backgroundColor: color, width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}
const bar = StyleSheet.create({
  track: { height: 8, borderRadius: 8, backgroundColor: '#1E293B', overflow: 'hidden', marginVertical: 8 },
  fill: { height: '100%', borderRadius: 8 }
});

const QUICK_PROBLEMS = [
  { label: '🌡️ Fever', value: 'fever' }, { label: '🤧 Cough', value: 'cough' },
  { label: '🤒 Cold', value: 'cold' }, { label: '🧠 Headache', value: 'headache' },
  { label: '🫃 Acidity', value: 'acidity' }, { label: '😴 Insomnia', value: 'insomnia' },
  { label: '🦴 Joint Pain', value: 'joint pain' }, { label: '🧘 Stress', value: 'stress' },
  { label: '🌿 Skin', value: 'acne' }, { label: '💆 Hair Fall', value: 'hair fall' },
  { label: '⚡ Weakness', value: 'weakness' }, { label: '🩸 Diabetes', value: 'diabetes' },
];

function HerbCardImage({ uri, name, color }: { uri: string; name: string; color: string }) {
  const [hasError, setHasError] = useState(false);

  const getEmoji = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.includes('honey') || lower.includes('shehad')) return '🍯';
    if (lower.includes('ginger') || lower.includes('saunth') || lower.includes('adrak')) return '🫚';
    if (lower.includes('pepper') || lower.includes('mirch') || lower.includes('pippali')) return '🖤';
    if (lower.includes('turmeric') || lower.includes('haldi')) return '🟡';
    if (lower.includes('tulsi') || lower.includes('mint') || lower.includes('basil') || lower.includes('pudina')) return '🍃';
    if (lower.includes('water') || lower.includes('jal')) return '💧';
    if (lower.includes('milk') || lower.includes('doodh')) return '🥛';
    if (lower.includes('oil') || lower.includes('tel')) return '🫙';
    if (lower.includes('ghee')) return '🧈';
    if (lower.includes('lemon') || lower.includes('nimbu')) return '🍋';
    if (lower.includes('garlic') || lower.includes('lahsun')) return '🧄';
    if (lower.includes('almond') || lower.includes('badam')) return '🥜';
    if (lower.includes('clove') || lower.includes('lavang')) return '🪵';
    if (lower.includes('saffron') || lower.includes('kesar')) return '🌺';
    if (lower.includes('seed') || lower.includes('ajwain') || lower.includes('jeera') || lower.includes('methi')) return '🌾';
    return '🌿';
  };

  const imgUri = uri ? (uri.includes('?') ? `${uri}&v=2` : `${uri}?v=2`) : '';

  if (hasError || !imgUri) {
    return (
      <View style={[s.ingImg, s.fallbackImgBox, { backgroundColor: color + '22' }]}>
        <Text style={s.fallbackEmoji}>{getEmoji(name)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imgUri }}
      style={s.ingImg}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function HealthAndLeftoverScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'ayurveda' | 'leftover'>('ayurveda');

  // Ayurveda tab state
  const [problem, setProblem] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [remedy, setRemedy] = useState<RemedyResult | null>(null);

  // Leftover tab state
  const [leftoverText, setLeftoverText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fusion, setFusion] = useState<FusionResult | null>(null);

  const findRemedy = async (q?: string) => {
    const query = (q ?? problem).trim();
    if (!query) return;
    setIsFinding(true);
    setRemedy(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/recipes/ayurvedic-remedy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: query }),
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        setRemedy({ condition: json.condition, medicine: json.medicine, emoji: json.emoji, color: json.color, ingredients: json.ingredients, ingredientCards: json.ingredientCards || [], steps: json.steps });
      } else {
        alert(json.message || 'Could not find a remedy.');
      }
    } catch {
      alert('Cannot connect to backend server on port 5000.');
    } finally {
      setIsFinding(false);
    }
  };

  const handleGenerate = async () => {
    if (!leftoverText.trim()) return;
    setIsProcessing(true);
    setFusion(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/recipes/leftover-makeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: leftoverText.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        setFusion({ dish: json.dish, steps: json.steps, tags: json.tags });
      } else {
        alert(json.message || 'Could not generate recipe.');
      }
    } catch {
      alert('Cannot connect to backend server on port 5000.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <TouchableOpacity onPress={onBack} style={s.backBtn}>
        <Text style={s.backBtnTxt}>← Back</Text>
      </TouchableOpacity>


      <View style={s.tabBar}>
        {([['ayurveda', '🌿 Ayurvedic Remedy'], ['leftover', '♻️ Leftover Makeover']] as const).map(([id, label]) => (
          <TouchableOpacity key={id} style={[s.tab, activeTab === id && s.activeTab]} onPress={() => setActiveTab(id)}>
            <Text style={[s.tabTxt, activeTab === id && s.activeTabTxt]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ══════════ AYURVEDA TAB ══════════ */}
        {activeTab === 'ayurveda' && (
          <View>
            {/* Hero */}
            <View style={s.heroBanner}>
              <Text style={s.heroTitle}>🌿 Ancient Ayurvedic Medicine</Text>
              <Text style={s.heroSub}>Tell us your health problem. We'll find the exact ancient Ayurvedic remedy and how to prepare it — step by step.</Text>
            </View>

            {/* Quick Select Chips */}
            <Text style={s.chipHeading}>Select a common problem or type your own:</Text>
            <View style={s.chipRow}>
              {QUICK_PROBLEMS.map(qp => (
                <TouchableOpacity key={qp.value} style={[s.chip, problem === qp.value && s.chipActive]}
                  onPress={() => { setProblem(qp.value); setRemedy(null); }}>
                  <Text style={[s.chipTxt, problem === qp.value && s.chipActiveTxt]}>{qp.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Text Input */}
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="e.g., fever, cough, joint pain, diabetes, anxiety..."
                placeholderTextColor="#64748B"
                value={problem}
                onChangeText={(t) => { setProblem(t); setRemedy(null); }}
              />
            </View>

            <TouchableOpacity style={[s.genBtn, isFinding && { opacity: 0.7 }]} onPress={() => findRemedy()} disabled={isFinding}>
              {isFinding ? <ActivityIndicator color="#FFF" /> : <Text style={s.genBtnTxt}>🔍 Find Ancient Remedy</Text>}
            </TouchableOpacity>

            {/* Result Card */}
            {remedy && (
              <View style={[s.remedyCard, { borderColor: remedy.color + '55' }]}>
                {/* Header */}
                <View style={[s.remedyHeader, { backgroundColor: remedy.color + '22' }]}>
                  <Text style={s.remedyEmoji}>{remedy.emoji}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.remedyCondition}>{remedy.condition}</Text>
                    <Text style={[s.remedyMedicineName, { color: remedy.color }]}>{remedy.medicine}</Text>
                  </View>
                </View>

                {/* Ingredient Names (Text Only) */}
                <Text style={s.sectionTitle}>🧪 Ingredients Required:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.ingScroll} contentContainerStyle={s.ingScrollContent}>
                  {remedy.ingredientCards.map((card, i) => (
                    <View key={i} style={[s.ingCard, { borderColor: remedy.color + '44' }]}>
                      <Text style={[s.ingCardName, { color: remedy.color }]} numberOfLines={2}>{card.name}</Text>
                      <Text style={s.ingCardQty} numberOfLines={2}>{card.quantity}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Steps */}
                <Text style={[s.sectionTitle, { marginTop: 18 }]}>📋 Step-by-Step Preparation:</Text>
                {remedy.steps.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    {step.startsWith('⚠️') ? (
                      <View style={s.warningBox}>
                        <Text style={s.warningTxt}>{step}</Text>
                      </View>
                    ) : (
                      <>
                        <View style={[s.stepNum, { backgroundColor: remedy.color }]}><Text style={s.stepNumTxt}>{i + 1}</Text></View>
                        <Text style={s.stepTxt}>{step}</Text>
                      </>
                    )}
                  </View>
                ))}

                <View style={s.disclaimerBox}>
                  <Text style={s.disclaimerTxt}>🏥 These are traditional Ayurvedic remedies for reference. Always consult a qualified Ayurvedic physician (Vaidya) before starting any herbal treatment, especially if you are on medication.</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ══════════ LEFTOVER TAB ══════════ */}
        {activeTab === 'leftover' && (
          <View>
            <View style={s.leftoverHero}>
              <Text style={s.leftoverHeroTitle}>♻️ Leftover Makeover</Text>
              <Text style={s.leftoverHeroSub}>Turn your fridge scraps into a gourmet dish — zero waste cooking!</Text>
            </View>

            <Text style={s.inputLabel}>What leftovers do you have?</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={[s.input, { minHeight: 60 }]}
                placeholder="e.g., Leftover dal, stale roti, cooked rice, tomato curry..."
                placeholderTextColor="#64748B"
                value={leftoverText}
                onChangeText={setLeftoverText}
                multiline
              />
            </View>

            <TouchableOpacity style={[s.genBtn, isProcessing && { opacity: 0.7 }]} onPress={handleGenerate} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={s.genBtnTxt}>✨ Generate Fusion Dish</Text>}
            </TouchableOpacity>

            {fusion && (
              <View style={s.fusionCard}>
                <Text style={s.fusionTitle}>🍽️ {fusion.dish}</Text>
                <View style={s.tagRow}>
                  {fusion.tags.map(t => <View key={t} style={s.tag}><Text style={s.tagTxt}>{t}</Text></View>)}
                </View>
                <Text style={s.stepsHeading}>Step-by-Step Recipe:</Text>
                {fusion.steps.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    <View style={s.stepNum}><Text style={s.stepNumTxt}>{i + 1}</Text></View>
                    <Text style={s.stepTxt}>{step}</Text>
                  </View>
                ))}
                <View style={s.zeroWasteTag}>
                  <Text style={s.zeroWasteTxt}>♻️ Zero Food Waste • AI-Powered Fusion Cooking</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  // ⬇️ ADJUST marginTop BELOW TO MOVE BACK BUTTON UP OR DOWN (for status bar / camera notch) ⬇️
  backBtn: { alignSelf: 'flex-start', marginTop: 45, marginLeft: 16, marginRight: 16, marginBottom: 10, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#1E293B', flexDirection: 'row', alignItems: 'center' },
  backBtnTxt: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1E293B', marginHorizontal: 20, marginTop: 16, borderRadius: 14, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#334155' },
  tabTxt: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  activeTabTxt: { color: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 60 },

  // Hero
  heroBanner: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 20 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#F8FAFC', marginBottom: 8 },
  heroSub: { fontSize: 14, color: '#94A3B8', lineHeight: 22 },

  // Quick chips
  chipHeading: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  chipActive: { backgroundColor: '#4ADE80', borderColor: '#4ADE80' },
  chipTxt: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  chipActiveTxt: { color: '#0F172A' },

  // Input
  inputWrap: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  input: { fontSize: 15, color: '#F8FAFC' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#CBD5E1', marginBottom: 10 },

  // Button
  genBtn: { backgroundColor: '#4ADE80', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  genBtnTxt: { color: '#0F172A', fontSize: 16, fontWeight: '800' },

  // Remedy card
  remedyCard: { backgroundColor: '#1E293B', borderRadius: 24, overflow: 'hidden', borderWidth: 1, marginBottom: 20 },
  remedyHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 16 },
  remedyEmoji: { fontSize: 40 },
  remedyCondition: { fontSize: 13, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  remedyMedicineName: { fontSize: 18, fontWeight: '900' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#CBD5E1', marginBottom: 10, paddingHorizontal: 20 },

  // Ingredient image cards (horizontal scroll)
  ingScroll: { marginBottom: 8 },
  ingScrollContent: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  ingCard: { minWidth: 120, backgroundColor: '#0B132B', borderRadius: 14, borderWidth: 1, overflow: 'hidden', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  ingImg: { width: 114, height: 90, borderRadius: 12, marginBottom: 8, backgroundColor: '#1E293B' },
  fallbackImgBox: { justifyContent: 'center', alignItems: 'center' },
  fallbackEmoji: { fontSize: 36 },
  ingCardName: { fontSize: 12, fontWeight: '700', color: '#F8FAFC', textAlign: 'center', lineHeight: 16, marginBottom: 4 },
  ingCardQty: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 15 },

  ingRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 8 },
  ingDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 12, flexShrink: 0 },
  ingTxt: { color: '#94A3B8', fontSize: 13, flex: 1, lineHeight: 20 },
  stepRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start', paddingHorizontal: 20 },
  stepNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12, flexShrink: 0 },
  stepNumTxt: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  stepTxt: { flex: 1, color: '#CBD5E1', fontSize: 14, lineHeight: 22 },
  warningBox: { flex: 1, backgroundColor: '#7C3AED22', borderRadius: 12, padding: 12, borderLeftWidth: 3, borderLeftColor: '#7C3AED', marginBottom: 4 },
  warningTxt: { color: '#A78BFA', fontSize: 13, lineHeight: 20, fontWeight: '600' },
  disclaimerBox: { backgroundColor: '#0F172A', margin: 16, borderRadius: 14, padding: 14 },
  disclaimerTxt: { color: '#64748B', fontSize: 12, lineHeight: 20 },

  // Leftover tab
  leftoverHero: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 20 },
  leftoverHeroTitle: { fontSize: 22, fontWeight: '900', color: '#F8FAFC', marginBottom: 6 },
  leftoverHeroSub: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },
  fusionCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20 },
  fusionTitle: { fontSize: 20, fontWeight: '900', color: '#F8FAFC', marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  tag: { backgroundColor: '#334155', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  tagTxt: { color: '#CBD5E1', fontSize: 11, fontWeight: '700' },
  stepsHeading: { fontSize: 14, fontWeight: '800', color: '#94A3B8', marginBottom: 12 },
  zeroWasteTag: { marginTop: 16, backgroundColor: '#14532D33', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#166534' },
  zeroWasteTxt: { color: '#4ADE80', fontSize: 12, fontWeight: '700', textAlign: 'center' },
});
