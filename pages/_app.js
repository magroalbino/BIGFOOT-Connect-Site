import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { TranslationProvider } from '../utils/translations';
import '../styles/globals.css';

// Importar Firebase para inicialização
import { auth, analytics } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevenir hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading state entre páginas
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Log de navegação para analytics
  useEffect(() => {
    if (analytics && typeof window !== 'undefined') {
      const handleRouteChange = (url) => {
        // Firebase Analytics page_view
        if (window.gtag) {
          window.gtag('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {
            page_path: url,
          });
        }
      };

      router.events.on('routeChangeComplete', handleRouteChange);
      return () => router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router.events]);

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('🔐 Usuário autenticado:', user.email);

        // Salvar no localStorage
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userEmail', user.email);
      } else {
        console.log('🔐 Nenhum usuário autenticado');

        // Limpar localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
      }
    });

    return () => unsubscribe();
  }, []);

  // Prevenir scroll restauration automático
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Error Boundary simples
  useEffect(() => {
    const handleError = (error) => {
      console.error('🚨 Global Error:', error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Não renderizar até estar montado (evitar hydration mismatch)
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1F948C" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </Head>

      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Translation Provider */}
      <TranslationProvider key={router.asPath}>
        {/* Loading Bar */}
        {loading && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 animate-pulse z-[9999]">
            <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        )}

        {/* Main Component */}
        <Component {...pageProps} />

        {/* Back to Top Button (Global) */}
        <BackToTopButton />
      </TranslationProvider>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1s infinite;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: #1F948C;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #14635e;
        }

        /* Light mode scrollbar */
        body.light-mode ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        body.light-mode ::-webkit-scrollbar-thumb {
          background: #FF6B35;
        }

        body.light-mode ::-webkit-scrollbar-thumb:hover {
          background: #e55a2b;
        }

        /* Selection color */
        ::selection {
          background: #1F948C;
          color: white;
        }

        ::-moz-selection {
          background: #1F948C;
          color: white;
        }

        /* Focus visible */
        *:focus-visible {
          outline: 2px solid #1F948C;
          outline-offset: 2px;
        }

        /* Disable animations for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}

// Back to Top Button Component
function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 animate-fade-in-up"
      aria-label="Voltar ao topo"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </button>
  );
}

export default MyApp;
