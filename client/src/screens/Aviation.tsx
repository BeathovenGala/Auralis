import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  AlertTriangle, 
  Route, 
  Zap,
  MapPin,
  Clock,
  Calculator
} from "lucide-react";
import { format, addHours } from "date-fns";

interface FlightRoute {
  id: string;
  callsign: string;
  origin: string;
  destination: string;
  routeType: 'polar' | 'transatlantic' | 'transpacific' | 'domestic';
  altitude: number; // feet
  estimatedDuration: number; // hours
  radiationRisk: 'low' | 'moderate' | 'high' | 'severe';
  recommendedAction: 'proceed' | 'monitor' | 'reroute' | 'ground';
  alternateRoute?: string;
  additionalDose?: number; // microsieverts
}

export default function Aviation() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("routes");

  // todo: replace with real flight data from API
  const activeFlights: FlightRoute[] = [
    {
      id: 'FLT-001',
      callsign: 'UAL857',
      origin: 'LAX',
      destination: 'NRT',
      routeType: 'transpacific',
      altitude: 41000,
      estimatedDuration: 11.5,
      radiationRisk: 'moderate',
      recommendedAction: 'monitor',
      additionalDose: 12.3
    },
    {
      id: 'FLT-002',
      callsign: 'LH441',
      origin: 'FRA',
      destination: 'LAX',
      routeType: 'polar',
      altitude: 39000,
      estimatedDuration: 10.2,
      radiationRisk: 'high',
      recommendedAction: 'reroute',
      alternateRoute: 'Southern Route (+45 min)',
      additionalDose: 28.7
    },
    {
      id: 'FLT-003',
      callsign: 'BAW117',
      origin: 'LHR',
      destination: 'JFK',
      routeType: 'transatlantic',
      altitude: 38000,
      estimatedDuration: 7.8,
      radiationRisk: 'low',
      recommendedAction: 'proceed',
      additionalDose: 4.2
    },
    {
      id: 'FLT-004',
      callsign: 'KLM691',
      origin: 'AMS',
      destination: 'ICN',
      routeType: 'polar',
      altitude: 42000,
      estimatedDuration: 9.5,
      radiationRisk: 'severe',
      recommendedAction: 'ground',
      alternateRoute: 'Southern Route (+90 min)',
      additionalDose: 45.1
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-weather-normal';
      case 'moderate': return 'text-weather-elevated';
      case 'high': return 'text-weather-high';
      case 'severe': return 'text-weather-severe';
      default: return 'text-muted-foreground';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'proceed': return 'bg-weather-normal';
      case 'monitor': return 'bg-weather-elevated';
      case 'reroute': return 'bg-weather-high';
      case 'ground': return 'bg-weather-severe';
      default: return 'bg-muted';
    }
  };

  const handleRerouteGeneration = (flightId: string) => {
    console.log(`Generating alternate routes for flight: ${flightId}`);
    // todo: implement route generation system
  };

  const handleRadiationCalculation = (flightId: string) => {
    console.log(`Calculating radiation exposure for flight: ${flightId}`);
    // todo: implement radiation calculation system
  };

  const selectedFlight = activeFlights.find(f => f.id === selectedRoute);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aviation Operations</h1>
          <p className="text-muted-foreground">
            Polar route monitoring and radiation exposure management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calculator className="w-4 h-4 mr-2" />
            Dose Calculator
          </Button>
          <Button variant="outline" size="sm">
            <Route className="w-4 h-4 mr-2" />
            Route Planner
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Active Routes</TabsTrigger>
          <TabsTrigger value="map">Route Map</TabsTrigger>
          <TabsTrigger value="advisories">Advisories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            
            {/* Flight List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Flights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeFlights.map((flight) => (
                    <div
                      key={flight.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover-elevate ${
                        selectedRoute === flight.id ? 'border-primary bg-muted/50' : 'border-border'
                      }`}
                      onClick={() => setSelectedRoute(flight.id)}
                      data-testid={`flight-${flight.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          <span className="font-mono font-semibold">{flight.callsign}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {flight.routeType}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span>{flight.origin} → {flight.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{flight.estimatedDuration}h • FL{Math.floor(flight.altitude/100)}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-xs font-medium ${getRiskColor(flight.radiationRisk)}`}>
                          {flight.radiationRisk.toUpperCase()} RISK
                        </span>
                        <div className={`px-2 py-1 rounded text-xs text-white ${getActionColor(flight.recommendedAction)}`}>
                          {flight.recommendedAction.toUpperCase()}
                        </div>
                      </div>

                      {flight.alternateRoute && (
                        <div className="mt-2 p-2 bg-weather-elevated/20 rounded text-xs">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Alt: {flight.alternateRoute}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Risk Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Risk Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {activeFlights.filter(f => f.recommendedAction === 'proceed').length}
                      </div>
                      <div className="text-xs text-weather-normal">Clear</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {activeFlights.filter(f => f.recommendedAction === 'monitor').length}
                      </div>
                      <div className="text-xs text-weather-elevated">Monitor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {activeFlights.filter(f => f.recommendedAction === 'reroute').length}
                      </div>
                      <div className="text-xs text-weather-high">Reroute</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {activeFlights.filter(f => f.recommendedAction === 'ground').length}
                      </div>
                      <div className="text-xs text-weather-severe">Ground</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Flight Details */}
            <div className="col-span-2">
              {selectedFlight ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5" />
                        {selectedFlight.callsign}
                        <Badge variant={selectedFlight.recommendedAction === 'proceed' ? 'default' : 'destructive'}>
                          {selectedFlight.recommendedAction.toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      {/* Route Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Route</div>
                          <div className="font-mono text-lg">
                            {selectedFlight.origin} → {selectedFlight.destination}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Type</div>
                          <div className="text-lg capitalize">{selectedFlight.routeType}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Altitude</div>
                          <div className="font-mono text-lg">
                            FL{Math.floor(selectedFlight.altitude/100)} ({selectedFlight.altitude.toLocaleString()} ft)
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                          <div className="font-mono text-lg">{selectedFlight.estimatedDuration}h</div>
                        </div>
                      </div>

                      {/* Radiation Exposure */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Radiation Exposure</span>
                          <Badge variant="outline" className={getRiskColor(selectedFlight.radiationRisk)}>
                            {selectedFlight.radiationRisk.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Current Route</div>
                            <div className="font-mono font-bold">
                              {selectedFlight.additionalDose} μSv
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Annual Limit</div>
                            <div className="font-mono">20,000 μSv</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">% of Limit</div>
                            <div className="font-mono">
                              {((selectedFlight.additionalDose || 0) / 200).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="font-medium mb-2">Recommendations</div>
                        <div className="text-sm space-y-1">
                          <div>• Action: {selectedFlight.recommendedAction.replace('_', ' ').toUpperCase()}</div>
                          {selectedFlight.alternateRoute && (
                            <div>• Alternate: {selectedFlight.alternateRoute}</div>
                          )}
                          <div>• Monitor crew dose accumulation</div>
                          <div>• Update passengers on space weather conditions</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleRerouteGeneration(selectedFlight.id)}
                          data-testid="button-generate-reroute"
                        >
                          <Route className="w-4 h-4 mr-2" />
                          Generate Reroute
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRadiationCalculation(selectedFlight.id)}
                          data-testid="button-calc-radiation"
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          Recalc Radiation
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid="button-notify-atc"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Notify ATC
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">Select a Flight</h3>
                      <p className="text-muted-foreground">
                        Choose a flight from the list to view detailed information
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Route Visualization</h3>
                  <p className="text-muted-foreground">
                    Interactive map showing flight paths and radiation risk zones
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    todo: Integrate with mapping library (Leaflet/Mapbox)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Advisories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border-l-4 border-l-weather-severe bg-weather-severe/10">
                <div className="font-semibold">POLAR ROUTE ADVISORY</div>
                <div className="text-sm text-muted-foreground">
                  Severe geomagnetic storm conditions. Recommend avoiding polar routes above FL350.
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Valid: {format(new Date(), 'yyyy-MM-dd HH:mm')}Z - {format(addHours(new Date(), 6), 'HH:mm')}Z
                </div>
              </div>
              
              <div className="p-3 border-l-4 border-l-weather-elevated bg-weather-elevated/10">
                <div className="font-semibold">HF RADIO DEGRADATION</div>
                <div className="text-sm text-muted-foreground">
                  Minor radio blackouts affecting HF communications over Pacific Ocean.
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Valid: {format(new Date(), 'yyyy-MM-dd HH:mm')}Z - {format(addHours(new Date(), 3), 'HH:mm')}Z
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 border rounded">
                  <div className="font-mono font-bold">{format(new Date(), 'yyyy-MM-dd')}</div>
                  <div className="text-muted-foreground">
                    Total flights monitored: 1,247 • High risk: 12 • Rerouted: 3
                  </div>
                </div>
                <div className="p-3 border rounded">
                  <div className="font-mono font-bold">{format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')}</div>
                  <div className="text-muted-foreground">
                    Total flights monitored: 1,186 • High risk: 8 • Rerouted: 1
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}