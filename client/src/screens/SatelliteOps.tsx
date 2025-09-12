import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Satellite, 
  Fuel, 
  Shield, 
  Activity,
  Calendar,
  Download
} from "lucide-react";
import { format, addHours } from "date-fns";

interface SatelliteData {
  id: string;
  name: string;
  type: 'LEO' | 'MEO' | 'GEO';
  status: 'nominal' | 'degraded' | 'critical' | 'safe_mode';
  altitude: number; // km
  inclination: number; // degrees
  dragCoeff: number;
  fuelLevel: number; // percentage
  nextManeuver?: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  recommendedAction?: string;
}

export default function SatelliteOps() {
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // todo: replace with real satellite data from API
  const satellites: SatelliteData[] = [
    {
      id: 'SAT-001',
      name: 'TerraSAR-X',
      type: 'LEO',
      status: 'nominal',
      altitude: 514,
      inclination: 97.4,
      dragCoeff: 2.2,
      fuelLevel: 78,
      riskLevel: 'low'
    },
    {
      id: 'SAT-002', 
      name: 'GOES-16',
      type: 'GEO',
      status: 'degraded',
      altitude: 35786,
      inclination: 0.1,
      dragCoeff: 0.1,
      fuelLevel: 34,
      nextManeuver: addHours(new Date(), 8),
      riskLevel: 'moderate',
      recommendedAction: 'Schedule attitude adjustment'
    },
    {
      id: 'SAT-003',
      name: 'Starlink-4152',
      type: 'LEO',
      status: 'critical',
      altitude: 342,
      inclination: 53.0,
      dragCoeff: 4.8,
      fuelLevel: 12,
      nextManeuver: addHours(new Date(), 2),
      riskLevel: 'severe',
      recommendedAction: 'Immediate safe mode required'
    },
    {
      id: 'SAT-004',
      name: 'GPS IIF-12',
      type: 'MEO',
      status: 'nominal',
      altitude: 20182,
      inclination: 55.0,
      dragCoeff: 1.1,
      fuelLevel: 89,
      riskLevel: 'low'
    },
    {
      id: 'SAT-005',
      name: 'Hubble Space Telescope',
      type: 'LEO',
      status: 'safe_mode',
      altitude: 547,
      inclination: 28.5,
      dragCoeff: 3.1,
      fuelLevel: 0, // Uses gyroscopes for pointing
      riskLevel: 'high',
      recommendedAction: 'Monitor gyroscope performance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nominal': return 'bg-weather-normal';
      case 'degraded': return 'bg-weather-elevated';
      case 'critical': return 'bg-weather-severe';
      case 'safe_mode': return 'bg-weather-high';
      default: return 'bg-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-weather-normal';
      case 'moderate': return 'text-weather-elevated';
      case 'high': return 'text-weather-high';
      case 'severe': return 'text-weather-severe';
      default: return 'text-muted-foreground';
    }
  };

  const handleSafeModeActivation = (satelliteId: string) => {
    console.log(`Initiating safe mode for satellite: ${satelliteId}`);
    // todo: implement safe mode activation with auth & confirmation
  };

  const handleManeuverPlanning = (satelliteId: string) => {
    console.log(`Planning maneuver for satellite: ${satelliteId}`);
    // todo: implement maneuver planning system
  };

  const selectedSat = satellites.find(s => s.id === selectedSatellite);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Satellite Operations</h1>
          <p className="text-muted-foreground">
            Monitor satellite health and plan orbital maneuvers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export TLE
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Satellite List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fleet Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {satellites.map((satellite) => (
                <div
                  key={satellite.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover-elevate ${
                    selectedSatellite === satellite.id ? 'border-primary bg-muted/50' : 'border-border'
                  }`}
                  onClick={() => setSelectedSatellite(satellite.id)}
                  data-testid={`satellite-${satellite.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(satellite.status)}`} />
                      <span className="font-medium text-sm">{satellite.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {satellite.type}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Alt: {satellite.altitude.toLocaleString()} km</span>
                      <span className={getRiskColor(satellite.riskLevel)}>
                        {satellite.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    {satellite.fuelLevel > 0 && (
                      <div className="flex justify-between mt-1">
                        <span>Fuel: {satellite.fuelLevel}%</span>
                        <span>Drag: {satellite.dragCoeff}</span>
                      </div>
                    )}
                  </div>

                  {satellite.recommendedAction && (
                    <div className="mt-2 p-2 bg-weather-elevated/20 rounded text-xs">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      {satellite.recommendedAction}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Emergency Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => selectedSatellite && handleSafeModeActivation(selectedSatellite)}
                disabled={!selectedSatellite}
                data-testid="button-safe-mode"
              >
                <Shield className="w-4 h-4 mr-2" />
                Safe Mode All Critical
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => selectedSatellite && handleManeuverPlanning(selectedSatellite)}
                disabled={!selectedSatellite}
                data-testid="button-plan-maneuver"
              >
                <Activity className="w-4 h-4 mr-2" />
                Plan Maneuver
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Satellite Details */}
        <div className="col-span-2">
          {selectedSat ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orbital">Orbital Data</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="maneuvers">Maneuvers</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="w-5 h-5" />
                      {selectedSat.name}
                      <Badge variant={selectedSat.status === 'nominal' ? 'default' : 'destructive'}>
                        {selectedSat.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">
                          {selectedSat.altitude.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Altitude (km)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">
                          {selectedSat.inclination}°
                        </div>
                        <div className="text-xs text-muted-foreground">Inclination</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">
                          {selectedSat.dragCoeff}
                        </div>
                        <div className="text-xs text-muted-foreground">Drag Coefficient</div>
                      </div>
                    </div>

                    {/* Fuel Level */}
                    {selectedSat.fuelLevel > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Fuel Level</span>
                          <span className="text-sm font-mono">{selectedSat.fuelLevel}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              selectedSat.fuelLevel > 50 ? 'bg-weather-normal' :
                              selectedSat.fuelLevel > 20 ? 'bg-weather-elevated' : 'bg-weather-severe'
                            }`}
                            style={{ width: `${selectedSat.fuelLevel}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Space Weather Risk</span>
                        <Badge variant="outline" className={getRiskColor(selectedSat.riskLevel)}>
                          {selectedSat.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      {selectedSat.recommendedAction && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Recommendation: {selectedSat.recommendedAction}
                        </div>
                      )}
                    </div>

                    {/* Next Maneuver */}
                    {selectedSat.nextManeuver && (
                      <div className="p-3 border rounded-lg bg-weather-elevated/10">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Next Scheduled Maneuver</span>
                        </div>
                        <div className="mt-1 font-mono text-sm">
                          {format(selectedSat.nextManeuver, 'yyyy-MM-dd HH:mm')}Z
                        </div>
                        <div className="mt-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orbital" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Orbital Elements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Semi-major axis:</span>
                          <span>{(selectedSat.altitude + 6371).toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eccentricity:</span>
                          <span>0.0012</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inclination:</span>
                          <span>{selectedSat.inclination}°</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>RAAN:</span>
                          <span>194.12°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Arg of Perigee:</span>
                          <span>267.89°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mean Anomaly:</span>
                          <span>92.34°</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Drag Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <p className="mb-2">Based on current space weather conditions:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Expected altitude loss: 0.8 km/day</li>
                          <li>• Fuel cost for station-keeping: 2.1 m/s Δv/week</li>
                          <li>• Recommended maneuver window: 2025-09-15 14:00Z</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maneuvers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Maneuver History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-2 border rounded">
                        <div className="font-mono">2025-09-10 08:45Z</div>
                        <div className="text-muted-foreground">Station-keeping burn: +1.2 m/s</div>
                      </div>
                      <div className="p-2 border rounded">
                        <div className="font-mono">2025-09-03 12:30Z</div>
                        <div className="text-muted-foreground">Inclination adjustment: +0.8 m/s</div>
                      </div>
                      <div className="p-2 border rounded">
                        <div className="font-mono">2025-08-27 16:15Z</div>
                        <div className="text-muted-foreground">Attitude correction: +0.3 m/s</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Satellite className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Select a Satellite</h3>
                  <p className="text-muted-foreground">
                    Choose a satellite from the list to view detailed information
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}