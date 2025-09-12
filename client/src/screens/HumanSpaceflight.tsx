import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Activity, 
  Timer, 
  AlertTriangle, 
  Users,
  Zap,
  Home
} from "lucide-react";
import { format, addMinutes } from "date-fns";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  currentDose: number; // mSv
  dailyLimit: number; // mSv/day
  eva_status: 'inside' | 'planned' | 'active' | 'abort';
}

export default function HumanSpaceflight() {
  const [shelterCountdown, setShelterCountdown] = useState<Date | null>(null);
  const [alertLevel, setAlertLevel] = useState<'normal' | 'elevated' | 'high' | 'severe'>('high');

  // todo: replace with real crew data from API
  const crewMembers: CrewMember[] = [
    {
      id: 'CREW-001',
      name: 'Commander Sarah Chen',
      role: 'Commander',
      currentDose: 0.24,
      dailyLimit: 1.0,
      eva_status: 'inside'
    },
    {
      id: 'CREW-002', 
      name: 'Flight Engineer Mike Rodriguez',
      role: 'Flight Engineer',
      currentDose: 0.31,
      dailyLimit: 1.0,
      eva_status: 'planned'
    },
    {
      id: 'CREW-003',
      name: 'Mission Specialist Dr. Yuki Tanaka',
      role: 'Mission Specialist',
      currentDose: 0.18,
      dailyLimit: 1.0,
      eva_status: 'inside'
    },
    {
      id: 'CREW-004',
      name: 'Pilot Emma Johnson',
      role: 'Pilot',
      currentDose: 0.29,
      dailyLimit: 1.0,
      eva_status: 'inside'
    }
  ];

  const handleShelterProcedure = () => {
    const shelterTime = addMinutes(new Date(), 15);
    setShelterCountdown(shelterTime);
    console.log('Initiating shelter procedure at:', shelterTime);
    // todo: implement real shelter procedure activation
  };

  const handleEvaHold = () => {
    console.log('EVA operations placed on hold due to space weather');
    // todo: implement EVA hold procedure
  };

  const handleEmergencyAlert = () => {
    console.log('Emergency alert sent to Mission Control');
    // todo: implement emergency alert system
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'normal': return 'bg-weather-normal';
      case 'elevated': return 'bg-weather-elevated';
      case 'high': return 'bg-weather-high';
      case 'severe': return 'bg-weather-severe';
      default: return 'bg-muted';
    }
  };

  const getDoseColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage < 50) return 'bg-weather-normal';
    if (percentage < 75) return 'bg-weather-elevated';
    if (percentage < 90) return 'bg-weather-high';
    return 'bg-weather-severe';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Human Spaceflight Console</h1>
          <p className="text-muted-foreground">
            Crew safety monitoring and radiation protection protocols
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleEmergencyAlert}
            data-testid="button-emergency-alert"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency Alert
          </Button>
        </div>
      </div>

      {/* Current Alert Status */}
      <Alert className={`border-l-4 ${getAlertLevelColor(alertLevel).replace('bg-', 'border-l-')}`}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-base font-medium">
          <span className="uppercase">{alertLevel}</span> SPACE WEATHER CONDITIONS
          {alertLevel === 'high' && ' - Enhanced monitoring required'}
          {alertLevel === 'severe' && ' - Shelter procedures may be necessary'}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Left Panel - Emergency Procedures */}
        <div className="space-y-4">
          
          {/* Shelter Procedures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Shelter Procedures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shelterCountdown ? (
                <div className="p-3 bg-weather-severe/20 rounded-lg text-center">
                  <div className="text-lg font-bold">SHELTER ACTIVE</div>
                  <div className="font-mono text-sm">
                    Until: {format(shelterCountdown, 'HH:mm:ss')}Z
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setShelterCountdown(null)}
                  >
                    Cancel Shelter
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleShelterProcedure}
                    data-testid="button-shelter-procedure"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Initiate Shelter
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Moves crew to shielded areas of the spacecraft
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="font-medium">Shelter Locations:</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Central corridor (primary)</li>
                  <li>• Equipment bay (secondary)</li>
                  <li>• Crew quarters (individual)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* EVA Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                EVA Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">EVA Status:</span>
                <Badge variant={
                  crewMembers.some(c => c.eva_status === 'planned') ? 'secondary' :
                  crewMembers.some(c => c.eva_status === 'active') ? 'default' : 'outline'
                }>
                  {crewMembers.some(c => c.eva_status === 'active') ? 'ACTIVE' :
                   crewMembers.some(c => c.eva_status === 'planned') ? 'PLANNED' : 'NONE'}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleEvaHold}
                data-testid="button-eva-hold"
              >
                <Timer className="w-4 h-4 mr-2" />
                Place EVA on Hold
              </Button>

              <div className="text-xs text-muted-foreground">
                Current EVA window: 14:30Z - 20:00Z
              </div>
            </CardContent>
          </Card>

          {/* Mission Control Communication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Mission Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Comm Status:</span>
                  <Badge variant="default">NOMINAL</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Next Pass:</span>
                  <span className="font-mono text-xs">14:23Z</span>
                </div>
                <div className="flex justify-between">
                  <span>Ground Track:</span>
                  <span className="text-xs">Pacific Ocean</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Crew Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Crew Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {crewMembers.map((crew) => (
                <div key={crew.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{crew.name}</div>
                      <div className="text-sm text-muted-foreground">{crew.role}</div>
                    </div>
                    <Badge variant={crew.eva_status === 'active' ? 'destructive' : 
                                  crew.eva_status === 'planned' ? 'secondary' : 'outline'}>
                      {crew.eva_status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Dose Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Daily Dose</span>
                      <span className="font-mono">
                        {crew.currentDose} / {crew.dailyLimit} mSv
                      </span>
                    </div>
                    <Progress 
                      value={(crew.currentDose / crew.dailyLimit) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {((crew.currentDose / crew.dailyLimit) * 100).toFixed(1)}% of daily limit
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Dosimetry & Shielding */}
        <div className="space-y-4">
          
          {/* Live Dosimetry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Live Dosimetry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold font-mono">0.42</div>
                  <div className="text-xs text-muted-foreground">mSv/hr Current</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-mono">2.34</div>
                  <div className="text-xs text-muted-foreground">mSv Total Today</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-mono">18.7</div>
                  <div className="text-xs text-muted-foreground">mSv Mission</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-mono">245</div>
                  <div className="text-xs text-muted-foreground">mSv/yr Limit</div>
                </div>
              </div>

              <div className="p-2 bg-muted rounded text-xs">
                <div className="font-medium">Dosimeter Status</div>
                <div className="text-muted-foreground">
                  All 4 units operational • Last calibration: 2025-09-08
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shielding Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shielding Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Water Shielding:</span>
                  <span className="font-mono">98% Coverage</span>
                </div>
                <div className="flex justify-between">
                  <span>Polyethylene:</span>
                  <span className="font-mono">12.5 g/cm²</span>
                </div>
                <div className="flex justify-between">
                  <span>Aluminum Hull:</span>
                  <span className="font-mono">2.7 g/cm²</span>
                </div>
              </div>

              <div className="p-2 bg-muted rounded text-xs">
                <div className="font-medium">Effectiveness</div>
                <div className="text-muted-foreground">
                  ~40% reduction in GCR exposure in shielded areas
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Home className="w-4 h-4" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Pressure</div>
                  <div className="font-mono">14.7 psi</div>
                </div>
                <div>
                  <div className="text-muted-foreground">O₂ Level</div>
                  <div className="font-mono">21.0%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">CO₂ Level</div>
                  <div className="font-mono">0.3%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Temperature</div>
                  <div className="font-mono">22.1°C</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-weather-normal rounded-full" />
                <span className="text-xs">All systems nominal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Panel - Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {format(new Date(), 'HH:mm:ss')}Z
              </span>
              <span>Space weather alert level elevated to HIGH - enhanced monitoring active</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {format(new Date(Date.now() - 600000), 'HH:mm:ss')}Z
              </span>
              <span>EVA-27 planned for 16:00Z - evaluating radiation conditions</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {format(new Date(Date.now() - 1200000), 'HH:mm:ss')}Z
              </span>
              <span>Daily dosimetry check completed - all crew within limits</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}