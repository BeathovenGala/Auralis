import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  Download,
  BarChart3,
  Zap
} from "lucide-react";
import { format, subHours } from "date-fns";

interface ModelMetric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface TrainingRun {
  id: string;
  timestamp: Date;
  duration: number; // minutes
  samples: number;
  performance: number;
  status: 'completed' | 'failed' | 'running';
}

export default function ModelTraining() {
  const [activeTab, setActiveTab] = useState("metrics");
  const [retrainStatus, setRetrainStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  // todo: replace with real model metrics from API
  const modelMetrics: ModelMetric[] = [
    {
      name: 'Brier Score',
      value: 0.12,
      target: 0.15,
      trend: 'down',
      description: 'Lower is better - measures forecast accuracy'
    },
    {
      name: 'ROC AUC',
      value: 0.87,
      target: 0.80,
      trend: 'up', 
      description: 'Higher is better - discrimination ability'
    },
    {
      name: 'Calibration Error',
      value: 0.08,
      target: 0.10,
      trend: 'stable',
      description: 'Lower is better - forecast reliability'
    },
    {
      name: 'Precision@k',
      value: 0.74,
      target: 0.70,
      trend: 'up',
      description: 'Precision for top-k predictions'
    }
  ];

  const trainingHistory: TrainingRun[] = [
    {
      id: 'RUN-001',
      timestamp: subHours(new Date(), 6),
      duration: 43,
      samples: 12847,
      performance: 0.87,
      status: 'completed'
    },
    {
      id: 'RUN-002',
      timestamp: subHours(new Date(), 30),
      duration: 51,
      samples: 12201,
      performance: 0.84,
      status: 'completed'
    },
    {
      id: 'RUN-003',
      timestamp: subHours(new Date(), 72),
      duration: 38,
      samples: 11956,
      performance: 0.82,
      status: 'completed'
    }
  ];

  const lastRetrain = trainingHistory[0];
  const datasetStats = {
    totalSamples: 128472,
    classBalance: {
      normal: 0.76,
      elevated: 0.15,
      high: 0.07,
      severe: 0.02
    },
    timeRange: '2019-01-01 to 2025-09-12',
    updateFrequency: 'Daily'
  };

  const driftIndicators = [
    { feature: 'Solar Wind Speed', drift: 0.023, threshold: 0.05, status: 'normal' },
    { feature: 'IMF Bz', drift: 0.041, threshold: 0.05, status: 'warning' },
    { feature: 'Dst Index', drift: 0.012, threshold: 0.05, status: 'normal' },
    { feature: 'Kp Index', drift: 0.067, threshold: 0.05, status: 'critical' }
  ];

  const handleRetrain = () => {
    setRetrainStatus('running');
    console.log('Starting model retrain process');
    // todo: implement real model retraining with guardrails
    
    // Simulate training progress
    setTimeout(() => {
      setRetrainStatus('completed');
      console.log('Model retrain completed');
    }, 5000);
  };

  const handleDownloadModel = () => {
    console.log('Downloading model artifacts');
    // todo: implement model download functionality
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-weather-normal" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-weather-severe rotate-180" />;
      default: return <div className="w-3 h-3 bg-muted-foreground rounded-full" />;
    }
  };

  const getDriftColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-weather-normal';
      case 'warning': return 'text-weather-elevated';
      case 'critical': return 'text-weather-severe';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Model & Training</h1>
          <p className="text-muted-foreground">
            ML model performance monitoring and retraining management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadModel}>
            <Download className="w-4 h-4 mr-2" />
            Download Model
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleRetrain}
            disabled={retrainStatus === 'running'}
            data-testid="button-retrain-model"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${retrainStatus === 'running' ? 'animate-spin' : ''}`} />
            {retrainStatus === 'running' ? 'Retraining...' : 'Retrain Model'}
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {driftIndicators.some(d => d.status === 'critical') && (
        <Alert className="border-l-4 border-l-weather-severe">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Model Drift Detected:</strong> Critical drift in Kp Index feature. 
            Consider retraining the model to maintain accuracy.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold font-mono">
                  {format(lastRetrain.timestamp, 'MMM dd')}
                </div>
                <p className="text-xs text-muted-foreground">Last Retrain</p>
              </div>
              <Brain className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold font-mono">{lastRetrain.performance}</div>
                <p className="text-xs text-muted-foreground">Model ROC AUC</p>
              </div>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{datasetStats.totalSamples.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Training Samples</p>
              </div>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {driftIndicators.filter(d => d.status === 'critical').length}
                </div>
                <p className="text-xs text-muted-foreground">Critical Drift</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-weather-severe" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="drift">Model Drift</TabsTrigger>
          <TabsTrigger value="training">Training History</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {modelMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {metric.name}
                    {getTrendIcon(metric.trend)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold font-mono">{metric.value}</span>
                      <Badge variant={metric.value >= metric.target ? 'default' : 'secondary'}>
                        Target: {metric.target}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Performance</span>
                        <span>{((metric.value / metric.target) * 100).toFixed(0)}% of target</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (metric.value / metric.target) * 100)}
                        className="h-2"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drift" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Drift Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driftIndicators.map((indicator) => (
                  <div key={indicator.feature} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        indicator.status === 'normal' ? 'bg-weather-normal' :
                        indicator.status === 'warning' ? 'bg-weather-elevated' : 'bg-weather-severe'
                      }`} />
                      <span className="font-medium">{indicator.feature}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono text-sm">{indicator.drift.toFixed(3)}</div>
                        <div className="text-xs text-muted-foreground">drift score</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-mono text-sm">{indicator.threshold}</div>
                        <div className="text-xs text-muted-foreground">threshold</div>
                      </div>

                      <Badge variant={
                        indicator.status === 'normal' ? 'default' :
                        indicator.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {indicator.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Drift Detection Info</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Drift scores calculated using Kolmogorov-Smirnov test</div>
                  <div>• Scores &gt; 0.05 indicate significant distribution changes</div>
                  <div>• Critical drift may require model retraining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            
            {/* Training History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Training Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingHistory.map((run) => (
                    <div key={run.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm">{run.id}</span>
                        <Badge variant={run.status === 'completed' ? 'default' : 'destructive'}>
                          {run.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-muted-foreground">Timestamp</div>
                          <div className="font-mono">{format(run.timestamp, 'MMM dd HH:mm')}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Duration</div>
                          <div className="font-mono">{run.duration}m</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Samples</div>
                          <div className="font-mono">{run.samples.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Performance</div>
                          <div className="font-mono">{run.performance}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dataset Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Dataset Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Samples</div>
                    <div className="font-mono font-bold">{datasetStats.totalSamples.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Time Range</div>
                    <div className="text-xs">{datasetStats.timeRange}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Class Balance</div>
                  <div className="space-y-2">
                    {Object.entries(datasetStats.classBalance).map(([className, percentage]) => (
                      <div key={className} className="flex items-center justify-between">
                        <span className="text-xs capitalize">{className}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div 
                              className="h-1.5 bg-primary rounded-full"
                              style={{ width: `${percentage * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono w-8">
                            {(percentage * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-muted rounded text-xs">
                  <div className="font-medium">Update Schedule</div>
                  <div className="text-muted-foreground">
                    {datasetStats.updateFrequency} automatic updates with new space weather data
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance (SHAP Values)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Feature Importance Visualization</h3>
                  <p className="text-muted-foreground">
                    SHAP feature importance and model explainability charts
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    todo: Integrate with D3.js or Plotly for interactive visualizations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Retrain Status */}
      {retrainStatus === 'running' && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-5 h-5 animate-spin text-primary" />
              <div>
                <div className="font-medium">Model Retraining in Progress</div>
                <div className="text-sm text-muted-foreground">
                  Processing {datasetStats.totalSamples.toLocaleString()} samples...
                </div>
              </div>
            </div>
            <Progress value={65} className="mt-3" />
          </CardContent>
        </Card>
      )}

      {retrainStatus === 'completed' && (
        <Card className="border-l-4 border-l-weather-normal">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-5 h-5 text-weather-normal" />
              <div>
                <div className="font-medium">Model Retrain Completed Successfully</div>
                <div className="text-sm text-muted-foreground">
                  New model performance: ROC AUC 0.89 (+2.3% improvement)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}