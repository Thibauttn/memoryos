export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier que la clé API est bien configurée
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante — configure ANTHROPIC_API_KEY dans Vercel' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // Transmettre le statut HTTP de l'API Anthropic
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Erreur API Anthropic:', error);
    res.status(500).json({ error: 'Erreur serveur — réessaie dans quelques secondes' });
  }
}
