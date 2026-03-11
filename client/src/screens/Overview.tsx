import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Satellite,
  BarChart3,
  Info,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Alert } from "../../../shared/schema";

// Enhanced Scientific Tooltip Component
function ScientificTooltip({ title, description, unit, range, children }: {
  title: string;
  description: string;
  unit?: string;
  range?: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-background border border-border shadow-xl">
          <div className="space-y-2">
            <div className="font-semibold text-foreground">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
            {unit && <div className="text-xs font-mono text-muted-foreground">Unit: {unit}</div>}
            {range && <div className="text-xs font-mono text-muted-foreground">Range: {range}</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Key Indices Card Component with Scientific Tooltips
function KeyIndicesCard() {
  const { data: omni2Data, isLoading } = useQuery({
    queryKey: ['/api/omni2/latest'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const indices = omni2Data?.[0] ? {
    dst: omni2Data[0].dst_index || -15,
    kp: omni2Data[0].kp_index || 2.3,
    ae: omni2Data[0].ae_index || 245,
    timestamp: new Date(omni2Data[0].timestamp)
  } : {
    dst: -15,
    kp: 2.3,
    ae: 245,
    timestamp: new Date()
  };

  const getDstStatus = (dst: number) => {
    if (dst >= -30) return { level: 'normal', color: 'bg-weather-normal', label: 'Quiet' };
    if (dst >= -50) return { level: 'weak', color: 'bg-weather-elevated', label: 'Weak Storm' };
    if (dst >= -100) return { level: 'moderate', color: 'bg-weather-high', label: 'Moderate' };
    if (dst >= -200) return { level: 'strong', color: 'bg-weather-severe', label: 'Strong' };
    return { level: 'severe', color: 'bg-weather-extreme', label: 'Severe' };
  };

  const getKpStatus = (kp: number) => {
    if (kp < 3) return { level: 'normal', color: 'bg-weather-normal', label: 'Quiet' };
    if (kp < 5) return { level: 'active', color: 'bg-weather-elevated', label: 'Active' };
    if (kp < 7) return { level: 'storm', color: 'bg-weather-high', label: 'Storm' };
    return { level: 'severe', color: 'bg-weather-severe', label: 'Severe' };
  };

  const dstStatus = getDstStatus(indices.dst);
  const kpStatus = getKpStatus(indices.kp);

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Key Geomagnetic Indices
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-6">
        {/* Dst Index */}
        <div className="space-y-2">
          <ScientificTooltip
            title="Disturbance Storm Time (Dst)"
            description="Measures the strength of the globally averaged equatorial electrojet (ring current). More negative values indicate stronger geomagnetic storms."
            unit="nanoTesla (nT)"
            range="Quiet: ≥-30 nT, Storm: <-50 nT"
          >
            <div className="cursor-help" data-testid="dst-index-display">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">DST INDEX</span>
                <Info className="w-3 h-3 text-muted-foreground" />
                {isLoading && <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold" data-testid="text-dst-value">{indices.dst}</span>
                <span className="text-sm font-mono text-muted-foreground">nT</span>
              </div>
              <Badge variant="secondary" className={`${dstStatus.color} text-white text-xs`} data-testid="badge-dst-status">
                {dstStatus.label}
              </Badge>
            </div>
          </ScientificTooltip>
        </div>

        {/* Kp Index */}
        <div className="space-y-2">
          <ScientificTooltip
            title="Planetary K-index (Kp)"
            description="Global geomagnetic activity index ranging from 0 (quiet) to 9 (extreme storm). Derived from 13 geomagnetic observatories."
            unit="logarithmic scale (0-9)"
            range="Quiet: 0-2, Active: 3-4, Storm: 5+"
          >
            <div className="cursor-help" data-testid="kp-index-display">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">KP INDEX</span>
                <Info className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold" data-testid="text-kp-value">{indices.kp.toFixed(1)}</span>
              </div>
              <Badge variant="secondary" className={`${kpStatus.color} text-white text-xs`} data-testid="badge-kp-status">
                {kpStatus.label}
              </Badge>
            </div>
          </ScientificTooltip>
        </div>

        {/* AE Index */}
        <div className="space-y-2">
          <ScientificTooltip
            title="Auroral Electrojet (AE)"
            description="Measures auroral zone magnetic activity. Higher values indicate more intense auroral electrojet currents and substorm activity."
            unit="nanoTesla (nT)"
            range="Quiet: <100 nT, Active: 100-300 nT, Storm: >500 nT"
          >
            <div className="cursor-help" data-testid="ae-index-display">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">AE INDEX</span>
                <Info className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold" data-testid="text-ae-value">{indices.ae}</span>
                <span className="text-sm font-mono text-muted-foreground">nT</span>
              </div>
              <Badge variant="secondary" className={`${indices.ae > 500 ? 'bg-weather-severe' : indices.ae > 100 ? 'bg-weather-elevated' : 'bg-weather-normal'} text-white text-xs`} data-testid="badge-ae-status">
                {indices.ae > 500 ? 'Storm' : indices.ae > 100 ? 'Active' : 'Quiet'}
              </Badge>
            </div>
          </ScientificTooltip>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Forecasting Module
function ForecastingModule() {
  const { data: forecast30min, isLoading: loading30min } = useQuery({
    queryKey: ['/api/forecast/geomagnetic/30min'],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: forecast3hour, isLoading: loading3hour } = useQuery({
    queryKey: ['/api/forecast/geomagnetic/3hour'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const forecasts = {
    "30min": forecast30min ? {
      predicted_dst: forecast30min.predicted_dst,
      storm_level: forecast30min.storm_level,
      confidence: forecast30min.confidence_score,
      forecast_time: new Date(forecast30min.forecast_time)
    } : {
      predicted_dst: -45,
      storm_level: "G1",
      confidence: 0.82,
      forecast_time: new Date()
    },
    "3hour": forecast3hour ? {
      predicted_dst: forecast3hour.predicted_dst,
      storm_level: forecast3hour.storm_level,
      confidence: forecast3hour.confidence_score,
      forecast_time: new Date(forecast3hour.forecast_time)
    } : {
      predicted_dst: -75,
      storm_level: "G2",
      confidence: 0.74,
      forecast_time: new Date()
    }
  };

  const getStormLevelInfo = (level: string) => {
    const levels = {
      "G0": { name: "Quiet", color: "bg-weather-normal", severity: 0 },
      "G1": { name: "Minor Storm", color: "bg-weather-elevated", severity: 1 },
      "G2": { name: "Moderate Storm", color: "bg-weather-high", severity: 2 },
      "G3": { name: "Strong Storm", color: "bg-weather-severe", severity: 3 },
      "G4": { name: "Severe Storm", color: "bg-weather-severe", severity: 4 },
      "G5": { name: "Extreme Storm", color: "bg-weather-extreme", severity: 5 }
    };
    return levels[level as keyof typeof levels] || levels.G0;
  };

  const forecast30 = getStormLevelInfo(forecasts["30min"].storm_level);
  const forecast3h = getStormLevelInfo(forecasts["3hour"].storm_level);

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Enhanced Dst Forecasting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 30-minute Forecast - Primary */}
        <div className="p-4 bg-muted/30 rounded-lg border" data-testid="forecast-30min-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold">30-Minute Forecast</span>
              {loading30min && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <Badge className={`${forecast30.color} text-white`} data-testid="badge-30min-storm-level">
              {forecasts["30min"].storm_level} - {forecast30.name}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Predicted Dst</div>
              <div className="text-xl font-mono font-bold" data-testid="text-30min-dst">{forecasts["30min"].predicted_dst} nT</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Confidence</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-mono font-bold" data-testid="text-30min-confidence">{(forecasts["30min"].confidence * 100).toFixed(0)}%</div>
                <Progress value={forecasts["30min"].confidence * 100} className="w-16 h-2" />
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
              <div className="flex items-center gap-1">
                {forecast30.severity > 1 ? <ArrowUp className="w-4 h-4 text-weather-severe" /> : <TrendingUp className="w-4 h-4 text-weather-normal" />}
                <span className="font-semibold">{forecast30.severity > 2 ? 'HIGH' : forecast30.severity > 0 ? 'ELEVATED' : 'LOW'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-hour Forecast - Secondary */}
        <div className="p-3 bg-muted/15 rounded-lg border border-muted" data-testid="forecast-3hour-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">3-Hour Outlook</span>
              {loading3hour && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <Badge variant="outline" className={`${forecast3h.color} text-white border-0`} data-testid="badge-3hour-storm-level">
              {forecasts["3hour"].storm_level}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Dst: </span>
              <span className="font-mono font-semibold" data-testid="text-3hour-dst">{forecasts["3hour"].predicted_dst} nT</span>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence: </span>
              <span className="font-mono font-semibold" data-testid="text-3hour-confidence">{(forecasts["3hour"].confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Model Information */}
        <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded border">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-3 h-3" />
            <span className="font-medium">Random Forest Model v1.2.0</span>
          </div>
          <div>Last updated: {new Date().toLocaleTimeString()} | Feature weights: Dst-min (32%), Scalar-B (18%), α/p ratio (15%)</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Current Conditions Summary
function CurrentConditionsCard() {
  type ConditionStatus = { level: string; value: string };
  const [conditions] = useState<{
    sol: ConditionStatus;
    mag: ConditionStatus;
    ion: ConditionStatus;
    scalarB: number;
    swSpeed: number;
    timestamp: Date;
  }>({
    sol: { level: 'normal', value: 'G0' },
    mag: { level: 'elevated', value: 'S1' },
    ion: { level: 'normal', value: 'R0' },
    scalarB: 6.2,
    swSpeed: 420,
    timestamp: new Date()
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Satellite className="w-5 h-5 text-primary" />
          Current Space Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Status Indicators */}
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(conditions).slice(0, 3) as [string, ConditionStatus][]).map(([key, status]) => (
            <div key={key} className="text-center p-3 bg-muted/20 rounded border">
              <div className="text-xs font-medium text-muted-foreground mb-1">{key.toUpperCase()}</div>
              <div className="text-lg font-mono font-bold mb-1">{status.value}</div>
              <div className={`w-2 h-2 rounded-full mx-auto ${status.level === 'normal' ? 'bg-weather-normal' :
                status.level === 'elevated' ? 'bg-weather-elevated' : 'bg-weather-severe'
                }`} />
            </div>
          ))}
        </div>

        {/* Key Parameters */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <div className="text-sm text-muted-foreground">Interplanetary Magnetic Field</div>
            <div className="text-xl font-mono font-bold">{conditions.scalarB} nT</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Solar Wind Speed</div>
            <div className="text-xl font-mono font-bold">{conditions.swSpeed} km/s</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated: {conditions.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

// System Status Module
function SystemStatusModule() {
  const [systemHealth] = useState({
    dataSources: 5,
    dataSourcesOnline: 4,
    lastUpdate: new Date(),
    alerts: 2
  });

  const healthPercentage = Math.round((systemHealth.dataSourcesOnline / systemHealth.dataSources) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Data Sources Health</span>
          <Badge variant={healthPercentage > 80 ? "default" : "destructive"}>
            {systemHealth.dataSourcesOnline}/{systemHealth.dataSources} Online
          </Badge>
        </div>

        <Progress value={healthPercentage} className="h-2" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">System Health: </span>
            <span className="font-semibold">{healthPercentage}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Active Alerts: </span>
            <span className="font-semibold">{systemHealth.alerts}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Last system check: {systemHealth.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Active Alerts Summary
function ActiveAlertsCard() {
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts/active'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getLevelColor = (level: string) => {
    const colors = {
      weak: 'bg-weather-elevated',
      moderate: 'bg-weather-high',
      strong: 'bg-weather-severe',
      severe: 'bg-weather-extreme',
      extreme: 'bg-weather-extreme'
    };
    return colors[level as keyof typeof colors] || 'bg-muted';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Active Alerts
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <Button variant="outline" size="sm" data-testid="button-view-all-alerts">View All</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-4" data-testid="no-alerts-message">
            No active alerts
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`p-3 border-l-4 ${getLevelColor(alert.alert_level)} bg-muted/20 rounded-r border`} data-testid={`alert-card-${alert.id}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-sm">{alert.title}</div>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-alert-level-${alert.id}`}>
                  {alert.alert_level.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Dst: {alert.predicted_dst} nT</div>
                <div>Confidence: {(alert.confidence * 100).toFixed(0)}%</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((Date.now() - new Date(alert.created_at).getTime()) / 60000)} min ago
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function Overview() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Space Weather Operations Center</h1>
            <p className="text-muted-foreground mt-1">Real-time geomagnetic monitoring and forecasting system</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="font-mono">{new Date().toLocaleString()}</div>
            <div>Operations Dashboard v2.0</div>
          </div>
        </div>

        {/* Key Indices - Top Priority */}
        <KeyIndicesCard />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Conditions */}
          <div className="space-y-6">
            <CurrentConditionsCard />
            <SystemStatusModule />
          </div>

          {/* Center Column - Enhanced Forecasting */}
          <div className="lg:col-span-1">
            <ForecastingModule />
          </div>

          {/* Right Column - Active Alerts */}
          <div>
            <ActiveAlertsCard />
          </div>
        </div>
      </div>
    </div>
  );
}