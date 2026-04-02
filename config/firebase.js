import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// ──────────────────────────────────────────────────────────────────
// IMPORTANTE: Nunca use valores hardcoded aqui.
// Todas as chaves devem vir de variáveis de ambiente (.env.local).
// Crie o arquivo .env.local na raiz do projeto com:
//
//   NEXT_PUBLIC_FIREBASE_API_KEY=...
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
//   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
//   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
//   NEXT_PUBLIC_FIREBASE_APP_ID=...
//   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
//
// O .env.local já está no .gitignore — NUNCA commite esse arquivo.
// ──────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Valida que todas as variáveis estão presentes (quebra o build cedo se faltar)
if (typeof window === 'undefined') {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => `NEXT_PUBLIC_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
  }
}

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
    .catch(() => {}); // Analytics é não-crítico — engole o erro silenciosamente
}

// ──────────────────────────────────────────────────────────────────
// ADMIN — verificação de admin deve ser feita via Firebase Custom Claims,
// nunca via email hardcoded no cliente.
//
// Como configurar:
//   1. No servidor (Admin SDK): auth.setCustomUserClaims(uid, { admin: true })
//   2. No cliente: const token = await user.getIdTokenResult();
//                  const isAdmin = token.claims.admin === true;
//
// REMOVIDO: ADMIN_EMAILS array — não exponha emails de admin no bundle JS.
// ──────────────────────────────────────────────────────────────────

// Verifica se o usuário atual é admin via Custom Claim (seguro)
export const isAdmin = async (user) => {
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.admin === true;
  } catch {
    return false;
  }
};

// Obtém um ID Token fresco para autenticar chamadas ao backend
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(/* forceRefresh= */ false);
  } catch {
    return null;
  }
};

// Função para verificar se está autenticado
export const isAuthenticated = () => !!auth.currentUser;

// Exportar serviços
export { app, auth, db, storage, analytics };
