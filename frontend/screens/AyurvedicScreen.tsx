import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert
} from 'react-native';
import { getApiBaseUrl } from '../config';

interface AyurvedicData {
  dosha: string;
  healthGoal: string;
  sattvicScore: number;
  doshaInsight: string;
  properties: {
    coolingItems: string[];
    heatingItems: string[];
    neutralItems: string[];
  };
  recommendedPairings: string[];
  guidelines: {
    eatMore: string[];
    eatLess: string[];
  };
  disclaimer: string;
}

export default function AyurvedicScreen({ onBack }: { onBack?: () => void }) {
  const [dosha, setDosha] = useState<'Pitta' | 'Vata' | 'Kapha'>('Pitta');
  const [ingredients, setIngredients] = useState<string[]>(['Mint', 'Cucumber', 'Rice', 'Tomato', 'Garlic']);
  const [data, setData] = useState<AyurvedicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAyurvedicGuidance = async (selectedDosha: 'Pitta' | 'Vata' | 'Kapha') => {
    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/ayurveda/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dosha: selectedDosha,
          ingredients,
          healthGoal: 'Eat Healthier & Balance Energy'
        })
      });

      const json = await response.json();
      if (json.status === 'success' && json.data) {
        setData(json.data);
      } else {
        Alert.alert('Ayurveda Engine', 'Unable to fetch Ayurvedic insights.');
      }
    } catch (err) {
      console.error('Ayurvedic fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAyurvedicGuidance(dosha);
  }, [dosha]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerCenter}>
          <Text style={styles.headerBadge}>🌿 AYURVEDIC WELLNESS</Text>
          <Text style={styles.headerTitle}>Dosha & Food Balancer</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dosha Selector Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SELECT YOUR CONSTITUTION (DOSHA)</Text>
          <View style={styles.doshaRow}>
            {[
              { id: 'Vata', emoji: '🌀', name: 'Vata', desc: 'Air & Ether' },
              { id: 'Pitta', emoji: '🔥', name: 'Pitta', desc: 'Fire & Water' },
              { id: 'Kapha', emoji: '🌊', name: 'Kapha', desc: 'Earth & Water' },
            ].map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.doshaPill,
                  dosha === item.id && styles.doshaPillActive
                ]}
                onPress={() => setDosha(item.id as any)}
              >
                <Text style={styles.doshaEmoji}>{item.emoji}</Text>
                <Text style={[styles.doshaName, dosha === item.id && styles.doshaNameActive]}>
                  {item.name}
                </Text>
                <Text style={styles.doshaDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#16A34A" size="large" />
            <Text style={styles.loadingText}>Analyzing Virya (Heating/Cooling) & Dosha Compatibility...</Text>
          </View>
        ) : data ? (
          <>
            {/* Sattvic Score & Insight */}
            <View style={styles.insightCard}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreNum}>{data.sattvicScore}%</Text>
                  <Text style={styles.scoreLabel}>Sattvic Score</Text>
                </View>
                <View style={styles.insightTextWrap}>
                  <Text style={styles.insightTitle}>{data.dosha} Balance Insight</Text>
                  <Text style={styles.insightSub}>{data.doshaInsight}</Text>
                </View>
              </View>
            </View>

            {/* Virya (Heating vs Cooling Properties) */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>FOOD THERMAL PROPERTIES (VIRYA)</Text>

              {data.properties.coolingItems.length > 0 && (
                <View style={styles.propSection}>
                  <Text style={styles.coolingHeader}>❄️ Cooling Foods (Sheeta Virya)</Text>
                  <View style={styles.chipWrap}>
                    {data.properties.coolingItems.map((item, idx) => (
                      <View key={idx} style={styles.coolingChip}>
                        <Text style={styles.coolingChipText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {data.properties.heatingItems.length > 0 && (
                <View style={styles.propSection}>
                  <Text style={styles.heatingHeader}>🔥 Heating Foods (Ushna Virya)</Text>
                  <View style={styles.chipWrap}>
                    {data.properties.heatingItems.map((item, idx) => (
                      <View key={idx} style={styles.heatingChip}>
                        <Text style={styles.heatingChipText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Recommended Pairings */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>BALANCING MEAL PAIRINGS</Text>
              {data.recommendedPairings.map((pair, idx) => (
                <View key={idx} style={styles.pairingRow}>
                  <Text style={styles.pairingBullet}>✨</Text>
                  <Text style={styles.pairingText}>{pair}</Text>
                </View>
              ))}
            </View>

            {/* Guidelines */}
            <View style={styles.guidelinesRow}>
              <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.eatMoreHeader}>✅ Eat More</Text>
                {data.guidelines.eatMore.map((g, idx) => (
                  <Text key={idx} style={styles.guidelineText}>• {g}</Text>
                ))}
              </View>

              <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.eatLessHeader}>⚠️ Limit / Avoid</Text>
                {data.guidelines.eatLess.map((g, idx) => (
                  <Text key={idx} style={styles.guidelineText}>• {g}</Text>
                ))}
              </View>
            </View>

            {/* Medical Disclaimer Card */}
            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerText}>{data.disclaimer}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#F1F5F9' },
  backBtnText: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  headerCenter: { alignItems: 'center' },
  headerBadge: { fontSize: 9, fontWeight: '900', color: '#16A34A', letterSpacing: 1.2 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 60 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: { fontSize: 11, fontWeight: '900', color: '#64748B', letterSpacing: 1, marginBottom: 14 },

  doshaRow: { flexDirection: 'row', gap: 10 },
  doshaPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  doshaPillActive: { backgroundColor: '#F0FDF4', borderColor: '#16A34A' },
  doshaEmoji: { fontSize: 24, marginBottom: 4 },
  doshaName: { fontSize: 14, fontWeight: '800', color: '#475569' },
  doshaNameActive: { color: '#15803D' },
  doshaDesc: { fontSize: 10, color: '#94A3B8', marginTop: 2 },

  loadingBox: { padding: 30, alignItems: 'center' },
  loadingText: { color: '#64748B', fontSize: 13, fontWeight: '600', marginTop: 12, textAlign: 'center' },

  insightCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  scoreBadge: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  scoreNum: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  scoreLabel: { fontSize: 9, fontWeight: '800', color: '#DCFCE7', textTransform: 'uppercase' },
  insightTextWrap: { flex: 1 },
  insightTitle: { fontSize: 16, fontWeight: '800', color: '#14532D', marginBottom: 4 },
  insightSub: { fontSize: 12, color: '#166534', lineHeight: 18 },

  propSection: { marginBottom: 14 },
  coolingHeader: { fontSize: 13, fontWeight: '800', color: '#0284C7', marginBottom: 8 },
  heatingHeader: { fontSize: 13, fontWeight: '800', color: '#EA580C', marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  coolingChip: { backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#BAE6FD' },
  coolingChipText: { fontSize: 12, fontWeight: '700', color: '#0369A1' },
  heatingChip: { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#FED7AA' },
  heatingChipText: { fontSize: 12, fontWeight: '700', color: '#C2410C' },

  pairingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  pairingBullet: { fontSize: 14 },
  pairingText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },

  guidelinesRow: { flexDirection: 'row', gap: 12 },
  halfCard: { flex: 1 },
  eatMoreHeader: { fontSize: 13, fontWeight: '800', color: '#15803D', marginBottom: 8 },
  eatLessHeader: { fontSize: 13, fontWeight: '800', color: '#B91C1C', marginBottom: 8 },
  guidelineText: { fontSize: 12, color: '#334155', marginBottom: 6, lineHeight: 16 },

  disclaimerCard: { backgroundColor: '#FFFBEB', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#FDE68A' },
  disclaimerText: { fontSize: 11, color: '#B45309', lineHeight: 16, fontWeight: '600' },
});
