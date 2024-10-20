// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { envconfig } from "../../envconfig";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: envconfig.VITE_FIREBASE_API_KEY,
    authDomain: envconfig.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envconfig.VITE_FIREBASE_PROJECT_ID,
    storageBucket: envconfig.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envconfig.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: envconfig.VITE_FIREBASE_APP_ID,
    measurementId: envconfig.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };