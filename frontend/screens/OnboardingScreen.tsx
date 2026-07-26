import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: '1',
    title: '1. Smart Fridge Scanner',
    subtitle: 'Take a photo of your fridge or pantry. AI instantly identifies ingredients with precision.',
    imageSource: require('../assets/workflow_slide1.png'),
    buttonText: 'Continue',
  },
  {
    id: '2',
    title: '2. AI Recipe Workflow',
    subtitle: 'Generate customized recipes step-by-step based on available ingredients & dietary preferences.',
    imageSource: require('../assets/workflow_slide2.png'),
    buttonText: 'Continue',
  },
  {
    id: '3',
    title: '3. Health & Ayurvedic Insights',
    subtitle: 'Track nutrition, leftover shelf-life, and balance your body dosha with ancient wellness intelligence.',
    imageSource: require('../assets/workflow_slide3.png'),
    buttonText: 'Start Cooking Workflow',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        {/* Top Rounded Image Frame */}
        <View style={styles.imageContainer}>
          <Image
            source={currentSlide.imageSource}
            style={styles.slideImage}
            resizeMode="cover"
          />
        </View>

        {/* Text Details Section */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{currentSlide.title}</Text>
          <Text style={styles.subtitleText}>{currentSlide.subtitle}</Text>
        </View>

        {/* Pagination Indicator Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.actionButtonText}>{currentSlide.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 44 : 28,
    paddingBottom: 36,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.95,
    maxHeight: 420,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F5F5F7',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#1A1A1A',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E5E5EA',
  },
  actionButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
