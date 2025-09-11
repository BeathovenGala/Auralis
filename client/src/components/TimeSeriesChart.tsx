import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Download, Settings, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subHours, addHours } from "date-fns";

interface TimeSeriesChartProps {
  title: string;
  parameter: string;
  unit: string;
  data?: Array<{ timestamp: Date; value: number; }>;
  thresholds?: Array<{ value: number; label: string; color: string; }>;
  syncCursor?: boolean;
  className?: string;
}

export default function TimeSeriesChart({ 
  title, 
  parameter, 
  unit, 
  data = [], 
  thresholds = [],
  syncCursor = true,
  className 
}: TimeSeriesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; value: number; time: Date } | null>(null);

  // todo: remove mock functionality - generate realistic space weather data
  const generateMockData = () => {
    const points = [];
    const baseTime = subHours(new Date(), 24);
    
    for (let i = 0; i < 288; i++) { // 5-minute intervals for 24 hours
      const time = addHours(baseTime, i / 12);
      let value: number;
      
      // Generate parameter-specific mock data
      switch (parameter.toLowerCase()) {
        case 'bz':
          value = Math.sin(i * 0.02) * 10 + Math.random() * 6 - 3; // IMF Bz in nT
          break;
        case 'solar_wind_speed':
          value = 400 + Math.sin(i * 0.01) * 100 + Math.random() * 50; // km/s
          break;
        case 'dst':
          value = Math.max(-120, Math.min(20, -20 + Math.sin(i * 0.015) * 40 + Math.random() * 20)); // nT
          break;
        case 'kp':
          value = Math.max(0, Math.min(9, 2 + Math.sin(i * 0.03) * 2 + Math.random() * 2)); // Kp index
          break;
        case 'proton_flux':
          value = Math.max(0.1, 1 + Math.exp(Math.sin(i * 0.025)) + Math.random() * 2); // particles/cm²/s
          break;
        default:
          value = Math.random() * 100;
      }
      
      points.push({ timestamp: time, value });
    }
    
    return points;
  };

  const mockData = data.length > 0 ? data : generateMockData();
  const latestValue = mockData[mockData.length - 1]?.value || 0;

  useEffect(() => {
    const canvas = chartRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 200 * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '200px';
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, rect.width, 200);

    if (mockData.length === 0) return;

    // Calculate scales
    const values = mockData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = 200 - padding * 2;

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }

    // Draw threshold lines
    thresholds.forEach(threshold => {
      const y = padding + chartHeight - ((threshold.value - minValue) / valueRange) * chartHeight;
      ctx.strokeStyle = threshold.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw data line
    ctx.strokeStyle = parameter.toLowerCase().includes('bz') ? '#10b981' : 
                     parameter.toLowerCase().includes('dst') ? '#f59e0b' :
                     parameter.toLowerCase().includes('kp') ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    mockData.forEach((point, index) => {
      const x = padding + (index / (mockData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw y-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (i / 5) * valueRange;
      const y = padding + (i / 5) * chartHeight + 4;
      ctx.fillText(value.toFixed(1), padding - 5, y);
    }

  }, [mockData, thresholds, parameter]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = chartRef.current;
    if (!canvas || !syncCursor) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const relativeX = (x - 40) / (rect.width - 80);
    
    if (relativeX >= 0 && relativeX <= 1) {
      const dataIndex = Math.round(relativeX * (mockData.length - 1));
      const dataPoint = mockData[dataIndex];
      
      if (dataPoint) {
        setCursorPosition({
          x: x,
          value: dataPoint.value,
          time: dataPoint.timestamp
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (syncCursor) {
      setCursorPosition(null);
    }
  };

  const handleDownload = () => {
    console.log(`Downloading ${parameter} data`);
  };

  const handleSettings = () => {
    console.log(`Opening settings for ${parameter} chart`);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log(isExpanded ? 'Collapsing' : 'Expanding', `${parameter} chart`);
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {latestValue.toFixed(2)} {unit}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExpand}>
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <div ref={containerRef} className="relative w-full">
          <canvas
            ref={chartRef}
            className="w-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-testid={`chart-${parameter.toLowerCase()}`}
          />
          
          {/* Cursor tooltip */}
          {cursorPosition && (
            <div
              className="absolute bg-card border border-card-border rounded px-2 py-1 text-xs font-mono pointer-events-none z-10"
              style={{
                left: cursorPosition.x + 10,
                top: 10,
              }}
            >
              <div>{format(cursorPosition.time, 'HH:mm:ss')}</div>
              <div className="font-semibold">
                {cursorPosition.value.toFixed(2)} {unit}
              </div>
            </div>
          )}
        </div>

        {/* Legend for thresholds */}
        {thresholds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {thresholds.map((threshold, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-3 h-0.5" 
                  style={{ backgroundColor: threshold.color }}
                />
                <span>{threshold.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}