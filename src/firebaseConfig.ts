// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { createDebugger } from "./utils/debug";

const debug = createDebugger('Firebase');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // Add a fallback value for projectId to prevent the "missing project ID" error
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Log full Firebase configuration for debugging (redacting sensitive values)
debug.log('Firebase Configuration:', {
  apiKey: firebaseConfig.apiKey ? "CONFIGURED" : "MISSING",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId || "MISSING",
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId ? "CONFIGURED" : "MISSING",
  appId: firebaseConfig.appId ? "CONFIGURED" : "MISSING",
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase
debug.log('Initializing Firebase app');
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
debug.log('Firebase initialized successfully');

export { app, analytics, auth }; 