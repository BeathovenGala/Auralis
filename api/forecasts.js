// Vercel serverless function for forecasts
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
      // Return mock forecast data
      const mockForecasts = [
        {
          id: '1',
          forecast_time: new Date().toISOString(),
          horizon: '3hour',
          predicted_dst: -30,
          confidence_score: 0.85,
          storm_level: 'G1',
          model_version: 'v1.2.0'
        }
      ];
      
      return res.status(200).json(mockForecasts);
    }

    if (req.method === 'POST') {
      // Accept forecast but return success for now
      return res.status(201).json({ 
        success: true, 
        message: 'Forecast created',
        data: req.body 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Forecasts API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
