import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Droplets, TrendingUp, Shield, Award } from 'lucide-react';

const PoolsPage = () => {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  const BIG_TOKEN_MINT = '39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8';
  const ORCA_POOL_URL = 'https://www.orca.so/pools?tokens=39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8';
  const ORCA_PORTFOLIO_URL = 'https://www.orca.so/portfolio';

  const translations = {
    en: {
      title: 'BIG/SOL Liquidity Pool',
      subtitle: 'Earn rewards by providing liquidity',
      whyAddLiquidity: 'Why Add Liquidity?',
      benefit1Title: 'Grow BIG Token Value',
      benefit1Desc: 'Higher TVL = more trust and higher token price',
      benefit2Title: 'Reduce Slippage',
      benefit2Desc: 'More liquidity means better prices for all traders',
      benefit3Title: 'Earn Passive Income',
      benefit3Desc: 'Bonus: earn 0.3% fees from every trade',
      howItWorks: 'How It Works',
      step1: 'Connect your wallet (Phantom, Solflare, etc)',
      step2: 'Deposit BIG and SOL tokens to increase pool TVL',
      step3: 'Your deposit strengthens the BIG token ecosystem',
      step4: 'Automatically earn fees from trading activity',
      step5: 'Watch the token value grow as TVL increases',
      goToOrca: 'Go to Orca Pool',
      managePositions: 'Manage My Positions',
      poolInfo: 'Pool Information',
      tokenAddress: 'BIG Token Address',
      platform: 'Platform',
      fee: 'Trading Fee',
      protocol: 'Protocol',
      security: 'Security & Trust',
      securityDesc: 'Orca is one of the most trusted DEXs on Solana, with millions in TVL and audited smart contracts.',
      whyOrca: 'Why Orca?',
      whyOrcaDesc: 'Orca offers the best liquidity experience on Solana with concentrated liquidity (Whirlpools), low fees, and a user-friendly interface.',
      copyAddress: 'Copy',
      copied: 'Copied!',
      statsTitle: 'Pool Stats',
      tvl: 'Total Value Locked',
      apr: 'Estimated APR',
      volume24h: '24h Volume',
    },
    pt: {
      title: 'Pool de Liquidez BIG/SOL',
      subtitle: 'Ganhe recompensas fornecendo liquidez',
      whyAddLiquidity: 'Por Que Adicionar Liquidez?',
      benefit1Title: 'Valorize o Token BIG',
      benefit1Desc: 'Maior TVL = mais confiança e preço maior do token',
      benefit2Title: 'Reduza o Slippage',
      benefit2Desc: 'Mais liquidez significa melhores preços para todos',
      benefit3Title: 'Ganhe Renda Passiva',
      benefit3Desc: 'Bônus: ganhe 0.3% de taxas de cada negociação',
      howItWorks: 'Como Funciona',
      step1: 'Conecte sua carteira (Phantom, Solflare, etc)',
      step2: 'Deposite tokens BIG e SOL para aumentar o TVL da pool',
      step3: 'Seu depósito fortalece o ecossistema do token BIG',
      step4: 'Ganhe taxas automaticamente da atividade de trading',
      step5: 'Veja o valor do token crescer conforme o TVL aumenta',
      goToOrca: 'Ir para Pool na Orca',
      managePositions: 'Gerenciar Minhas Posições',
      poolInfo: 'Informações da Pool',
      tokenAddress: 'Endereço do Token BIG',
      platform: 'Plataforma',
      fee: 'Taxa de Trading',
      protocol: 'Protocolo',
      security: 'Segurança e Confiança',
      securityDesc: 'Orca é uma das DEXs mais confiáveis da Solana, com milhões em TVL e contratos inteligentes auditados.',
      whyOrca: 'Por Que Orca?',
      whyOrcaDesc: 'Orca oferece a melhor experiência de liquidez na Solana com liquidez concentrada (Whirlpools), taxas baixas e interface amigável.',
      copyAddress: 'Copiar',
      copied: 'Copiado!',
      statsTitle: 'Estatísticas da Pool',
      tvl: 'Valor Total Bloqueado',
      apr: 'APR Estimado',
      volume24h: 'Volume 24h',
    }
  };

  const t = translations[lang];
  const [copiedAddress, setCopiedAddress] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') document.body.classList.add('light-mode');
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
        });
      },
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [mounted]);

  const registerRef = (id, el) => { sectionRefs.current[id] = el; };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    if (newTheme === 'light') { document.body.classList.add('light-mode'); }
    else { document.body.classList.remove('light-mode'); }
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Liquidity Pools - BIGFOOT Connect</title>
        <meta name="description" content="Add liquidity to BIG/SOL pool on Orca and earn rewards." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className={`min-h-screen ${isDark ? 'bg-[#080808] text-gray-100' : 'bg-[#fafafa] text-gray-900'} transition-colors duration-500`} style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Partículas de fundo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle absolute rounded-full" style={{
              width: `${[160, 120, 200, 90, 140][i]}px`,
              height: `${[160, 120, 200, 90, 140][i]}px`,
              left: `${[8, 78, 42, 88, 22][i]}%`,
              top: `${[12, 58, 78, 28, 45][i]}%`,
              background: isDark
                ? `radial-gradient(circle, rgba(249,115,22,${[0.06,0.04,0.05,0.07,0.03][i]}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(249,115,22,${[0.08,0.05,0.07,0.09,0.04][i]}) 0%, transparent 70%)`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${9 + i * 2}s`,
            }} />
          ))}
        </div>

        {/* Header */}
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 20
            ? isDark
              ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-orange-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
              : 'bg-white/90 backdrop-blur-xl border-b border-orange-500/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : isDark ? 'border-b border-gray-800/60' : 'border-b border-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 scale-110" />
                  <Image src="/images/logo.png" alt="BIGFOOT Logo" width={40} height={40} className="relative rounded-xl transition-all duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xl font-bold text-orange-500 transition-colors duration-300 group-hover:text-orange-400" style={{ fontFamily: "'Syne', sans-serif" }}>
                  BIGFOOT Connect
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className={`${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border rounded-xl px-3 py-2 text-sm cursor-pointer transition-all duration-300 hover:border-orange-500 focus:outline-none`}
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                </select>
                <button
                  onClick={toggleTheme}
                  className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl px-3 py-2 text-orange-500 transition-all duration-300 hover:border-orange-500 hover:scale-110`}
                >
                  {isDark ? '🌙' : '🌞'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 pools-reveal"
              style={{
                background: isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.06)',
                borderColor: isDark ? 'rgba(249,115,22,0.25)' : 'rgba(249,115,22,0.3)',
              }}>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-500 text-sm font-semibold tracking-wider uppercase">
                {lang === 'pt' ? 'Solana · DeFi · Orca' : 'Solana · DeFi · Orca'}
              </span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 pools-reveal-delay-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              💧 {t.title}
            </h1>
            <p className={`text-lg md:text-xl pools-reveal-delay-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.subtitle}
            </p>
            <p className={`text-sm font-semibold mt-2 pools-reveal-delay-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              🚀 {lang === 'pt' ? 'Ajude a aumentar o TVL e valorize o token BIG!' : 'Help increase TVL and grow BIG token value!'}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 pools-reveal-delay-2">
            <button
              onClick={() => window.open(ORCA_POOL_URL, '_blank', 'noopener,noreferrer')}
              className="group relative bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(249,115,22,0.35)] text-white overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/15 rounded-xl">
                  <Droplets className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{t.goToOrca}</h3>
              <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                {lang === 'pt' ? 'Deposite agora e aumente o TVL!' : 'Deposit now and increase TVL!'}
              </p>
            </button>

            <button
              onClick={() => window.open(ORCA_PORTFOLIO_URL, '_blank', 'noopener,noreferrer')}
              className="group relative bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] text-white overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/15 rounded-xl">
                  <Award className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{t.managePositions}</h3>
              <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                {lang === 'pt' ? 'Veja e gerencie suas posições' : 'View and manage your positions'}
              </p>
            </button>
          </div>

          {/* Benefits */}
          <Section id="benefits" registerRef={registerRef} visible={visibleSections.benefits} isDark={isDark}>
            <SectionHeader label={lang === 'pt' ? 'Benefícios' : 'Benefits'} title={t.whyAddLiquidity} isDark={isDark} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: <TrendingUp className="w-7 h-7" />, title: t.benefit1Title, desc: t.benefit1Desc, tag: lang === 'pt' ? '🎯 Objetivo Principal' : '🎯 Main Goal', color: 'orange' },
                { icon: <Shield className="w-7 h-7" />, title: t.benefit2Title, desc: t.benefit2Desc, tag: lang === 'pt' ? '📊 Melhor para Traders' : '📊 Better for Traders', color: 'blue' },
                { icon: <Award className="w-7 h-7" />, title: t.benefit3Title, desc: t.benefit3Desc, tag: lang === 'pt' ? '💰 Recompensa Extra' : '💰 Extra Reward', color: 'green' },
              ].map((item, i) => {
                const colors = {
                  orange: isDark ? 'bg-orange-500/8 border-orange-500/15 text-orange-400' : 'bg-orange-50 border-orange-100 text-orange-600',
                  blue: isDark ? 'bg-blue-500/8 border-blue-500/15 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600',
                  green: isDark ? 'bg-green-500/8 border-green-500/15 text-green-400' : 'bg-green-50 border-green-100 text-green-600',
                };
                return (
                  <div key={i} className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${colors[item.color]}`}>
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{item.title}</h3>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                    <div className="text-xs font-semibold opacity-70">{item.tag}</div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* How it works */}
          <Section id="how" registerRef={registerRef} visible={visibleSections.how} isDark={isDark}>
            <SectionHeader label={lang === 'pt' ? 'Processo' : 'Process'} title={t.howItWorks} isDark={isDark} />
            <div className="mt-8 relative">
              <div className={`absolute left-5 top-0 bottom-0 w-px ${isDark ? 'bg-orange-500/15' : 'bg-orange-100'}`} />
              <div className="space-y-3">
                {[t.step1, t.step2, t.step3, t.step4, t.step5].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-6 group">
                    <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isDark ? 'bg-gray-900 border-2 border-orange-500/30 text-orange-400 group-hover:border-orange-500 group-hover:bg-orange-500/10' : 'bg-white border-2 border-orange-200 text-orange-600 group-hover:border-orange-500 group-hover:bg-orange-50'
                    }`} style={{ fontFamily: "'Syne', sans-serif" }}>
                      {idx + 1}
                    </div>
                    <div className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                      isDark ? 'group-hover:bg-gray-900/60' : 'group-hover:bg-white'
                    }`}>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Stats */}
          <Section id="stats" registerRef={registerRef} visible={visibleSections.stats} isDark={isDark}>
            <SectionHeader label="Stats" title={t.statsTitle} isDark={isDark} />
            <p className={`text-sm text-center mt-1 mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              🎯 {lang === 'pt' ? 'Objetivo: Aumentar o TVL para valorizar o token BIG!' : 'Goal: Increase TVL to grow BIG token value!'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: t.tvl, value: lang === 'pt' ? 'Crescendo' : 'Growing', sub: lang === 'pt' ? '⬆️ Vamos juntos!' : '⬆️ Let\'s grow it!', highlight: true },
                { label: t.apr, value: '~100%', sub: lang === 'pt' ? 'Recompensas' : 'Rewards', highlight: false },
                { label: t.volume24h, value: lang === 'pt' ? 'Ativo' : 'Active', sub: lang === 'pt' ? 'Em expansão' : 'Expanding', highlight: false },
              ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-2xl border text-center relative overflow-hidden ${
                  stat.highlight
                    ? isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
                    : isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100'
                }`}>
                  {stat.highlight && <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-xl font-bold">{lang === 'pt' ? 'PRINCIPAL' : 'MAIN'}</div>}
                  <div className={`text-xs uppercase tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
                  <div className={`text-2xl font-extrabold mb-1 ${stat.highlight ? 'text-orange-500' : isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* TVL explainer */}
            <div className={`mt-6 p-5 rounded-2xl border-l-4 border-orange-500 ${isDark ? 'bg-orange-500/5' : 'bg-orange-50'}`}>
              <h4 className={`font-bold text-sm mb-3 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                💡 {lang === 'pt' ? 'Por que TVL é importante?' : 'Why is TVL important?'}
              </h4>
              <ul className={`text-sm space-y-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {(lang === 'pt' ? [
                  'Maior TVL = Mais confiança dos investidores',
                  'Pool mais profunda = Menos variação de preço',
                  'Atrai mais traders = Mais volume = Mais taxas para você',
                  'Token mais estável e valorizado',
                ] : [
                  'Higher TVL = More investor confidence',
                  'Deeper pool = Less price volatility',
                  'Attracts traders = More volume = More fees for you',
                  'More stable and valuable token',
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* Pool Info */}
          <Section id="info" registerRef={registerRef} visible={visibleSections.info} isDark={isDark}>
            <SectionHeader label="Info" title={t.poolInfo} isDark={isDark} />
            <div className="mt-8 space-y-4">
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className={`text-xs uppercase tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.tokenAddress}</div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <code className={`text-xs md:text-sm font-mono break-all ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{BIG_TOKEN_MINT}</code>
                  <button
                    onClick={() => copyToClipboard(BIG_TOKEN_MINT, 'token')}
                    className="flex-shrink-0 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs text-white font-semibold transition-all duration-300 hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                  >
                    {copiedAddress === 'token' ? '✓ ' + t.copied : t.copyAddress}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t.platform, value: 'Orca', color: isDark ? 'text-white' : 'text-gray-900' },
                  { label: t.fee, value: '0.3%', color: isDark ? 'text-green-400' : 'text-green-600' },
                  { label: t.protocol, value: 'Whirlpool', color: isDark ? 'text-white' : 'text-gray-900' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className={`text-xs uppercase tracking-widest mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</div>
                    <div className={`font-bold ${item.color}`} style={{ fontFamily: "'Syne', sans-serif" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Why Orca */}
          <Section id="orca" registerRef={registerRef} visible={visibleSections.orca} isDark={isDark}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-green-500/5 border-green-500/15' : 'bg-green-50 border-green-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{t.security}</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.securityDesc}</p>
              </div>
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-blue-500/5 border-blue-500/15' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{t.whyOrca}</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.whyOrcaDesc}</p>
              </div>
            </div>
          </Section>

          {/* Final CTA */}
          <div
            id="finalcta"
            ref={el => registerRef('finalcta', el)}
            className={`relative overflow-hidden rounded-3xl p-10 text-center transition-all duration-700 ${visibleSections.finalcta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold mb-3 text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                🚀 {lang === 'pt' ? 'Vamos valorizar o BIG juntos!' : "Let's grow BIG together!"}
              </h2>
              <p className="text-orange-100 mb-1 text-sm">
                {lang === 'pt' ? 'Cada depósito aumenta o TVL e fortalece o ecossistema BIG!' : 'Every deposit increases TVL and strengthens the BIG ecosystem!'}
              </p>
              <p className="text-orange-200/80 text-xs mb-8">
                {lang === 'pt' ? 'Meta: Alcançar $10,000+ em TVL para atrair grandes investidores' : 'Goal: Reach $10,000+ TVL to attract major investors'}
              </p>
              <button
                onClick={() => window.open(ORCA_POOL_URL, '_blank', 'noopener,noreferrer')}
                className="group inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
              >
                {lang === 'pt' ? 'Depositar Agora' : 'Deposit Now'}
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`relative z-10 text-center py-8 border-t ${isDark ? 'border-gray-800/60 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            © 2025 BIGFOOT Connect. {lang === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
            {lang === 'pt' ? '⚠️ Fornecer liquidez envolve riscos. Sempre faça sua própria pesquisa.' : '⚠️ Providing liquidity involves risks. Always do your own research.'}
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(20px, -30px) scale(1.05); opacity: 0.8; }
          50% { transform: translate(-10px, -50px) scale(0.95); opacity: 0.5; }
          75% { transform: translate(-25px, -20px) scale(1.02); opacity: 0.7; }
        }

        @keyframes pools-reveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .particle { animation: particle-drift var(--dur, 10s) ease-in-out infinite; }

        .pools-reveal { animation: pools-reveal 0.6s ease-out both; }
        .pools-reveal-delay-1 { animation: pools-reveal 0.6s ease-out 0.1s both; }
        .pools-reveal-delay-2 { animation: pools-reveal 0.6s ease-out 0.2s both; }

        body.light-mode { background-color: #fafafa; color: #1a1a1a; }
        body[data-theme="dark"] { background-color: #080808; color: #f0f0f0; }
        body[data-theme="light"] { background-color: #fafafa; color: #1a1a1a; }
      `}</style>
    </>
  );
};

// Componentes auxiliares
function Section({ id, registerRef, visible, children, isDark }) {
  return (
    <div
      id={id}
      ref={el => registerRef(id, el)}
      className={`mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div
        className="rounded-3xl p-8 border"
        style={{
          background: isDark ? 'rgba(17,17,17,0.6)' : '#ffffff',
          borderColor: isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.15)',
          boxShadow: isDark ? '0 4px 40px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ label, title, isDark }) {
  return (
    <div className="text-center">
      <span className="inline-block text-orange-500 text-xs font-semibold tracking-widest uppercase mb-3">
        {label}
      </span>
      <h2 className={`text-2xl md:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
        {title}
      </h2>
    </div>
  );
}

export default PoolsPage;
