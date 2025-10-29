import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { useTranslation } from '../utils/translations';

export default function Login() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [theme, setTheme] = useState('dark');

  // Inicialização do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }, []);

  // Persistência de autenticação
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistência LOCAL ativada');
      })
      .catch((error) => {
        console.error('Erro ao definir persistência:', error);
      });
  }, []);

  // Redirecionar se já autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, []);

  // Criar partículas flutuantes
  useEffect(() => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particlesContainer.appendChild(particle);
    }

    return () => {
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);

  // Efeito de mouse nas partículas
  useEffect(() => {
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('.particle');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      particles.forEach((particle, index) => {
        const speed = 0.5 + (index % 3) * 0.2;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        particle.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mostrar mensagem
  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  // Toggle tema
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  // Trocar idioma
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Toggle mostrar senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Google login (placeholder)
  const handleGoogleLogin = () => {
    showMessage(t('googleDevelopment'), 'info');
  };

  // Forgot password (placeholder)
  const handleForgotPassword = (e) => {
    e.preventDefault();
    showMessage(t('forgotPasswordDevelopment'), 'info');
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showMessage(t('fillAll'), 'error');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', user.email);

      showMessage(t('success'), 'success');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      let errorMessage = t('error') + ' ' + error.message;
      
      // Mensagens de erro customizadas
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = t('userNotFound');
          break;
        case 'auth/wrong-password':
          errorMessage = t('wrongPassword');
          break;
        case 'auth/invalid-email':
          errorMessage = t('invalidCredentials');
          break;
        case 'auth/user-disabled':
          errorMessage = 'Conta desabilitada. Entre em contato com o suporte.';
          break;
        case 'auth/too-many-requests':
          errorMessage = t('tooManyRequests');
          break;
        case 'auth/invalid-credential':
          errorMessage = t('invalidCredentials');
          break;
        default:
          errorMessage = t('invalidCredentials');
      }
      
      showMessage(errorMessage, 'error');
      console.error('Erro de login:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('formTitle')} - BIGFOOT Connect</title>
        <meta name="description" content="Faça login no BIGFOOT Connect" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative overflow-hidden transition-colors duration-300`}>
        {/* Animated background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-30' : 'opacity-20'}`} style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(31, 148, 140, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
            `,
            animation: 'float 25s ease-in-out infinite'
          }}></div>
        </div>

        {/* Floating particles */}
        <div id="particles" className="fixed inset-0 z-0 pointer-events-none"></div>

        {/* Top bar */}
        <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
          <select
            value={language}
            onChange={handleLanguageChange}
            className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-300'} border rounded-xl px-3 py-2 text-orange-500 cursor-pointer transition-all duration-300 hover:border-teal-600 hover:-translate-y-0.5 shadow-lg backdrop-blur-xl`}
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
          
          <button
            onClick={toggleTheme}
            className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-300'} border rounded-xl w-11 h-11 flex items-center justify-center text-orange-500 text-xl cursor-pointer transition-all duration-300 hover:border-teal-600 hover:-translate-y-0.5 hover:scale-105 shadow-lg backdrop-blur-xl relative overflow-hidden`}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? '🌙' : '🌞'}
          </button>
        </div>

        {/* Main container */}
        <div className="w-full max-w-md z-10 animate-slide-in-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 animate-fade-in-scale">
            <Link href="/" className="group">
              <Image
                src="/images/logo.png"
                alt="BIGFOOT Logo"
                width={85}
                height={85}
                className="transition-all duration-400 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl"
                priority
              />
            </Link>
            <span className="mt-4 text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              BIGFOOT Connect
            </span>
          </div>

          {/* Form container */}
          <div className={`${theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'} border backdrop-blur-2xl rounded-3xl p-10 shadow-2xl relative overflow-hidden`}>
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-green-500"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(31, 148, 140, 0.3) 45deg, transparent 90deg)',
              animation: 'shimmer 8s linear infinite'
            }}></div>

            <h2 className="text-3xl font-bold text-center mb-8 relative">
              {t('formTitle')}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-teal-600 to-green-500 rounded-full mt-2"></div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-gray-800 focus:bg-white/10' : 'bg-gray-50 border-gray-300 focus:bg-white'} border-2 rounded-2xl transition-all duration-300 focus:border-teal-600 focus:shadow-lg focus:shadow-teal-600/20 focus:-translate-y-0.5 outline-none peer`}
                  placeholder=" "
                  required
                  autoComplete="email"
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} px-2 pointer-events-none transition-all duration-300 peer-focus:top-0 peer-focus:text-teal-600 peer-focus:font-semibold peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-teal-600 peer-[:not(:placeholder-shown)]:font-semibold`}
                >
                  {t('email')}
                </label>
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-gray-800 focus:bg-white/10' : 'bg-gray-50 border-gray-300 focus:bg-white'} border-2 rounded-2xl transition-all duration-300 focus:border-teal-600 focus:shadow-lg focus:shadow-teal-600/20 focus:-translate-y-0.5 outline-none peer pr-12`}
                  placeholder=" "
                  required
                  autoComplete="current-password"
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} px-2 pointer-events-none transition-all duration-300 peer-focus:top-0 peer-focus:text-teal-600 peer-focus:font-semibold peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-teal-600 peer-[:not(:placeholder-shown)]:font-semibold`}
                >
                  {t('password')}
                </label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 hover:bg-orange-500/10 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className="text-teal-600 hover:text-teal-500 text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                >
                  {t('forgotPassword')}
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-600/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600"></span>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('loggingIn')}
                  </span>
                ) : (
                  t('loginBtn')
                )}
              </button>

              {/* Message */}
              {message.text && (
                <div className={`p-4 rounded-xl text-center text-sm font-medium animate-slide-in ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/30' :
                  message.type === 'info' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' :
                  'bg-red-500/10 text-red-500 border border-red-500/30'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className={`absolute inset-0 flex items-center`}>
                  <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-4 text-gray-500 font-medium`}>
                    {t('dividerText')}
                  </span>
                </div>
              </div>

              {/* Google login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-gray-800' : 'bg-gray-50 hover:bg-white border-gray-300'} border py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-3 font-medium`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{t('googleBtn')}</span>
              </button>

              {/* Register link */}
              <div className="text-center text-sm">
                <Link href="/register" className="text-teal-600 hover:text-teal-500 font-semibold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-teal-600 after:to-green-500 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
                  {t('registerLink')}
                </Link>
              </div>
            </form>
          </div>

          {/* Back to home */}
          <div className="mt-10 text-center">
            <Link href="/" className="text-gray-500 hover:text-orange-500 text-sm transition-all duration-300 inline-flex items-center gap-2 hover:gap-3 hover:-translate-x-1 px-4 py-2 rounded-lg hover:bg-orange-500/10">
              <span>←</span>
              <span>{t('backHome')}</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.8;
          }
          33% { 
            transform: translateY(-20px) rotate(1deg) scale(1.02); 
            opacity: 1;
          }
          66% { 
            transform: translateY(10px) rotate(-0.5deg) scale(0.98); 
            opacity: 0.9;
          }
        }

        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }

        .animate-slide-in {
          animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #1F948C;
          border-radius: 50%;
          opacity: 0.6;
          animation: particleFloat 15s linear infinite;
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }

        body.light-mode .particle {
          background: #FF6B35;
          opacity: 0.4;
        }

        body.light-mode {
          background-color: #f8fafc;
          color: #1a202c;
        }

        body[data-theme="dark"] {
          background-color: #000;
          color: #fff;
        }

        body[data-theme="light"] {
          background-color: #f8fafc;
          color: #1a202c;
        }
      `}</style>
    </>
  );
}
