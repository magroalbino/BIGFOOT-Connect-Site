import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAhziJbG5Pxg0UYvq784YH4zXpsdKfh7AY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bigfoot-connect.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bigfoot-connect",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bigfoot-connect.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "177999879162",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:177999879162:web:a1ea739930cac97475e243",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-WEY300P1S7"
};

// Inicializar Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar serviços
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configurar persistência de autenticação
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('✅ Firebase Auth: Persistência LOCAL ativada');
    })
    .catch((error) => {
      console.error('❌ Firebase Auth: Erro ao configurar persistência:', error);
    });

  // Habilitar persistência offline do Firestore
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ Firestore: Persistência offline ativada');
    })
    .catch((error) => {
      if (error.code === 'failed-precondition') {
        console.warn('⚠️ Firestore: Múltiplas abas abertas, persistência desabilitada');
      } else if (error.code === 'unimplemented') {
        console.warn('⚠️ Firestore: Navegador não suporta persistência offline');
      } else {
        console.error('❌ Firestore: Erro ao ativar persistência:', error);
      }
    });
}

// Inicializar Analytics (apenas no cliente e se suportado)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics ativado');
      } else {
        console.warn('⚠️ Firebase Analytics não suportado neste navegador');
      }
    })
    .catch((error) => {
      console.error('❌ Erro ao verificar suporte do Analytics:', error);
    });
}

// Lista de emails de administradores
export const ADMIN_EMAILS = [
  'fabricioricard23@gmail.com'
];

// Função para verificar se é admin
export const isAdmin = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Função para obter o usuário atual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Função para verificar se está autenticado
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Configuração da API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bigfootconnect.tech';

// Função para fazer requisições à API
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

// Exportar serviços
export { app, auth, db, storage, analytics };

// Exportar configuração (útil para debug)
export const getFirebaseConfig = () => {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    // Não exponha chaves sensíveis em produção
  };
};

// Log de inicialização
console.log('🔥 Firebase inicializado com sucesso');
console.log(`📦 Projeto: ${firebaseConfig.projectId}`);
console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
