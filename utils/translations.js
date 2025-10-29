import { createContext, useContext, useState, useEffect } from 'react';

// Dicionário de traduções
const translations = {
  pt: {
    // Geral
    hello: 'Olá',
    loading: 'Carregando',
    error: 'Erro',
    success: 'Sucesso',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    yes: 'Sim',
    no: 'Não',

    // Navegação
    home: 'Início',
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Sair',
    register: 'Criar conta',
    profile: 'Perfil',
    settings: 'Configurações',

    // Homepage
    heroTitle: 'Conecte. Contribua. Ganhe.',
    heroText: 'Com o <strong>BIGFOOT Connect</strong>, você compartilha seu poder computacional, ajuda a descentralizar a rede e ainda recebe recompensas em <strong>BIG</strong>. Baixe o app, conecte e comece agora mesmo!',
    downloadWindows: 'Windows',
    installerWarning: '🛡️ <strong>Aviso:</strong> O Windows pode exibir "O Windows protegeu seu computador" ao instalar o BIGFOOT Connect. Isso ocorre porque o instalador ainda não é assinado digitalmente. Para prosseguir, clique em <strong>"Mais informações"</strong> e depois <strong>"Executar assim mesmo"</strong>. Nosso programa é totalmente seguro e <strong>não contém nada que possa prejudicar o computador do usuário</strong>.',

    // Whitepaper
    whitepaperTitle: '📄 Whitepaper do Projeto',
    whitepaperText: 'Quer saber como o BIGFOOT Connect funciona, quais as tecnologias por trás e como você é recompensado? Confira nosso whitepaper completo.',
    whitepaperBtn: 'Visualizar / Baixar Whitepaper',

    // Token
    tokenTitle: '💰 Token BIG (BIG)',
    tokenDesc: 'O <strong>BIG</strong> é o token oficial do ecossistema BIGFOOT Connect. Usuários são recompensados em BIG por compartilharem poder computacional e contribuírem com a descentralização da rede.',
    contractLabel: 'Contrato:',

    // Roadmap
    roadmapTitle: '🗺️ Roadmap do Projeto',

    // Contato
    contactTitle: '📧 Entre em Contato',
    contactDescription: 'Tem dúvidas, sugestões ou quer fazer uma parceria? Entre em contato conosco!',
    contactEmailText: 'contact@bigfootconnect.tech',
    purposePartnerships: '💼 Parcerias',
    purposeSupport: '🛠️ Suporte',
    purposeQuestions: '❓ Dúvidas',

    // Footer
    footerDescription: 'Compartilhe seu poder computacional e ganhe recompensas em tokens BIG.',
    footerAbout: 'Sobre',
    footerWhitepaper: 'Whitepaper',
    footerRoadmap: 'Roadmap',
    footerToken: 'Token BIG',
    footerResources: 'Recursos',
    footerDashboard: 'Dashboard',
    footerPools: 'Pools',
    footerDownload: 'Download',
    footerSupport: 'Suporte',
    footerContact: 'Contato',
    footerRights: 'Todos os direitos reservados.',
    footerPrivacy: 'Privacidade',
    footerTerms: 'Termos',
    footerText: '© 2025 BIGFOOT Connect. Todos os direitos reservados.',

    // Login
    formTitle: 'Entrar',
    email: 'E-mail',
    password: 'Senha',
    loginBtn: 'Entrar',
    registerLink: 'Não tem conta? Registre-se',
    backHome: '← Voltar para a Home',
    dividerText: 'ou',
    googleBtn: 'Entrar com Google',
    forgotPassword: 'Esqueceu a senha?',
    fillAll: 'Preencha todos os campos.',
    invalidCredentials: 'E-mail ou senha inválidos.',
    userNotFound: 'Usuário não encontrado.',
    wrongPassword: 'Senha incorreta.',
    tooManyRequests: 'Muitas tentativas. Tente novamente mais tarde.',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    loggingIn: 'Entrando...',
    googleDevelopment: 'Funcionalidade do Google em desenvolvimento',
    forgotPasswordDevelopment: 'Funcionalidade de recuperação de senha em desenvolvimento',

    // Register
    title: 'Criar Conta',
    register: 'Registrar',
    fillRequired: 'Preencha todos os campos obrigatórios.',
    weakPassword: 'A senha deve ter pelo menos 6 caracteres.',
    emailInUse: 'Este e-mail já está em uso.',
    invalidEmail: 'E-mail inválido.',
    weakPasswordFirebase: 'Senha muito fraca.',
    firestoreError: 'Conta criada mas houve erro ao salvar dados. Tente fazer login.',

    // Dashboard
    heading: 'Bem-vindo ao seu Painel',
    progress: '📊 Seu Progresso',
    shared: 'Total de BIG Points',
    daysActive: 'Dias Ativos',
    chartTitle: 'Histórico de BIG Points',
    selectMonth: 'Selecionar Mês:',
    allData: 'Todos os dados',
    jan2025: 'Janeiro 2025',
    feb2025: 'Fevereiro 2025',
    mar2025: 'Março 2025',
    apr2025: 'Abril 2025',
    may2025: 'Maio 2025',
    jun2025: 'Junho 2025',
    jul2025: 'Julho 2025',
    aug2025: 'Agosto 2025',
    sep2025: 'Setembro 2025',
    oct2025: 'Outubro 2025',
    nov2025: 'Novembro 2025',
    dec2025: 'Dezembro 2025',
    sharedThisMonth: 'BIG Points no Mês',
    activeDaysMonth: 'Dias Ativos',
    dailyAverage: 'Média Diária',

    // Wallet
    walletTitle: '💰 Carteira Solana',
    walletDesc: 'Configure seu endereço Solana para receber as recompensas em tokens BIG.',
    placeholder: 'Digite seu endereço Solana (ex: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)',
    saveWallet: '💾 Salvar Endereço',

    // Referral
    referralTitle: '👥 Sistema de Referência',
    referralDesc: 'Convide amigos e ganhe <strong>10% extra</strong> em BIG para cada pessoa que você indicar!',
    copyBtn: '📋 Copiar Link de Referência',
    referrals: 'Indicações',
    referralEarnings: 'Ganhos por Ref.',

    // Chart
    chartLabel: 'BIG Points Ganhos',
  },

  en: {
    // General
    hello: 'Hello',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    yes: 'Yes',
    no: 'No',

    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    profile: 'Profile',
    settings: 'Settings',

    // Homepage
    heroTitle: 'Connect. Contribute. Earn.',
    heroText: 'With <strong>BIGFOOT Connect</strong>, you share your computing power, help decentralize the network, and get rewarded in <strong>BIG</strong>. Download the app, connect, and get started now!',
    downloadWindows: 'Windows',
    installerWarning: '🛡️ <strong>Notice:</strong> When installing BIGFOOT Connect, Windows might display "Windows protected your PC" because the installer is not digitally signed yet. To continue, click <strong>"More info"</strong> and then <strong>"Run anyway"</strong>. Rest assured, our application is completely safe and <strong>does not contain anything that could harm your computer</strong>.',

    // Whitepaper
    whitepaperTitle: '📄 Project Whitepaper',
    whitepaperText: 'Want to know how BIGFOOT Connect works, the technology behind it, and how you get rewarded? Check out our full whitepaper.',
    whitepaperBtn: 'View / Download Whitepaper',

    // Token
    tokenTitle: '💰 BIG Token (BIG)',
    tokenDesc: 'The <strong>BIG</strong> token powers the BIGFOOT Connect ecosystem. Users are rewarded in BIG for sharing computing power and contributing to network decentralization.',
    contractLabel: 'Contract:',

    // Roadmap
    roadmapTitle: '🗺️ Project Roadmap',

    // Contact
    contactTitle: '📧 Get in Touch',
    contactDescription: 'Have questions, suggestions, or want to partner with us? Get in touch!',
    contactEmailText: 'contact@bigfootconnect.tech',
    purposePartnerships: '💼 Partnerships',
    purposeSupport: '🛠️ Support',
    purposeQuestions: '❓ Questions',

    // Footer
    footerDescription: 'Share your computing power and earn BIG token rewards.',
    footerAbout: 'About',
    footerWhitepaper: 'Whitepaper',
    footerRoadmap: 'Roadmap',
    footerToken: 'BIG Token',
    footerResources: 'Resources',
    footerDashboard: 'Dashboard',
    footerPools: 'Pools',
    footerDownload: 'Download',
    footerSupport: 'Support',
    footerContact: 'Contact',
    footerRights: 'All rights reserved.',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerText: '© 2025 BIGFOOT Connect. All rights reserved.',

    // Login
    formTitle: 'Login',
    email: 'Email',
    password: 'Password',
    loginBtn: 'Login',
    registerLink: "Don't have an account? Register",
    backHome: '← Back to Home',
    dividerText: 'or',
    googleBtn: 'Continue with Google',
    forgotPassword: 'Forgot password?',
    fillAll: 'Please fill in all fields.',
    invalidCredentials: 'Invalid email or password.',
    userNotFound: 'User not found.',
    wrongPassword: 'Incorrect password.',
    tooManyRequests: 'Too many attempts. Try again later.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    loggingIn: 'Logging in...',
    googleDevelopment: 'Google functionality under development',
    forgotPasswordDevelopment: 'Password recovery functionality under development',

    // Register
    title: 'Create Account',
    register: 'Register',
    fillRequired: 'Please fill in all required fields.',
    weakPassword: 'Password must be at least 6 characters long.',
    emailInUse: 'This email is already in use.',
    invalidEmail: 'Invalid email address.',
    weakPasswordFirebase: 'Password is too weak.',
    firestoreError: 'Account created but error saving data. Try logging in.',

    // Dashboard
    heading: 'Welcome to your Dashboard',
    progress: '📊 Your Progress',
    shared: 'Total BIG Points',
    daysActive: 'Active Days',
    chartTitle: 'BIG Points History',
    selectMonth: 'Select Month:',
    allData: 'All data',
    jan2025: 'January 2025',
    feb2025: 'February 2025',
    mar2025: 'March 2025',
    apr2025: 'April 2025',
    may2025: 'May 2025',
    jun2025: 'June 2025',
    jul2025: 'July 2025',
    aug2025: 'August 2025',
    sep2025: 'September 2025',
    oct2025: 'October 2025',
    nov2025: 'November 2025',
    dec2025: 'December 2025',
    sharedThisMonth: 'BIG Points this Month',
    activeDaysMonth: 'Active Days',
    dailyAverage: 'Daily Average',

    // Wallet
    walletTitle: '💰 Solana Wallet',
    walletDesc: 'Set up your Solana address to receive BIG token rewards.',
    placeholder: 'Enter your Solana address (ex: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)',
    saveWallet: '💾 Save Address',

    // Referral
    referralTitle: '👥 Referral System',
    referralDesc: 'Invite friends and earn <strong>10% extra</strong> BIG for each person you refer!',
    copyBtn: '📋 Copy Referral Link',
    referrals: 'Referrals',
    referralEarnings: 'Ref. Earnings',

    // Chart
    chartLabel: 'BIG Points Earned',
  }
};

