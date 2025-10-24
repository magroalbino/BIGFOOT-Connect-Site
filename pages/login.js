import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('pt');
  const [theme, setTheme] = useState('dark');
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'pt';
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setLang(savedLang);
    setTheme(savedTheme);

    // Criar partículas animadas
    createParticles();
  }, []);

  const translations = {
    en: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      loginBtn: 'Login',
      registerLink: "Don't have an account? Register",
      backHome: '← Back to Home',
      forgotPassword: 'Forgot password?',
      fillAll: 'Please fill in all fields.',
      success: 'Login successful!',
      invalidCredentials: 'Invalid email or password.',
      loggingIn: 'Logging in...'
    },
    pt: {
      title: 'Entrar',
      email: 'E-mail',
      password: 'Senha',
      loginBtn: 'Entrar',
      registerLink: 'Não tem conta? Registre-se',
      backHome: '← Voltar para a Home',
      forgotPassword: 'Esqueceu a senha?',
      fillAll: 'Preencha todos os campos.',
      success: 'Login realizado com sucesso!',
      invalidCredentials: 'E-mail ou senha inválidos.',
      loggingIn: 'Entrando...'
    }
  };

  const t = translations[lang];

  const createParticles = () => {
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
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t.fillAll);
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userId', auth.currentUser.uid);
      localStorage.setItem('userEmail', auth.currentUser.email);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(t.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleLanguage = () => {
    const newLang = lang === 'pt' ? 'en' : 'pt';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-teal-500/10 animate-pulse" />
      </div>

      {/* Particles */}
      <div id="particles" className="fixed inset-0 z-0" />

      {/* Theme & Language Toggle */}
      <div className="fixed top-6 right-6 flex gap-3 z-50">
        <button
          onClick={toggleLanguage}
          className={`px-4 py-2 rounded-lg transition ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
        >
          {lang === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
        </button>
        <button
          onClick={toggleTheme}
          className={`w-11 h-11 rounded-lg flex items-center justify-center text-2xl transition ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/images/logo.png" alt="BIGFOOT Logo" className="h-20 mb-4 hover:scale-110 transition" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            BIGFOOT Connect
          </span>
        </div>

        {/* Form Container */}
        <div className={`${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white'} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className="text-3xl font-bold text-center mb-8">{t.title}</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                required
              />
              <label className={`absolute left-4 transition-all pointer-events-none ${email ? '-top-2 text-xs bg-gray-900 px-2' : 'top-3'} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.email}
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                required
              />
              <label className={`absolute left-4 transition-all pointer-events-none ${password ? '-top-2 text-xs bg-gray-900 px-2' : 'top-3'} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.password}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-xl"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-teal-500 hover:text-teal-400 transition">
                {t.forgotPassword}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.loggingIn : t.loginBtn}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} text-gray-500`}>ou</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <a href="/register" className="text-teal-500 hover:text-teal-400 font-semibold transition">
              {t.registerLink}
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a href="/" className="text-gray-400 hover:text-orange-500 transition inline-flex items-center gap-2">
            {t.backHome}
          </a>
        </div>
      </div>

      <style jsx>{`
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

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
