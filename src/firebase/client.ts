import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBOyLJZ2HokyQN-1aEPjmT1h-EZxwag8K0",
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
