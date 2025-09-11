import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Satellite,
  Plane
} from "lucide-react";
import { format, addMinutes } from "date-fns";

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // minutes
  required: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

interface Playbook {
  id: string;
  title: string;
  persona: 'grid' | 'satellite' | 'aviation' | 'spaceflight' | 'general';
  description: string;
  estimatedDuration: number; // minutes
  requiredApprovals: string[];
  automationEndpoint?: string;
  steps: PlaybookStep[];
  lastUsed?: Date;
  usageCount: number;
}

export default function Playbooks() {
  const [activeTab, setActiveTab] = useState("grid");
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [runningPlaybook, setRunningPlaybook] = useState<string | null>(null);

  // todo: replace with real playbook data from API
  const playbooks: Playbook[] = [
    {
      id: 'GRID-001',
      title: 'Severe Geomagnetic Storm Response',
      persona: 'grid',
      description: 'Protect critical grid infrastructure during G3+ storms',
      estimatedDuration: 45,
      requiredApprovals: ['Grid Operations Manager'],
      automationEndpoint: '/api/v1/playbooks/grid-storm-response/run',
      usageCount: 12,
      lastUsed: new Date(Date.now() - 86400000),
      steps: [
        {
          id: 'STEP-001',
          title: 'Alert all grid operators',
          description: 'Send immediate notifications to all regional grid control centers',
          estimatedTime: 5,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-002', 
          title: 'Isolate vulnerable transformers',
          description: 'Disconnect high-voltage transformers in northern latitudes',
          estimatedTime: 15,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-003',
          title: 'Enable GIC monitoring',
          description: 'Activate real-time geomagnetically induced current monitoring',
          estimatedTime: 10,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-004',
          title: 'Prepare backup generation',
          description: 'Bring standby generators online for critical loads',
          estimatedTime: 15,
          required: false,
          status: 'pending'
        }
      ]
    },
    {
      id: 'SAT-001',
      title: 'Satellite Safe Mode Activation',
      persona: 'satellite',
      description: 'Emergency safe mode procedures for radiation storms',
      estimatedDuration: 30,
      requiredApprovals: ['Mission Director', 'Flight Dynamics Officer'],
      automationEndpoint: '/api/v1/playbooks/satellite-safe-mode/run',
      usageCount: 8,
      lastUsed: new Date(Date.now() - 172800000),
      steps: [
        {
          id: 'STEP-101',
          title: 'Assess radiation environment',
          description: 'Evaluate current and predicted particle flux levels',
          estimatedTime: 5,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-102',
          title: 'Initiate safe mode commands',
          description: 'Send safe mode commands to all vulnerable satellites',
          estimatedTime: 10,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-103',
          title: 'Verify telemetry response',
          description: 'Confirm all satellites have entered safe mode successfully',
          estimatedTime: 15,
          required: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'AVN-001',
      title: 'Polar Route Rerouting',
      persona: 'aviation',
      description: 'Reroute flights away from polar regions during radiation events',
      estimatedDuration: 20,
      requiredApprovals: ['ATC Supervisor'],
      automationEndpoint: '/api/v1/playbooks/aviation-reroute/run',
      usageCount: 15,
      lastUsed: new Date(Date.now() - 43200000),
      steps: [
        {
          id: 'STEP-201',
          title: 'Identify affected flights',
          description: 'List all flights on polar routes in next 6 hours',
          estimatedTime: 5,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-202',
          title: 'Calculate alternate routes',
          description: 'Generate southern route alternatives with fuel considerations',
          estimatedTime: 10,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-203',
          title: 'Coordinate with ATC',
          description: 'Submit route changes to air traffic control centers',
          estimatedTime: 5,
          required: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'HSF-001',
      title: 'ISS Shelter Procedures',
      persona: 'spaceflight',
      description: 'Crew shelter protocols for solar radiation events',
      estimatedDuration: 60,
      requiredApprovals: ['Flight Director', 'Crew Surgeon'],
      usageCount: 3,
      lastUsed: new Date(Date.now() - 604800000),
      steps: [
        {
          id: 'STEP-301',
          title: 'Alert crew of radiation event',
          description: 'Immediate communication to ISS crew about incoming radiation',
          estimatedTime: 5,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-302',
          title: 'Initiate shelter protocol',
          description: 'Move crew to most shielded areas of the station',
          estimatedTime: 15,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-303',
          title: 'Cancel EVA operations',
          description: 'Postpone all extravehicular activities until all-clear',
          estimatedTime: 10,
          required: true,
          status: 'pending'
        },
        {
          id: 'STEP-304',
          title: 'Monitor crew dosimetry',
          description: 'Continuous monitoring of crew radiation exposure',
          estimatedTime: 30,
          required: true,
          status: 'pending'
        }
      ]
    }
  ];

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case 'grid': return Zap;
      case 'satellite': return Satellite;
      case 'aviation': return Plane;
      case 'spaceflight': return Users;
      default: return BookOpen;
    }
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'grid': return 'bg-blue-500';
      case 'satellite': return 'bg-green-500';
      case 'aviation': return 'bg-purple-500';
      case 'spaceflight': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  const handleRunPlaybook = (playbookId: string) => {
    setRunningPlaybook(playbookId);
    console.log(`Starting playbook execution: ${playbookId}`);
    // todo: implement real playbook execution with automation
    
    // Simulate playbook execution
    setTimeout(() => {
      setRunningPlaybook(null);
      console.log(`Playbook ${playbookId} completed`);
    }, 3000);
  };

  const filteredPlaybooks = playbooks.filter(p => 
    activeTab === 'all' || p.persona === activeTab
  );

  const selectedPlaybookData = playbooks.find(p => p.id === selectedPlaybook);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Playbooks & Runbooks</h1>
          <p className="text-muted-foreground">
            Standardized response procedures for space weather events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Create Playbook
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Playbooks</TabsTrigger>
          <TabsTrigger value="grid">Grid Operations</TabsTrigger>
          <TabsTrigger value="satellite">Satellite Ops</TabsTrigger>
          <TabsTrigger value="aviation">Aviation</TabsTrigger>
          <TabsTrigger value="spaceflight">Human Spaceflight</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            
            {/* Playbook List */}
            <div className="space-y-4">
              {filteredPlaybooks.map((playbook) => {
                const Icon = getPersonaIcon(playbook.persona);
                return (
                  <Card 
                    key={playbook.id}
                    className={`cursor-pointer hover-elevate transition-all duration-200 ${
                      selectedPlaybook === playbook.id ? 'border-primary bg-muted/50' : ''
                    }`}
                    onClick={() => setSelectedPlaybook(playbook.id)}
                    data-testid={`playbook-${playbook.id.toLowerCase()}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getPersonaColor(playbook.persona)}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{playbook.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {playbook.description}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {playbook.estimatedDuration}m
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Used {playbook.usageCount}x
                            </Badge>
                          </div>

                          {playbook.requiredApprovals.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Requires: {playbook.requiredApprovals.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Playbook Details */}
            <div className="col-span-2">
              {selectedPlaybookData ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {(() => {
                          const Icon = getPersonaIcon(selectedPlaybookData.persona);
                          return <Icon className="w-5 h-5" />;
                        })()}
                          {selectedPlaybookData.title}
                        </CardTitle>
                        <Button 
                          onClick={() => handleRunPlaybook(selectedPlaybookData.id)}
                          disabled={runningPlaybook === selectedPlaybookData.id}
                          data-testid="button-run-playbook"
                        >
                          <Play className={`w-4 h-4 mr-2 ${runningPlaybook === selectedPlaybookData.id ? 'animate-pulse' : ''}`} />
                          {runningPlaybook === selectedPlaybookData.id ? 'Running...' : 'Run Playbook'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">{selectedPlaybookData.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Estimated Duration</div>
                            <div className="font-mono">{selectedPlaybookData.estimatedDuration} minutes</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Required Approvals</div>
                            <div>{selectedPlaybookData.requiredApprovals.join(', ')}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Usage Count</div>
                            <div className="font-mono">{selectedPlaybookData.usageCount} times</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Last Used</div>
                            <div className="font-mono">
                              {selectedPlaybookData.lastUsed ? 
                                format(selectedPlaybookData.lastUsed, 'MMM dd, yyyy') : 
                                'Never'
                              }
                            </div>
                          </div>
                        </div>

                        {selectedPlaybookData.automationEndpoint && (
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm font-medium">Automation Available</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {selectedPlaybookData.automationEndpoint}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Playbook Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Execution Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPlaybookData.steps.map((step, index) => (
                          <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {index + 1}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{step.title}</div>
                                <div className="flex items-center gap-2">
                                  {step.required && (
                                    <AlertTriangle className="w-3 h-3 text-weather-severe" />
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {step.estimatedTime}m
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-sm text-muted-foreground mt-1">
                                {step.description}
                              </div>

                              {step.required && (
                                <div className="text-xs text-weather-severe mt-1">
                                  Required Step
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium">Total Estimated Time</div>
                        <div className="text-lg font-bold">
                          {selectedPlaybookData.steps.reduce((acc, step) => acc + step.estimatedTime, 0)} minutes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">Select a Playbook</h3>
                      <p className="text-muted-foreground">
                        Choose a playbook from the list to view execution steps
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Execution Status */}
      {runningPlaybook && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Play className="w-5 h-5 animate-pulse text-primary" />
              <div>
                <div className="font-medium">Playbook Execution in Progress</div>
                <div className="text-sm text-muted-foreground">
                  Running: {playbooks.find(p => p.id === runningPlaybook)?.title}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}