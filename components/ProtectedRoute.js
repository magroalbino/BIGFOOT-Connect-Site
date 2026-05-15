import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, isAdmin } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProtectedRoute({ 
  children, 
  adminOnly = false,
  redirectTo = '/login',
  loadingComponent = null 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAuthorized(false);
        setUser(null);
        setLoading(false);
        router.push(redirectTo);
        return;
      }

      setUser(currentUser);

      if (adminOnly) {
        const userIsAdmin = await isAdmin(currentUser);
        if (!userIsAdmin) {
          setAuthorized(false);
          setLoading(false);
          router.push('/dashboard');
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, adminOnly, redirectTo]);

  if (loading) {
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="mb-8 animate-pulse">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg font-medium">
            Verificando autenticação...
          </p>
          {adminOnly && (
            <p className="mt-2 text-gray-500 text-sm">
              Validando permissões de administrador
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-400 mb-6">
            {adminOnly 
              ? 'Você não tem permissão para acessar esta página.'
              : 'Você precisa estar autenticado para acessar esta página.'}
          </p>
          <p className="text-gray-500 text-sm">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function withProtectedRoute(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const admin = await isAdmin(currentUser);
        setIsUserAdmin(admin);
      } else {
        setIsUserAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin: isUserAdmin };
}

export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

export function useRequireAdmin(redirectTo = '/dashboard') {
  const router = useRouter();
  const { user, loading, isAdmin: isUserAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isUserAdmin) {
        router.push(redirectTo);
      }
    }
  }, [user, loading, isUserAdmin, router, redirectTo]);

  return { user, loading, isAdmin: isUserAdmin };
}