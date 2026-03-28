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
    dashboard: 'Painel',
    login: 'Login',
    logout: 'Sair',
    register: 'Criar conta',
    profile: 'Perfil',
    settings: 'Configurações',
    
    // Homepage
    heroTitle: 'Conectar. Descentralizar. Ganhar.',
    heroText: 'Com o BIGFOOT Connect, você roda um nó da rede, ajuda na descentralização e ganha recompensas em BIG. Baixe o aplicativo, conecte-se e comece agora mesmo!',
    downloadWindows: 'Windows',
    installerWarning: '🛡️ Aviso: O Windows pode exibir "O Windows protegeu seu computador" ao instalar o BIGFOOT Connect. Isso ocorre porque o instalador ainda não é assinado digitalmente. Para prosseguir, clique em "Mais informações" e depois "Executar assim mesmo". Nosso programa é totalmente seguro e não contém nada que possa prejudicar o computador do usuário.',
    
    // Whitepaper
    whitepaperTitle: '📄 Whitepaper do Projeto',
    whitepaperText: 'Quer saber como o BIGFOOT Connect funciona, quais as tecnologias por trás e como você é recompensado? Confira nosso whitepaper completo.',
    whitepaperBtn: 'Visualizar / Baixar Whitepaper',
    
    // Token
    tokenTitle: '💰 Token BIG (BIG)',
    tokenDesc: 'O BIG é o token oficial do ecossistema BIGFOOT Connect. Usuários são recompensados em BIG por relay e contribuírem com a construção da rede.',
    contractLabel: 'Contrato:',
    
    // Roadmap
    roadmapTitle: '🗺️ Roteiro do Projeto',
    
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
    loginLink: 'Já tem conta? Faça Login',
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
    shared: 'Total de BIG',
    daysActive: 'Dias Ativos',
    chartTitle: 'Histórico de BIG',
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
    sharedThisMonth: 'BIG no Mês',
    activeDaysMonth: 'Dias Ativos',
    dailyAverage: 'Média Diária',
    
    // Wallet
    walletTitle: '💰 Carteira Solana',
    walletDesc: 'Configure seu endereço Solana para receber as recompensas em tokens BIG.',
    placeholder: 'Digite seu endereço Solana (ex: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)',
    saveWallet: '💾 Salvar Endereço',
    
    // Referral
    referralTitle: '👥 Sistema de Referência',
    referralDesc: 'Convide amigos e ganhe 10% extra em BIG para cada pessoa que você indicar!',
    copyBtn: '📋 Copiar Link de Referência',
    referrals: 'Indicações',
    referralEarnings: 'Ganhos por Ref.',
    
    // Chart
    chartLabel: 'BIG Ganhos',
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
    heroTitle: 'Connect. Decentralize. Earn.',
    heroText: 'With BIGFOOT Connect, you run a network node, help decentralize the web, and earn BIG rewards. Download the app, connect, and get started today!',
    downloadWindows: 'Windows',
    installerWarning: '🛡️ Notice: When installing BIGFOOT Connect, Windows might display "Windows protected your PC" because the installer is not digitally signed yet. To continue, click "More info" and then "Run anyway". Rest assured, our application is completely safe and does not contain anything that could harm your computer.',
    
    // Whitepaper
    whitepaperTitle: '📄 Project Whitepaper',
    whitepaperText: 'Want to know how BIGFOOT Connect works, the technology behind it, and how you get rewarded? Check out our full whitepaper.',
    whitepaperBtn: 'View / Download Whitepaper',
    
    // Token
    tokenTitle: '💰 BIG Token (BIG)',
    tokenDesc: 'The BIG token powers the BIGFOOT Connect ecosystem. Users are rewarded in BIG for sharing computing power and contributing to building the network.',
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
    loginLink: 'Already have an account? Login',
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
    shared: 'Total BIG',
    daysActive: 'Active Days',
    chartTitle: 'BIG History',
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
    sharedThisMonth: 'BIG this Month',
    activeDaysMonth: 'Active Days',
    dailyAverage: 'Daily Average',
    
    // Wallet
    walletTitle: '💰 Solana Wallet',
    walletDesc: 'Set up your Solana address to receive BIG token rewards.',
    placeholder: 'Enter your Solana address (ex: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)',
    saveWallet: '💾 Save Address',
    
    // Referral
    referralTitle: '👥 Referral System',
    referralDesc: 'Invite friends and earn 10% extra BIG for each person you refer!',
    copyBtn: '📋 Copy Referral Link',
    referrals: 'Referrals',
    referralEarnings: 'Ref. Earnings',
    
    // Chart
    chartLabel: 'BIG Earned',
  }
};

// Context
const TranslationContext = createContext();

// Provider
export function TranslationProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      console.log('🌐 Idioma salvo no localStorage:', savedLang);
      return savedLang || 'pt';
    }
    return 'pt';
  });

  // Salvar mudança de idioma
  const setLanguage = (lang) => {
    console.log(`🌐 Alterando idioma para: ${lang}`);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      
      // Atualizar atributo HTML lang
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';
    }
    
    setLanguageState(lang);
  };

  // Sincronizar com HTML lang E forçar re-render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en-US';
      console.log(`✅ Idioma sincronizado: ${language}`);
      console.log(`✅ Teste de tradução - formTitle:`, translations[language]?.formTitle);
      console.log(`✅ Teste de tradução - email:`, translations[language]?.email);
      console.log(`✅ Teste de tradução - loginBtn:`, translations[language]?.loginBtn);
      
      // Forçar update do localStorage se estiver diferente
      const saved = localStorage.getItem('lang');
      if (saved !== language) {
        console.log(`⚠️ Corrigindo localStorage de ${saved} para ${language}`);
        localStorage.setItem('lang', language);
      }
    }
  }, [language]);

  // Função de tradução
  const t = (key) => {
    const translation = translations[language]?.[key] || translations['pt']?.[key] || key;
    return translation;
  };

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
