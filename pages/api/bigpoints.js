const { db, auth } = require('../../lib/firebaseAdmin');

export default async function handler(req, res) {
  // Apenas métodos POST são permitidos
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use POST.' 
    });
  }

  try {
    const { email, date, amount, idToken } = req.body;

    // Validação dos dados recebidos
    if (!email || !date || amount === undefined || !idToken) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios: email, date, amount, idToken'
      });
    }

    // Valida o ID token do Firebase Auth
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      console.error('Erro na autenticação:', authError);
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação inválido'
      });
    }

    // Verifica se o email do token bate com o email enviado
    if (decodedToken.email !== email) {
      return res.status(403).json({
        success: false,
        message: 'Email não corresponde ao token de autenticação'
      });
    }

    // Validação dos valores
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser um número positivo'
      });
    }

    // Validação da data (formato YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de data inválido. Use YYYY-MM-DD'
      });
    }

    // Limite de segurança (máximo 1000 BIG Points por dia)
    if (numericAmount > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade excede limite máximo diário (1000 BIG Points)'
      });
    }

    const userId = decodedToken.uid;
    const docRef = db
      .collection('users')
      .doc(userId)
      .collection('bigpoints_earnings')
      .doc(date);

    // Verifica se já existe documento para esta data
    const existingDoc = await docRef.get();
    
    if (existingDoc.exists) {
      // Atualiza documento existente (incrementa ou substitui)
      const currentAmount = existingDoc.data().bigpoints || 0;
      
      // Opção 1: Incrementar (soma com valor existente)
      // const newAmount = currentAmount + numericAmount;
      
      // Opção 2: Substituir (usa novo valor - recomendado para total absoluto)
      const newAmount = numericAmount;
      
      await docRef.update({
        bigpoints: newAmount,
        updatedAt: new Date(),
        lastUpdate: new Date().toISOString()
      });

      console.log(`BIG Points atualizados para ${email} em ${date}: ${currentAmount} → ${newAmount}`);
      
      return res.status(200).json({
        success: true,
        message: 'BIG Points atualizados com sucesso',
        data: {
          date,
          previousAmount: currentAmount,
          newAmount: newAmount,
          added: numericAmount
        }
      });
      
    } else {
      // Cria novo documento
      await docRef.set({
        bigpoints: numericAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId,
        email: email
      });

      console.log(`Novo registro de BIG Points criado para ${email} em ${date}: ${numericAmount}`);
      
      return res.status(201).json({
        success: true,
        message: 'BIG Points registrados com sucesso',
        data: {
          date,
          amount: numericAmount,
          created: true
        }
      });
    }

  } catch (error) {
    console.error('Erro no endpoint /api/bigpoints:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
