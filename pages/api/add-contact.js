// pages/api/add-contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, nome } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Colocar no .env
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          PRENOME: nome
        },
        listIds: [5]
      })
    });

    const result = await response.json();
    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar contato' });
  }
}