// Context
const TranslationContext = createContext();

// Provider
export function TranslationProvider({ children }) {
  // Inicializar com o valor do localStorage ou padrão
  const initialLanguage = typeof window !== 'undefined' ?
    localStorage.getItem('lang') || 'pt' : 'pt';

  const [language, setLanguageState] = useState(initialLanguage);
  const [mounted, setMounted] = useState(false);

  // Inicialização do idioma
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && savedLang !== language) {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang === 'pt' ? 'pt-BR' : 'en-US';
    }
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en-US';
    setMounted(true);
  }, []);

  // Salvar mudança de idioma
  const setLanguage = (lang) => {
    if (typeof window !== 'undefined' && lang !== language) {
      try {
        // Salvar no localStorage
        localStorage.setItem('lang', lang);

        // Atualizar estado
        setLanguageState(lang);

        // Atualizar atributo HTML lang
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';

        // Forçar recarregamento completo da página
        window.location.href = window.location.pathname;

        console.log(`🌐 Idioma alterado para: ${lang}`);
      } catch (error) {
        console.error('Erro ao mudar idioma:', error);
      }
    }
  };

  // Função de tradução
  const t = (key) => {
    const translation = translations[language]?.[key];
    if (translation) return translation;

    const fallback = translations['pt']?.[key];
    if (fallback) {
      console.warn(`🌐 Tradução não encontrada para '${key}' em '${language}', usando fallback em PT`);
      return fallback;
    }

    console.error(`🌐 Chave de tradução não encontrada: '${key}'`);
    return key;
  };

  // Não renderizar até estar montado (SSR safe)
  if (!mounted) {
    return null;
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook customizado
export function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}

// Função helper para tradução direta (sem hook)
export function translate(key, lang = 'pt') {
  return translations[lang]?.[key] || translations['pt']?.[key] || key;
}

// Exportar traduções completas (para debug)
export { translations };

// HOC para componentes que precisam de tradução
export function withTranslation(Component) {
  return function TranslatedComponent(props) {
    const { language, setLanguage, t } = useTranslation();
    return <Component {...props} language={language} setLanguage={setLanguage} t={t} />;
  };
}

// Detectar idioma do navegador
export function detectBrowserLanguage() {
  if (typeof window === 'undefined') return 'pt';

  const browserLang = navigator.language || navigator.userLanguage;

  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('en')) return 'en';

  return 'pt'; // Padrão
}

// Auto-detectar e definir idioma
export function initializeLanguage() {
  if (typeof window === 'undefined') return 'pt';

  const savedLang = localStorage.getItem('lang');

  if (savedLang) {
    console.log('🌐 Idioma salvo encontrado:', savedLang);
    return savedLang;
  }

  const browserLang = detectBrowserLanguage();
  console.log('🌐 Idioma detectado do navegador:', browserLang);
  localStorage.setItem('lang', browserLang);

  return browserLang;
}
