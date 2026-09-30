import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "tradevance-os",
  appId: "1:872704491179:web:998bbaf4e8000fbdfc01ee",
  storageBucket: "tradevance-os.firebasestorage.app",
  apiKey: "AIzaSyD7CP8VcUoowK1XauTtg87D0fxwmSavwwY",
  authDomain: "tradevance-os.web.app",
  messagingSenderId: "872704491179",
  measurementId: "G-TY3F8K4ZT3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
