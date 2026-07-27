import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Platform
} from 'react-native';

interface ScanYourFridgeLandingScreenProps {
  onStartScan: () => void;
}

export default function ScanYourFridgeLandingScreen({
  onStartScan
}: ScanYourFridgeLandingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Centered Content */}
      <View style={styles.content}>
        {/* Soft Light Green Circle Badge with Camera Icon */}
        <View style={styles.iconCircle}>
          <View style={styles.cameraIconBox}>
            <Text style={styles.cameraEmoji}>📷</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.titleText}>Scan Your Ingredients Photo</Text>
        <Text style={styles.subtitleText}>
          Gather all your available ingredients together in one place, snap a quick photo, and get instant recipes!
        </Text>
      </View>

      {/* Bottom Full-Width Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startScanButton}
          activeOpacity={0.85}
          onPress={onStartScan}
        >
          <Text style={styles.startScanButtonText}>📸 Snap Ingredients Photo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  topBar: {
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 44 : 28,
    paddingBottom: 8,
  },
  dashboardBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dashboardBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EBF7EE', // Soft light green circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  cameraIconBox: {
    width: 72,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#48B02C', // Solid green camera body
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraEmoji: {
    fontSize: 32,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    fontWeight: '400',
  },
  footer: {
    paddingBottom: Platform.OS === 'android' ? 36 : 24,
  },
  startScanButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#48B02C', // Matches screenshot green
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#48B02C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  startScanButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  youtubePillBtn: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginRight: 8,
  },
  youtubePillBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  youtubeCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  youtubeCardIcon: {
    fontSize: 24,
  },
  youtubeCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  youtubeCardSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  youtubeCardArrow: {
    fontSize: 18,
    color: '#FF4D4D',
    fontWeight: 'bold',
  },
});
