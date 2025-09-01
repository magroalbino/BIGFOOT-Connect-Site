import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';

const firebaseConfig = {
  apiKey: "AIzaSyAhziJbG5Pxg0UYvq784YH4zXpsdKfh7AY",
  authDomain: "bigfoot-connect.firebaseapp.com",
  projectId: "bigfoot-connect",
  storageBucket: "bigfoot-connect.appspot.com",
  messagingSenderId: "177999879162",
  appId: "1:177999879162:web:a1ea739930cac97475e243"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let usageChart;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // ✅ Busca dados BIG Points ao invés de MB compartilhados
    await loadBigPointsData(user);
    
    // ✅ Opcional: Mantém compatibilidade com dados antigos
    await loadLegacyUsageData(user);
  } else {
    alert('Você precisa estar logado para ver seu dashboard.');
    window.location.href = '/login.html';
  }
});

// ✅ NOVA FUNÇÃO: Carrega dados de BIG Points
async function loadBigPointsData(user) {
  try {
    // Busca earnings de BIG Points por email do usuário
    const earningsQuery = query(
      collection(db, 'bigpoints_earnings'),
      where('email', '==', user.email),
      orderBy('date', 'asc')
    );
    
    const earningsSnapshot = await getDocs(earningsQuery);
    
    if (!earningsSnapshot.empty) {
      const bigPointsData = {};
      let totalBigPoints = 0;
      
      earningsSnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date;
        const amount = data.bigPointsAmount || 0;
        
        // Agrupa por data
        if (!bigPointsData[date]) {
          bigPointsData[date] = 0;
        }
        bigPointsData[date] += amount;
        totalBigPoints += amount;
      });
      
      console.log('Dados BIG Points carregados:', bigPointsData);
      console.log('Total BIG Points:', totalBigPoints);
      
      // ✅ Atualiza interface
      updateTotalBigPoints(totalBigPoints);
      renderBigPointsChart(bigPointsData);
      
      return;
    }
    
    console.log('Nenhum dado de BIG Points encontrado.');
  } catch (error) {
    console.error('Erro ao carregar BIG Points:', error);
  }
}

// ✅ FUNÇÃO DE COMPATIBILIDADE: Carrega dados antigos se não houver BIG Points
async function loadLegacyUsageData(user) {
  try {
    const dailyUsageRef = doc(db, 'usage', user.uid);
    const dailySnap = await getDoc(dailyUsageRef);

    if (dailySnap.exists()) {
      const data = dailySnap.data().daily || {};
      console.log('Dados legacy encontrados:', data);
      
      // Se não há dados de BIG Points, mostra dados antigos
      if (Object.keys(data).length > 0 && !document.getElementById('usageChart').hasChildNodes()) {
        renderLegacyChart(data);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados legacy:', error);
  }
}

// ✅ NOVA FUNÇÃO: Renderiza gráfico de BIG Points
function renderBigPointsChart(dailyData) {
  const labels = Object.keys(dailyData).sort();
  const values = labels.map(date => dailyData[date]);

  const ctx = document.getElementById('usageChart').getContext('2d');

  // Destroi gráfico anterior se existir
  if (usageChart) {
    usageChart.destroy();
  }

  usageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'BIG Points Ganhos',
        data: values,
        fill: true,
        borderColor: 'rgb(255, 193, 7)', // Cor dourada para BIG Points
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: context => `${context.parsed.y.toFixed(6)} BIG Points`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'BIG Points' }
        },
        x: {
          title: { display: true, text: 'Data' }
        }
      }
    }
  });
}

// ✅ FUNÇÃO LEGACY: Para dados antigos (MB compartilhados)
function renderLegacyChart(dailyData) {
  const labels = Object.keys(dailyData).sort();
  const values = labels.map(date => dailyData[date]);

  const ctx = document.getElementById('usageChart').getContext('2d');

  if (usageChart) {
    usageChart.destroy();
  }

  usageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'MB Compartilhados (Legacy)',
        data: values,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: context => `${context.parsed.y} MB`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'MB (Legacy)' }
        },
        x: {
          title: { display: true, text: 'Data' }
        }
      }
    }
  });
}

// ✅ NOVA FUNÇÃO: Atualiza total de BIG Points na interface
function updateTotalBigPoints(total) {
  // Procura elemento na página para mostrar total
  const totalElement = document.getElementById('totalBigPoints');
  if (totalElement) {
    totalElement.textContent = `${total.toFixed(6)} BIG Points`;
  }
  
  // ✅ Cria elemento se não existir
  if (!totalElement) {
    const newElement = document.createElement('div');
    newElement.id = 'totalBigPoints';
    newElement.innerHTML = `
      <h3>Total BIG Points: ${total.toFixed(6)}</h3>
    `;
    newElement.style.cssText = `
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #333;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    `;
    
    // Insere antes do gráfico
    const chartContainer = document.getElementById('usageChart').parentElement;
    chartContainer.insertBefore(newElement, chartContainer.firstChild);
  }
}

// ✅ FUNÇÃO PARA ATUALIZAÇÃO EM TEMPO REAL (opcional)
function startRealTimeUpdates(user) {
  // Atualiza dados a cada 5 minutos
  setInterval(async () => {
    console.log('Atualizando dados BIG Points...');
    await loadBigPointsData(user);
  }, 300000); // 5 minutos
}
