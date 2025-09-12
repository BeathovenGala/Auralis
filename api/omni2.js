// Vercel serverless function for OMNI2 data
import { db } from './db.js';

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
      // Return mock data for now since we need schema imports
      const mockData = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          dst_index: -25,
          scalar_b: 8.5,
          alpha_proton_ratio: 0.04,
          sunspot_number: 120,
          sw_plasma_temperature: 100000,
          sw_plasma_speed: 450,
          kp_index: 3.0,
          ae_index: 150,
          source: 'ACE',
          quality: 'good'
        }
      ];
      
      return res.status(200).json(mockData);
    }

    if (req.method === 'POST') {
      // Accept data but return success for now
      return res.status(201).json({ 
        success: true, 
        message: 'Data received',
        data: req.body 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('OMNI2 API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
