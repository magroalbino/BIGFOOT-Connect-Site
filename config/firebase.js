import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Firebase Auth persistence error:', error);
    }
  });

  enableIndexedDbPersistence(db).catch((error) => {
    if (process.env.NODE_ENV !== 'production') {
      if (error.code === 'failed-precondition') {
        console.warn('Firestore: multiple tabs open, offline persistence disabled');
      } else if (error.code === 'unimplemented') {
        console.warn('Firestore: browser does not support offline persistence');
      } else {
        console.error('Firestore persistence error:', error);
      }
    }
  });
}

let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

// Verificação de admin via Custom Claim
export const isAdmin = async (user) => {
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.admin === true;
  } catch {
    return false;
  }
};

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(false);
  } catch {
    return null;
  }
};

export const getCurrentUser = () => auth.currentUser;
export const isAuthenticated = () => !!auth.currentUser;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bigfootconnect.tech';

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export { app, auth, db, storage, analytics };