import { useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState('dark');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Roadmap data
  const roadmapItems = {
    pt: [
      { title: "Q1 2025 – Lançamento ✅", desc: "Versão inicial com recursos básicos de compartilhamento e recompensas." },
      { title: "Q2 2025 – Criação da BIGchain", desc: "Nossa própria blockchain." },
      { title: "Q3 2025 – Integração com Extensão", desc: "Suporte para pareamento com extensão de navegador e melhorias de UX." },
      { title: "Q4 2025 – Plataforma Multiplataforma", desc: "Apps para Android e iOS, além de melhorias na estabilidade e segurança." },
      { title: "Q1 2026 – Expansão da Rede", desc: "Parcerias estratégicas e expansão da base de usuários." },
      { title: "Q2 2026 – Recursos Avançados", desc: "Novos modelos de recompensas, analytics e suporte a novos protocolos." },
    ],
    en: [
      { title: "Q1 2025 – Launch ✅", desc: "Initial version with basic sharing features and rewards." },
      { title: "Q2 2025 – BIGchain Creation", desc: "Our own blockchain." },
      { title: "Q3 2025 – Extension Integration", desc: "Support for pairing with browser extension and UX improvements." },
      { title: "Q4 2025 – Multiplatform Platform", desc: "Apps for Android and iOS, plus improvements in stability and security." },
      { title: "Q1 2026 – Network Expansion", desc: "Strategic partnerships and user base growth." },
      { title: "Q2 2026 – Advanced Features", desc: "New reward models, analytics, and support for new protocols." },
    ]
  };

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
    });

    return () => unsubscribe();
  }, []);

  // Scroll handler para botão "Voltar ao topo"
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    setLanguage(e.target.value);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Head>
        <title>BIGFOOT Connect - Conecte. Contribua. Ganhe.</title>
        <meta name="description" content="Compartilhe seu poder computacional, ajude a descentralizar a rede e receba recompensas em BIG" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        {/* Header */}
        <header className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-800' : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'} border-b-2 shadow-lg`}>
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
              
              <nav className="flex items-center gap-6">
                {user ? (
                  <>
                    <span className={`${theme === 'dark' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-500/5 border-orange-500/20'} border px-3 py-1.5 rounded-lg font-medium`}>
                      {t.hello || 'Olá'}, {user.email}
                    </span>
                    <Link 
                      href="/dashboard"
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t.dashboard || 'Dashboard'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t.logout || 'Sair'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t.login || 'Login'}
                    </Link>
                    <Link 
                      href="/register"
                      className="text-orange-500 hover:text-orange-400 font-medium px-3 py-1.5 rounded-lg border border-transparent hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                    >
                      {t.register || 'Criar conta'}
                    </Link>
                  </>
                )}
                
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 hover:border-orange-500`}
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
                
                <button
                  onClick={toggleTheme}
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border rounded-lg px-3 py-2 text-orange-500 text-xl transition-all duration-300 hover:border-orange-500 hover:scale-110`}
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? '🌙' : '🌞'}
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            {t('heroTitle')}
          </h1>
          
          <p 
            className={`max-w-3xl text-xl md:text-2xl leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            dangerouslySetInnerHTML={{ 
              __html: t('heroText')
            }}
          />

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center mb-6">
            <a
              href="https://github.com/fabricioricard/BIGFOOT-Connect/releases/download/v1.1.8/BIGFOOT-Connect-Setup-1.1.8.exe"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {t.downloadWindows || 'Windows'}
            </a>
          </div>

          {/* Installer Warning */}
          <div 
            className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-orange-500' : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-500'} border-l-4 rounded-lg p-4 max-w-3xl text-left mb-8 shadow-lg`}
            dangerouslySetInnerHTML={{ 
              __html: t.installerWarning || '🛡️ <strong>Aviso:</strong> O Windows pode exibir "O Windows protegeu seu computador" ao instalar o BIGFOOT Connect...' 
            }}
          />

          {/* Hero Image */}
          <div className="relative w-full max-w-md mb-16">
            <Image
              src="/images/logo.png"
              alt="Preview do App"
              width={400}
              height={400}
              className="rounded-2xl shadow-2xl animate-pulse-slow border-2 border-orange-500/20"
              priority
            />
          </div>

          {/* Divider */}
          <div className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent my-12"></div>

          {/* Whitepaper Section */}
          <section className="text-center py-8 max-w-3xl">
            <h2 className="text-4xl font-bold mb-4 text-white">
              {t.whitepaperTitle || '📄 Whitepaper do Projeto'}
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
              {t.whitepaperText || 'Quer saber como o BIGFOOT Connect funciona, quais as tecnologias por trás e como você é recompensado? Confira nosso whitepaper completo.'}
            </p>
            <a
              href="/docs/whitepaper.pdf"
              target="_blank"
              className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {t.whitepaperBtn || 'Visualizar / Baixar Whitepaper'}
            </a>
          </section>

          {/* Divider */}
          <div className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent my-12"></div>

          {/* Token Section */}
          <section className="text-center py-8 max-w-3xl">
            <h2 className="text-4xl font-bold mb-4 text-white">
              {t.tokenTitle || '💰 Token BIG (BIG)'}
            </h2>
            <p 
              className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg mb-4`}
              dangerouslySetInnerHTML={{ 
                __html: t.tokenDesc || 'O <strong>BIG</strong> é o token oficial do ecossistema BIGFOOT Connect. Usuários são recompensados em BIG por compartilharem poder computacional e contribuírem com a descentralização da rede.' 
              }}
            />
            <p className="text-sm break-all">
              <span className={`${theme === 'dark' ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-500/10 border-orange-500/20'} border px-3 py-1 rounded-lg font-semibold mr-2`}>
                {t.contractLabel || 'Contrato:'}
              </span>
              <a
                href="https://explorer.solana.com/address/39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8?cluster=mainnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 underline font-mono"
              >
                39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8 🔗
              </a>
            </p>
          </section>

          {/* Divider */}
          <div className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent my-12"></div>

          {/* Roadmap Section */}
          <section className="w-full max-w-3xl py-8">
            <h2 className="text-4xl font-bold text-center mb-8">
              <span className={`${theme === 'dark' ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-500/10 border-orange-500/20'} border px-4 py-2 rounded-lg inline-block`}>
                {t.roadmapTitle || '🗺️ Roadmap do Projeto'}
              </span>
            </h2>
            <ul className="space-y-6">
              {roadmapItems[language]?.map((item, index) => (
                <li
                  key={index}
                  className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 hover:from-orange-500 hover:to-orange-600' : 'bg-gradient-to-br from-white to-gray-50 hover:from-orange-500 hover:to-orange-600'} border ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-500/30'} rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default group`}
                >
                  <strong className="block text-xl mb-2 text-white group-hover:text-white">
                    {item.title}
                  </strong>
                  <small className={`text-base ${theme === 'dark' ? 'text-gray-300 group-hover:text-gray-100' : 'text-gray-700 group-hover:text-gray-100'}`}>
                    {item.desc}
                  </small>
                </li>
              ))}
            </ul>
          </section>

          {/* Divider */}
          <div className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent my-12"></div>

          {/* Contact Section */}
          <section className={`w-full max-w-3xl ${theme === 'dark' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-500/3 border-orange-500/15'} border rounded-3xl p-12 shadow-2xl`}>
            <h2 className="text-4xl font-bold mb-4 text-white">
              {t.contactTitle || '📧 Entre em Contato'}
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg mb-8`}>
              {t.contactDescription || 'Tem dúvidas, sugestões ou quer fazer uma parceria? Entre em contato conosco!'}
            </p>
            
            <a
              href="mailto:contact@bigfootconnect.tech"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl border-2 border-white/10 hover:border-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>{t.contactEmailText || 'contact@bigfootconnect.tech'}</span>
            </a>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className={`${theme === 'dark' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-500/8 border-orange-500/15'} border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500/20 hover:border-orange-500/30`}>
                {t.purposePartnerships || '💼 Parcerias'}
              </div>
              <div className={`${theme === 'dark' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-500/8 border-orange-500/15'} border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500/20 hover:border-orange-500/30`}>
                {t.purposeSupport || '🛠️ Suporte'}
              </div>
              <div className={`${theme === 'dark' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-500/8 border-orange-500/15'} border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500/20 hover:border-orange-500/30`}>
                {t.purposeQuestions || '❓ Dúvidas'}
              </div>
            </div>
          </section>

          {/* Social Links */}
          <div className="flex gap-10 justify-center py-12">
            <SocialLink href="https://discord.gg/mkfmncN5Sa" label="Discord">
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.211.375-.444.864-.608 1.249a18.233 18.233 0 0 0-5.487 0 12.66 12.66 0 0 0-.617-1.249.077.077 0 0 0-.078-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.033.027C.533 9.045-.32 13.579.099 18.057a.086.086 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.057.076.076 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.993a.076.076 0 0 0-.041-.105 13.181 13.181 0 0 1-1.872-.896.076.076 0 0 1-.008-.127c.126-.094.252-.191.371-.291a.074.074 0 0 1 .077-.01c3.927 1.794 8.18 1.794 12.061 0a.074.074 0 0 1 .078.01c.12.1.245.197.371.291a.076.076 0 0 1-.006.127 12.316 12.316 0 0 1-1.874.896.076.076 0 0 0-.041.105c.36.698.772 1.362 1.226 1.993a.076.076 0 0 0 .084.027 19.888 19.888 0 0 0 6.001-3.057.076.076 0 0 0 .03-.057c.5-5.177-.838-9.664-3.568-13.661a.06.06 0 0 0-.032-.027ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.094 2.157 2.42 0 1.334-.955 2.418-2.157 2.418Zm7.956 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.094 2.157 2.42 0 1.334-.947 2.418-2.157 2.418Z" />
            </SocialLink>

            <SocialLink href="https://t.me/+qrkA9s2VTxVhMzcx" label="Telegram">
              <path d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12S18.628 0 12 0zm5.292 7.665-1.68 7.92c-.126.558-.456.696-.923.435l-2.553-1.885-1.232 1.188c-.136.135-.25.25-.512.25l.184-2.626 4.776-4.318c.207-.184-.046-.287-.322-.104l-5.902 3.7-2.544-.795c-.552-.174-.563-.552.116-.816l9.933-3.826c.46-.173.861.105.713.807z" />
            </SocialLink>

            <SocialLink href="https://x.com/BIGFOOT_Connect" label="X">
              <path d="M20.662 3H17.27l-4.42 5.713L8.63 3H3l6.911 9.283L3.3 21h3.393l4.718-6.085L15.48 21h5.52l-7.091-9.576L20.662 3zm-3.663 16h-1.218l-3.8-5.16-4.14 5.16H6.999l5.3-6.644L6.7 5h1.215l3.58 4.865L15.504 5h1.224l-5.05 6.434L17 19z" />
            </SocialLink>

            <SocialLink href="https://www.youtube.com/@bigfootconnect" label="YouTube">
              <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-.9C17.2 2.7 12 2.7 12 2.7s-5.2 0-8.6.2c-.4 0-1.3 0-2.1.9-.6.7-.8 2.4-.8 2.4S0 8.3 0 10.4v2.5c0 2.1.2 4.2.2 4.2s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1C6.8 20.9 12 20.9 12 20.9s5.2 0 8.6-.2c.4 0 1.3 0 2.1-.9.6-.7.8-2.4.8-2.4s.2-2.1.2-4.2v-2.5c0-2.1-.2-4.2-.2-4.2zM9.6 15.5V8.5l6.4 3.5-6.4 3.5z" />
            </SocialLink>
          </div>
        </main>

        {/* Footer */}
        <footer className={`text-center py-6 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'} border-t-2`}>
          <p className="text-gray-500 text-sm">
            {t.footerText || '© 2025 BIGFOOT Connect. Todos os direitos reservados.'}
          </p>
        </footer>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 z-50"
            aria-label="Voltar ao topo"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.85;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        body.light-mode {
          background-color: #fefefe;
          color: #1a1a1a;
        }

        body[data-theme="dark"] {
          background-color: #0a0a0a;
          color: #f0f0f0;
        }

        body[data-theme="light"] {
          background-color: #fefefe;
          color: #1a1a1a;
        }
      `}</style>
    </>
  );
}

// Componente de link social
function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:-translate-y-1 p-2 rounded-lg hover:bg-orange-500/10"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
        {children}
      </svg>
    </a>
  );
}
