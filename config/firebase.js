import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// ── Configuração do Firebase ──────────────────────────────────────────────────
// Todas as chaves vêm de variáveis de ambiente — nunca hardcoded.
// Configure em .env.local (local) e no painel do Vercel (produção).
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase App (singleton — evita re-inicialização em hot-reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar serviços
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// Configurar persistência de autenticação (apenas no cliente)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Firebase Auth persistence error:', error);
    }
  });

  // Habilitar persistência offline do Firestore
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

// Inicializar Analytics (apenas no cliente e se suportado)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

// ── Admin ─────────────────────────────────────────────────────────────────────
// Verificação de admin via Firebase Custom Claim — nunca via email hardcoded.
// O claim é definido server-side com:
//   admin.auth().setCustomUserClaims(uid, { admin: true })
export const isAdmin = async (user) => {
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.admin === true;
  } catch {
    return false;
  }
};

// ── Auth helpers ──────────────────────────────────────────────────────────────

// Obtém um ID Token fresco para autenticar chamadas ao backend
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(false);
  } catch {
    return null;
  }
};

// Obtém o usuário atual
export const getCurrentUser = () => auth.currentUser;

// Verifica se está autenticado
export const isAuthenticated = () => !!auth.currentUser;

// ── API ───────────────────────────────────────────────────────────────────────
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

// ── Exportações ───────────────────────────────────────────────────────────────
export { app, auth, db, storage, analytics };
