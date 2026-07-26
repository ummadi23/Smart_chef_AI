import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Image } from 'react-native';
import Storage from './utils/storage';
import { getApiBaseUrl } from './config';
import AuthScreen from './screens/AuthScreen';
import ScannerScreen from './screens/ScannerScreen';
import CommunityScreen from './screens/CommunityScreen';
import VoiceAssistantScreen from './screens/VoiceAssistantScreen';
import HealthAndLeftoverScreen from './screens/HealthAndLeftoverScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import QuestionnaireScreen, { UserPreferences } from './screens/QuestionnaireScreen';
import SplashScreen from './screens/SplashScreen';
import ScanYourFridgeLandingScreen from './screens/ScanYourFridgeLandingScreen';
import { performFirebaseGoogleAuth } from './utils/firebaseAuth';
import AyurvedicScreen from './screens/AyurvedicScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import BottomNavBar, { TabType } from './components/BottomNavBar';
import GlobalDishFinderScreen from './screens/GlobalDishFinderScreen';


export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'scan_landing' | 'home' | 'scanner' | 'community' | 'voice' | 'health' | 'ayurveda' | 'profile' | 'recipes' | 'edit_preferences'>('home');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isShowingSplash, setIsShowingSplash] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [onboardingStage, setOnboardingStage] = useState<'slides' | 'questionnaire' | 'completed'>('slides');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  // Sync tab switching to current screen
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'scan') setCurrentScreen('scan_landing');
    else if (tab === 'youtube') setCurrentScreen('voice');
    else if (tab === 'ayurveda') setCurrentScreen('ayurveda');
    else if (tab === 'leftovers') setCurrentScreen('health');
    else if (tab === 'community') setCurrentScreen('community');
    else if (tab === 'profile') setCurrentScreen('profile');
    else if (tab === 'recipes') setCurrentScreen('recipes');

  };

  // Load saved preferences on app start while requiring Create Account screen
  useEffect(() => {
    Storage.getItem('userPreferences')
      .then((storedPrefs) => {
        if (storedPrefs) {
          try {
            setUserPreferences(JSON.parse(storedPrefs));
          } catch (e) { }
        }
      })
      .catch((err) => {
        console.error('Storage error on launch:', err);
      })
      .finally(() => {
        setUserProfile(null);
        setOnboardingStage('completed');
        setIsLoadingSession(false);
      });
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardingStage('questionnaire');
  };

  const handleQuestionnaireComplete = async (prefs: UserPreferences) => {
    const updatedPrefs = { ...prefs, onboardingComplete: true };
    setUserPreferences(updatedPrefs);
    await Storage.setItem('userPreferences', JSON.stringify(updatedPrefs));

    if (userProfile) {
      const updatedUser = { ...userProfile, preferences: updatedPrefs };
      setUserProfile(updatedUser);
      await Storage.setItem('userSession', JSON.stringify(updatedUser));
    }

    setOnboardingStage('completed');
    if (currentScreen === 'edit_preferences') {
      setCurrentScreen('home');
    }

    // Sync updated preferences & onboardingComplete: true to backend database
    if (userProfile && userProfile.id) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/auth/update-preferences`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userProfile.id, preferences: updatedPrefs })
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.user) {
            setUserProfile(resJson.user);
            await Storage.setItem('userSession', JSON.stringify(resJson.user));
          }
        }
      } catch (err) {
        console.error('Failed to sync updated preferences to backend:', err);
      }
    }
  };

  const handleLoginSuccess = async (userData: any, isSignUp: boolean = false) => {
    await Storage.setItem('userSession', JSON.stringify(userData));
    setUserProfile(userData);

    const isComplete = userData?.preferences?.onboardingComplete;
    if (isSignUp || !isComplete) {
      // New Account Sign-Up -> Route through Workflow screens
      setOnboardingStage('slides');
    } else {
      // Existing User Log-In -> Skip Workflow screens completely
      setOnboardingStage('completed');
    }
  };

  const handleGoogleAuth = async (selectedAccount?: any) => {
    try {
      setIsLoadingSession(true);
      let email = '';
      let name = '';
      let googleId = '';

      if (selectedAccount?.email) {
        email = selectedAccount.email;
        name = selectedAccount.name;
        googleId = selectedAccount.id;
      } else {
        // Trigger Official Real Firebase Google Account Authentication
        try {
          const firebaseUser = await performFirebaseGoogleAuth();
          email = firebaseUser.email;
          name = firebaseUser.displayName;
          googleId = firebaseUser.uid;
        } catch (fbErr: any) {
          if (fbErr.code === 'auth/popup-closed-by-user') {
            setIsLoadingSession(false);
            return;
          }
          console.warn('Firebase popup unavailable, prompting fallback account details.');
          // Provide fallback account entry if popup is cancelled or blocked
          email = 'google.user@example.com';
          name = 'Google User';
          googleId = `google_${Date.now()}`;
        }
      }

      if (!email) {
        setIsLoadingSession(false);
        return;
      }

      const response = await fetch(`${getApiBaseUrl()}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, googleId })
      });
      const json = await response.json();
      if (response.ok) {
        setIsShowingSplash(false);
        await handleLoginSuccess(json.user, json.isNewUser || false);
      } else {
        alert(json.message || 'Google Auth Failed.');
      }
    } catch (err) {
      alert('Google Auth connection failed. Ensure backend server is running.');
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleLogout = async () => {
    await Storage.removeItem('userSession');
    setUserProfile(null);
    setCurrentScreen('home');
    setOnboardingStage('slides');
    setIsShowingSplash(true);
  };

  // 1. Initial Launch: Display App Logo Splash Screen
  if (isShowingSplash && !userProfile) {
    return <SplashScreen onFinish={() => setIsShowingSplash(false)} />;
  }

  // 2. Show loading spinner if checking session takes time
  if (isLoadingSession) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </SafeAreaView>
    );
  }

  // 3. AUTH GATE STEP 1: Not signed in -> Show Auth Screen (Sign-Up / Log In)
  if (!userProfile) {
    return (
      <AuthScreen
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
        userPreferences={userPreferences}
        onGoogleAuth={handleGoogleAuth}
        onBackToSplash={() => setIsShowingSplash(true)}
      />
    );
  }

  // 4. AUTH GATE STEP 2: Signed in -> If onboardingStage is not completed, show Workflow screens
  if (onboardingStage !== 'completed') {
    if (onboardingStage === 'slides') {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }
    if (onboardingStage === 'questionnaire') {
      return (
        <QuestionnaireScreen
          initialPreferences={userPreferences || userProfile?.preferences}
          onBackToOnboarding={() => setOnboardingStage('slides')}
          onComplete={handleQuestionnaireComplete}
        />
      );
    }
  }

  // 5. STAGE 4: Edit Preferences Mode
  if (currentScreen === 'edit_preferences') {
    return (
      <QuestionnaireScreen
        initialPreferences={userPreferences || userProfile?.preferences}
        isEditMode={true}
        onBackToOnboarding={() => setCurrentScreen('home')}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }

  let renderActiveScreen = () => {
    if (currentScreen === 'home') return (
      <DashboardScreen
        userProfile={userProfile}
        userPreferences={userPreferences}
        onNavigate={(targetScreen) => {
          if (targetScreen === 'scan_landing') {
            setActiveTab('scan');
            setCurrentScreen('scan_landing');
          } else if (targetScreen === 'scanner') {
            setActiveTab('scan');
            setCurrentScreen('scanner');
          } else if (targetScreen === 'ayurveda') {
            setActiveTab('ayurveda');
            setCurrentScreen('ayurveda');
          } else if (targetScreen === 'health') {
            setActiveTab('leftovers');
            setCurrentScreen('health');
          } else if (targetScreen === 'voice') {
            setActiveTab('youtube');
            setCurrentScreen('voice');
          } else if (targetScreen === 'community') {
            setActiveTab('community');
            setCurrentScreen('community');
          } else if (targetScreen === 'profile') {
            setActiveTab('profile');
            setCurrentScreen('profile');
          } else if (targetScreen === 'edit_preferences') {
            setCurrentScreen('edit_preferences');
          } else if (targetScreen === 'recipes') {
            setActiveTab('recipes');
            setCurrentScreen('recipes');
          }
        }}
      />
    );

    if (currentScreen === 'recipes') return <GlobalDishFinderScreen />;
    if (currentScreen === 'profile') return (
      <ProfileScreen
        userProfile={userProfile}
        userPreferences={userPreferences}
        onEditPreferences={() => setCurrentScreen('edit_preferences')}
        onLogout={handleLogout}
      />
    );
    if (currentScreen === 'scanner') return <ScannerScreen onBack={() => { setActiveTab('home'); setCurrentScreen('home'); }} />;
    if (currentScreen === 'community') return <CommunityScreen onBack={() => { setActiveTab('home'); setCurrentScreen('home'); }} />;
    if (currentScreen === 'voice') return <VoiceAssistantScreen onBack={() => { setActiveTab('home'); setCurrentScreen('home'); }} />;
    if (currentScreen === 'health') return <HealthAndLeftoverScreen onBack={() => { setActiveTab('home'); setCurrentScreen('home'); }} />;
    if (currentScreen === 'ayurveda') return <AyurvedicScreen onBack={() => { setActiveTab('home'); setCurrentScreen('home'); }} />;

    return (
      <ScanYourFridgeLandingScreen
        onStartScan={() => setCurrentScreen('scanner')}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ flex: 1, paddingBottom: 60 }}>
        {renderActiveScreen()}
      </View>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 24 },
  greetingText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  titleText: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginTop: 4, lineHeight: 30 },
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  searchContainer: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 54, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2, marginBottom: 16 },
  onboardingPillBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#48B02C', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 24 },
  onboardingPillEmoji: { fontSize: 18, marginRight: 10 },
  onboardingPillText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#48B02C' },
  onboardingPillArrow: { fontSize: 18, color: '#48B02C', fontWeight: 'bold' },
  searchInput: { fontSize: 15, color: '#1A1A1A' },
  sectionHeading: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginTop: 24, marginBottom: 16 },
  bentoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  bentoCard: { borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  heroCard: { width: '48%', height: 184, display: 'flex', flexDirection: 'column' },
  bentoColumn: { width: '48%', justifyContent: 'space-between' },
  smallCard: { height: 86, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  cardEmoji: { fontSize: 32, marginBottom: 14 },
  cardEmojiSmall: { fontSize: 22, marginRight: 10 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', lineHeight: 20 },
  cardSubtitle: { fontSize: 11, color: '#666', marginTop: 2 },
  cardTitleSmall: { fontSize: 12, fontWeight: '600', color: '#1A1A1A', flexShrink: 1 },
  communityBanner: { backgroundColor: '#1A1A1A', borderRadius: 24, padding: 24, marginTop: 8 },
  communityTag: { color: '#FFF', fontSize: 12, fontWeight: '600', opacity: 0.8, marginBottom: 8 },
  communityTitle: { color: '#FFF', fontSize: 15, fontWeight: '500', lineHeight: 22 },
  fabButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#FF6B6B', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, shadowColor: '#FF6B6B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  fabText: { color: '#FFF', fontSize: 15, fontWeight: '600' }
});
