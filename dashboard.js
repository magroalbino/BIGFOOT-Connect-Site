import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc
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
    const dailyUsageRef = doc(db, 'usage', user.uid);
    const dailySnap = await getDoc(dailyUsageRef);

    if (dailySnap.exists()) {
      const data = dailySnap.data().daily || {};
      renderChart(data);
    } else {
      console.log('Nenhum dado encontrado.');
    }
  } else {
    alert('Você precisa estar logado para ver seu dashboard.');
    window.location.href = '/login.html';
  }
});

function renderChart(dailyData) {
  const labels = Object.keys(dailyData).sort();
  const values = labels.map(date => dailyData[date]);

  const ctx = document.getElementById('usageChart').getContext('2d');

  usageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'MB Compartilhados',
        data: values,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
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
          title: { display: true, text: 'MB' }
        },
        x: {
          title: { display: true, text: 'Data' }
        }
      }
    }
  });
}
