import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Maximize2,
  Download,
  Settings,
  Layers
} from "lucide-react";
import Globe3D from "@/components/Globe3D";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import { format, subHours, addHours } from "date-fns";

export default function Visualize() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSlider, setTimeSlider] = useState([0]);
  const [selectedLayers, setSelectedLayers] = useState(['satellites', 'magnetometers', 'grid']);
  const [chartTimeRange, setChartTimeRange] = useState('24h');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausing' : 'Playing', 'visualization timeline');
  };

  const handleTimeJump = (direction: 'back' | 'forward') => {
    const step = 1; // 1 hour
    if (direction === 'back') {
      setTimeSlider(prev => [Math.min(prev[0] + step, 72)]);
    } else {
      setTimeSlider(prev => [Math.max(prev[0] - step, -24)]);
    }
  };

  const handleReset = () => {
    setTimeSlider([0]);
    setIsPlaying(false);
    console.log('Reset to current time');
  };

  const handleExportData = () => {
    console.log('Exporting visualization data');
  };

  const currentTime = new Date();
  const visualizationTime = addHours(currentTime, -timeSlider[0]);

  const layerOptions = [
    { id: 'satellites', label: 'Satellites', color: 'bg-blue-500' },
    { id: 'magnetometers', label: 'Magnetometer Stations', color: 'bg-green-500' },
    { id: 'grid', label: 'Power Grid Nodes', color: 'bg-yellow-500' },
    { id: 'flights', label: 'Flight Paths', color: 'bg-purple-500' },
    { id: 'aurora', label: 'Aurora Zones', color: 'bg-red-500' },
    { id: 'radiation', label: 'Radiation Belts', color: 'bg-orange-500' },
  ];

  const toggleLayer = (layerId: string) => {
    setSelectedLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visualization Center</h1>
          <p className="text-muted-foreground">
            Interactive globe and synchronized time series analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            View Settings
          </Button>
        </div>
      </div>

      {/* Main Visualization Layout */}
      <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        
        {/* Globe Panel - 3 columns */}
        <div className="col-span-3 space-y-4">
          
          {/* Globe Container */}
          <Card className="flex-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Global Visualization
                  <Badge variant="outline" className="font-mono text-xs">
                    {format(visualizationTime, 'yyyy-MM-dd HH:mm')}Z
                  </Badge>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Globe3D className="h-full" />
            </CardContent>
          </Card>

          {/* Time Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                
                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleTimeJump('back')}
                    data-testid="button-time-back"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePlayPause}
                    data-testid="button-play-pause-viz"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleTimeJump('forward')}
                    data-testid="button-time-forward"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    data-testid="button-reset-time"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Time Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Control</span>
                    <span className="font-mono">
                      {timeSlider[0] === 0 ? 'Current Time' : 
                       timeSlider[0] > 0 ? `T-${timeSlider[0]}h` : `T+${Math.abs(timeSlider[0])}h`}
                    </span>
                  </div>
                  <Slider
                    value={timeSlider}
                    onValueChange={setTimeSlider}
                    max={72}
                    min={-24}
                    step={0.25}
                    className="w-full"
                    data-testid="slider-time-control"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>+72h (Future)</span>
                    <span>Now</span>
                    <span>-24h (Past)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Controls & Layers */}
        <div className="space-y-4">
          
          {/* Layer Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Display Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {layerOptions.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                    <span className="text-sm">{layer.label}</span>
                  </div>
                  <Button
                    variant={selectedLayers.includes(layer.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer(layer.id)}
                    data-testid={`toggle-layer-${layer.id}`}
                  >
                    {selectedLayers.includes(layer.id) ? 'On' : 'Off'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-2">
                <div className="p-2 bg-weather-elevated/20 rounded">
                  <div className="font-medium">Aurora Activity</div>
                  <div className="text-xs text-muted-foreground">Northern Canada, Scandinavia</div>
                </div>
                <div className="p-2 bg-weather-high/20 rounded">
                  <div className="font-medium">Grid Instability</div>
                  <div className="text-xs text-muted-foreground">Northeast US, Ontario</div>
                </div>
                <div className="p-2 bg-weather-elevated/20 rounded">
                  <div className="font-medium">HF Radio Blackout</div>
                  <div className="text-xs text-muted-foreground">Pacific Ocean</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Satellites</span>
                  <span className="font-mono">847/851</span>
                </div>
                <div className="flex justify-between">
                  <span>Mag Stations</span>
                  <span className="font-mono">156/162</span>
                </div>
                <div className="flex justify-between">
                  <span>Grid Nodes</span>
                  <span className="font-mono">1,247/1,251</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Flights</span>
                  <span className="font-mono">2,841</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Synchronized Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Synchronized Time Series</CardTitle>
            <div className="flex items-center gap-2">
              <Tabs value={chartTimeRange} onValueChange={setChartTimeRange}>
                <TabsList>
                  <TabsTrigger value="6h">6h</TabsTrigger>
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="72h">72h</TabsTrigger>
                  <TabsTrigger value="7d">7d</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <TimeSeriesChart
              title="IMF Bz Component"
              parameter="bz"
              unit="nT"
              syncCursor={true}
              thresholds={[
                { value: -5, label: 'Warning', color: '#f59e0b' },
                { value: -10, label: 'Alert', color: '#ef4444' },
              ]}
            />
            <TimeSeriesChart
              title="Solar Wind Speed"
              parameter="solar_wind_speed"
              unit="km/s"
              syncCursor={true}
            />
            <TimeSeriesChart
              title="Dst Index"
              parameter="dst"
              unit="nT"
              syncCursor={true}
              thresholds={[
                { value: -50, label: 'Minor Storm', color: '#f59e0b' },
                { value: -100, label: 'Moderate Storm', color: '#ef4444' },
              ]}
            />
            <TimeSeriesChart
              title="Kp Index"
              parameter="kp"
              unit=""
              syncCursor={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}