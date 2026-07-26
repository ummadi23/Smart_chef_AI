import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Image
} from 'react-native';
import { UserPreferences } from './QuestionnaireScreen';

interface ProfileScreenProps {
  userProfile: any;
  userPreferences?: UserPreferences | null;
  onEditPreferences: () => void;
  onLogout: () => void;
}

const GOAL_MAP: Record<string, string> = {
  healthier: '❤️ Eat Healthier',
  save_money: '🐖 Save Money',
  learn_recipes: '📖 Learn New Recipes',
  reduce_waste: '🍃 Reduce Food Waste',
  cook_faster: '⏱️ Cook Faster',
  impress: '🎉 Impress Others',
};

const SKILL_MAP: Record<string, string> = {
  beginner: '🥄 Beginner (Keep it simple)',
  intermediate: '🍳 Intermediate (Regular Cook)',
  advanced: '👨‍🍳 Advanced (Experimental & Gourmet)',
};

const GROUP_MAP: Record<string, string> = {
  '1': '👤 Just Me',
  '2': '👥 Couple',
  '3-4': '👪 Family (3-4)',
  '5+': '👨‍👩‍👧‍👦 Big Group (5+)',
};

const CUISINE_MAP: Record<string, string> = {
  american: '🇺🇸 American',
  asian: '🌏 Asian',
  mexican: '🇲🇽 Mexican',
  indian: '🇮🇳 Indian',
  italian: '🇮🇹 Italian',
  mediterranean: '🌿 Mediterranean',
  greek: '🇬🇷 Greek',
  turkish: '🇹🇷 Turkish',
  french: '🇫🇷 French',
  spanish: '🇪🇸 Spanish',
  chinese: '🇨🇳 Chinese',
  japanese: '🇯🇵 Japanese',
  thai: '🇹🇭 Thai',
  korean: '🇰🇷 Korean',
  vietnamese: '🇻🇳 Vietnamese',
  lebanese: '🇱🇧 Lebanese',
  moroccan: '🇲🇦 Moroccan',
};

export default function ProfileScreen({
  userProfile,
  userPreferences,
  onEditPreferences,
  onLogout,
}: ProfileScreenProps) {
  const getCleanName = () => {
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

  const username = getCleanName();
  const email = userProfile?.email || 'chef@smartchef.ai';
  const avatarChar = username.charAt(0).toUpperCase();

  const prefs = userPreferences || userProfile?.preferences || {};
  
  const skill = SKILL_MAP[prefs?.cookingSkill] || prefs?.cookingSkill || '🍳 Intermediate (Regular Cook)';
  const groupSize = GROUP_MAP[prefs?.groupSize] || prefs?.groupSize || '👤 Just Me';

  const rawGoals: string[] = prefs?.goals && prefs.goals.length > 0 ? prefs.goals : ['healthier', 'reduce_waste'];
  const goals = rawGoals.map(g => GOAL_MAP[g] || g);

  const rawCuisines: string[] = prefs?.cuisines && prefs.cuisines.length > 0 ? prefs.cuisines : ['indian', 'italian', 'asian'];
  const cuisines = rawCuisines.map(c => CUISINE_MAP[c] || (c.charAt(0).toUpperCase() + c.slice(1)));

  const dietary: string[] = prefs?.dietaryNeeds && prefs.dietaryNeeds.length > 0 ? prefs.dietaryNeeds : [];
  const allergies: string[] = prefs?.allergies && prefs.allergies.length > 0 ? prefs.allergies : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderTitle}>My Profile</Text>
          <Text style={styles.topHeaderSubtitle}>Account Settings & Preferences</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarChar}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.userEmail}>{email}</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>✨ Smart Chef Master</Text>
            </View>
          </View>
        </View>

        {/* Kitchen Preferences Summary Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>🍳 Kitchen Preferences</Text>
            <TouchableOpacity style={styles.editBtn} onPress={onEditPreferences} activeOpacity={0.8}>
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.prefGroup}>
            <Text style={styles.prefLabel}>Cooking Skill Level</Text>
            <Text style={styles.prefValue}>{skill}</Text>
          </View>

          <View style={styles.prefGroup}>
            <Text style={styles.prefLabel}>Household Serving Size</Text>
            <Text style={styles.prefValue}>{groupSize}</Text>
          </View>

          <View style={styles.prefGroup}>
            <Text style={styles.prefLabel}>Dietary Goals</Text>
            <View style={styles.chipRow}>
              {goals.map((g: string, idx: number) => (
                <View key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>{g}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.prefGroup}>
            <Text style={styles.prefLabel}>Favorite Cuisines</Text>
            <View style={styles.chipRow}>
              {cuisines.map((c: string, idx: number) => (
                <View key={idx} style={[styles.chip, styles.chipCuisine]}>
                  <Text style={styles.chipCuisineText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          {dietary.length > 0 && (
            <View style={styles.prefGroup}>
              <Text style={styles.prefLabel}>Dietary Restrictions</Text>
              <View style={styles.chipRow}>
                {dietary.map((d: string, idx: number) => (
                  <View key={idx} style={[styles.chip, styles.chipDietary]}>
                    <Text style={styles.chipDietaryText}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {allergies.length > 0 && (
            <View style={styles.prefGroup}>
              <Text style={styles.prefLabel}>Allergies</Text>
              <View style={styles.chipRow}>
                {allergies.map((a: string, idx: number) => (
                  <View key={idx} style={[styles.chip, styles.chipAllergy]}>
                    <Text style={styles.chipAllergyText}>⚠️ {a}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Quick Edit Preferences Banner */}
        <TouchableOpacity
          style={styles.editBanner}
          onPress={onEditPreferences}
          activeOpacity={0.85}
        >
          <Text style={styles.editBannerEmoji}>⚙️</Text>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <Text style={styles.editBannerTitle}>Update Questionnaire Answers</Text>
            <Text style={styles.editBannerSubtitle}>Refine your meal suggestions & ingredient matches</Text>
          </View>
          <Text style={styles.editBannerArrow}>›</Text>
        </TouchableOpacity>

        {/* Account Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.actionRow} onPress={onLogout} activeOpacity={0.8}>
            <Text style={styles.actionRowIcon}>🚪</Text>
            <Text style={styles.actionRowTextDanger}>Log Out of Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Smart Chef AI • Version 2.4.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 90,
  },
  topHeader: {
    marginBottom: 20,
  },
  topHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  topHeaderSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4ADE80',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4ADE80',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#334155',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ADE80',
  },
  prefGroup: {
    marginBottom: 14,
  },
  prefLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prefValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  chip: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  chipCuisine: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  chipCuisineText: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: '600',
  },
  chipDietary: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  chipDietaryText: {
    fontSize: 12,
    color: '#C084FC',
    fontWeight: '600',
  },
  chipAllergy: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  chipAllergyText: {
    fontSize: 12,
    color: '#FCA5A5',
    fontWeight: '600',
  },
  editBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  editBannerEmoji: {
    fontSize: 22,
  },
  editBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBannerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  editBannerArrow: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionRowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  actionRowTextDanger: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
});
