import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { auth, db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  doc,
  query,
  where,
  updateDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from '../components/ProtectedRoute';
import { useTranslation } from '../utils/translations';

// Importar Chart.js dinamicamente
const Line = dynamic(
  () =>
    import('chart.js').then((ChartJS) => {
      ChartJS.Chart.register(
        ChartJS.CategoryScale,
        ChartJS.LinearScale,
        ChartJS.PointElement,
        ChartJS.LineElement,
        ChartJS.Title,
        ChartJS.Tooltip,
        ChartJS.Legend,
        ChartJS.Filler
      );
      return import('react-chartjs-2').then((mod) => mod.Line);
    }),
  { ssr: false }
);

const ADMIN_EMAIL = 'fabricioricard23@gmail.com';

export default function Dashboard() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  
  // Estados principais
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  
  // Estados dos dados do usuário
  const [walletAddress, setWalletAddress] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  
  // Estados de progresso
  const [totalBigPoints, setTotalBigPoints] = useState(0);
  const [daysActive, setDaysActive] = useState(0);
  const [allUsageData, setAllUsageData] = useState({});
  
  // Estados do filtro mensal
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyData, setMonthlyData] = useState({
    totalPoints: 0,
    activeDays: 0,
    avgDaily: 0,
    showMonthly: false
  });
  
  // Estados do gráfico
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  
  // Estados de mensagens
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '', show: false });
  const [notification, setNotification] = useState({ text: '', type: '', show: false });

  // Inicialização do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }, []);

  // Inicialização do idioma
  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    setSelectedMonth(currentMonth);
  }, []);

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await initDashboard(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Inicializar dashboard
  const initDashboard = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await createUserDocument(user);
        return;
      }

      const userData = userDoc.data();
      
      // Configurar carteira
      setWalletAddress(userData.walletAddress || '');
      
      // Configurar link de referência
      const encodedEmail = encodeURIComponent(user.email);
      const refLink = `${window.location.origin}/register?ref=${encodedEmail}`;
      setReferralLink(refLink);
      
      // Carregar todos os dados
      await loadAllUsageData(user.uid);
      await loadReferralStats(user.email);
      
      // Configurar listener em tempo real
      setupRealtimeListener(user.uid);
      
    } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
      showStatusMessage('Erro ao carregar dados. Tente recarregar a página.', 'error');
    }
  };

  // Criar documento do usuário
  const createUserDocument = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        sharedPoints: 0,
        walletAddress: '',
        referredBy: '',
        referralEarnings: 0
      });
      await initDashboard(user);
    } catch (error) {
      console.error('Erro ao criar documento do usuário:', error);
    }
  };

  // Carregar todos os dados de uso
  const loadAllUsageData = async (uid) => {
    setChartLoading(true);
    
    try {
      const usageRef = collection(db, 'users', uid, 'bigpoints_earnings');
      const usageQuery = query(usageRef, orderBy('createdAt', 'desc'));
      const usageSnap = await getDocs(usageQuery);
      
      const data = {};
      
      if (!usageSnap.empty) {
        usageSnap.forEach(docSnap => {
          const docData = docSnap.data();
          const bigPoints = docData.bigpoints || 0;
          
          let dateKey;
          
          // Usar ID do documento se for uma data válida
          if (/^\d{4}-\d{2}-\d{2}$/.test(docSnap.id)) {
            dateKey = docSnap.id;
          }
          // Converter timestamp
          else if (docData.createdAt && docData.createdAt.toDate) {
            const date = docData.createdAt.toDate();
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            dateKey = `${year}-${month}-${day}`;
          }
          else {
            dateKey = docSnap.id;
          }
          
          // Somar pontos se a data já existe
          if (data[dateKey]) {
            data[dateKey] += bigPoints;
          } else {
            data[dateKey] = bigPoints;
          }
        });
      }
      
      setAllUsageData(data);
      
      // Calcular totais
      let total = 0;
      let days = 0;
      Object.values(data).forEach(points => {
        total += points;
        if (points > 0) days++;
      });
      
      setTotalBigPoints(total);
      setDaysActive(days);
      
      setChartLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar dados de uso:', error);
      setChartLoading(false);
    }
  };

  // Carregar estatísticas de referência
  const loadReferralStats = async (userEmail) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referredBy', '==', userEmail));
      const referralsSnap = await getDocs(q);
      
      setReferralCount(referralsSnap.size);
      
      // Buscar ganhos por referral
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const earnings = userDoc.data().referralEarnings || 0;
      setReferralEarnings(earnings);
      
    } catch (error) {
      console.error('Erro ao carregar estatísticas de referência:', error);
    }
  };

  // Filtrar dados por mês
  useEffect(() => {
    if (Object.keys(allUsageData).length === 0) return;
    
    filterDataByMonth(selectedMonth);
  }, [selectedMonth, allUsageData]);

  const filterDataByMonth = (month) => {
    let filtered = {};
    let monthTotal = 0;
    let monthDays = 0;
    
    if (month === 'all') {
      // Mostrar últimos 7 dias
      const sortedDates = Object.keys(allUsageData).sort().reverse().slice(0, 7);
      sortedDates.forEach(date => {
        filtered[date] = allUsageData[date];
      });
      setMonthlyData({ ...monthlyData, showMonthly: false });
    } else {
      // Filtrar por mês específico
      Object.keys(allUsageData).forEach(date => {
        if (date.startsWith(month)) {
          filtered[date] = allUsageData[date];
          monthTotal += allUsageData[date];
          if (allUsageData[date] > 0) monthDays++;
        }
      });
      
      const avgDaily = monthDays > 0 ? monthTotal / monthDays : 0;
      
      setMonthlyData({
        totalPoints: monthTotal,
        activeDays: monthDays,
        avgDaily: avgDaily,
        showMonthly: true
      });
    }
    
    generateChartData(filtered);
  };

  // Gerar dados do gráfico
  const generateChartData = (data) => {
    const sortedEntries = Object.entries(data).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    
    const labels = sortedEntries.map(([dateStr]) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}`;
    });
    
    const values = sortedEntries.map(([, value]) => value);

    const isDark = theme === 'dark';
    
    setChartData({
      labels: labels,
      datasets: [{
        label: t('chartLabel'),
        data: values,
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255,107,53,0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF6B35',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    });
  };

  // Configurar listener em tempo real
  const setupRealtimeListener = (uid) => {
    const usageRef = collection(db, 'users', uid, 'bigpoints_earnings');
    
    const unsubscribe = onSnapshot(usageRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          console.log('Dados atualizados em tempo real');
        }
      });
      
      loadAllUsageData(uid);
    });

    return unsubscribe;
  };

  // Salvar carteira
  const handleSaveWallet = async () => {
    const wallet = walletAddress.trim();
    
    if (!wallet) {
      showStatusMessage('Digite um endereço válido.', 'error');
      return;
    }
    
    if (wallet.length < 32 || wallet.length > 44) {
      showStatusMessage('Endereço Solana inválido.', 'error');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        walletAddress: wallet,
        walletUpdatedAt: new Date()
      });
      showStatusMessage('Endereço salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar carteira:', error);
      showStatusMessage('Erro ao salvar endereço. Tente novamente.', 'error');
    }
  };

  // Copiar link de referência
  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showNotification('Link copiado!', 'copy');
    } catch (error) {
      showNotification('Link copiado!', 'copy');
    }
  };

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
    
    // Regenerar gráfico
    if (allUsageData && Object.keys(allUsageData).length > 0) {
      filterDataByMonth(selectedMonth);
    }
  };

  // Trocar idioma
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Regenerar gráfico com novo idioma
    if (allUsageData && Object.keys(allUsageData).length > 0) {
      filterDataByMonth(selectedMonth);
    }
  };

  // Mostrar mensagem de status
  const showStatusMessage = (text, type = 'success') => {
    setStatusMessage({ text, type, show: true });
    setTimeout(() => {
      setStatusMessage({ text: '', type: '', show: false });
    }, 3000);
  };

  // Mostrar notificação
  const showNotification = (text, type = 'success') => {
    setNotification({ text, type, show: true });
    setTimeout(() => {
      setNotification({ text: '', type: '', show: false });
    }, 3000);
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#f0f0f0' : '#1a1a1a',
          font: { size: 14, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#FF6B35',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} BIG`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1
        },
        ticks: {
          color: theme === 'dark' ? '#f0f0f0' : '#4b5563',
          font: { size: 12 }
        }
      },
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1
        },
        ticks: {
          color: theme === 'dark' ? '#f0f0f0' : '#4b5563',
          font: { size: 12 },
          callback: (value) => `${value} BIG`
        },
        beginAtZero: true
      }
    }
  };

  // Meses disponíveis
  const availableMonths = [
    { value: 'all', label: t('allData') },
    { value: '2025-01', label: t('jan2025') },
    { value: '2025-02', label: t('feb2025') },
    { value: '2025-03', label: t('mar2025') },
    { value: '2025-04', label: t('apr2025') },
    { value: '2025-05', label: t('may2025') },
    { value: '2025-06', label: t('jun2025') },
    { value: '2025-07', label: t('jul2025') },
    { value: '2025-08', label: t('aug2025') },
    { value: '2025-09', label: t('sep2025') },
    { value: '2025-10', label: t('oct2025') },
    { value: '2025-11', label: t('nov2025') },
    { value: '2025-12', label: t('dec2025') },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>{t('heading')} - BIGFOOT Connect</title>
        <meta name="description" content="Painel do usuário BIGFOOT Connect" />
      </Head>

      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
        {/* Header */}
        <header className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-white'} border-b-2 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/')}>
                <Image src="/images/logo.png" alt="BIGFOOT Logo" width={40} height={40} className="rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent hover:from-orange-400 hover:to-orange-500 transition-all duration-300">BIGFOOT Connect</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {t('logout')}
                </button>
                
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 hover:border-orange-500`}
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
                
                <button
                  onClick={toggleTheme}
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-orange-500 text-xl transition-all duration-300 hover:border-orange-500 hover:scale-110`}
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? '🌙' : '🌞'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-4xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('heading')}
          </h1>

          {/* Progress Card */}
          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl border ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-500/40'} mb-8 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            
            <div className="flex justify-center mb-6">
              <h2 className={`text-3xl font-bold px-6 py-3 rounded-lg ${theme === 'dark' ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white'} shadow-lg`}>
                {t('progress')}
              </h2>
            </div>

            {/* Stats Top */}
            <div className={`flex justify-center gap-16 mb-8 p-6 ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'} rounded-xl`}>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {totalBigPoints.toFixed(2)} BIG
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                  {t('shared')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {daysActive}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                  {t('daysActive')}
                </div>
              </div>
            </div>

            {/* Month Selector */}
            <div className="text-center mb-6">
              <label className={`${theme === 'dark' ? 'text-orange-500' : 'text-orange-600'} font-semibold mr-4`}>
                {t('selectMonth')}
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-orange-500' : 'bg-white text-gray-900 border-orange-600'} border-2 rounded-lg px-4 py-2 cursor-pointer font-medium transition-all duration-300 min-w-[200px]`}
              >
                {availableMonths.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            {/* Monthly Data Display */}
            {monthlyData.showMonthly && (
              <div className={`${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'} rounded-xl p-6 mb-6`}>
                <h3 className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-orange-500' : 'text-orange-600'} mb-4`}>
                  {availableMonths.find(m => m.value === selectedMonth)?.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`text-center p-4 ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white border border-orange-200'} rounded-lg`}>
                    <div className="text-2xl font-bold text-orange-500 mb-1">
                      {monthlyData.totalPoints.toFixed(2)} BIG
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                      {t('sharedThisMonth')}
                    </div>
                  </div>
                  <div className={`text-center p-4 ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white border border-orange-200'} rounded-lg`}>
                    <div className="text-2xl font-bold text-orange-500 mb-1">
                      {monthlyData.activeDays}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                      {t('activeDaysMonth')}
                    </div>
                  </div>
                  <div className={`text-center p-4 ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white border border-orange-200'} rounded-lg`}>
                    <div className="text-2xl font-bold text-orange-500 mb-1">
                      {monthlyData.avgDaily.toFixed(2)} BIG
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                      {t('dailyAverage')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className={`${theme === 'dark' ? 'bg-orange-500/5 border border-orange-500/15' : 'bg-orange-50 border border-orange-200'} rounded-xl p-6`}>
              <h3 className={`text-center ${theme === 'dark' ? 'text-orange-500' : 'text-orange-600'} font-semibold text-lg mb-4 pb-2 border-b-2 ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-200'}`}>
                {t('chartTitle')}
              </h3>
              <div className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white'} rounded-xl p-4 border ${theme === 'dark' ? 'border-orange-500/10' : 'border-gray-200'}`} style={{ height: '350px' }}>
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-orange-500">{t('loading')}...</div>
                  </div>
                ) : chartData ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className={`flex items-center justify-center h-full ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nenhum dado disponível
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Card */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl border ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-500/40'} relative overflow-hidden`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              
              <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                {t('walletTitle')}
              </h2>
              <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6 text-lg`}>
                {t('walletDesc')}
              </p>
              
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={t('placeholder')}
                className={`w-full px-4 py-3 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'} transition-all duration-300 focus:border-orange-500 focus:outline-none mb-4`}
              />
              
              <button
                onClick={handleSaveWallet}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {t('saveWallet')}
              </button>
              
              {statusMessage.show && (
                <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                  statusMessage.type === 'error'
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-green-500/20 border border-green-500/30 text-green-400'
                }`}>
                  {statusMessage.text}
                </div>
              )}
            </div>

            {/* Referral Card */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl border ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-500/40'} relative overflow-hidden`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              
              <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                {t('referralTitle')}
              </h2>
              <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6 text-lg`}>
                {t('referralDesc')}
              </p>
              
              <input
                type="text"
                value={referralLink}
                readOnly
                className={`w-full px-4 py-3 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'} font-mono text-sm cursor-pointer mb-4`}
                onClick={handleCopyReferralLink}
              />
              
              <button
                onClick={handleCopyReferralLink}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mb-6"
              >
                {t('copyBtn')}
              </button>
              
              {/* Referral Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-4 ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'} rounded-lg`}>
                  <div className="text-2xl font-bold text-orange-500 mb-1">
                    {referralCount}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                    {t('referrals')}
                  </div>
                </div>
                <div className={`text-center p-4 ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'} rounded-lg`}>
                  <div className="text-2xl font-bold text-orange-500 mb-1">
                    {referralEarnings.toFixed(3)} BIG
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider font-medium`}>
                    {t('referralEarnings')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`text-center py-6 mt-12 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} border-t-2`}>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {t('footerText')}
          </p>
        </footer>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-lg shadow-2xl font-semibold transition-all duration-300 ${
            notification.type === 'copy'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
              : 'bg-gradient-to-r from-green-500 to-green-600'
          } text-white`}>
            {notification.text}
          </div>
        )}

        {/* Admin Button */}
        {user?.email === ADMIN_EMAIL && (
          <button
            onClick={() => router.push('/admin')}
            className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full font-semibold text-sm uppercase tracking-wider shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-red-500/50 opacity-60 hover:opacity-100"
            style={{ animation: 'fadeInUp 0.5s ease-out 2s both' }}
          >
            👑 Admin
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 0.6;
            transform: translateY(0);
          }
        }

        body.light-mode {
          background-color: #f9fafb;
          color: #1a1a1a;
        }

        body[data-theme="dark"] {
          background-color: #0a0a0a;
          color: #f0f0f0;
        }

        body[data-theme="light"] {
          background-color: #f9fafb;
          color: #1a1a1a;
        }

        /* BIGFOOT Connect Header Styling */
        header span[class*="text-xl"][class*="font-bold"] {
          background: linear-gradient(90deg, #FF6B35 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        header span[class*="text-xl"][class*="font-bold"]:hover {
          background: linear-gradient(90deg, #FFA500 0%, #FF6B35 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </ProtectedRoute>
  );
}
