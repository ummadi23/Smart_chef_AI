import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Standard Firebase Configuration for CookMate AI
const firebaseConfig = {
  apiKey: "AIzaSyB-DemoSmartChefFirebaseConfigKey99",
  authDomain: "cookmate-ai.firebaseapp.com",
  projectId: "cookmate-ai",
  storageBucket: "cookmate-ai.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:a1b2c3d4e5f6g7h8"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);
export { GoogleAuthProvider, signInWithCredential };
