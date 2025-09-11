import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Globe3DProps {
  className?: string;
}

// Mock satellite data for demonstration
interface Satellite {
  id: string;
  name: string;
  position: [number, number, number]; // lat, lon, altitude
  status: 'operational' | 'warning' | 'critical';
}

export default function Globe3D({ className }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSlider, setTimeSlider] = useState([0]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // todo: remove mock functionality - integrate real CesiumJS
  const satellites: Satellite[] = [
    { id: 'dscovr', name: 'DSCOVR', position: [0, -100, 1500000], status: 'operational' },
    { id: 'ace', name: 'ACE', position: [0, -120, 1400000], status: 'operational' },
    { id: 'goes16', name: 'GOES-16', position: [0, -75.2, 35786000], status: 'warning' },
    { id: 'goes18', name: 'GOES-18', position: [0, -137, 35786000], status: 'operational' },
  ];

  useEffect(() => {
    // todo: Initialize CesiumJS here
    // This would include:
    // - Loading Cesium with Earth imagery
    // - Adding satellite markers with real-time positions
    // - Event plume visualization overlays
    // - Time animation controls
    // - Interactive camera controls
    
    console.log('Globe3D: CesiumJS would be initialized here');
    
    return () => {
      // Cleanup CesiumJS instance
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausing' : 'Playing', 'globe animation');
  };

  const handleReset = () => {
    setTimeSlider([0]);
    setIsPlaying(false);
    console.log('Resetting globe to current time');
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log(isExpanded ? 'Collapsing' : 'Expanding', 'globe view');
  };

  const handleTimeSliderChange = (value: number[]) => {
    setTimeSlider(value);
    console.log('Time slider changed to:', value[0], 'hours from now');
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Global Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePlayPause}
              data-testid="button-globe-play-pause"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              data-testid="button-globe-reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExpand}
              data-testid="button-globe-expand"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Globe Container */}
        <div 
          ref={containerRef}
          className="flex-1 bg-black rounded-md relative overflow-hidden min-h-[300px]"
          style={{
            background: 'radial-gradient(circle at center, #001122 0%, #000000 100%)',
          }}
        >
          {/* Mock 3D Earth representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Earth */}
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-green-400 shadow-lg"
                style={{
                  background: 'conic-gradient(from 0deg, #4F94CD, #228B22, #DAA520, #4F94CD)',
                  boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.3), 0 0 20px rgba(70,130,180,0.3)'
                }}
              />
              
              {/* Satellite positions (mock) */}
              {satellites.map((sat, index) => (
                <div
                  key={sat.id}
                  className={cn(
                    "absolute w-2 h-2 rounded-full animate-pulse",
                    sat.status === 'operational' ? 'bg-weather-normal' :
                    sat.status === 'warning' ? 'bg-weather-elevated' : 'bg-weather-severe'
                  )}
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${80 + (index % 2) * 20}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${sat.name} - ${sat.status}`}
                />
              ))}

              {/* Event plumes (mock) */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(ellipse at 30% 70%, rgba(255,69,0,0.4) 0%, transparent 70%)'
                }}
                title="Aurora activity region"
              />
            </div>
          </div>

          {/* Overlay information */}
          <div className="absolute top-2 left-2 text-xs text-white space-y-1">
            <div>Satellites: {satellites.filter(s => s.status === 'operational').length}/{satellites.length} OK</div>
            <div>Aurora: Northern Lights Active</div>
            <div>Solar Wind: 420 km/s</div>
          </div>
        </div>

        {/* Time Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Time:</span>
            <span className="font-mono">
              {timeSlider[0] === 0 ? 'Current' : `T+${timeSlider[0]}h`}
            </span>
          </div>
          <Slider
            value={timeSlider}
            onValueChange={handleTimeSliderChange}
            max={72}
            min={-24}
            step={1}
            className="w-full"
            data-testid="slider-globe-time"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-24h</span>
            <span>Now</span>
            <span>+72h</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-weather-normal rounded-full" />
            <span>Satellites OK</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-weather-elevated rounded-full" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-weather-severe rounded-full" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 opacity-60 rounded-full" />
            <span>Aurora Zones</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}