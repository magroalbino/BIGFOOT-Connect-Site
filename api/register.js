app.post('/api/register', async (req, res) => {
  const { id, password } = req.body;

  // Verifica se já existe
  const existingUser = await db.users.findOne({ where: { id } });
  if (existingUser) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }

  // Salva no banco (ideal: criptografar senha)
  await db.users.create({ id, password });
  res.status(201).json({ message: 'Cadastro realizado com sucesso.' });
});
