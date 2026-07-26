import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Linking
} from 'react-native';

export interface UserPreferences {
  groupSize: string;
  goals: string[];
  cookingSkill: string;
  cuisines: string[];
  dietaryNeeds: string[];
  allergies: string[];
  onboardingComplete?: boolean;
}

interface QuestionnaireScreenProps {
  initialPreferences?: UserPreferences | null;
  onBackToOnboarding?: () => void;
  onComplete: (preferences: UserPreferences) => void;
  isEditMode?: boolean;
}

const GROUP_OPTIONS = [
  { id: '1', number: '1', label: 'Just me', icon: '👤' },
  { id: '2', number: '2', label: 'Couple', icon: '👥' },
  { id: '3-4', number: '3-4', label: 'Family', icon: '👪' },
  { id: '5+', number: '5+', label: 'Big group', icon: '👨‍👩‍👧‍👦' },
];

const GOAL_OPTIONS = [
  { id: 'healthier', label: 'Eat healthier', icon: '❤️' },
  { id: 'save_money', label: 'Save money', icon: '🐖' },
  { id: 'learn_recipes', label: 'Learn new recipes', icon: '📖' },
  { id: 'reduce_waste', label: 'Reduce food waste', icon: '🍃' },
  { id: 'cook_faster', label: 'Cook faster', icon: '⏱️' },
  { id: 'impress', label: 'Impress others', icon: '🎉' },
];

const SKILL_OPTIONS = [
  { id: 'beginner', title: 'Beginner', subtitle: 'I rarely cook — keep it simple!', icon: '🥄' },
  { id: 'intermediate', title: 'Intermediate', subtitle: 'I cook a few times a week', icon: '🍳' },
  { id: 'advanced', title: 'Advanced', subtitle: 'I love cooking and experimenting', icon: '👨‍🍳' },
];

