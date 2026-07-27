import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Standard Firebase Configuration for CookMate AI
const firebaseConfig = {
  apiKey: "AIzaSyAOd2M5mZTXc6oQRhcsWhDv5C21PmYwOOY",
  authDomain: "smart-chef-ai-2ad41.firebaseapp.com",
  projectId: "smart-chef-ai-2ad41",
  storageBucket: "smart-chef-ai-2ad41.firebasestorage.app",
  messagingSenderId: "956976912121",
  appId: "1:956976912121:android:325731bb134e9a2a9e7428"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);
export { GoogleAuthProvider, signInWithCredential };
