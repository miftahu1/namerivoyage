
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Hardcoded config to ensure it's available during Next.js static build process
const firebaseConfig = {
  apiKey: "AIzaSyDAPo3zZoclQ1z8YH6zQy3jjzHG5hNz_hg",
  authDomain: "studio-9680445401-39d92.firebaseapp.com",
  projectId: "studio-9680445401-39d92",
  storageBucket: "studio-9680445401-39d92.firebasestorage.app",
  messagingSenderId: "461782211544",
  appId: "1:461782211544:web:b4a24c8d78695f4e05f0ad"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
