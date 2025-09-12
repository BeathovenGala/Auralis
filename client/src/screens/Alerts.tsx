import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar, Download } from "lucide-react";
import AlertCard from "@/components/AlertCard";
import { addHours, subHours, format } from "date-fns";

export default function Alerts() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // todo: replace with real alert data from API
  const mockActiveAlerts = [
    {
      id: "A20250912T0012Z_0001",
      level: 'WARNING' as const,
      tier: 'imminent' as const,
      title: "Severe Geomagnetic Storm (G3)",
      description: "Sustained Bz < -10 nT for 15 minutes. Dst dropping rapidly. Grid operators should prepare for voltage irregularities.",
      timestamp: new Date(Date.now() - 300000),
      expiresAt: addHours(new Date(), 6),
      sources: ['DSCOVR', 'ACE', 'GOES'],
      confidence: 0.92,
      impactedAssets: ['Power Grid NE', 'GPS Network', 'HF Comms', 'Satellites LEO'],
      acknowledged: false
    },
    {
      id: "A20250912T0008Z_0002",
      level: 'ADVISORY' as const,
      tier: 'strategic' as const,
      title: "Solar Radiation Storm Forecast (S2)",
      description: "ML model predicts 78% probability of S2+ event within 3 hours based on solar flare activity.",
      timestamp: new Date(Date.now() - 600000),
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
      timestamp: new Date(Date.now() - 900000),
      sources: ['GOES', 'NOAA'],
      confidence: 0.45,
      impactedAssets: ['HF Radio'],
      acknowledged: true
    }
  ];

  const mockHistoryAlerts = [
    ...mockActiveAlerts,
    {
      id: "A20250911T2145Z_0004",
      level: 'WARNING' as const,
      tier: 'imminent' as const,
      title: "Moderate Geomagnetic Storm (G2)",
      description: "Storm conditions resolved. All systems nominal.",
      timestamp: subHours(new Date(), 8),
      expiresAt: subHours(new Date(), 2),
      sources: ['DSCOVR', 'ACE'],
      confidence: 0.95,
      impactedAssets: ['Power Grid', 'GPS'],
      acknowledged: true
    }
  ];

  const handleAlertAction = (alertId: string, action: string) => {
    console.log(`${action} alert:`, alertId);
    // todo: implement real alert action API calls
  };

  const filteredAlerts = (alerts: typeof mockActiveAlerts) => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           alert.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === "all" || alert.level === levelFilter;
      const matchesSource = sourceFilter === "all" || alert.sources.includes(sourceFilter);
      
      return matchesSearch && matchesLevel && matchesSource;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage space weather alerts and operator actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                data-testid="input-search-alerts"
              />
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40" data-testid="select-level-filter">
                <SelectValue placeholder="Alert Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="WATCH">Watch</SelectItem>
                <SelectItem value="ADVISORY">Advisory</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40" data-testid="select-source-filter">
                <SelectValue placeholder="Data Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="DSCOVR">DSCOVR</SelectItem>
                <SelectItem value="ACE">ACE</SelectItem>
                <SelectItem value="GOES">GOES</SelectItem>
                <SelectItem value="NOAA">NOAA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" data-testid="tab-active-alerts">
            Active Alerts
            <Badge variant="destructive" className="ml-2">
              {filteredAlerts(mockActiveAlerts.filter(a => !a.acknowledged)).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-alert-history">
            Alert History
            <Badge variant="outline" className="ml-2">
              {filteredAlerts(mockHistoryAlerts).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {filteredAlerts(mockActiveAlerts).length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No active alerts</h3>
                    <p className="text-muted-foreground">All systems nominal</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts(mockActiveAlerts).map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={(id) => handleAlertAction(id, 'acknowledge')}
                  onEscalate={(id) => handleAlertAction(id, 'escalate')}
                  onRunPlaybook={(id) => handleAlertAction(id, 'run_playbook')}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {filteredAlerts(mockHistoryAlerts).map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={(id) => handleAlertAction(id, 'acknowledge')}
                onEscalate={(id) => handleAlertAction(id, 'escalate')}
                onRunPlaybook={(id) => handleAlertAction(id, 'run_playbook')}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockActiveAlerts.filter(a => !a.acknowledged).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockActiveAlerts.filter(a => a.level === 'WARNING').length}
            </div>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round(mockActiveAlerts.reduce((acc, a) => acc + a.confidence, 0) / mockActiveAlerts.length * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {format(new Date(), 'HH:mm')}Z
            </div>
            <p className="text-xs text-muted-foreground">Last Update</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}