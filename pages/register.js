import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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
  }, []);

  const translations = {
    en: {
      title: 'Create Account',
      email: 'Email',
      password: 'Password',
      register: 'Register',
      loginLink: 'Already have an account? Log in',
      backHome: '← Back to Home',
      fillRequired: 'Please fill in all required fields.',
      weakPassword: 'Password must be at least 6 characters long.',
      success: 'Account created successfully!',
      emailInUse: 'This email is already in use.',
      creating: 'Creating...'
    },
    pt: {
      title: 'Criar Conta',
      email: 'E-mail',
      password: 'Senha',
      register: 'Registrar',
      loginLink: 'Já tem conta? Entrar',
      backHome: '← Voltar para a Home',
      fillRequired: 'Preencha todos os campos obrigatórios.',
      weakPassword: 'A senha deve ter pelo menos 6 caracteres.',
      success: 'Conta criada com sucesso!',
      emailInUse: 'Este e-mail já está em uso.',
      creating: 'Criando...'
    }
  };

  const t = translations[lang];

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t.fillRequired);
      return;
    }

    if (password.length < 6) {
      setError(t.weakPassword);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get referral parameter
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        referredBy: ref || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sharedPoints: 0,
        walletAddress: '',
        referralEarnings: 0
      });

      router.push('/login');
    } catch (err) {
      console.error('Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError(t.emailInUse);
      } else {
        setError(err.message);
      }
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

  const getStrengthColor = () => {
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    if (passwordStrength === 4) return 'bg-green-500';
    return 'bg-gray-600';
  };

  const getStrengthWidth = () => {
    return `${passwordStrength * 25}%`;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-teal-500/10 animate-pulse" />
      </div>

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

          <form onSubmit={handleRegister} className="space-y-6">
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
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

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: getStrengthWidth() }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.creating : t.register}
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

          {/* Login Link */}
          <div className="text-center">
            <a href="/login" className="text-teal-500 hover:text-teal-400 font-semibold transition">
              {t.loginLink}
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
