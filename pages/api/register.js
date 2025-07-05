export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido');
  
  const { id, password } = req.body;

  if (!id || !password) return res.status(400).json({ error: 'ID ou senha ausentes.' });

  // Aqui você pode salvar no Firestore, por exemplo
  // ou apenas confirmar que chegou tudo bem
  return res.status(200).json({ message: 'Registrado com sucesso' });
}
