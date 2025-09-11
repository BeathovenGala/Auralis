import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Satellite, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Download,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format, subMinutes } from "date-fns";

interface DataSource {
  id: string;
  name: string;
  type: 'satellite' | 'ground' | 'model' | 'archive';
  status: 'online' | 'degraded' | 'offline' | 'maintenance';
  lastUpdate: Date;
  latency: number; // seconds
  sampleRate: number; // Hz or samples per hour
  reliability: number; // percentage
  errors24h: number;
  failoverOptions: string[];
  description: string;
}

export default function DataSources() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // todo: replace with real data source information from API
  const dataSources: DataSource[] = [
    {
      id: 'DSCOVR',
      name: 'DSCOVR L1 Point',
      type: 'satellite',
      status: 'online',
      lastUpdate: subMinutes(new Date(), 2),
      latency: 2.3,
      sampleRate: 60, // 1/min
      reliability: 98.7,
      errors24h: 0,
      failoverOptions: ['ACE'],
      description: 'Solar wind magnetic field and plasma measurements'
    },
    {
      id: 'ACE',
      name: 'Advanced Composition Explorer',
      type: 'satellite', 
      status: 'online',
      lastUpdate: subMinutes(new Date(), 3),
      latency: 3.1,
      sampleRate: 64, // 1/min
      reliability: 96.2,
      errors24h: 1,
      failoverOptions: ['DSCOVR'],
      description: 'Solar wind particles and magnetic field'
    },
    {
      id: 'GOES16',
      name: 'GOES-16 Magnetometer',
      type: 'satellite',
      status: 'degraded', 
      lastUpdate: subMinutes(new Date(), 7),
      latency: 7.2,
      sampleRate: 12, // 5/min
      reliability: 94.1,
      errors24h: 3,
      failoverOptions: ['GOES-18', 'Ground Stations'],
      description: 'Geostationary magnetometer and particle flux'
    },
    {
      id: 'GOES18',
      name: 'GOES-18 Magnetometer',
      type: 'satellite',
      status: 'online',
      lastUpdate: subMinutes(new Date(), 1),
      latency: 1.8,
      sampleRate: 12, // 5/min  
      reliability: 99.1,
      errors24h: 0,
      failoverOptions: ['GOES-16'],
      description: 'Geostationary magnetometer and particle flux'
    },
    {
      id: 'NOAA_SWPC',
      name: 'NOAA Space Weather Prediction Center',
      type: 'ground',
      status: 'online',
      lastUpdate: subMinutes(new Date(), 1),
      latency: 1.2,
      sampleRate: 24, // hourly updates
      reliability: 99.8,
      errors24h: 0,
      failoverOptions: ['BGS', 'Kyoto WDC'],
      description: 'Processed space weather indices and forecasts'
    },
    {
      id: 'BGS',
      name: 'British Geological Survey',
      type: 'ground',
      status: 'online', 
      lastUpdate: subMinutes(new Date(), 4),
      latency: 4.1,
      sampleRate: 60, // 1/min
      reliability: 97.8,
      errors24h: 0,
      failoverOptions: ['Kyoto WDC'],
      description: 'Global magnetometer network'
    },
    {
      id: 'KYOTO_WDC',
      name: 'Kyoto World Data Center',
      type: 'archive',
      status: 'online',
      lastUpdate: subMinutes(new Date(), 15),
      latency: 15.7,
      sampleRate: 4, // 4/hour (15 min)
      reliability: 99.9,
      errors24h: 0,
      failoverOptions: ['BGS'],
      description: 'Historical geomagnetic indices (Kp, Dst, AE)'
    },
    {
      id: 'DONKI',
      name: 'Database of Notifications, Knowledge, Information',
      type: 'archive',
      status: 'maintenance',
      lastUpdate: subMinutes(new Date(), 45),
      latency: 45.0,
      sampleRate: 1, // event-driven
      reliability: 95.2,
      errors24h: 2,
      failoverOptions: ['Manual Entry'],
      description: 'Solar event database and notifications'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-weather-normal';
      case 'degraded': return 'text-weather-elevated';
      case 'offline': return 'text-weather-severe';
      case 'maintenance': return 'text-weather-high';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'degraded': return 'secondary';
      case 'offline': return 'destructive';
      case 'maintenance': return 'outline';
      default: return 'outline';
    }
  };

  const handleForceReIngest = (sourceId: string) => {
    console.log(`Force re-ingesting data from: ${sourceId}`);
    // todo: implement force re-ingest functionality
  };

  const handleTestConnection = (sourceId: string) => {
    console.log(`Testing connection to: ${sourceId}`);
    // todo: implement connection testing
  };

  const selectedSourceData = dataSources.find(s => s.id === selectedSource);

  const onlineSources = dataSources.filter(s => s.status === 'online').length;
  const totalSources = dataSources.length;
  const avgLatency = dataSources.reduce((acc, s) => acc + s.latency, 0) / dataSources.length;
  const totalErrors = dataSources.reduce((acc, s) => acc + s.errors24h, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Sources & Health</h1>
          <p className="text-muted-foreground">
            Monitor data ingestion performance and source reliability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure Sources
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{onlineSources}/{totalSources}</div>
                <p className="text-xs text-muted-foreground">Sources Online</p>
              </div>
              <CheckCircle className="w-4 h-4 text-weather-normal" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold font-mono">{avgLatency.toFixed(1)}s</div>
                <p className="text-xs text-muted-foreground">Average Latency</p>
              </div>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalErrors}</div>
                <p className="text-xs text-muted-foreground">Errors (24h)</p>
              </div>
              {totalErrors > 0 ? 
                <XCircle className="w-4 h-4 text-weather-severe" /> :
                <CheckCircle className="w-4 h-4 text-weather-normal" />
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {(dataSources.reduce((acc, s) => acc + s.reliability, 0) / dataSources.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Average Reliability</p>
              </div>
              <Database className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Source Details</TabsTrigger>
          <TabsTrigger value="health">Health History</TabsTrigger>
          <TabsTrigger value="failover">Failover Config</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {dataSources.map((source) => (
              <Card 
                key={source.id}
                className={`cursor-pointer hover-elevate transition-all duration-200 ${
                  selectedSource === source.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedSource(source.id)}
                data-testid={`source-${source.id.toLowerCase()}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Satellite className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">{source.name}</div>
                          <div className="text-sm text-muted-foreground">{source.description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-mono">
                          {format(source.lastUpdate, 'HH:mm:ss')}Z
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {source.latency}s latency
                        </div>
                      </div>
                      
                      <Badge variant={getStatusBadge(source.status)}>
                        {source.status.toUpperCase()}
                      </Badge>

                      <div className="text-right">
                        <div className="text-sm font-mono">{source.reliability}%</div>
                        <div className="text-xs text-muted-foreground">reliability</div>
                      </div>

                      {source.errors24h > 0 && (
                        <div className="flex items-center gap-1 text-weather-severe">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">{source.errors24h}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Reliability</span>
                      <span>{source.reliability}%</span>
                    </div>
                    <Progress value={source.reliability} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedSourceData ? (
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSourceData.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Type</div>
                      <div className="font-mono capitalize">{selectedSourceData.type}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <Badge variant={getStatusBadge(selectedSourceData.status)}>
                        {selectedSourceData.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sample Rate</div>
                      <div className="font-mono">{selectedSourceData.sampleRate}/min</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Latency</div>
                      <div className="font-mono">{selectedSourceData.latency}s</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Reliability</div>
                      <div className="font-mono">{selectedSourceData.reliability}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">24h Errors</div>
                      <div className="font-mono">{selectedSourceData.errors24h}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Description</div>
                    <div className="text-sm">{selectedSourceData.description}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Failover Options</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSourceData.failoverOptions.map((option) => (
                        <Badge key={option} variant="outline" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => handleForceReIngest(selectedSourceData.id)}
                    data-testid="button-force-reingest"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Force Re-Ingest
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleTestConnection(selectedSourceData.id)}
                    data-testid="button-test-connection"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>

                  <div className="text-xs text-muted-foreground mt-4">
                    Last successful update: {format(selectedSourceData.lastUpdate, 'yyyy-MM-dd HH:mm:ss')}Z
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Select a Data Source</h3>
                  <p className="text-muted-foreground">
                    Choose a source from the overview to view detailed information
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Health Monitoring Charts</h3>
                  <p className="text-muted-foreground">
                    Historical reliability, latency, and error rate trends
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    todo: Integrate with charting library
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failover Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataSources.map((source) => (
                <div key={source.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{source.name}</span>
                    <Badge variant={getStatusBadge(source.status)}>
                      {source.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Failover to: {source.failoverOptions.join(', ')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}