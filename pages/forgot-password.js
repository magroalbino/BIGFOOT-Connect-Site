import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useTranslation } from '../utils/translations';

export default function ForgotPassword() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [emailSent, setEmailSent] = useState(false);
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

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showMessage(language === 'pt' ? 'Por favor, insira seu e-mail.' : 'Please enter your email.', 'error');
      return;
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage(language === 'pt' ? 'Por favor, insira um e-mail válido.' : 'Please enter a valid email.', 'error');
      return;
    }

    setLoading(true);

    try {
      // Configurar actionCodeSettings para customizar o e-mail
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      
      console.log('✅ E-mail de recuperação enviado para:', email);
      
      setEmailSent(true);
      showMessage(
        language === 'pt' 
          ? 'E-mail de recuperação enviado! Verifique sua caixa de entrada.' 
          : 'Recovery email sent! Check your inbox.',
        'success'
      );

      // Limpar o campo de e-mail
      setEmail('');
      
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail de recuperação:', error);
      
      let errorMessage = language === 'pt' 
        ? 'Erro ao enviar e-mail de recuperação.' 
        : 'Error sending recovery email.';
      
      // Mensagens de erro customizadas
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = language === 'pt'
            ? 'Nenhuma conta encontrada com este e-mail.'
            : 'No account found with this email.';
          break;
        case 'auth/invalid-email':
          errorMessage = language === 'pt'
            ? 'E-mail inválido.'
            : 'Invalid email.';
          break;
        case 'auth/too-many-requests':
          errorMessage = language === 'pt'
            ? 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
            : 'Too many attempts. Please wait a few minutes and try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = language === 'pt'
            ? 'Erro de conexão. Verifique sua internet.'
            : 'Connection error. Check your internet.';
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

  // Reenviar e-mail
  const handleResendEmail = () => {
    setEmailSent(false);
    setMessage({ text: '', type: '' });
  };

  return (
    <>
      <Head>
        <title>{language === 'pt' ? 'Recuperar Senha' : 'Forgot Password'} - BIGFOOT Connect</title>
        <meta name="description" content="Recupere sua senha do BIGFOOT Connect" />
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

            {!emailSent ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-green-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                    🔐
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-4 relative">
                  {language === 'pt' ? 'Esqueceu a Senha?' : 'Forgot Password?'}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-teal-600 to-green-500 rounded-full"></div>
                </h2>

                <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'pt' 
                    ? 'Digite seu e-mail e enviaremos um link para redefinir sua senha.' 
                    : 'Enter your email and we\'ll send you a link to reset your password.'}
                </p>

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
                      autoFocus
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} px-2 pointer-events-none transition-all duration-300 peer-focus:top-0 peer-focus:text-teal-600 peer-focus:font-semibold peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-teal-600 peer-[:not(:placeholder-shown)]:font-semibold`}
                    >
                      {language === 'pt' ? 'E-mail' : 'Email'}
                    </label>
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
                        {language === 'pt' ? 'Enviando...' : 'Sending...'}
                      </span>
                    ) : (
                      <span>{language === 'pt' ? 'Enviar Link de Recuperação' : 'Send Recovery Link'}</span>
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

                  {/* Back to login */}
                  <div className="text-center">
                    <Link href="/login" className="text-teal-600 hover:text-teal-500 text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 inline-flex items-center gap-2">
                      <span>←</span>
                      <span>{language === 'pt' ? 'Voltar ao Login' : 'Back to Login'}</span>
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="flex justify-center mb-6 animate-bounce-in">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                    ✉️
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-4 text-green-500">
                  {language === 'pt' ? 'E-mail Enviado!' : 'Email Sent!'}
                </h2>

                <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'pt' 
                    ? 'Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada e spam.' 
                    : 'We sent a recovery link to your email. Check your inbox and spam folder.'}
                </p>

                <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                    💡 {language === 'pt' 
                      ? 'Dica: O e-mail pode levar alguns minutos para chegar. Não se esqueça de verificar a pasta de spam!' 
                      : 'Tip: The email may take a few minutes to arrive. Don\'t forget to check your spam folder!'}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/login" className="block w-full">
                    <button className="w-full bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-600/40">
                      {language === 'pt' ? 'Ir para o Login' : 'Go to Login'}
                    </button>
                  </Link>

                  <button
                    onClick={handleResendEmail}
                    className={`w-full ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-gray-800' : 'bg-gray-50 hover:bg-white border-gray-300'} border py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium`}
                  >
                    {language === 'pt' ? 'Reenviar E-mail' : 'Resend Email'}
                  </button>
                </div>
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
