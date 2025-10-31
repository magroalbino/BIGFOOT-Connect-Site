import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../config/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useTranslation } from '../utils/translations';

export default function ResetPassword() {
  const router = useRouter();
  const { oobCode } = router.query; // Código que vem do link do e-mail
  const { t, language, setLanguage } = useTranslation();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [codeValid, setCodeValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
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

  // Verificar o código de reset ao carregar a página
  useEffect(() => {
    if (!oobCode) {
      setVerifying(false);
      return;
    }

    const verifyCode = async () => {
      try {
        // Verificar se o código é válido e obter o e-mail
        const email = await verifyPasswordResetCode(auth, oobCode);
        setUserEmail(email);
        setCodeValid(true);
        console.log('✅ Código válido para:', email);
      } catch (error) {
        console.error('❌ Erro ao verificar código:', error);
        setCodeValid(false);
        
        let errorMessage = language === 'pt'
          ? 'Link inválido ou expirado.'
          : 'Invalid or expired link.';
          
        if (error.code === 'auth/invalid-action-code') {
          errorMessage = language === 'pt'
            ? 'Este link é inválido ou já foi usado.'
            : 'This link is invalid or has already been used.';
        } else if (error.code === 'auth/expired-action-code') {
          errorMessage = language === 'pt'
            ? 'Este link expirou. Solicite um novo link de recuperação.'
            : 'This link has expired. Request a new recovery link.';
        }
        
        showMessage(errorMessage, 'error');
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, language]);

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
    }, 7000);
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validar senha
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return language === 'pt' 
        ? 'A senha deve ter no mínimo 6 caracteres.' 
        : 'Password must be at least 6 characters.';
    }
    return null;
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showMessage(
        language === 'pt' ? 'Preencha todos os campos.' : 'Fill in all fields.',
        'error'
      );
      return;
    }

    // Validar senha
    const passwordError = validatePassword(password);
    if (passwordError) {
      showMessage(passwordError, 'error');
      return;
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      showMessage(
        language === 'pt' ? 'As senhas não coincidem.' : 'Passwords do not match.',
        'error'
      );
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      
      console.log('✅ Senha alterada com sucesso');
      
      setPasswordChanged(true);
      showMessage(
        language === 'pt' 
          ? 'Senha alterada com sucesso!' 
          : 'Password changed successfully!',
        'success'
      );

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error);
      
      let errorMessage = language === 'pt' 
        ? 'Erro ao alterar senha.' 
        : 'Error changing password.';
      
      switch (error.code) {
        case 'auth/weak-password':
          errorMessage = language === 'pt'
            ? 'Senha muito fraca. Use uma senha mais forte.'
            : 'Password too weak. Use a stronger password.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = language === 'pt'
            ? 'Link inválido ou já usado.'
            : 'Invalid or already used link.';
          break;
        case 'auth/expired-action-code':
          errorMessage = language === 'pt'
            ? 'Link expirado. Solicite um novo.'
            : 'Expired link. Request a new one.';
          break;
        default:
          errorMessage = language === 'pt'
            ? `Erro: ${error.message}`
            : `Error: ${error.message}`;
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar loading enquanto verifica o código
  if (verifying) {
    return (
      <>
        <Head>
          <title>{language === 'pt' ? 'Redefinir Senha' : 'Reset Password'} - BIGFOOT Connect</title>
        </Head>
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">{language === 'pt' ? 'Verificando...' : 'Verifying...'}</p>
          </div>
        </div>
      </>
    );
  }

  // Renderizar erro se o código não for válido
  if (!oobCode || !codeValid) {
    return (
      <>
        <Head>
          <title>{language === 'pt' ? 'Link Inválido' : 'Invalid Link'} - BIGFOOT Connect</title>
        </Head>
        <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="w-full max-w-md text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'pt' ? 'Link Inválido' : 'Invalid Link'}
            </h2>
            <p className="text-gray-500 mb-8">
              {language === 'pt' 
                ? 'Este link de recuperação é inválido ou já expirou.' 
                : 'This recovery link is invalid or has expired.'}
            </p>
            <div className="space-y-3">
              <Link href="/forgot-password" className="block">
                <button className="w-full bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-600/40">
                  {language === 'pt' ? 'Solicitar Novo Link' : 'Request New Link'}
                </button>
              </Link>
              <Link href="/login" className="block">
                <button className={`w-full ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-gray-800' : 'bg-gray-50 hover:bg-white border-gray-300'} border py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium`}>
                  {language === 'pt' ? 'Voltar ao Login' : 'Back to Login'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{language === 'pt' ? 'Redefinir Senha' : 'Reset Password'} - BIGFOOT Connect</title>
        <meta name="description" content="Redefina sua senha do BIGFOOT Connect" />
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

            {!passwordChanged ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-green-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                    🔑
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-4 relative">
                  {language === 'pt' ? 'Nova Senha' : 'New Password'}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-teal-600 to-green-500 rounded-full"></div>
                </h2>

                {userEmail && (
                  <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    {language === 'pt' ? 'Redefinindo senha para:' : 'Resetting password for:'}<br/>
                    <span className="text-teal-600 font-semibold">{userEmail}</span>
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password input */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-gray-800 focus:bg-white/10' : 'bg-gray-50 border-gray-300 focus:bg-white'} border-2 rounded-2xl transition-all duration-300 focus:border-teal-600 focus:shadow-lg focus:shadow-teal-600/20 focus:-translate-y-0.5 outline-none peer pr-12`}
                      placeholder=" "
                      required
                      autoFocus
                    />
                    <label
                      htmlFor="password"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} px-2 pointer-events-none transition-all duration-300 peer-focus:top-0 peer-focus:text-teal-600 peer-focus:font-semibold peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-teal-600 peer-[:not(:placeholder-shown)]:font-semibold`}
                    >
                      {language === 'pt' ? 'Nova Senha' : 'New Password'}
                    </label>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 hover:bg-orange-500/10 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>

                  {/* Confirm Password input */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-gray-800 focus:bg-white/10' : 'bg-gray-50 border-gray-300 focus:bg-white'} border-2 rounded-2xl transition-all duration-300 focus:border-teal-600 focus:shadow-lg focus:shadow-teal-600/20 focus:-translate-y-0.5 outline-none peer pr-12`}
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="confirmPassword"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} px-2 pointer-events-none transition-all duration-300 peer-focus:top-0 peer-focus:text-teal-600 peer-focus:font-semibold peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-teal-600 peer-[:not(:placeholder-shown)]:font-semibold`}
                    >
                      {language === 'pt' ? 'Confirmar Senha' : 'Confirm Password'}
                    </label>
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 hover:bg-orange-500/10 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                      aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>

                  {/* Password requirements */}
                  <div className={`p-3 rounded-xl text-xs ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                    <p className="font-semibold mb-1">
                      {language === 'pt' ? '📋 Requisitos da senha:' : '📋 Password requirements:'}
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• {language === 'pt' ? 'Mínimo 6 caracteres' : 'Minimum 6 characters'}</li>
                    </ul>
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
                        {language === 'pt' ? 'Alterando...' : 'Changing...'}
                      </span>
                    ) : (
                      <span>{language === 'pt' ? 'Alterar Senha' : 'Change Password'}</span>
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
                </form>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="flex justify-center mb-6 animate-bounce-in">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                    ✅
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-4 text-green-500">
                  {language === 'pt' ? 'Senha Alterada!' : 'Password Changed!'}
                </h2>

                <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'pt' 
                    ? 'Sua senha foi alterada com sucesso. Você será redirecionado para o login em alguns segundos.' 
                    : 'Your password has been changed successfully. You will be redirected to login in a few seconds.'}
                </p>

                <Link href="/login" className="block">
                  <button className="w-full bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-600/40">
                    {language === 'pt' ? 'Ir para o Login' : 'Go to Login'}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-10 text-center">
            <Link href="/" className="text-gray-500 hover:text-orange-500 text-sm transition-all duration-300 inline-flex items-center gap-2 hover:gap-3 px-4 py-2 rounded-lg hover:bg-orange-500/10">
              <span>{language === 'pt' ? '← Voltar para Home' : '← Back to Home'}</span>
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

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
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

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
