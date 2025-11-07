import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Droplets, TrendingUp, Shield, Award, ArrowRight } from 'lucide-react';

const PoolsPage = () => {
  const [lang, setLang] = useState('en'); // Default to English

  // Constants
  const BIG_TOKEN_MINT = '39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8';
  const ORCA_POOL_URL = 'https://www.orca.so/pools?tokens=39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8';
  const ORCA_PORTFOLIO_URL = 'https://www.orca.so/portfolio';

  const translations = {
    en: {
      title: '💧 BIG/SOL Liquidity Pool',
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
      poolAddress: 'Pool Address',
      platform: 'Platform',
      fee: 'Trading Fee',
      protocol: 'Protocol',
      security: 'Security & Trust',
      securityDesc: 'Orca is one of the most trusted DEXs on Solana, with millions in TVL and audited smart contracts.',
      whyOrca: 'Why Orca?',
      whyOrcaDesc: 'Orca offers the best liquidity experience on Solana with concentrated liquidity (Whirlpools), low fees, and a user-friendly interface.',
      copyAddress: 'Copy Address',
      copied: 'Copied!',
      learnMore: 'Learn More',
      statsTitle: 'Current Pool Stats',
      tvl: 'Total Value Locked',
      apr: 'Estimated APR',
      volume24h: '24h Volume',
      fees24h: '24h Fees',
      backToHome: 'Back to Home',
    },
    pt: {
      title: '💧 Pool de Liquidez BIG/SOL',
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
      poolAddress: 'Endereço da Pool',
      platform: 'Plataforma',
      fee: 'Taxa de Trading',
      protocol: 'Protocolo',
      security: 'Segurança e Confiança',
      securityDesc: 'Orca é uma das DEXs mais confiáveis da Solana, com milhões em TVL e contratos inteligentes auditados.',
      whyOrca: 'Por Que Orca?',
      whyOrcaDesc: 'Orca oferece a melhor experiência de liquidez na Solana com liquidez concentrada (Whirlpools), taxas baixas e interface amigável.',
      copyAddress: 'Copiar Endereço',
      copied: 'Copiado!',
      learnMore: 'Saiba Mais',
      statsTitle: 'Estatísticas Atuais da Pool',
      tvl: 'Valor Total Bloqueado',
      apr: 'APR Estimado',
      volume24h: 'Volume 24h',
      fees24h: 'Taxas 24h',
      backToHome: 'Voltar ao Início',
    }
  };

  const t = translations[lang];

  const [copiedAddress, setCopiedAddress] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const openOrcaPool = () => {
    window.open(ORCA_POOL_URL, '_blank', 'noopener,noreferrer');
  };

  const openOrcaPortfolio = () => {
    window.open(ORCA_PORTFOLIO_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Head>
        <title>Liquidity Pools - BIGFOOT Connect</title>
        <meta name="description" content="Add liquidity to BIG/SOL pool on Orca and earn rewards while helping grow the BIG token ecosystem. Increase TVL and support the BIGFOOT Connect project." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 cursor-pointer group">
                <Image 
                  src="/images/logo.png" 
                  alt="BIGFOOT Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
                />
                <span className="text-xl font-bold text-orange-500 transition-all duration-300 group-hover:text-orange-400">
                  BIGFOOT Connect
                </span>
              </Link>
              
              <div className="flex items-center gap-4">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 hover:border-orange-500"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Page Title */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-2">{t.subtitle}</p>
            <p className="text-md text-orange-400 font-semibold">
              {lang === 'pt' 
                ? '🚀 Ajude a aumentar o TVL e valorize o token BIG!' 
                : '🚀 Help increase TVL and grow BIG token value!'}
            </p>
          </div>

          {/* Main CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <button
              onClick={openOrcaPool}
              className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-12 h-12" />
                <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.goToOrca}</h3>
              <p className="text-orange-100 text-sm">
                {lang === 'pt' ? 'Deposite agora e aumente o TVL!' : 'Deposit now and increase TVL!'}
              </p>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
            </button>

            <button
              onClick={openOrcaPortfolio}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <Award className="w-12 h-12" />
                <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.managePositions}</h3>
              <p className="text-blue-100 text-sm">
                {lang === 'pt' ? 'Veja e gerencie suas posições' : 'View and manage your positions'}
              </p>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
            </button>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">{t.whyAddLiquidity}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6 hover:bg-orange-900/30 transition">
                <TrendingUp className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-orange-400 mb-2">{t.benefit1Title}</h3>
                <p className="text-gray-300 text-sm">{t.benefit1Desc}</p>
                <div className="mt-3 text-xs text-orange-300 font-semibold">
                  {lang === 'pt' ? '🎯 Objetivo Principal' : '🎯 Main Goal'}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 hover:bg-blue-900/30 transition">
                <Shield className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-blue-400 mb-2">{t.benefit2Title}</h3>
                <p className="text-gray-300 text-sm">{t.benefit2Desc}</p>
                <div className="mt-3 text-xs text-blue-300 font-semibold">
                  {lang === 'pt' ? '📊 Melhor para Traders' : '📊 Better for Traders'}
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 hover:bg-green-900/30 transition">
                <Award className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">{t.benefit3Title}</h3>
                <p className="text-gray-300 text-sm">{t.benefit3Desc}</p>
                <div className="mt-3 text-xs text-green-300 font-semibold">
                  {lang === 'pt' ? '💰 Recompensa Extra' : '💰 Extra Reward'}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">{t.howItWorks}</h2>
            
            <div className="space-y-4">
              {[t.step1, t.step2, t.step3, t.step4, t.step5].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200">{step}</p>
                  </div>
                  {idx < 4 && <ArrowRight className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Pool Stats with TVL Emphasis */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-3xl font-bold mb-2 text-center">{t.statsTitle}</h2>
            <p className="text-center text-gray-400 text-sm mb-6">
              {lang === 'pt' 
                ? '🎯 Objetivo: Aumentar o TVL para valorizar o token BIG!' 
                : '🎯 Goal: Increase TVL to grow BIG token value!'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-500/20 border-2 border-orange-500/50 rounded-xl p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                  {lang === 'pt' ? 'PRINCIPAL' : 'MAIN'}
                </div>
                <div className="text-sm text-gray-300 mb-1">{t.tvl}</div>
                <div className="text-3xl font-bold text-orange-400 mb-1">$21.95</div>
                <div className="text-xs text-orange-300">
                  {lang === 'pt' ? '⬆️ Vamos aumentar!' : '⬆️ Let\'s grow it!'}
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">{t.apr}</div>
                <div className="text-2xl font-bold text-green-400">~100%</div>
                <div className="text-xs text-gray-500">{lang === 'pt' ? 'Bônus' : 'Bonus'}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">{t.volume24h}</div>
                <div className="text-2xl font-bold text-blue-400">$0.00</div>
                <div className="text-xs text-gray-500">{lang === 'pt' ? 'Crescendo' : 'Growing'}</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">{t.fees24h}</div>
                <div className="text-2xl font-bold text-purple-400">$0.00</div>
                <div className="text-xs text-gray-500">{lang === 'pt' ? 'Em breve' : 'Soon'}</div>
              </div>
            </div>
            
            {/* TVL Impact Explanation */}
            <div className="mt-6 bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-l-4 border-orange-500 rounded-lg p-4">
              <h4 className="font-bold text-orange-400 mb-2">
                {lang === 'pt' ? '💡 Por que TVL é importante?' : '💡 Why is TVL important?'}
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✅ {lang === 'pt' ? 'Maior TVL = Mais confiança dos investidores' : 'Higher TVL = More investor confidence'}</li>
                <li>✅ {lang === 'pt' ? 'Pool mais profunda = Menos variação de preço' : 'Deeper pool = Less price volatility'}</li>
                <li>✅ {lang === 'pt' ? 'Atrai mais traders = Mais volume = Mais taxas para você' : 'Attracts traders = More volume = More fees for you'}</li>
                <li>✅ {lang === 'pt' ? 'Token mais estável e valorizado' : 'More stable and valuable token'}</li>
              </ul>
            </div>
          </div>

          {/* Pool Info */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t.poolInfo}</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-2">{t.tokenAddress}</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs md:text-sm text-orange-400 break-all">{BIG_TOKEN_MINT}</code>
                  <button
                    onClick={() => copyToClipboard(BIG_TOKEN_MINT, 'token')}
                    className="flex-shrink-0 px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded-lg text-xs transition"
                  >
                    {copiedAddress === 'token' ? t.copied : t.copyAddress}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">{t.platform}</div>
                  <div className="font-bold text-lg">Orca</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">{t.fee}</div>
                  <div className="font-bold text-lg text-green-400">0.3%</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">{t.protocol}</div>
                  <div className="font-bold text-lg">Whirlpool</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Orca Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-bold">{t.security}</h3>
              </div>
              <p className="text-gray-300 text-sm">{t.securityDesc}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Droplets className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold">{t.whyOrca}</h3>
              </div>
              <p className="text-gray-300 text-sm">{t.whyOrcaDesc}</p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {lang === 'pt' ? '🚀 Vamos valorizar o BIG juntos!' : '🚀 Let\'s grow BIG together!'}
            </h2>
            <p className="text-orange-100 mb-2">
              {lang === 'pt' 
                ? 'Cada depósito aumenta o TVL e fortalece o ecossistema BIG!'
                : 'Every deposit increases TVL and strengthens the BIG ecosystem!'}
            </p>
            <p className="text-orange-200 text-sm mb-6">
              {lang === 'pt'
                ? 'Meta: Alcançar $10,000+ em TVL para atrair grandes investidores'
                : 'Goal: Reach $10,000+ TVL to attract major investors'}
            </p>
            <button
              onClick={openOrcaPool}
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2"
            >
              {lang === 'pt' ? 'Depositar Agora' : 'Deposit Now'}
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 BIGFOOT Connect. {lang === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
            <p className="mt-2 text-xs">
              {lang === 'pt' 
                ? '⚠️ Fornecer liquidez envolve riscos. Sempre faça sua própria pesquisa.'
                : '⚠️ Providing liquidity involves risks. Always do your own research.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoolsPage;
