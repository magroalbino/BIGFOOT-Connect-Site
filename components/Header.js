import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { auth } from '../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from '../utils/translations';

export default function Header() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Inicialização do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }, []);

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
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
    const newLang = e.target.value;
    console.log('🌐 Mudando idioma para:', newLang);

    // Salvar no localStorage e atualizar o estado via Provider
    setLanguage(newLang);
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-800' : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'} border-b-2 shadow-lg sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="BIGFOOT Logo"
                width={40}
                height={40}
                className="rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-lg">
                      <span class="text-white font-bold text-lg">B</span>
                    </div>
                  `;
                }}
              />
            </div>
            <span className="text-xl font-bold text-orange-500 transition-all duration-300 group-hover:text-orange-400 hidden sm:inline">
              BIGFOOT Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className={`${theme === 'dark' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-500/5 border-orange-500/20'} border px-3 py-1.5 rounded-lg font-medium text-sm`}>
                      {t('hello')}, {user.email}
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t('dashboard')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      {t('register')}
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Language Switcher */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 hover:border-orange-500 text-sm`}
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-orange-500 text-xl transition-all duration-300 hover:border-orange-500 hover:scale-110`}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? '🌙' : '🌞'}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in-up">
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className={`${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-500/5'} px-3 py-2 rounded-lg text-sm`}>
                      {t('hello')}, {user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-orange-500 hover:text-orange-400 font-medium px-3 py-2 rounded-lg hover:bg-orange-500/10 transition-all"
                    >
                      {t('dashboard')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-orange-500 hover:text-orange-400 font-medium px-3 py-2 rounded-lg hover:bg-orange-500/10 transition-all"
                    >
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-orange-500 hover:text-orange-400 font-medium px-3 py-2 rounded-lg hover:bg-orange-500/10 transition-all"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/register"
                      className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      {t('register')}
                    </Link>
                  </>
                )}
              </>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-gray-700">
              <select
                value={language}
                onChange={handleLanguageChange}
                className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2`}
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>

              <button
                onClick={toggleTheme}
                className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 text-xl`}
              >
                {theme === 'dark' ? '🌙' : '🌞'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
