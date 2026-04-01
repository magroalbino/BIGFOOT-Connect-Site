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
  
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  // Phantom Wallet
  const [phantomConnected, setPhantomConnected] = useState(false);
  const [phantomAddress, setPhantomAddress] = useState('');
  const [phantomConnecting, setPhantomConnecting] = useState(false);

  // Claim
  const [claimStatus, setClaimStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [claimTx, setClaimTx] = useState('');
  const [claimError, setClaimError] = useState('');
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  
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

  const handleConnectPhantom = async () => {
    const provider = window?.solana;
    if (!provider?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    setPhantomConnecting(true);
    try {
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      setPhantomAddress(address);
      setPhantomConnected(true);
      showNotification(
        language === 'pt' ? 'Phantom conectada!' : 'Phantom connected!', 'success'
      );
    } catch (err) {
      if (err.code !== 4001) {
        showNotification(
          language === 'pt' ? 'Erro ao conectar a Phantom.' : 'Failed to connect Phantom.',
          'error'
        );
      }
    } finally {
      setPhantomConnecting(false);
    }
  };

  const handleDisconnectPhantom = async () => {
    try {
      await window?.solana?.disconnect();
    } catch {}
    setPhantomConnected(false);
    setPhantomAddress('');
  };

  // Check if user already claimed this month
  const checkAlreadyClaimed = async (uid) => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // "2025-06"
      const claimRef = doc(db, 'users', uid, 'claims', currentMonth);
      const claimSnap = await getDoc(claimRef);
      setAlreadyClaimed(claimSnap.exists());
    } catch {}
  };

  // Run claim check when user logs in
  useEffect(() => {
    if (user?.uid) checkAlreadyClaimed(user.uid);
  }, [user]);

  const handleClaim = async () => {
    if (!phantomConnected || !phantomAddress) return;
    if (alreadyClaimed) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const claimablePoints = monthlyData.showMonthly
      ? monthlyData.totalPoints
      : totalBigPoints;

    if (claimablePoints < 1) {
      showNotification(
        language === 'pt' ? 'Saldo mínimo para claim: 1 BIG.' : 'Minimum claim balance: 1 BIG.',
        'error'
      );
      return;
    }

    const amount = Math.min(Math.floor(claimablePoints), 1000);

    setClaimStatus('loading');
    setClaimError('');
    setClaimTx('');

    try {
      const response = await fetch('https://bigfoot-server.vercel.app/api/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: phantomAddress,
          amount,
          userId: user.uid,
          userEmail: user.email,
          month: currentMonth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Bridge error');
      }

      // Zero out this month's points in Firestore
      const monthDates = Object.keys(allUsageData).filter(d => d.startsWith(currentMonth));
      const batch = [];
      for (const dateKey of monthDates) {
        batch.push(
          updateDoc(
            doc(db, 'users', user.uid, 'bigpoints_earnings', dateKey),
            { bigpoints: 0 }
          )
        );
      }
      await Promise.all(batch);

      // Record claim so user can't claim again this month
      await setDoc(doc(db, 'users', user.uid, 'claims', currentMonth), {
        amount,
        walletAddress: phantomAddress,
        txSignature: data.signature || data.tx || '',
        claimedAt: new Date(),
      });

      setClaimTx(data.signature || data.tx || '');
      setClaimStatus('success');
      setAlreadyClaimed(true);

      // Reload points
      await loadAllUsageData(user.uid);

    } catch (err) {
      setClaimStatus('error');
      setClaimError(err.message || 'Unknown error');
    }
  };

  const handleCopyReferralLink = async () => {
    try { await navigator.clipboard.writeText(referralLink); } catch {}
    showNotification(language === 'pt' ? 'Link copiado!' : 'Link copied!', 'copy');
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

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type, show: true });
    setTimeout(() => setNotification({ text: '', type: '', show: false }), 3000);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#d1d5db' : '#374151',
          font: { size: 13, weight: '500', family: "'Plus Jakarta Sans', sans-serif" }
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: isDark ? '#fff' : '#111',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: 'rgba(249,115,22,0.4)',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "'Plus Jakarta Sans', sans-serif" },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
        callbacks: { label: (ctx) => `  ${ctx.parsed.y} BIG` }
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" } }
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
          callback: (v) => `${v} BIG`
        },
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

        {/* Fontes padronizadas — igual ao index.jsx */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className={`min-h-screen ${isDark ? 'bg-[#080808] text-gray-100' : 'bg-[#fafafa] text-gray-900'} transition-colors duration-500`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >

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

        {/* ── HEADER ── */}
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 20
            ? isDark
              ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-orange-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
              : 'bg-white/90 backdrop-blur-xl border-b border-orange-500/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : isDark ? 'border-b border-gray-800/60' : 'border-b border-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">

              {/* Logo — Space Grotesk, idêntico ao index.jsx */}
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 scale-110" />
                  <Image src="/images/logo.png" alt="BIGFOOT Logo" width={40} height={40}
                    className="relative rounded-xl transition-all duration-300 group-hover:scale-110" />
                </div>
                <span
                  className="text-xl font-bold text-orange-500 transition-colors duration-300 group-hover:text-orange-400"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.3px' }}
                >
                  BIGFOOT Connect
                </span>
              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)] overflow-hidden"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.1px' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {t('logout')}
                </button>

                {/* Separator */}
                <div className={`w-px h-5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mx-1`} />

                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className={`${isDark ? 'bg-gray-900 text-gray-100 border-gray-700/60' : 'bg-white text-gray-900 border-gray-200'} border rounded-lg px-3 py-2 text-sm cursor-pointer transition-all duration-300 hover:border-orange-500 focus:outline-none font-medium`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                </select>

                <button
                  onClick={toggleTheme}
                  className={`${isDark ? 'bg-gray-900 border-gray-700/60' : 'bg-white border-gray-200'} border rounded-lg px-3 py-2 text-orange-500 transition-all duration-300 hover:border-orange-500 hover:scale-110`}
                  aria-label="Alternar tema"
                >
                  {isDark ? '🌙' : '🌞'}
                </button>

                {/* ── Phantom Wallet Button — à direita do tema ── */}
                {phantomConnected ? (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105"
                    style={{
                      background: isDark ? 'rgba(83,75,177,0.15)' : 'rgba(83,75,177,0.07)',
                      borderColor: 'rgba(83,75,177,0.35)',
                    }}
                    onClick={handleDisconnectPhantom}
                    title={language === 'pt' ? 'Clique para desconectar' : 'Click to disconnect'}
                  >
                    <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" rx="22" fill="#AB9FF2"/>
                      <path d="M50 16C33.432 16 20 29.432 20 46C20 56.4 24.6 64 30.4 69.2C32 70.64 33 72.6 33 74.6V81C33 82.1 33.9 83 35 83H39V79H61V83H65C66.1 83 67 82.1 67 81V74.6C67 72.6 68 70.64 69.6 69.2C75.4 64 80 56.4 80 46C80 29.432 66.568 16 50 16Z" fill="white"/>
                      <ellipse cx="42" cy="47" rx="4.5" ry="5.5" fill="#AB9FF2"/>
                      <ellipse cx="58" cy="47" rx="4.5" ry="5.5" fill="#AB9FF2"/>
                      <path d="M33 81C33 81 36 78 39 81C42 84 47 81 50 81C53 81 58 84 61 81C64 78 67 81 67 81" stroke="#AB9FF2" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                    </svg>
                    <div className="flex flex-col leading-none">
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#7C5CF6', letterSpacing: '0.4px' }}>
                        {language === 'pt' ? 'Conectada' : 'Connected'}
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        {phantomAddress.slice(0, 4)}...{phantomAddress.slice(-4)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectPhantom}
                    disabled={phantomConnecting}
                    className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      letterSpacing: '0.1px',
                      background: isDark ? 'rgba(83,75,177,0.12)' : 'rgba(83,75,177,0.07)',
                      borderColor: isDark ? 'rgba(83,75,177,0.40)' : 'rgba(83,75,177,0.25)',
                      color: '#7C5CF6',
                    }}
                    onMouseEnter={e => !phantomConnecting && (e.currentTarget.style.boxShadow = '0 4px 14px rgba(83,75,177,0.28)')}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    title={language === 'pt' ? 'Conectar Phantom Wallet' : 'Connect Phantom Wallet'}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#534BB1]/0 via-[#534BB1]/10 to-[#534BB1]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {phantomConnecting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#534BB1]/30 border-t-[#534BB1] animate-spin" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" rx="22" fill="#AB9FF2"/>
                        <path d="M50 16C33.432 16 20 29.432 20 46C20 56.4 24.6 64 30.4 69.2C32 70.64 33 72.6 33 74.6V81C33 82.1 33.9 83 35 83H39V79H61V83H65C66.1 83 67 82.1 67 81V74.6C67 72.6 68 70.64 69.6 69.2C75.4 64 80 56.4 80 46C80 29.432 66.568 16 50 16Z" fill="white"/>
                        <ellipse cx="42" cy="47" rx="4.5" ry="5.5" fill="#AB9FF2"/>
                        <ellipse cx="58" cy="47" rx="4.5" ry="5.5" fill="#AB9FF2"/>
                        <path d="M33 81C33 81 36 78 39 81C42 84 47 81 50 81C53 81 58 84 61 81C64 78 67 81 67 81" stroke="#AB9FF2" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    )}
                    {phantomConnecting
                      ? (language === 'pt' ? 'Conectando...' : 'Connecting...')
                      : 'Phantom'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Título da página */}
          <div className="text-center mb-10 dash-reveal">
            <span
              className="inline-block text-orange-500 mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}
            >
              {language === 'pt' ? 'Painel do Usuário' : 'User Dashboard'}
            </span>
            <h1
              className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-1px', lineHeight: 1.08 }}
            >
              {t('heading')}
            </h1>
          </div>

          {/* ── Progress Card ── */}
          <div className={`relative overflow-hidden rounded-3xl p-8 mb-8 border dash-reveal-delay-1 ${
            isDark ? 'bg-gray-900/60 border-orange-500/15' : 'bg-white border-orange-500/20'
          } shadow-xl`}>
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-orange-500/8 blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h2
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', letterSpacing: '-0.4px' }}
                >
                  {t('progress')}
                </h2>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: totalBigPoints.toFixed(2), label: `BIG · ${t('shared')}` },
                  { value: daysActive, label: t('daysActive') },
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-orange-500/8 border-orange-500/15' : 'bg-orange-50 border-orange-100'}`}>
                    <div
                      className="text-3xl md:text-4xl font-bold text-orange-500 mb-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.8px' }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className={isDark ? 'text-gray-400' : 'text-gray-500'}
                      style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Month Selector */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span
                  className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {t('selectMonth')}
                </span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`${isDark ? 'bg-gray-800 text-gray-100 border-gray-700/60' : 'bg-white text-gray-900 border-gray-200'} border rounded-xl px-4 py-2 text-sm cursor-pointer font-medium transition-all duration-300 hover:border-orange-500 focus:outline-none focus:border-orange-500 min-w-[180px]`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
                    <h3
                      className={`text-sm font-semibold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
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
                        <div
                          className="text-xl font-bold text-orange-500 mb-1"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.3px' }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className={isDark ? 'text-gray-500' : 'text-gray-400'}
                          style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  <div className="w-1 h-4 bg-orange-500/60 rounded-full" />
                  <h3
                    className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
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

          {/* ── Bottom Grid ── */}
          <div className="grid grid-cols-1 gap-6">

            {/* ── Claim Card — only visible when Phantom is connected ── */}
            {phantomConnected && (
              <div className={`relative overflow-hidden rounded-3xl p-8 border dash-reveal-delay-2 ${
                isDark ? 'bg-gray-900/60 border-[#AB9FF2]/20' : 'bg-white border-[#AB9FF2]/30'
              } shadow-xl`}>
                {/* top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AB9FF2]/50 to-transparent" />
                {/* bg glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                  style={{ background: 'rgba(171,159,242,0.06)' }} />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full" style={{ background: '#AB9FF2' }} />
                      <h2
                        className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', letterSpacing: '-0.3px' }}
                      >
                        {language === 'pt' ? 'Resgatar BIG' : 'Claim BIG'}
                      </h2>
                    </div>

                    {/* Connected wallet badge */}
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                      style={{
                        background: isDark ? 'rgba(171,159,242,0.10)' : 'rgba(171,159,242,0.08)',
                        borderColor: 'rgba(171,159,242,0.30)',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
                        <rect width="100" height="100" rx="22" fill="#AB9FF2"/>
                        <path d="M50 16C33.432 16 20 29.432 20 46C20 56.4 24.6 64 30.4 69.2C32 70.64 33 72.6 33 74.6V81C33 82.1 33.9 83 35 83H39V79H61V83H65C66.1 83 67 82.1 67 81V74.6C67 72.6 68 70.64 69.6 69.2C75.4 64 80 56.4 80 46C80 29.432 66.568 16 50 16Z" fill="white"/>
                        <ellipse cx="42" cy="47" rx="4.5" ry="5.5" fill="#AB9FF2"/>
                        <ellipse cx="58" cy="47" rx="4.5" ry="5.5" fill="#AB9FF2"/>
                        <path d="M33 81C33 81 36 78 39 81C42 84 47 81 50 81C53 81 58 84 61 81C64 78 67 81 67 81" stroke="#AB9FF2" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                      </svg>
                      <span className="font-mono" style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        {phantomAddress.slice(0, 4)}...{phantomAddress.slice(-4)}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-sm mb-6 pl-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    style={{ lineHeight: '1.65', fontWeight: 400 }}
                  >
                    {language === 'pt'
                      ? 'Resgate seus tokens BIG (Solana) referentes ao mês atual. Apenas 1 claim por mês.'
                      : 'Claim your BIG tokens (Solana) for the current month. One claim per month.'}
                  </p>

                  {/* Amount display */}
                  <div className={`rounded-2xl border p-5 mb-5 ${
                    isDark ? 'bg-[rgba(171,159,242,0.06)] border-[#AB9FF2]/15' : 'bg-[#F5F3FF] border-[#AB9FF2]/25'
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p
                          className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                          style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}
                        >
                          {language === 'pt' ? 'Disponível para resgate' : 'Available to claim'}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span
                            className="font-bold"
                            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', letterSpacing: '-1px', color: '#AB9FF2' }}
                          >
                            {Math.min(Math.floor(monthlyData.showMonthly ? monthlyData.totalPoints : totalBigPoints), 1000).toLocaleString()}
                          </span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>BIG</span>
                        </div>
                        {(monthlyData.showMonthly ? monthlyData.totalPoints : totalBigPoints) > 1000 && (
                          <p className="text-xs mt-1" style={{ color: '#AB9FF2', opacity: 0.7 }}>
                            {language === 'pt' ? 'Limite: 1.000 BIG por claim' : 'Limit: 1,000 BIG per claim'}
                          </p>
                        )}
                      </div>
                      <div className={`text-right text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        <p>{language === 'pt' ? 'Rede' : 'Network'}</p>
                        <p className="font-semibold text-[#9945FF]">Solana</p>
                      </div>
                    </div>
                  </div>

                  {/* Already claimed this month */}
                  {alreadyClaimed ? (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      isDark ? 'bg-green-500/8 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                    }`}>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">
                        {language === 'pt' ? 'Já resgatado este mês! Próximo claim disponível em 1º do mês.' : 'Already claimed this month! Next claim available on the 1st.'}
                      </p>
                    </div>

                  ) : claimStatus === 'success' ? (
                    <div className="space-y-3">
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                        isDark ? 'bg-green-500/8 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                      }`}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">
                          {language === 'pt' ? 'Claim realizado com sucesso!' : 'Claim successful!'}
                        </p>
                      </div>
                      {claimTx && (
                        <a
                          href={`https://explorer.solana.com/tx/${claimTx}?cluster=mainnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80"
                          style={{ color: '#AB9FF2', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {language === 'pt' ? 'Ver transação no Solana Explorer' : 'View transaction on Solana Explorer'}
                        </a>
                      )}
                    </div>

                  ) : claimStatus === 'error' ? (
                    <div className="space-y-3">
                      <div className={`px-4 py-3 rounded-xl border ${
                        isDark ? 'bg-red-500/8 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        <p className="text-sm font-medium mb-1">
                          {language === 'pt' ? 'Erro ao processar claim' : 'Claim failed'}
                        </p>
                        {claimError && (
                          <p className="text-xs opacity-70 font-mono">{claimError}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setClaimStatus(null)}
                        className="text-xs font-medium underline"
                        style={{ color: '#AB9FF2', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {language === 'pt' ? 'Tentar novamente' : 'Try again'}
                      </button>
                    </div>

                  ) : (
                    /* Claim button */
                    <button
                      onClick={handleClaim}
                      disabled={
                        claimStatus === 'loading' ||
                        Math.floor(monthlyData.showMonthly ? monthlyData.totalPoints : totalBigPoints) < 1
                      }
                      className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: '0.1px',
                        background: 'linear-gradient(135deg, #9945FF 0%, #AB9FF2 100%)',
                        color: 'white',
                        boxShadow: claimStatus === 'loading' ? 'none' : '0 8px 24px rgba(153,69,255,0.30)',
                      }}
                      onMouseEnter={e => { if (claimStatus !== 'loading') e.currentTarget.style.boxShadow = '0 12px 32px rgba(153,69,255,0.45)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(153,69,255,0.30)'; }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      {claimStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          {language === 'pt' ? 'Processando...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {language === 'pt' ? 'Fazer Claim' : 'Claim BIG'}
                        </>
                      )}
                    </button>
                  )}

                  {/* Info note */}
                  {!alreadyClaimed && claimStatus !== 'success' && (
                    <p
                      className={`text-xs mt-3 text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                      style={{ lineHeight: '1.5' }}
                    >
                      {language === 'pt'
                        ? '⚡ Os pontos do mês atual serão zerados após o resgate.'
                        : '⚡ Current month points will be reset after claiming.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Referral Card */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border dash-reveal-delay-2 ${
              isDark ? 'bg-gray-900/60 border-orange-500/15' : 'bg-white border-orange-500/20'
            } shadow-xl`}>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full" />
                  <h2
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', letterSpacing: '-0.3px' }}
                  >
                    {t('referralTitle')}
                  </h2>
                </div>
                <p
                  className={`text-sm mb-6 pl-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ lineHeight: '1.65', fontWeight: 400 }}
                >
                  {t('referralDesc')}
                </p>

                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono cursor-pointer transition-all duration-300 hover:border-orange-500/50 mb-4 ${
                    isDark ? 'bg-gray-800/60 border-gray-700/60 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                  onClick={handleCopyReferralLink}
                />

                <button
                  onClick={handleCopyReferralLink}
                  className="group relative w-full inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)] overflow-hidden mb-6"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.1px' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {t('copyBtn')}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: referralCount, label: t('referrals') },
                    { value: referralEarnings.toFixed(3), label: `BIG · ${t('referralEarnings')}` },
                  ].map((stat, i) => (
                    <div key={i} className={`text-center p-4 rounded-2xl border ${isDark ? 'bg-orange-500/8 border-orange-500/15' : 'bg-orange-50 border-orange-100'}`}>
                      <div
                        className="text-2xl font-bold text-orange-500 mb-1"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={isDark ? 'text-gray-500' : 'text-gray-400'}
                        style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className={`relative z-10 text-center py-8 mt-8 border-t ${isDark ? 'border-gray-800/40 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
          <p
            className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
            style={{ fontWeight: 400, letterSpacing: '0.2px' }}
          >
            {t('footerText')}
          </p>
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
