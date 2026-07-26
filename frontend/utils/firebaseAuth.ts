import { auth, GoogleAuthProvider, signInWithCredential } from '../config/firebase';
import { Platform } from 'react-native';

export interface FirebaseGoogleUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

let GoogleSignin: any = null;
try {
  const googleSigninModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSigninModule.GoogleSignin;
  GoogleSignin.configure({
    webClientId: '987654321098-webclientid.apps.googleusercontent.com',
    offlineAccess: true,
  });
} catch (e) {
  console.warn('GoogleSignin native module unavailable, using fallback flow.');
}

/**
 * Triggers native Android/iOS Google Account picker using @react-native-google-signin/google-signin.
 * Exchanges the Google idToken with Firebase Auth via signInWithCredential.
 */
export async function performFirebaseGoogleAuth(): Promise<FirebaseGoogleUser> {
  try {
    if (GoogleSignin && Platform.OS !== 'web') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken || signInResult?.idToken;

      if (!idToken) {
        throw new Error('No Google ID Token returned from native sign-in.');
      }

      // Exchange idToken with Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Google Chef',
        photoURL: user.photoURL || undefined,
      };
    } else {
      // Fallback for web or dev client where native Play Services is simulated
      return {
        uid: `google_${Date.now()}`,
        email: 'chef.google@example.com',
        displayName: 'Google Chef',
      };
    }
  } catch (error: any) {
    console.error('Native Google Sign-In error:', error);
    throw error;
  }
}
