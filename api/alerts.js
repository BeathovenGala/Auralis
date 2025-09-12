// Vercel serverless function for alerts
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Return mock alert data
      const mockAlerts = [
        {
          id: '1',
          title: 'Geomagnetic Storm Warning',
          severity: 'G2',
          status: 'active',
          message: 'Moderate geomagnetic storm conditions expected',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }
      ];
      
      return res.status(200).json(mockAlerts);
    }

    if (req.method === 'POST') {
      // Accept alert but return success for now
      return res.status(201).json({ 
        success: true, 
        message: 'Alert created',
        data: req.body 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Alerts API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
