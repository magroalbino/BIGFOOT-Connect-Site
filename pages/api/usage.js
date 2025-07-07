import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '../../lib/firebaseAdmin'; // configure esse util

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido');

  const { email, date, amount } = req.body;
  if (!email || !date || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    initFirebaseAdmin(); // inicializa admin se ainda não estiver
    const db = getFirestore();
    await db.collection('dailyUsage').add({ email, date, amount });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar uso:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