const CUISINE_OPTIONS = [
  { id: 'american', label: 'American', subtitle: 'Burgers, BBQ & comfort food', icon: '🇺🇸' },
  { id: 'asian', label: 'Asian', subtitle: 'Bold flavors across the continent', icon: '🌏' },
  { id: 'mexican', label: 'Mexican', subtitle: 'Tacos, salsas & spicy heat', icon: '🇲🇽' },
  { id: 'indian', label: 'Indian', subtitle: 'Rich curries & aromatic spices', icon: '🇮🇳' },
  { id: 'italian', label: 'Italian', subtitle: 'Pasta, pizza & dolce vita', icon: '🇮🇹' },
  { id: 'mediterranean', label: 'Mediterranean', subtitle: 'Fresh herbs, olive oil & fish', icon: '🌿' },
  { id: 'greek', label: 'Greek', subtitle: 'Mezze, lamb & feta cheese', icon: '🇬🇷' },
  { id: 'turkish', label: 'Turkish', subtitle: 'Kebabs, mezze & baklava', icon: '🇹🇷' },
  { id: 'french', label: 'French', subtitle: 'Bistro classics, pastries & wine', icon: '🇫🇷' },
  { id: 'spanish', label: 'Spanish', subtitle: 'Tapas, paella & sangria', icon: '🇪🇸' },
  { id: 'chinese', label: 'Chinese', subtitle: 'Dim sum, stir-fries & noodles', icon: '🇨🇳' },
  { id: 'japanese', label: 'Japanese', subtitle: 'Sushi, ramen & savory bento', icon: '🇯🇵' },
  { id: 'thai', label: 'Thai', subtitle: 'Pad thai, curries & street food', icon: '🇹🇭' },
  { id: 'korean', label: 'Korean', subtitle: 'K-BBQ, kimchi & bibimbap', icon: '🇰🇷' },
  { id: 'vietnamese', label: 'Vietnamese', subtitle: 'Pho, bahn mi & fresh rolls', icon: '🇻🇳' },
  { id: 'lebanese', label: 'Lebanese', subtitle: 'Hummus, falafel & shawarma', icon: '🇱🇧' },
  { id: 'moroccan', label: 'Moroccan', subtitle: 'Tagines, couscous & aromatic tea', icon: '🇲🇦' },
  { id: 'caribbean', label: 'Caribbean', subtitle: 'Jerk spice, plantains & seafood', icon: '🇯🇲' },
  { id: 'brazilian', label: 'Brazilian', subtitle: 'Churrasco, feijoada & açai', icon: '🇧🇷' },
  { id: 'african', label: 'African', subtitle: 'Jollof rice, stews & plant-based', icon: '🌍' },
  { id: 'german', label: 'German', subtitle: 'Schnitzel, pretzels & hearty roasts', icon: '🇩🇪' },
  { id: 'eastern_european', label: 'Eastern European', subtitle: 'Pierogi, borscht & goulash', icon: '🇪🇺' },
  { id: 'british', label: 'British', subtitle: 'Sunday roast, pies & pub grub', icon: '🇬🇧' },
];

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
  { id: 'vegan', label: 'Vegan', icon: '🌾' },
  { id: 'keto', label: 'Keto', icon: '⚡' },
  { id: 'gluten_free', label: 'Gluten-free', icon: '🌾' },
  { id: 'low_carb', label: 'Low-carb', icon: '📈' },
  { id: 'kosher', label: 'Kosher', icon: '⭐' },
  { id: 'halal', label: 'Halal', icon: '🌙' },
  { id: 'high_protein', label: 'High-protein', icon: '🏋️' },
  { id: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
  { id: 'paleo', label: 'Paleo', icon: '🥩' },
  { id: 'dairy_free', label: 'Dairy-free', icon: '🥛' },
  { id: 'nut_free', label: 'Nut-free', icon: '🚫' },
  { id: 'soy_free', label: 'Soy-free', icon: '⊗' },
  { id: 'egg_free', label: 'Egg-free', icon: '🥚' },
  { id: 'low_sodium', label: 'Low-sodium', icon: '💧' },
  { id: 'diabetic', label: 'Diabetic-friendly', icon: '🏥' },
  { id: 'low_fat', label: 'Low-fat', icon: '🤍' },
  { id: 'whole30', label: 'Whole30', icon: '📅' },
  { id: 'mediterranean_diet', label: 'Mediterranean', icon: '🌊' },
  { id: 'raw_food', label: 'Raw food', icon: '🥗' },
  { id: 'flexitarian', label: 'Flexitarian', icon: '⚖️' },
];

const ALLERGY_OPTIONS = [
  { id: 'nuts', label: 'Nuts', icon: '🥜' },
  { id: 'peanuts', label: 'Peanuts', icon: '⭕' },
  { id: 'tree_nuts', label: 'Tree nuts', icon: '🌲' },
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'soy', label: 'Soy', icon: '🌿' },
  { id: 'wheat', label: 'Wheat', icon: '🌾' },
  { id: 'gluten', label: 'Gluten', icon: '░' },
  { id: 'sesame', label: 'Sesame', icon: '🫓' },
  { id: 'mustard', label: 'Mustard', icon: '🌼' },
  { id: 'celery', label: 'Celery', icon: '🌿' },
  { id: 'corn', label: 'Corn', icon: '🌽' },
  { id: 'lupin', label: 'Lupin', icon: '🌸' },
  { id: 'sulfites', label: 'Sulfites', icon: '🧪' },
  { id: 'mollusks', label: 'Mollusks', icon: '🐚' },
];

