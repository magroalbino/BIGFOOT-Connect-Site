import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from '../utils/translations';

export default function Home() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [emailCopied, setEmailCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  // Roadmap data
  const roadmapItems = {
    pt: [
      { title: "Fase 1 (2025) – Lançamento ✅", desc: "Versão inicial com recursos básicos de compartilhamento e recompensas.", done: true },
      { title: "Fase 2 (2026) – Criação da BIGchain", desc: "Nossa própria blockchain.", done: false },
      { title: "Fase 3 (2026) – Integração com Extensão", desc: "Suporte para extensão de navegador.", done: false },
      { title: "Fase 4 (2026) – Multiplataforma", desc: "Apps para Android e iOS.", done: false },
      { title: "Fase 5 (2026) – Expansão da Rede", desc: "Parcerias estratégicas e expansão da base de usuários.", done: false },
      { title: "Fase 6 (2026) – Recursos Avançados", desc: "Novos modelos de recompensas, análises e suporte a novos protocolos.", done: false },
    ],
    en: [
      { title: "Phase 1 (2025) – Launch ✅", desc: "Initial version with basic sharing features and rewards.", done: true },
      { title: "Phase 2 (2026) – BIGchain Creation", desc: "Our own blockchain.", done: false },
      { title: "Phase 3 (2026) – Extension Integration", desc: "Support for browser extension.", done: false },
      { title: "Phase 4 (2026) – Multiplatform", desc: "Apps for Android and iOS.", done: false },
      { title: "Phase 5 (2026) – Network Expansion", desc: "Strategic partnerships and user base growth.", done: false },
      { title: "Phase 6 (2026) – Advanced Features", desc: "New reward models, analytics, and support for new protocols.", done: false },
    ]
  };

  // Inicialização do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') document.body.classList.add('light-mode');
  }, []);

  // Scroll listener para parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer para animações de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const registerRef = (id, el) => {
    sectionRefs.current[id] = el;
  };

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@bigfootconnect.tech');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar email:', error);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      <Head>
        <title>BIGFOOT Connect - {t('heroTitle')}</title>
        <meta name="description" content={t('heroText').replace(/<[^>]*>/g, '')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#080808] text-gray-100' : 'bg-[#fafafa] text-gray-900'} transition-colors duration-500`} style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Partículas de fundo animadas */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle absolute rounded-full"
              style={{
                width: `${[180, 120, 220, 90, 160, 100][i]}px`,
                height: `${[180, 120, 220, 90, 160, 100][i]}px`,
                left: `${[10, 75, 40, 85, 20, 60][i]}%`,
                top: `${[15, 60, 80, 25, 45, 10][i]}%`,
                background: isDark
                  ? `radial-gradient(circle, rgba(249,115,22,${[0.06,0.04,0.05,0.07,0.03,0.05][i]}) 0%, transparent 70%)`
                  : `radial-gradient(circle, rgba(249,115,22,${[0.08,0.05,0.07,0.09,0.04,0.06][i]}) 0%, transparent 70%)`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${8 + i * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <header
          className={`sticky top-0 z-50 transition-all duration-300 ${
            scrollY > 20
              ? isDark
                ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-orange-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
                : 'bg-white/90 backdrop-blur-xl border-b border-orange-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.08)]'
              : 'bg-transparent border-b border-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 scale-110" />
                  <Image
                    src="/images/logo.png"
                    alt="BIGFOOT Logo"
                    width={40}
                    height={40}
                    className="relative rounded-xl transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-xl font-bold text-orange-500 transition-all duration-300 group-hover:text-orange-400" style={{ fontFamily: "'Syne', sans-serif" }}>
                  BIGFOOT Connect
                </span>
              </Link>

              <nav className="flex items-center gap-4">
                {loading ? (
                  <div className="flex items-center gap-4">
                    <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} h-8 w-32 rounded-lg animate-pulse`} />
                    <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} h-8 w-24 rounded-lg animate-pulse`} />
                  </div>
                ) : user ? (
                  <>
                    <span className={`${isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-300' : 'bg-orange-500/5 border-orange-500/20 text-orange-700'} border px-3 py-1.5 rounded-lg text-sm font-medium`}>
                      {t('hello')}, {user.email}
                    </span>
                    <NavLink href="/dashboard" label={t('dashboard')} isDark={isDark} />
                    <NavLink href="/pools" label="Pools" isDark={isDark} />
                    <button
                      onClick={handleLogout}
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300 text-sm"
                    >
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink href="/login" label={t('login')} isDark={isDark} />
                    <NavLink href="/register" label={t('register')} isDark={isDark} />
                    <NavLink href="/pools" label="Pools" isDark={isDark} />
                  </>
                )}

                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className={`${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded-lg px-3 py-2 text-sm cursor-pointer transition-all duration-300 hover:border-orange-500 focus:outline-none`}
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                </select>

                <button
                  onClick={toggleTheme}
                  className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-orange-500 transition-all duration-300 hover:border-orange-500 hover:scale-110`}
                  aria-label="Alternar tema"
                >
                  {isDark ? '🌙' : '🌞'}
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          {/* ── HERO ── */}
          <section className="w-full max-w-5xl pt-24 pb-20 flex flex-col items-center">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
              style={{
                background: isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.06)',
                borderColor: isDark ? 'rgba(249,115,22,0.25)' : 'rgba(249,115,22,0.3)',
              }}>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-500 text-sm font-semibold tracking-wider uppercase">
                {language === 'pt' ? 'Plataforma Web3 · Solana' : 'Web3 Platform · Solana'}
              </span>
            </div>

            {/* Título */}
            <h1
              className="hero-title text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                {t('heroTitle').split(' ').slice(0, -1).join(' ')}{' '}
              </span>
              <span className="relative inline-block">
                <span className="text-orange-500">
                  {t('heroTitle').split(' ').slice(-1)}
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
              </span>
            </h1>

            <p className={`hero-text max-w-2xl text-lg md:text-xl leading-relaxed mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('heroText')}
            </p>

            {/* CTA */}
            <div className="hero-cta flex gap-4 flex-wrap justify-center mb-10">
              <a
                href="https://github.com/fabricioricard/BIGFOOT-Connect/releases/download/v1.2.2/BIGFOOT-Connect-Setup-1.2.2.exe"
                className="group relative inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(249,115,22,0.4)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-white/10 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  <path d="M17 12l-5 5-5-5h3V7h4v5h3z" />
                </svg>
                {t('downloadWindows')}
              </a>
              <Link
                href="/pools"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:-translate-y-1 border ${
                  isDark
                    ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50'
                    : 'border-orange-500/40 text-orange-600 hover:bg-orange-500/8 hover:border-orange-500/60'
                }`}
              >
                {language === 'pt' ? 'Ver Pools de Liquidez' : 'View Liquidity Pools'}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Aviso instalador */}
            <div
              className={`hero-warning w-full max-w-2xl text-left text-sm px-5 py-4 rounded-xl border-l-4 border-orange-500 ${
                isDark ? 'bg-orange-500/5 text-gray-300' : 'bg-orange-50 text-gray-700'
              }`}
              dangerouslySetInnerHTML={{ __html: t('installerWarning') }}
            />

            {/* Logo animada */}
            <div className="hero-logo mt-16 relative">
              <div className="absolute inset-0 rounded-3xl bg-orange-500/10 blur-3xl scale-125 animate-pulse" />
              <div className="absolute inset-0 rounded-3xl bg-orange-500/5 blur-2xl scale-110" style={{ animation: 'orbit 8s linear infinite' }} />
              <Image
                src="/images/logo.png"
                alt="BIGFOOT Logo"
                width={280}
                height={280}
                className="relative rounded-3xl border border-orange-500/20 shadow-[0_0_60px_rgba(249,115,22,0.15)]"
                style={{ animation: 'float 6s ease-in-out infinite' }}
                priority
              />
            </div>
          </section>

          {/* ── DIVIDER ── */}
          <Divider />

          {/* ── WHITEPAPER ── */}
          <section
            id="whitepaper"
            ref={el => registerRef('whitepaper', el)}
            className={`w-full max-w-3xl py-20 text-center transition-all duration-700 ${visibleSections.whitepaper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
              {language === 'pt' ? 'Documentação' : 'Documentation'}
            </span>
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {t('whitepaperTitle')}
            </h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('whitepaperText')}
            </p>
            <a
              href="/docs/whitepaper.pdf"
              target="_blank"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,184,166,0.35)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('whitepaperBtn')}
            </a>
          </section>

          <Divider />

          {/* ── TOKEN ── */}
          <section
            id="token"
            ref={el => registerRef('token', el)}
            className={`w-full max-w-3xl py-20 text-center transition-all duration-700 ${visibleSections.token ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
              {language === 'pt' ? 'Token' : 'Token'}
            </span>
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {t('tokenTitle')}
            </h2>
            <p
              className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              dangerouslySetInnerHTML={{ __html: t('tokenDesc') }}
            />
            <div className={`inline-flex items-center gap-3 flex-wrap justify-center px-6 py-4 rounded-2xl border text-sm ${
              isDark ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200'
            }`}>
              <span className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                {t('contractLabel')}
              </span>
              <a
                href="https://explorer.solana.com/address/39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8?cluster=mainnet"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-teal-500 hover:text-teal-400 transition-colors break-all"
              >
                39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8 🔗
              </a>
            </div>
          </section>

          <Divider />

          {/* ── ROADMAP ── */}
          <section
            id="roadmap"
            ref={el => registerRef('roadmap', el)}
            className={`w-full max-w-3xl py-20 transition-all duration-700 ${visibleSections.roadmap ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
              Roadmap
            </span>
            <h2 className={`text-4xl md:text-5xl font-extrabold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {t('roadmapTitle')}
            </h2>

            <div className="relative">
              {/* Linha vertical */}
              <div className={`absolute left-6 top-0 bottom-0 w-px ${isDark ? 'bg-orange-500/20' : 'bg-orange-200'}`} />

              <ul className="space-y-4">
                {roadmapItems[language]?.map((item, index) => (
                  <li
                    key={index}
                    className="roadmap-item relative pl-16 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Dot na linha */}
                    <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      item.done
                        ? 'bg-orange-500 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                        : isDark
                          ? 'bg-gray-800 border-orange-500/40 group-hover:border-orange-500 group-hover:bg-orange-500/20'
                          : 'bg-white border-orange-300 group-hover:border-orange-500 group-hover:bg-orange-50'
                    }`} />

                    <div className={`p-5 rounded-2xl border transition-all duration-300 cursor-default group-hover:-translate-x-0 group-hover:shadow-lg ${
                      item.done
                        ? isDark
                          ? 'bg-orange-500/8 border-orange-500/30 group-hover:bg-orange-500/12'
                          : 'bg-orange-50 border-orange-200 group-hover:bg-orange-100'
                        : isDark
                          ? 'bg-gray-900/60 border-gray-800 group-hover:bg-gray-900 group-hover:border-orange-500/30'
                          : 'bg-white border-gray-200 group-hover:border-orange-200'
                    }`}>
                      <strong className={`block text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                        {item.title}
                      </strong>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Divider />

          {/* ── CONTACT ── */}
          <section
            id="contact"
            ref={el => registerRef('contact', el)}
            className={`w-full max-w-3xl py-20 transition-all duration-700 ${visibleSections.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className={`relative overflow-hidden rounded-3xl p-12 border ${
              isDark ? 'bg-gradient-to-br from-gray-900 to-[#0d0d0d] border-orange-500/15' : 'bg-gradient-to-br from-orange-50 to-white border-orange-200'
            }`}>
              {/* Glow de fundo */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

              <div className="relative">
                <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
                  {language === 'pt' ? 'Contato' : 'Contact'}
                </span>
                <h2 className={`text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {t('contactTitle')}
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('contactDescription')}
                </p>

                <button
                  onClick={handleCopyEmail}
                  className="group inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(249,115,22,0.4)] overflow-hidden relative"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>{emailCopied ? (language === 'pt' ? '✓ Copiado!' : '✓ Copied!') : t('contactEmailText')}</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
                  {[t('purposePartnerships'), t('purposeSupport'), t('purposeQuestions')].map((item, i) => (
                    <div key={i} className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-orange-500/8 border-orange-500/15 text-gray-300 hover:bg-orange-500/15 hover:border-orange-500/25'
                        : 'bg-white border-orange-100 text-gray-700 hover:border-orange-200 hover:bg-orange-50'
                    }`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SOCIALS ── */}
          <div
            id="socials"
            ref={el => registerRef('socials', el)}
            className={`flex gap-8 justify-center py-16 transition-all duration-700 ${visibleSections.socials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <SocialLink href="https://discord.gg/mkfmncN5Sa" label="Discord" isDark={isDark}>
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.211.375-.444.864-.608 1.249a18.233 18.233 0 0 0-5.487 0 12.66 12.66 0 0 0-.617-1.249.077.077 0 0 0-.078-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.033.027C.533 9.045-.32 13.579.099 18.057a.086.086 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.057.076.076 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.993a.076.076 0 0 0-.041-.105 13.181 13.181 0 0 1-1.872-.896.076.076 0 0 1-.008-.127c.126-.094.252-.191.371-.291a.074.074 0 0 1 .077-.01c3.927 1.794 8.18 1.794 12.061 0a.074.074 0 0 1 .078.01c.12.1.245.197.371.291a.076.076 0 0 1-.006.127 12.316 12.316 0 0 1-1.874.896.076.076 0 0 0-.041.105c.36.698.772 1.362 1.226 1.993a.076.076 0 0 0 .084.027 19.888 19.888 0 0 0 6.001-3.057.076.076 0 0 0 .03-.057c.5-5.177-.838-9.664-3.568-13.661a.06.06 0 0 0-.032-.027ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.094 2.157 2.42 0 1.334-.955 2.418-2.157 2.418Zm7.956 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.094 2.157 2.42 0 1.334-.947 2.418-2.157 2.418Z" />
            </SocialLink>
            <SocialLink href="https://t.me/+qrkA9s2VTxVhMzcx" label="Telegram" isDark={isDark}>
              <path d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12S18.628 0 12 0zm5.292 7.665-1.68 7.92c-.126.558-.456.696-.923.435l-2.553-1.885-1.232 1.188c-.136.135-.25.25-.512.25l.184-2.626 4.776-4.318c.207-.184-.046-.287-.322-.104l-5.902 3.7-2.544-.795c-.552-.174-.563-.552.116-.816l9.933-3.826c.46-.173.861.105.713.807z" />
            </SocialLink>
            <SocialLink href="https://x.com/BIGFOOT_Connect" label="X" isDark={isDark}>
              <path d="M20.662 3H17.27l-4.42 5.713L8.63 3H3l6.911 9.283L3.3 21h3.393l4.718-6.085L15.48 21h5.52l-7.091-9.576L20.662 3zm-3.663 16h-1.218l-3.8-5.16-4.14 5.16H6.999l5.3-6.644L6.7 5h1.215l3.58 4.865L15.504 5h1.224l-5.05 6.434L17 19z" />
            </SocialLink>
            <SocialLink href="https://www.youtube.com/@bigfootconnect" label="YouTube" isDark={isDark}>
              <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-.9C17.2 2.7 12 2.7 12 2.7s-5.2 0-8.6.2c-.4 0-1.3 0-2.1.9-.6.7-.8 2.4-.8 2.4S0 8.3 0 10.4v2.5c0 2.1.2 4.2.2 4.2s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1C6.8 20.9 12 20.9 12 20.9s5.2 0 8.6-.2c.4 0 1.3 0 2.1-.9.6-.7.8-2.4.8-2.4s.2-2.1.2-4.2v-2.5c0-2.1-.2-4.2-.2-4.2zM9.6 15.5V8.5l6.4 3.5-6.4 3.5z" />
            </SocialLink>
          </div>
        </main>

        {/* Footer */}
        <footer className={`relative z-10 text-center py-8 border-t ${isDark ? 'border-gray-800/60 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {t('footerText')}
          </p>
        </footer>

        {/* Toast */}
        {emailCopied && (
          <div className="fixed top-6 right-6 z-50 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] font-semibold text-sm animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full" />
            {language === 'pt' ? 'Email copiado!' : 'Email copied!'}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(0.5deg); }
          66% { transform: translateY(-6px) rotate(-0.5deg); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(20px, -30px) scale(1.05); opacity: 0.8; }
          50% { transform: translate(-10px, -50px) scale(0.95); opacity: 0.5; }
          75% { transform: translate(-25px, -20px) scale(1.02); opacity: 0.7; }
        }

        @keyframes hero-reveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .particle {
          animation: particle-drift var(--dur, 10s) ease-in-out infinite;
        }

        .hero-badge {
          animation: hero-reveal 0.6s ease-out both;
        }
        .hero-title {
          animation: hero-reveal 0.6s ease-out 0.1s both;
        }
        .hero-text {
          animation: hero-reveal 0.6s ease-out 0.2s both;
        }
        .hero-cta {
          animation: hero-reveal 0.6s ease-out 0.3s both;
        }
        .hero-warning {
          animation: hero-reveal 0.6s ease-out 0.4s both;
        }
        .hero-logo {
          animation: hero-reveal 0.6s ease-out 0.5s both;
        }

        .roadmap-item {
          animation: hero-reveal 0.5s ease-out both;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        body.light-mode { background-color: #fafafa; color: #1a1a1a; }
        body[data-theme="dark"] { background-color: #080808; color: #f0f0f0; }
        body[data-theme="light"] { background-color: #fafafa; color: #1a1a1a; }
      `}</style>
    </>
  );
}

// ── Componentes auxiliares ──

function Divider() {
  return (
    <div className="w-full max-w-3xl flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-500/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-500/30" />
    </div>
  );
}

function NavLink({ href, label, isDark }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg border border-transparent transition-all duration-300 ${
        isDark
          ? 'text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30'
          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-500/8 hover:border-orange-500/20'
      }`}
    >
      {label}
    </Link>
  );
}

function SocialLink({ href, label, children, isDark }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group relative p-3 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.2)] ${
        isDark
          ? 'text-gray-500 border-gray-800 hover:text-orange-400 hover:border-orange-500/30 hover:bg-orange-500/8'
          : 'text-gray-400 border-gray-200 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50'
      }`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110">
        {children}
      </svg>
    </a>
  );
}
