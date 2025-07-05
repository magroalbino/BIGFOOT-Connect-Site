export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: 'ID e senha obrigatórios' });
  }

  // (opcional) salvar no banco de dados aqui
  return res.status(200).json({ message: 'Registrado com sucesso' });
}