export default function QuestionnaireScreen({
  initialPreferences,
  onBackToOnboarding,
  onComplete,
  isEditMode = false
}: QuestionnaireScreenProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedGroupSize, setSelectedGroupSize] = useState<string | null>(initialPreferences?.groupSize || null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialPreferences?.goals || []);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(initialPreferences?.cookingSkill || null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(initialPreferences?.cuisines || []);
  const [selectedDietaryNeeds, setSelectedDietaryNeeds] = useState<string[]>(initialPreferences?.dietaryNeeds || []);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(initialPreferences?.allergies || []);

  const toggleArrayItem = (list: string[], setList: (items: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBackToOnboarding) {
      onBackToOnboarding();
    }
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupSize(groupId);
    setTimeout(() => setStep(2), 200);
  };

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
    setTimeout(() => setStep(4), 200);
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      finishQuestionnaire();
    }
  };

  const finishQuestionnaire = () => {
    onComplete({
      groupSize: selectedGroupSize || '1',
      goals: selectedGoals,
      cookingSkill: selectedSkill || 'intermediate',
      cuisines: selectedCuisines,
      dietaryNeeds: selectedDietaryNeeds,
      allergies: selectedAllergies,
      onboardingComplete: true,
    });
  };

  const isContinueEnabled = () => {
    if (step === 1) return selectedGroupSize !== null;
    if (step === 2) return selectedGoals.length > 0;
    if (step === 3) return selectedSkill !== null;
    if (step === 4) return selectedCuisines.length > 0;
    if (step === 5) return true;
    if (step === 6) return true;
    return true;
  };

  const progressPercent = `${Math.round((step / 6) * 100)}%`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with Back Button and Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressPercent as any }]} />
        </View>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: GROUP SIZE */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.questionTitle}>
              How many people do you usually cook for?
            </Text>

            <View style={styles.gridContainer}>
              {GROUP_OPTIONS.map((item) => {
                const isSelected = selectedGroupSize === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.gridCard,
                      isSelected ? styles.gridCardSelected : styles.gridCardUnselected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleGroupSelect(item.id)}
                  >
                    <Text style={styles.gridIcon}>{item.icon}</Text>
                    <Text style={[styles.gridNumber, isSelected && styles.textSelected]}>
                      {item.number}
                    </Text>
                    <Text style={[styles.gridLabel, isSelected && styles.textSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 2: KITCHEN GOALS */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.questionTitle}>
              What are your goals in the kitchen?
            </Text>
            <Text style={styles.questionSubtitle}>Select all that apply</Text>

            <View style={styles.listContainer}>
              {GOAL_OPTIONS.map((item) => {
                const isSelected = selectedGoals.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionCard,
                      isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => toggleArrayItem(selectedGoals, setSelectedGoals, item.id)}
                  >
                    <View style={styles.cardLeftContent}>
                      <Text style={styles.cardIcon}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.cardLabel,
                          isSelected ? styles.cardLabelSelected : styles.cardLabelUnselected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {isSelected && (
                      <View style={styles.checkmarkCircle}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: COOKING SKILL */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.questionTitle}>
              What is your cooking skill?
            </Text>

            <View style={styles.skillListContainer}>
              {SKILL_OPTIONS.map((item) => {
                const isSelected = selectedSkill === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.skillCard,
                      isSelected ? styles.skillCardSelected : styles.skillCardUnselected,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleSkillSelect(item.id)}
                  >
                    <View style={styles.skillIconBox}>
                      <Text style={styles.skillIcon}>{item.icon}</Text>
                    </View>

                    <View style={styles.skillTextContent}>
                      <Text style={[styles.skillTitle, isSelected && styles.textSelected]}>
                        {item.title}
                      </Text>
                      <Text style={styles.skillSubtitle}>{item.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 4: CUISINES */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.questionTitle}>
              Select cuisines you'd like to try
            </Text>
            <Text style={styles.questionSubtitle}>Pick as many as you want</Text>

            <View style={styles.listContainer}>
              {CUISINE_OPTIONS.map((item) => {
                const isSelected = selectedCuisines.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.cuisineCard,
                      isSelected ? styles.cuisineCardSelected : styles.cuisineCardUnselected,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => toggleArrayItem(selectedCuisines, setSelectedCuisines, item.id)}
                  >
                    <View style={styles.cardLeftContent}>
                      <View style={styles.cuisineIconBox}>
                        <Text style={styles.cuisineIcon}>{item.icon}</Text>
                      </View>

                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text
                          style={[
                            styles.cardLabel,
                            isSelected ? styles.cuisineLabelSelected : styles.cardLabelUnselected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={styles.cuisineSubLabel}>{item.subtitle}</Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View style={styles.amberCheckmarkCircle}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 5: DIETARY NEEDS */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.questionTitle}>
              Dietary needs
            </Text>
            <Text style={styles.questionSubtitle}>Select any that apply to you</Text>

            <View style={styles.pillContainer}>
              {DIETARY_OPTIONS.map((item) => {
                const isSelected = selectedDietaryNeeds.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleArrayItem(selectedDietaryNeeds, setSelectedDietaryNeeds, item.id)}
                  >
                    <Text style={styles.pillIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.pillLabel,
                        isSelected ? styles.pillLabelSelected : styles.pillLabelUnselected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 6: ALLERGIES */}
        {step === 6 && (
          <View style={styles.stepContainer}>
            <Text style={styles.questionTitle}>
              Allergies
            </Text>
            <Text style={styles.questionSubtitle}>Select any food allergies you have</Text>

            <View style={styles.pillContainer}>
              {ALLERGY_OPTIONS.map((item) => {
                const isSelected = selectedAllergies.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleArrayItem(selectedAllergies, setSelectedAllergies, item.id)}
                  >
                    <Text style={styles.pillIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.pillLabel,
                        isSelected ? styles.pillLabelSelected : styles.pillLabelUnselected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Button for Steps 2 to 6 */}
      {step >= 2 && step <= 6 && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isContinueEnabled() ? styles.buttonActive : styles.buttonDisabled,
            ]}
            disabled={!isContinueEnabled()}
            activeOpacity={0.85}
            onPress={handleNextStep}
          >
            <Text
              style={[
                styles.buttonText,
                isContinueEnabled() ? styles.buttonTextActive : styles.buttonTextDisabled,
              ]}
            >
              {step === 6 ? 'Complete' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    lineHeight: 32,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#48B02C',
    borderRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  stepContainer: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 34,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 20,
  },

  /* GRID STYLING FOR STEP 1 */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridCard: {
    width: '47.5%',
    height: 160,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
  },
  gridCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAEAEA',
  },
  gridCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#48B02C',
  },
  gridIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  gridNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  gridLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  textSelected: {
    color: '#48B02C',
  },

  /* LIST STYLING FOR STEP 2 & GENERAL CARDS */
  listContainer: {
    marginTop: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  optionCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAEAEA',
  },
  optionCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#48B02C',
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardLabelUnselected: {
    color: '#1A1A1A',
  },
  cardLabelSelected: {
    color: '#48B02C',
  },
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#48B02C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  /* STEP 3: COOKING SKILL STYLING */
  skillListContainer: {
    marginTop: 16,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  skillCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAEAEA',
  },
  skillCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#48B02C',
  },
  skillIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#F3F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  skillIcon: {
    fontSize: 28,
  },
  skillTextContent: {
    flex: 1,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  skillSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },

  /* STEP 4: CUISINE STYLING */
  cuisineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  cuisineCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAEAEA',
  },
  cuisineCardSelected: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  cuisineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cuisineIcon: {
    fontSize: 22,
  },
  cuisineLabelSelected: {
    color: '#F59E0B',
  },
  cuisineSubLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  amberCheckmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* STEPS 5 & 6: PILL GRID STYLING */
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  pillUnselected: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EAEAEA',
  },
  pillSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#48B02C',
  },
  pillIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  pillLabelUnselected: {
    color: '#4A4A4A',
  },
  pillLabelSelected: {
    color: '#48B02C',
  },

  /* STEP 7: RATING PROMPT STYLING */
  ratingContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  ratingHeartBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  ratingHeartEmoji: {
    fontSize: 48,
  },
  ratingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  ratingSubtitle: {
    fontSize: 15,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 12,
  },
  ratingButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  ratingButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  ratingSkipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ratingSkipText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '600',
  },

  /* FOOTER & BUTTON */
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
  },
  continueButton: {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  buttonActive: {
    backgroundColor: '#48B02C',
    shadowColor: '#48B02C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#8E8E93',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
});
