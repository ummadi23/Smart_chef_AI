import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';
import { getApiBaseUrl } from '../config';
import Storage from '../utils/storage';

import GoogleAccountPickerModal, { GoogleAccount } from './GoogleAccountPickerModal';

WebBrowser.maybeCompleteAuthSession();

interface AuthScreenProps {
  onLoginSuccess: (userData: any, isSignUp?: boolean) => void;
  userPreferences?: any;
  initialMode?: 'login' | 'signup';

  onGoogleAuth?: (selectedAccount?: GoogleAccount) => void;
  onBackToSplash?: () => void;
}

export default function AuthScreen({
  onLoginSuccess,
  userPreferences,
  initialMode = 'signup',
  onGoogleAuth,
  onBackToSplash
}: AuthScreenProps) {
  // All useState hooks moved to top of AuthScreen
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState<boolean>(false);

  // Inline Field Errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    try {
      GoogleSignin.configure({
        scopes: ['email', 'profile'],
      });
    } catch (e) {
      console.warn('GoogleSignin configure warning:', e);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      console.log("User logged in successfully:", JSON.stringify(signInResult));

      const resAny = signInResult as any;
      const userObj = resAny?.data?.user || resAny?.user || resAny;
      
      const userEmail = userObj?.email || resAny?.email;
      const userName = userObj?.name || userObj?.givenName || (userEmail ? userEmail.split('@')[0] : 'Google User');
      const userId = userObj?.id || resAny?.id || `google_${Date.now()}`;

      if (userEmail && onGoogleAuth) {
        onGoogleAuth({
          id: userId,
          email: userEmail,
          name: userName,
          avatarColor: '#4285F4'
        });
        return;
      }
      setIsGoogleModalVisible(true);
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      setIsGoogleModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    clearErrors();

    // Username check for Sign-Up
    if (isSignUp && !username.trim()) {
      setUsernameError('Please enter a username.');
      isValid = false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Password strength check
    if (!password) {
      setPasswordError('Please enter a password.');
      isValid = false;
    } else if (isSignUp) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (password.length < 8 || !hasLetter || !hasNumber) {
        setPasswordError('Password must be at least 8 characters with 1 letter and 1 number.');
        isValid = false;
      }
    }

    // Confirm Password check for Sign-Up
    if (isSignUp) {
      if (!confirmPassword) {
        setConfirmPasswordError('Please confirm your password.');
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match. Please re-enter.');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleAuthAction = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setSuccessMessage('');
    const endpoint = isSignUp ? 'signup' : 'login';

    let prefs = userPreferences;
    if (!prefs) {
      const stored = await Storage.getItem('userPreferences');
      if (stored) prefs = JSON.parse(stored);
    }

    const payload = isSignUp
      ? { username: username.trim(), email: email.trim(), password, preferences: prefs || {} }
      : { email: email.trim(), password };

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (response.ok) {
        onLoginSuccess(json.user, isSignUp);
      } else {
        if (json.error === 'EMAIL_EXISTS') {
          setEmailError('An account with this email already exists. Please log in instead.');
        } else if (json.error === 'EMAIL_NOT_FOUND') {
          setEmailError('No account found with this email. Please create an account first.');
        } else if (json.error === 'INVALID_PASSWORD') {
          setPasswordError('Incorrect email or password. Please try again.');
        } else {
          setEmailError(json.message || 'Authentication failed.');
        }
      }
    } catch (error) {
      console.error('Auth network failure:', error);
      setEmailError('Cannot connect to server. Check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    clearErrors();
    setSuccessMessage('');
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter a new password.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your new password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), newPassword: password })
      });
      const json = await response.json();
      if (response.ok) {
        setSuccessMessage('Password reset successfully! Please log in with your new password.');
        setIsForgotPassword(false);
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        if (json.error === 'EMAIL_NOT_FOUND') {
          setEmailError('No account found with this email.');
        } else {
          setEmailError(json.message || 'Failed to reset password.');
        }
      }
    } catch (err) {
      setEmailError('Cannot connect to server. Ensure backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setIsForgotPassword(false);
    clearErrors();
    setSuccessMessage('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Back Button */}
        {(onBackToSplash || isForgotPassword) && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false);
                clearErrors();
              } else if (onBackToSplash) {
                onBackToSplash();
              }
            }}
          >
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        )}

        {/* Branding Block with App Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.titleText}>
          {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitleText}>
          {isForgotPassword
            ? 'Enter your registered email and a new password'
            : 'Smart Chef AI Kitchen Assistant'}
        </Text>

        {/* SUCCESS BANNER */}
        {!!successMessage && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>✓ {successMessage}</Text>
          </View>
        )}

        {/* USERNAME INPUT (Sign-Up Only) */}
        {isSignUp && !isForgotPassword && (
          <View style={styles.fieldGroup}>
            <View style={[styles.inputBox, usernameError ? styles.inputErrorBorder : null]}>
              <TextInput
                style={styles.inputField}
                placeholder="Username"
                placeholderTextColor="#8E8E93"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) setUsernameError('');
                }}
              />
            </View>
            {!!usernameError && <Text style={styles.inlineErrorText}>{usernameError}</Text>}
          </View>
        )}

        {/* EMAIL INPUT */}
        <View style={styles.fieldGroup}>
          <View style={[styles.inputBox, emailError ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.inputField}
              placeholder="Email Address (e.g. name@gmail.com)"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
            />
          </View>
          {!!emailError && <Text style={styles.inlineErrorText}>{emailError}</Text>}
        </View>

        {/* PASSWORD INPUT */}
        <View style={styles.fieldGroup}>
          <View style={[styles.inputBox, passwordError ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.inputField}
              placeholder={isForgotPassword ? 'New Password' : 'Password'}
              placeholderTextColor="#8E8E93"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
            />
          </View>
          {!!passwordError && <Text style={styles.inlineErrorText}>{passwordError}</Text>}
        </View>

        {/* CONFIRM PASSWORD INPUT (Sign-Up or Reset Password) */}
        {(isSignUp || isForgotPassword) && (
          <View style={styles.fieldGroup}>
            <View style={[styles.inputBox, confirmPasswordError ? styles.inputErrorBorder : null]}>
              <TextInput
                style={styles.inputField}
                placeholder={isForgotPassword ? 'Confirm New Password' : 'Confirm Password'}
                placeholderTextColor="#8E8E93"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
              />
            </View>
            {!!confirmPasswordError && <Text style={styles.inlineErrorText}>{confirmPasswordError}</Text>}
          </View>
        )}

        {/* FORGOT PASSWORD LINK (Log In Mode Only) */}
        {!isSignUp && !isForgotPassword && (
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => {
              setIsForgotPassword(true);
              clearErrors();
              setSuccessMessage('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        {/* MAIN SUBMIT BUTTON */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={isForgotPassword ? handleResetPassword : handleAuthAction}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.actionButtonText}>
              {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Log In'}
            </Text>
          )}
        </TouchableOpacity>

        {/* GOOGLE SIGN-IN ALTERNATIVE BUTTON */}
        {onGoogleAuth && !isForgotPassword && (
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.googleIcon}>🌐</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        )}

        {/* MODE TOGGLE LINK */}
        {!isForgotPassword && (
          <TouchableOpacity style={styles.toggleModeButton} onPress={() => switchMode(!isSignUp)}>
            <Text style={styles.toggleModeText}>
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        )}
        {isForgotPassword && (
          <TouchableOpacity style={styles.toggleModeButton} onPress={() => setIsForgotPassword(false)}>
            <Text style={styles.toggleModeText}>‹ Back to Log In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Interactive Google Account Selector Modal */}
      <GoogleAccountPickerModal
        visible={isGoogleModalVisible}
        onClose={() => setIsGoogleModalVisible(false)}
        onSelectAccount={(selectedAccount) => {
          setIsGoogleModalVisible(false);
          if (onGoogleAuth) {
            onGoogleAuth(selectedAccount);
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backBtnText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  inputBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputField: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  inlineErrorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  actionButton: {
    backgroundColor: '#4ADE80',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  actionButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  googleButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  googleIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleModeButton: {
    marginTop: 20,
    paddingVertical: 4,
  },
  toggleModeText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 14,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  forgotPasswordText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  successBannerText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#4ADE80',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  otpBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 6,
  },
  otpBannerCode: {
    fontSize: 28,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 6,
    marginVertical: 4,
  },
  otpBannerSub: {
    fontSize: 11,
    color: '#16A34A',
    textAlign: 'center',
    marginTop: 4,
  },
});
