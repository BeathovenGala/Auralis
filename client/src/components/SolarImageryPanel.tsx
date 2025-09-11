import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Maximize2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subHours } from "date-fns";

interface SolarImageryPanelProps {
  className?: string;
}

const wavelengths = [
  { value: '94', name: 'AIA 94Å', color: 'from-green-900 to-green-400' },
  { value: '131', name: 'AIA 131Å', color: 'from-orange-900 to-orange-400' },
  { value: '171', name: 'AIA 171Å', color: 'from-yellow-900 to-yellow-400' },
  { value: '193', name: 'AIA 193Å', color: 'from-blue-900 to-blue-400' },
  { value: '211', name: 'AIA 211Å', color: 'from-purple-900 to-purple-400' },
  { value: '304', name: 'AIA 304Å', color: 'from-red-900 to-red-400' },
];

export default function SolarImageryPanel({ className }: SolarImageryPanelProps) {
  const [selectedWavelength, setSelectedWavelength] = useState('171');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSlider, setTimeSlider] = useState([0]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentTime = new Date();
  const imageTime = subHours(currentTime, timeSlider[0]);

  const handleWavelengthSelect = (wavelength: string) => {
    setSelectedWavelength(wavelength);
    console.log(`Selected wavelength: ${wavelength}Å`);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausing' : 'Playing', 'solar imagery animation');
  };

  const handleStepBackward = () => {
    setTimeSlider(prev => [Math.min(prev[0] + 1, 24)]);
    console.log('Step backward in time');
  };

  const handleStepForward = () => {
    setTimeSlider(prev => [Math.max(prev[0] - 1, 0)]);
    console.log('Step forward in time');
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log(isExpanded ? 'Collapsing' : 'Expanding', 'solar imagery view');
  };

  const handleDownload = () => {
    console.log(`Downloading solar image: ${selectedWavelength}Å at ${format(imageTime, 'yyyy-MM-dd HH:mm')}Z`);
  };

  const handleTimeSliderChange = (value: number[]) => {
    setTimeSlider(value);
  };

  const selectedWl = wavelengths.find(wl => wl.value === selectedWavelength);

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Solar Imagery</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              data-testid="button-download-image"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExpand}
              data-testid="button-expand-imagery"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Wavelength Selection */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Wavelength</div>
          <div className="flex flex-wrap gap-2">
            {wavelengths.map((wl) => (
              <Button
                key={wl.value}
                variant={selectedWavelength === wl.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleWavelengthSelect(wl.value)}
                className="text-xs"
                data-testid={`button-wavelength-${wl.value}`}
              >
                {wl.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Solar Image Display */}
        <div className="flex-1 bg-black rounded-md relative overflow-hidden min-h-[300px]">
          {/* Mock solar image */}
          <div 
            className={cn(
              "absolute inset-0 opacity-80",
              `bg-gradient-radial ${selectedWl?.color || 'from-yellow-900 to-yellow-400'}`
            )}
            style={{
              background: `radial-gradient(circle at 45% 40%, ${selectedWavelength === '94' ? '#00ff41' : 
                          selectedWavelength === '131' ? '#ff6b35' :
                          selectedWavelength === '171' ? '#ffdd00' :
                          selectedWavelength === '193' ? '#4da6ff' :
                          selectedWavelength === '211' ? '#9d4edd' : '#ff0040'} 20%, #000000 70%)`
            }}
          />
          
          {/* Solar features overlay */}
          <div className="absolute inset-0">
            {/* Active regions */}
            <div className="absolute w-8 h-8 bg-white opacity-90 rounded-full top-1/3 left-1/2 transform -translate-x-1/2" 
                 title="Active Region AR3435" />
            <div className="absolute w-6 h-6 bg-white opacity-70 rounded-full top-2/3 right-1/3 transform translate-x-1/2"
                 title="Active Region AR3436" />
            
            {/* Coronal holes (dark areas) */}
            <div className="absolute w-12 h-16 bg-black opacity-40 rounded-full bottom-1/4 left-1/4 transform rotate-12"
                 title="Coronal Hole" />
          </div>

          {/* Image metadata overlay */}
          <div className="absolute top-2 left-2 text-white text-xs space-y-1 bg-black bg-opacity-50 p-2 rounded">
            <div>SDO/AIA {selectedWavelength}Å</div>
            <div className="font-mono">{format(imageTime, 'yyyy-MM-dd HH:mm:ss')}Z</div>
            <div>Resolution: 4096×4096</div>
            <div>Cadence: 12s</div>
          </div>

          {/* Processing status */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs text-white">
              Live
            </Badge>
          </div>

          {/* Solar features callouts */}
          <div className="absolute bottom-2 left-2 text-white text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Active Regions (2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black border border-white rounded-full" />
              <span>Coronal Holes (1)</span>
            </div>
          </div>
        </div>

        {/* Time Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleStepBackward}
                data-testid="button-step-backward"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePlayPause}
                data-testid="button-play-pause-imagery"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleStepForward}
                data-testid="button-step-forward"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground font-mono">
              {timeSlider[0] === 0 ? 'Latest' : `${timeSlider[0]}h ago`}
            </div>
          </div>

          <Slider
            value={timeSlider}
            onValueChange={handleTimeSliderChange}
            max={24}
            min={0}
            step={0.25}
            className="w-full"
            data-testid="slider-imagery-time"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Latest</span>
            <span>12h ago</span>
            <span>24h ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}