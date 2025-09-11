import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Satellite, 
  Database,
  Shield,
  Zap,
  Plane,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";

import SystemHealthBar from './SystemHealthBar';
import SpaceWeatherTile from './SpaceWeatherTile';
import ForecastTile from './ForecastTile';
import Globe3D from './Globe3D';
import SolarImageryPanel from './SolarImageryPanel';
import AlertCard from './AlertCard';
import TimeSeriesChart from './TimeSeriesChart';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className }: DashboardProps) {
  const [chartsExpanded, setChartsExpanded] = useState(true);
  const [activePersona, setActivePersona] = useState<'grid' | 'satellite' | 'aviation' | 'spaceflight' | null>(null);

  // todo: remove mock functionality - replace with real alert data
  const mockAlerts = [
    {
      id: "A20250912T0012Z_0001",
      level: 'WARNING' as const,
      tier: 'imminent' as const,
      title: "Severe Geomagnetic Storm (G3)",
      description: "Sustained Bz < -10 nT for 15 minutes. Grid operators prepare for voltage irregularities.",
      timestamp: new Date(Date.now() - 300000),
      expiresAt: new Date(Date.now() + 21600000),
      sources: ['DSCOVR', 'ACE', 'GOES'],
      confidence: 0.92,
      impactedAssets: ['Power Grid NE', 'GPS Network', 'HF Comms', 'Satellites LEO'],
    },
    {
      id: "A20250912T0008Z_0002",
      level: 'ADVISORY' as const,
      tier: 'strategic' as const,
      title: "Solar Radiation Storm Forecast (S2)",
      description: "78% probability of S2+ event within 3 hours based on solar flare activity.",
      timestamp: new Date(Date.now() - 600000),
      sources: ['NOAA', 'SDO'],
      confidence: 0.78,
      impactedAssets: ['Polar Routes', 'Satellite Ops'],
    }
  ];

  const mockForecasts = [
    { scale: 'R' as const, low: 15, medium: 5, high: 1 },
    { scale: 'S' as const, low: 10, medium: 2, high: 0 },
    { scale: 'G' as const, low: 25, medium: 8, high: 2 },
  ];

  const personas = [
    { id: 'grid', label: 'Power Grid', icon: Zap, color: 'bg-blue-500' },
    { id: 'satellite', label: 'Satellite Ops', icon: Satellite, color: 'bg-green-500' },
    { id: 'aviation', label: 'Aviation', icon: Plane, color: 'bg-purple-500' },
    { id: 'spaceflight', label: 'Human Spaceflight', icon: Users, color: 'bg-orange-500' },
  ];

  const handlePersonaClick = (personaId: string) => {
    setActivePersona(activePersona === personaId ? null : personaId as any);
    console.log(`Selected persona: ${personaId}`);
  };

  const getPlaybookActions = (persona: string) => {
    switch (persona) {
      case 'grid':
        return ['Isolate Transformers', 'Enable Voltage Control', 'Alert Grid Operators', 'Monitor GIC Levels'];
      case 'satellite':
        return ['Initiate Safe Mode', 'Adjust Orbit', 'Shield Electronics', 'Increase Telemetry'];
      case 'aviation':
        return ['Reroute Polar Flights', 'Monitor HF Comms', 'Update Crew Dose', 'Alert ATC Centers'];
      case 'spaceflight':
        return ['Shelter Procedures', 'EVA Hold', 'Monitor Dosimetry', 'Update Mission Control'];
      default:
        return [];
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* System Health Bar */}
      <SystemHealthBar />

      {/* Main Dashboard Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        
        {/* Left Panel - Data Sources & Controls */}
        <div className="w-80 border-r border-border bg-card overflow-y-auto">
          <div className="p-4 space-y-4">
            
            {/* Data Source Health */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* todo: replace with real data source monitoring */}
                {['DSCOVR', 'ACE', 'GOES-16', 'NOAA'].map((source) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm">{source}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-weather-normal rounded-full" />
                      <span className="text-xs text-muted-foreground font-mono">2.3s</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Persona-Specific Playbooks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {personas.map((persona) => (
                  <div key={persona.id} className="space-y-2">
                    <Button
                      variant={activePersona === persona.id ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handlePersonaClick(persona.id)}
                      data-testid={`button-persona-${persona.id}`}
                    >
                      <persona.icon className="w-3 h-3 mr-2" />
                      {persona.label}
                    </Button>
                    
                    {activePersona === persona.id && (
                      <div className="pl-4 space-y-1">
                        {getPlaybookActions(persona.id).map((action, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => console.log(`Executing: ${action}`)}
                            data-testid={`button-action-${action.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Panel - Main Dashboard */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Current R/S/G Status */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Space Weather Conditions</h2>
              <div className="grid grid-cols-3 gap-4">
                <SpaceWeatherTile
                  scale="R"
                  title="Radio Blackouts"
                  current={{ level: "elevated", value: 1, description: "Minor" }}
                  past24h={{ max: 2, events: 3 }}
                />
                <SpaceWeatherTile
                  scale="S"
                  title="Radiation Storms"
                  current={{ level: "normal", value: 0, description: "None" }}
                  past24h={{ max: 1, events: 1 }}
                />
                <SpaceWeatherTile
                  scale="G"
                  title="Geomagnetic Storms"
                  current={{ level: "high", value: 3, description: "Strong" }}
                  past24h={{ max: 3, events: 2 }}
                />
              </div>
            </div>

            {/* Forecast Tiles */}
            <div>
              <h2 className="text-xl font-semibold mb-4">3-Day Forecast</h2>
              <div className="grid grid-cols-3 gap-4">
                <ForecastTile
                  day={1}
                  date={addDays(new Date(), 1)}
                  forecasts={mockForecasts}
                  confidence="high"
                  trend="up"
                />
                <ForecastTile
                  day={2}
                  date={addDays(new Date(), 2)}
                  forecasts={mockForecasts.map(f => ({ ...f, low: f.low * 1.2, medium: f.medium * 1.5 }))}
                  confidence="medium"
                  trend="stable"
                />
                <ForecastTile
                  day={3}
                  date={addDays(new Date(), 3)}
                  forecasts={mockForecasts.map(f => ({ ...f, low: f.low * 0.8, medium: f.medium * 0.6 }))}
                  confidence="low"
                  trend="down"
                />
              </div>
            </div>

            {/* Globe and Solar Imagery */}
            <div className="grid grid-cols-2 gap-6 h-[500px]">
              <Globe3D />
              <SolarImageryPanel />
            </div>

            {/* Time Series Charts - Collapsible */}
            <Collapsible open={chartsExpanded} onOpenChange={setChartsExpanded}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Real-time Data</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-toggle-charts">
                    {chartsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <TimeSeriesChart
                    title="IMF Bz Component"
                    parameter="bz"
                    unit="nT"
                    thresholds={[
                      { value: -5, label: 'Warning', color: '#f59e0b' },
                      { value: -10, label: 'Alert', color: '#ef4444' },
                    ]}
                  />
                  <TimeSeriesChart
                    title="Solar Wind Speed"
                    parameter="solar_wind_speed"
                    unit="km/s"
                  />
                  <TimeSeriesChart
                    title="Dst Index"
                    parameter="dst"
                    unit="nT"
                    thresholds={[
                      { value: -50, label: 'Minor Storm', color: '#f59e0b' },
                      { value: -100, label: 'Moderate Storm', color: '#ef4444' },
                    ]}
                  />
                  <TimeSeriesChart
                    title="Kp Index"
                    parameter="kp"
                    unit=""
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Right Panel - Active Alerts & News */}
        <div className="w-96 border-l border-border bg-card overflow-y-auto">
          <div className="p-4 space-y-4">
            
            {/* Active Alerts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Active Alerts
                </h3>
                <Badge variant="outline">{mockAlerts.length}</Badge>
              </div>
              
              <div className="space-y-3">
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
            </div>

            {/* Site News */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">System Status & News</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs space-y-2">
                  <div className="p-2 bg-muted rounded text-muted-foreground">
                    <div className="font-mono text-xs">{format(new Date(), 'yyyy-MM-dd HH:mm')}Z</div>
                    <div className="mt-1">
                      DSCOVR L1 data processing restored. 12-minute gap in real-time data from 14:23-14:35Z has been backfilled.
                    </div>
                  </div>
                  
                  <div className="p-2 bg-muted rounded text-muted-foreground">
                    <div className="font-mono text-xs">{format(new Date(Date.now() - 3600000), 'yyyy-MM-dd HH:mm')}Z</div>
                    <div className="mt-1">
                      Model retrain completed. Tier-1 forecast engine updated with latest storm patterns from March 2024 events.
                    </div>
                  </div>

                  <div className="p-2 bg-muted rounded text-muted-foreground">
                    <div className="font-mono text-xs">{format(new Date(Date.now() - 7200000), 'yyyy-MM-dd HH:mm')}Z</div>
                    <div className="mt-1">
                      Scheduled maintenance: GOES-18 magnetometer calibration 2025-09-13 02:00-04:00Z. Backup systems active.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}