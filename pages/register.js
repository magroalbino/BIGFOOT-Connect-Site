import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from '../utils/translations';

const API_BASE_URL = 'https://api.bigfootconnect.tech';

export default function Register() {
  const router = useRouter();
  const { ref } = router.query; // Referral parameter
  const { t, language, setLanguage } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  // Verificar força da senha
  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  // Criar documento do usuário no Firestore
  const criarDocumentoUsuario = async (user, referredBy = null) => {
    try {
      console.log('Iniciando criação do documento do usuário:', user.uid);
      
      const userData = {
        email: user.email,
        uid: user.uid,
        referredBy: referredBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        walletAddress: '',
        referralEarnings: 0
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      
      console.log('Documento do usuário criado/atualizado com sucesso:', userData);
      return true;
      
    } catch (error) {
      console.error('Erro ao criar documento do usuário no Firestore:', error);
      throw new Error(`Erro ao salvar dados do usuário: ${error.message}`);
    }
  };

  // Adicionar contato ao Brevo via API
  const adicionarContatoBrevo = async (email, nome = '') => {
    try {
      console.log('Adicionando contato ao Brevo via API própria:', email);
      
      const response = await fetch(`${API_BASE_URL}/api/addcontact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          nome: nome || email.split('@')[0]
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contato adicionado ao Brevo com sucesso:', result);
        return result;
      } else {
        const errorData = await response.json();
        console.warn('Aviso ao adicionar contato ao Brevo:', errorData);
        return null;
      }
      
    } catch (error) {
      console.warn('Aviso ao adicionar contato ao Brevo:', error);
      return null;
    }
  };

  // Verificar força da senha
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    
    if (pwd.length >= 6) strength++;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/\d/)) strength++;
    if (pwd.match(/[^a-zA-Z\d]/)) strength++;
    
    setPasswordStrength(strength);
    return strength;
  };

  // Classe CSS para força da senha
  const getStrengthClass = () => {
    if (passwordStrength === 1) return 'strength-weak';
    if (passwordStrength === 2) return 'strength-fair';
    if (passwordStrength === 3) return 'strength-good';
    if (passwordStrength === 4) return 'strength-strong';
    return '';
  };

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

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showMessage(t('fillRequired'), 'error');
      return;
    }

    if (password.length < 6) {
      showMessage(t('weakPassword'), 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando processo de registro para:', email);
      
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Usuário criado no Firebase Auth:', user.uid);

      // 2. Obter parâmetro de referência
      const referredBy = ref || null;

      // 3. Criar documento no Firestore (CRÍTICO)
      try {
        await criarDocumentoUsuario(user, referredBy);
        console.log('✅ Documento do usuário salvo no Firestore com sucesso');
      } catch (firestoreError) {
        console.error('❌ Erro crítico ao salvar no Firestore:', firestoreError);
        showMessage(t('firestoreError'), 'error');
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        return;
      }

      // 4. Adicionar ao Brevo via API própria (não bloqueia se der erro)
      try {
        await adicionarContatoBrevo(user.email);
        console.log('✅ Contato adicionado ao Brevo com sucesso');
      } catch (brevoError) {
        console.warn('⚠️ Erro ao adicionar ao Brevo (não crítico):', brevoError);
      }
      
      // 5. Sucesso total - mostrar mensagem e redirecionar
      console.log('✅ Registro completo realizado com sucesso!');
      showMessage(t('success'), 'success');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro no processo de registro:', error);
      
      let errorMessage = `${t('error')} ${error.message}`;
      
      // Personalizar mensagens de erro
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('emailInUse');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('invalidEmail');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('weakPasswordFirebase');
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('title')} - BIGFOOT Connect</title>
        <meta name="description" content="Crie sua conta no BIGFOOT Connect" />
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
              {t('title')}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-teal-600 to-green-500 rounded-full"></div>
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

              {/* Password input with strength meter */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-gray-800 focus:bg-white/10' : 'bg-gray-50 border-gray-300 focus:bg-white'} border-2 rounded-2xl transition-all duration-300 focus:border-teal-600 focus:shadow-lg focus:shadow-teal-600/20 focus:-translate-y-0.5 outline-none peer pr-12`}
                  placeholder=" "
                  required
                  autoComplete="new-password"
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
                
                {/* Password strength meter */}
                <div className={`h-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} rounded-full mt-2 overflow-hidden`}>
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${getStrengthClass()}`}
                    style={{
                      width: passwordStrength === 1 ? '25%' : 
                             passwordStrength === 2 ? '50%' : 
                             passwordStrength === 3 ? '75%' : 
                             passwordStrength === 4 ? '100%' : '0%'
                    }}
                  ></div>
                </div>
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
                    {language === 'pt' ? 'Criando...' : 'Creating...'}
                  </span>
                ) : (
                  t('register')
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
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-4 text-gray-500 font-medium`}>
                    {t('dividerText')}
                  </span>
                </div>
              </div>

              {/* Login button */}
              <Link href="/login" className="block">
                <button
                  type="button"
                  className={`w-full ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-gray-800' : 'bg-gray-50 hover:bg-white border-gray-300'} border py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium`}
                >
                  {t('loginLink')}
                </button>
              </Link>
            </form>
          </div>

          {/* Back to home */}
          <div className="mt-10 text-center">
            <Link href="/" className="text-gray-500 hover:text-orange-500 text-sm transition-all duration-300 inline-flex items-center gap-2 hover:gap-3 px-4 py-2 rounded-lg hover:bg-orange-500/10">
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

        .strength-weak {
          background: #EF4444;
        }

        .strength-fair {
          background: #F59E0B;
        }

        .strength-good {
          background: #1F948C;
        }

        .strength-strong {
          background: #10B981;
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
