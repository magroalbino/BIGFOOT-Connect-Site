import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '../../lib/firebaseAdmin'; // configure esse util

export default async function handler(req, res) {
  // ✅ Aceita apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { 
    email, 
    date, 
    bigPointsAmount, 
    pktMined, 
    hashrate, 
    shares, 
    miningTime 
  } = req.body;

  // ✅ Validação de dados obrigatórios
  if (!email || !date || typeof bigPointsAmount !== 'number') {
    return res.status(400).json({ 
      error: 'Dados inválidos', 
      required: 'email, date, bigPointsAmount (number)' 
    });
  }

  // ✅ Validação de valores
  if (bigPointsAmount < 0) {
    return res.status(400).json({ error: 'bigPointsAmount deve ser positivo' });
  }

  try {
    // ✅ Inicializa Firebase Admin
    initFirebaseAdmin();
    const db = getFirestore();

    // ✅ Salva transação individual de BIG Points
    const earningData = {
      email,
      date,
      bigPointsAmount: Number(bigPointsAmount.toFixed(6)), // Precisão de 6 decimais
      pktMined: pktMined ? Number(pktMined.toFixed(6)) : bigPointsAmount,
      hashrate: hashrate || 0,
      shares: shares || 0,
      miningTime: miningTime || 0,
      timestamp: FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    // ✅ Adiciona documento na collection bigpoints_earnings
    const earningRef = await db.collection('bigpoints_earnings').add(earningData);
    
    console.log(`BIG Points salvos: ${bigPointsAmount} para ${email} em ${date}`);
    
          // Usuário existe - atualiza totais
          const currentData = userDoc.data();
          transaction.update(userStatsRef, {
            totalBigPoints: (currentData.totalBigPoints || 0) + bigPointsAmount,
            totalPktMined: (currentData.totalPktMined || 0) + (pktMined || bigPointsAmount),
            totalShares: (currentData.totalShares || 0) + (shares || 0),
            lastMiningDate: date,
            lastMiningTime: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          });
        } else {
          // Primeiro registro do usuário
          transaction.set(userStatsRef, {
            email,
            totalBigPoints: bigPointsAmount,
            totalPktMined: pktMined || bigPointsAmount,
            totalShares: shares || 0,
            lastMiningDate: date,
            firstMiningDate: date,
            lastMiningTime: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      });

      console.log(`Estatísticas do usuário ${email} atualizadas`);
    } catch (statsError) {
      // ✅ Se falhar ao atualizar stats, não falha a operação principal
      console.warn('Erro ao atualizar estatísticas do usuário:', statsError);
    }

    // ✅ Resposta de sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'BIG Points salvos com sucesso',
      data: {
        id: earningRef.id,
        bigPointsAmount,
        email,
        date
      }
    });

  } catch (error) {
    console.error('Erro ao salvar BIG Points:', error);
    
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Falha ao processar dados'
    });
  }
}
