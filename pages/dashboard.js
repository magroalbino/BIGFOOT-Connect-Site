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
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [scrollY, setScrollY] = useState(0);
  
  const [walletAddress, setWalletAddress] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  
  const [totalBigPoints, setTotalBigPoints] = useState(0);
  const [daysActive, setDaysActive] = useState(0);
  const [allUsageData, setAllUsageData] = useState({});
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyData, setMonthlyData] = useState({
    totalPoints: 0,
    activeDays: 0,
    avgDaily: 0,
    showMonthly: false
  });
  
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '', show: false });
  const [notification, setNotification] = useState({ text: '', type: '', show: false });

  const isDark = theme === 'dark';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') document.body.classList.add('light-mode');
  }, []);

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const initDashboard = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await createUserDocument(user);
        return;
      }
      const userData = userDoc.data();
      setWalletAddress(userData.walletAddress || '');
      const encodedEmail = encodeURIComponent(user.email);
      const refLink = `${window.location.origin}/register?ref=${encodedEmail}`;
      setReferralLink(refLink);
      await loadAllUsageData(user.uid);
      await loadReferralStats(user.email);
      setupRealtimeListener(user.uid);
    } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
      showStatusMessage('Erro ao carregar dados. Tente recarregar a página.', 'error');
    }
  };

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
          if (/^\d{4}-\d{2}-\d{2}$/.test(docSnap.id)) {
            dateKey = docSnap.id;
          } else if (docData.createdAt && docData.createdAt.toDate) {
            const date = docData.createdAt.toDate();
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            dateKey = `${year}-${month}-${day}`;
          } else {
            dateKey = docSnap.id;
          }
          data[dateKey] = (data[dateKey] || 0) + bigPoints;
        });
      }
      setAllUsageData(data);
      let total = 0, days = 0;
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

  const loadReferralStats = async (userEmail) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referredBy', '==', userEmail));
      const referralsSnap = await getDocs(q);
      setReferralCount(referralsSnap.size);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const earnings = userDoc.data().referralEarnings || 0;
      setReferralEarnings(earnings);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de referência:', error);
    }
  };

  useEffect(() => {
    if (Object.keys(allUsageData).length === 0) return;
    filterDataByMonth(selectedMonth);
  }, [selectedMonth, allUsageData]);

  const filterDataByMonth = (month) => {
    let filtered = {};
    let monthTotal = 0, monthDays = 0;
    if (month === 'all') {
      const sortedDates = Object.keys(allUsageData).sort().reverse().slice(0, 7);
      sortedDates.forEach(date => { filtered[date] = allUsageData[date]; });
      setMonthlyData({ ...monthlyData, showMonthly: false });
    } else {
      Object.keys(allUsageData).forEach(date => {
        if (date.startsWith(month)) {
          filtered[date] = allUsageData[date];
          monthTotal += allUsageData[date];
          if (allUsageData[date] > 0) monthDays++;
        }
      });
      setMonthlyData({
        totalPoints: monthTotal,
        activeDays: monthDays,
        avgDaily: monthDays > 0 ? monthTotal / monthDays : 0,
        showMonthly: true
      });
    }
    generateChartData(filtered);
  };

  const generateChartData = (data) => {
    const sortedEntries = Object.entries(data).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    const labels = sortedEntries.map(([dateStr]) => {
      const [, month, day] = dateStr.split('-');
      return `${month}/${day}`;
    });
    const values = sortedEntries.map(([, value]) => value);
    setChartData({
      labels,
      datasets: [{
        label: t('chartLabel'),
        data: values,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    });
  };

  const setupRealtimeListener = (uid) => {
    const usageRef = collection(db, 'users', uid, 'bigpoints_earnings');
    const unsubscribe = onSnapshot(usageRef, () => { loadAllUsageData(uid); });
    return unsubscribe;
  };

  const handleSaveWallet = async () => {
    const wallet = walletAddress.trim();
    if (!wallet) { showStatusMessage('Digite um endereço válido.', 'error'); return; }
    if (wallet.length < 32 || wallet.length > 44) { showStatusMessage('Endereço Solana inválido.', 'error'); return; }
    try {
      await updateDoc(doc(db, 'users', user.uid), { walletAddress: wallet, walletUpdatedAt: new Date() });
      showStatusMessage('Endereço salvo com sucesso!');
    } catch (error) {
      showStatusMessage('Erro ao salvar endereço. Tente novamente.', 'error');
    }
  };

  const handleCopyReferralLink = async () => {
    try { await navigator.clipboard.writeText(referralLink); } catch {}
    showNotification('Link copiado!', 'copy');
  };

  const handleLogout = async () => {
    try { await signOut(auth); localStorage.clear(); router.push('/'); } catch {}
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    if (newTheme === 'light') { document.body.classList.add('light-mode'); }
    else { document.body.classList.remove('light-mode'); }
    if (allUsageData && Object.keys(allUsageData).length > 0) filterDataByMonth(selectedMonth);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (allUsageData && Object.keys(allUsageData).length > 0) filterDataByMonth(selectedMonth);
  };

  const showStatusMessage = (text, type = 'success') => {
    setStatusMessage({ text, type, show: true });
    setTimeout(() => setStatusMessage({ text: '', type: '', show: false }), 3000);
  };

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type, show: true });
    setTimeout(() => setNotification({ text: '', type: '', show: false }), 3000);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: isDark ? '#d1d5db' : '#374151', font: { size: 13, weight: '500' } }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: isDark ? '#fff' : '#111',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: 'rgba(249,115,22,0.4)',
        borderWidth: 1,
        padding: 12,
        callbacks: { label: (ctx) => `  ${ctx.parsed.y} BIG` }
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 12 } }
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 12 }, callback: (v) => `${v} BIG` },
        beginAtZero: true
      }
    }
  };

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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080808]' : 'bg-[#fafafa]'}`}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 rounded-full bg-orange-500/5 blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>{t('heading')} - BIGFOOT Connect</title>
        <meta name="description" content="Painel do usuário BIGFOOT Connect" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className={`min-h-screen ${isDark ? 'bg-[#080808] text-gray-100' : 'bg-[#fafafa] text-gray-900'} transition-colors duration-500`} style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Partículas de fundo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="particle absolute rounded-full" style={{
              width: `${[200, 140, 180, 120][i]}px`,
              height: `${[200, 140, 180, 120][i]}px`,
              left: `${[5, 80, 50, 90][i]}%`,
              top: `${[10, 55, 30, 75][i]}%`,
              background: isDark
                ? `radial-gradient(circle, rgba(249,115,22,${[0.05,0.04,0.04,0.03][i]}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(249,115,22,${[0.07,0.05,0.06,0.04][i]}) 0%, transparent 70%)`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + i * 2}s`,
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
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 scale-110" />
                  <Image src="/images/logo.png" alt="BIGFOOT Logo" width={40} height={40} className="relative rounded-xl transition-all duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xl font-bold text-orange-500 transition-colors duration-300 group-hover:text-orange-400" style={{ fontFamily: "'Syne', sans-serif" }}>
                  BIGFOOT Connect
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {t('logout')}
                </button>

                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className={`${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border rounded-xl px-3 py-2 text-sm cursor-pointer transition-all duration-300 hover:border-orange-500 focus:outline-none`}
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                </select>

                <button
                  onClick={toggleTheme}
                  className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl px-3 py-2 text-orange-500 transition-all duration-300 hover:border-orange-500 hover:scale-110`}
                  aria-label="Alternar tema"
                >
                  {isDark ? '🌙' : '🌞'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Título da página */}
          <div className="text-center mb-10 dash-reveal">
            <span className="inline-block text-orange-500 text-xs font-semibold tracking-widest uppercase mb-3">
              {language === 'pt' ? 'Painel do Usuário' : 'User Dashboard'}
            </span>
            <h1 className={`text-4xl md:text-5xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {t('heading')}
            </h1>
          </div>

          {/* Progress Card */}
          <div className={`relative overflow-hidden rounded-3xl p-8 mb-8 border dash-reveal-delay-1 ${
            isDark ? 'bg-gray-900/60 border-orange-500/15' : 'bg-white border-orange-500/20'
          } shadow-xl`}>
            {/* Glow decorativo */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-orange-500/8 blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <div className="relative">
              {/* Título da seção */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {t('progress')}
                </h2>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-orange-500/8 border-orange-500/15' : 'bg-orange-50 border-orange-100'}`}>
                  <div className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {totalBigPoints.toFixed(2)}
                  </div>
                  <div className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    BIG · {t('shared')}
                  </div>
                </div>
                <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-orange-500/8 border-orange-500/15' : 'bg-orange-50 border-orange-100'}`}>
                  <div className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {daysActive}
                  </div>
                  <div className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('daysActive')}
                  </div>
                </div>
              </div>

              {/* Month Selector */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('selectMonth')}
                </span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`${isDark ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border rounded-xl px-4 py-2 text-sm cursor-pointer font-medium transition-all duration-300 hover:border-orange-500 focus:outline-none focus:border-orange-500 min-w-[180px]`}
                >
                  {availableMonths.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>

              {/* Monthly Stats */}
              {monthlyData.showMonthly && (
                <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50/60 border-orange-100'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-orange-500/60 rounded-full" />
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                      {availableMonths.find(m => m.value === selectedMonth)?.label}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: `${monthlyData.totalPoints.toFixed(2)} BIG`, label: t('sharedThisMonth') },
                      { value: monthlyData.activeDays, label: t('activeDaysMonth') },
                      { value: `${monthlyData.avgDaily.toFixed(2)} BIG`, label: t('dailyAverage') },
                    ].map((stat, i) => (
                      <div key={i} className={`text-center p-4 rounded-xl border ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100'}`}>
                        <div className="text-xl font-bold text-orange-500 mb-1">{stat.value}</div>
                        <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  <div className="w-1 h-4 bg-orange-500/60 rounded-full" />
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('chartTitle')}
                  </h3>
                </div>
                <div className="p-4" style={{ height: '320px' }}>
                  {chartLoading ? (
                    <div className="flex items-center justify-center h-full gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
                      <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('loading')}</span>
                    </div>
                  ) : chartData ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <div className={`flex items-center justify-center h-full text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      {language === 'pt' ? 'Nenhum dado disponível' : 'No data available'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Wallet Card */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border dash-reveal-delay-2 ${
              isDark ? 'bg-gray-900/60 border-orange-500/15' : 'bg-white border-orange-500/20'
            } shadow-xl`}>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                    {t('walletTitle')}
                  </h2>
                </div>
                <p className={`text-sm mb-6 pl-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('walletDesc')}
                </p>

                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={t('placeholder')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-300 focus:outline-none focus:border-orange-500 mb-4 ${
                    isDark ? 'bg-gray-800/60 border-gray-700 text-gray-100 placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />

                <button
                  onClick={handleSaveWallet}
                  className="group relative w-full inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {t('saveWallet')}
                </button>

                {statusMessage.show && (
                  <div className={`mt-4 px-4 py-3 rounded-xl text-sm text-center font-medium ${
                    statusMessage.type === 'error'
                      ? isDark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'
                      : isDark ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-green-50 border border-green-200 text-green-600'
                  }`}>
                    {statusMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Referral Card */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border dash-reveal-delay-2 ${
              isDark ? 'bg-gray-900/60 border-orange-500/15' : 'bg-white border-orange-500/20'
            } shadow-xl`}>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                    {t('referralTitle')}
                  </h2>
                </div>
                <p className={`text-sm mb-6 pl-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('referralDesc')}
                </p>

                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono cursor-pointer transition-all duration-300 hover:border-orange-500/50 mb-4 ${
                    isDark ? 'bg-gray-800/60 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                  onClick={handleCopyReferralLink}
                />

                <button
                  onClick={handleCopyReferralLink}
                  className="group relative w-full inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)] overflow-hidden mb-6"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {t('copyBtn')}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`text-center p-4 rounded-2xl border ${isDark ? 'bg-orange-500/8 border-orange-500/15' : 'bg-orange-50 border-orange-100'}`}>
                    <div className="text-2xl font-extrabold text-orange-500 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {referralCount}
                    </div>
                    <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t('referrals')}
                    </div>
                  </div>
                  <div className={`text-center p-4 rounded-2xl border ${isDark ? 'bg-orange-500/8 border-orange-500/15' : 'bg-orange-50 border-orange-100'}`}>
                    <div className="text-2xl font-extrabold text-orange-500 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {referralEarnings.toFixed(3)}
                    </div>
                    <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      BIG · {t('referralEarnings')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`relative z-10 text-center py-8 mt-8 border-t ${isDark ? 'border-gray-800/60 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t('footerText')}</p>
        </footer>

        {/* Notification Toast */}
        {notification.show && (
          <div className="fixed top-6 right-6 z-50 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] font-semibold text-sm animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full" />
            {notification.text}
          </div>
        )}

        {/* Admin Button */}
        {user?.email === ADMIN_EMAIL && (
          <button
            onClick={() => router.push('/admin')}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider shadow-2xl transition-all duration-300 hover:scale-110 opacity-60 hover:opacity-100"
            style={{ animation: 'fadeInUp 0.5s ease-out 2s both' }}
          >
            👑 Admin
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(20px, -30px) scale(1.05); opacity: 0.8; }
          50% { transform: translate(-10px, -50px) scale(0.95); opacity: 0.5; }
          75% { transform: translate(-25px, -20px) scale(1.02); opacity: 0.7; }
        }

        @keyframes dash-reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 0.6; transform: translateY(0); }
        }

        .particle { animation: particle-drift var(--dur, 10s) ease-in-out infinite; }

        .dash-reveal { animation: dash-reveal 0.6s ease-out both; }
        .dash-reveal-delay-1 { animation: dash-reveal 0.6s ease-out 0.1s both; }
        .dash-reveal-delay-2 { animation: dash-reveal 0.6s ease-out 0.2s both; }

        .animate-fade-in { animation: fade-in 0.3s ease-out; }

        body.light-mode { background-color: #fafafa; color: #1a1a1a; }
        body[data-theme="dark"] { background-color: #080808; color: #f0f0f0; }
        body[data-theme="light"] { background-color: #fafafa; color: #1a1a1a; }
      `}</style>
    </ProtectedRoute>
  );
}
