import AlertCard from '../AlertCard';
import { addHours, addMinutes } from "date-fns";

export default function AlertCardExample() {
  // todo: remove mock functionality - replace with real alert data
  const mockAlerts = [
    {
      id: "A20250912T0012Z_0001",
      level: 'WARNING' as const,
      tier: 'imminent' as const,
      title: "Severe Geomagnetic Storm (G3)",
      description: "Sustained Bz < -10 nT for 15 minutes. Dst dropping rapidly. Grid operators should prepare for voltage irregularities.",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      expiresAt: addHours(new Date(), 6),
      sources: ['DSCOVR', 'ACE', 'GOES'],
      confidence: 0.92,
      impactedAssets: ['Power Grid NE', 'GPS Network', 'HF Comms', 'Satellites LEO'],
      geometry: "45°N-65°N, 60°W-120°W"
    },
    {
      id: "A20250912T0008Z_0002", 
      level: 'ADVISORY' as const,
      tier: 'strategic' as const,
      title: "Solar Radiation Storm Forecast (S2)",
      description: "ML model predicts 78% probability of S2+ event within 3 hours based on solar flare activity.",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      sources: ['NOAA', 'SDO'],
      confidence: 0.78,
      impactedAssets: ['Polar Routes', 'Satellite Ops'],
      acknowledged: false
    },
    {
      id: "A20250912T0005Z_0003",
      level: 'WATCH' as const, 
      tier: 'strategic' as const,
      title: "Radio Blackout Potential (R1-R2)",
      description: "Increased solar activity detected. Minor radio blackouts possible on sunlit side of Earth.",
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      sources: ['GOES', 'NOAA'],
      confidence: 0.45,
      impactedAssets: ['HF Radio'],
      acknowledged: true
    }
  ];

  return (
    <div className="bg-background p-6 space-y-4 max-w-2xl">
      {mockAlerts.map(alert => (
        <AlertCard 
          key={alert.id}
          alert={alert}
          onAcknowledge={(id) => console.log('Acknowledged:', id)}
          onEscalate={(id) => console.log('Escalated:', id)}
          onRunPlaybook={(id) => console.log('Running playbook for:', id)}
        />
      ))}
    </div>
  );
}