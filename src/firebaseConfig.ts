// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { createDebugger } from "./utils/debug";

const debug = createDebugger('Firebase');

// IMPORTANT: Hardcoded project ID to ensure it's always available
// This prevents the "A project ID is required to access the auth service" error
const PROJECT_ID = "yarba-app";

console.log('Firebase initialization starting...');
console.log('Environment project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log('Using fallback project ID if needed:', PROJECT_ID);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // Ensure projectId is ALWAYS set with a fallback
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Log full Firebase configuration for debugging (redacting sensitive values)
debug.log('Firebase Configuration:', {
  apiKey: firebaseConfig.apiKey ? "CONFIGURED" : "MISSING",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId ? "CONFIGURED" : "MISSING",
  appId: firebaseConfig.appId ? "CONFIGURED" : "MISSING",
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase
debug.log('Initializing Firebase app');
console.log('Final Firebase project ID being used:', firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported by the browser
let analytics: any = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
    debug.log('Firebase Analytics initialized');
  } else {
    debug.warn('Firebase Analytics not supported in this environment');
  }
}).catch(err => {
  debug.error('Error checking Analytics support:', err);
});

// Initialize authentication with explicit project configuration
const auth = getAuth(app);

// Try to ensure the project ID is correctly passed to Firebase internally
console.log('Setting up Firebase auth with project:', PROJECT_ID);

debug.log('Firebase initialized successfully');
console.log('Firebase auth configuration:', {
  projectId: auth.app.options.projectId,
  authDomain: auth.app.options.authDomain
});

export { app, analytics, auth }; 