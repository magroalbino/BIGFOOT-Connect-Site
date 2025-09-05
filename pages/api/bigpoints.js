const { db, auth } = require('../../lib/firebaseAdmin');

// Handler deve ser exportado corretamente para Next.js
export default async function handler(req, res) {
  // Configurar CORS se necessário
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Lidar com requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas métodos POST são permitidos
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use POST.' 
    });
  }

  try {
    const { email, date, amount, idToken } = req.body;

    // Log para debug
    console.log('Dados recebidos:', { email, date, amount, hasToken: !!idToken });

    // Validação dos dados recebidos
    if (!email || !date || amount === undefined || !idToken) {
      console.log('Validação falhou:', { email: !!email, date: !!date, amount, idToken: !!idToken });
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios: email, date, amount, idToken',
        received: { email: !!email, date: !!date, amount, hasToken: !!idToken }
      });
    }

    // Valida o ID token do Firebase Auth
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
      console.log('Token validado para:', decodedToken.email);
    } catch (authError) {
      console.error('Erro na autenticação:', authError.message);
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação inválido',
        error: authError.message
      });
    }

    // Verifica se o email do token bate com o email enviado
    if (decodedToken.email !== email) {
      console.log('Email mismatch:', { tokenEmail: decodedToken.email, requestEmail: email });
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
        message: 'Quantidade deve ser um número positivo',
        received: amount
      });
    }

    // Validação da data (formato YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de data inválido. Use YYYY-MM-DD',
        received: date
      });
    }

    // Validar se a data não é no futuro
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fim do dia atual
    
    if (inputDate > today) {
      return res.status(400).json({
        success: false,
        message: 'Data não pode ser no futuro'
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
    
    // Verificar se o Firebase está configurado corretamente
    if (!db) {
      throw new Error('Database não inicializado');
    }

    const docRef = db
      .collection('users')
      .doc(userId)
      .collection('bigpoints_earnings')
      .doc(date);

    console.log('Consultando documento:', `users/${userId}/bigpoints_earnings/${date}`);

    // Verifica se já existe documento para esta data
    const existingDoc = await docRef.get();
    
    if (existingDoc.exists) {
      console.log('Documento existente encontrado');
      // Atualiza documento existente
      const currentData = existingDoc.data();
      const currentAmount = currentData.bigpoints || 0;
      
      // Usar o novo valor como total absoluto
      const newAmount = numericAmount;
      
      await docRef.update({
        bigpoints: newAmount,
        updatedAt: new Date(),
        lastUpdate: new Date().toISOString(),
        email: email // Garantir que o email esteja sempre atualizado
      });

      console.log(`BIG Points atualizados para ${email} em ${date}: ${currentAmount} → ${newAmount}`);
      
      return res.status(200).json({
        success: true,
        message: 'BIG Points atualizados com sucesso',
        data: {
          date,
          previousAmount: currentAmount,
          newAmount: newAmount,
          userId: userId
        }
      });
      
    } else {
      console.log('Criando novo documento');
      // Cria novo documento
      const newDoc = {
        bigpoints: numericAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId,
        email: email
      };

      await docRef.set(newDoc);

      console.log(`Novo registro de BIG Points criado para ${email} em ${date}: ${numericAmount}`);
      
      return res.status(201).json({
        success: true,
        message: 'BIG Points registrados com sucesso',
        data: {
          date,
          amount: numericAmount,
          created: true,
          userId: userId
        }
      });
    }

  } catch (error) {
    console.error('Erro no endpoint /api/bigpoints:', error);
    
    // Log mais detalhado do erro
    console.error('Stack trace:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        details: error.details
      } : 'Erro interno'
    });
  }
}
