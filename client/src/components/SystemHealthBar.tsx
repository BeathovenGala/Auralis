import { Clock, Wifi, Database, Satellite } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SystemHealthBarProps {
  className?: string;
}

interface DataSource {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  lastUpdate: Date;
  lag: number; // seconds
}

export default function SystemHealthBar({ className }: SystemHealthBarProps) {
  const currentTime = new Date();
  
  // todo: remove mock functionality - replace with real data sources
  const dataSources: DataSource[] = [
    { name: 'DSCOVR', status: 'online', lastUpdate: new Date(Date.now() - 120000), lag: 2 },
    { name: 'ACE', status: 'online', lastUpdate: new Date(Date.now() - 180000), lag: 3 },
    { name: 'GOES', status: 'degraded', lastUpdate: new Date(Date.now() - 420000), lag: 7 },
    { name: 'NOAA', status: 'online', lastUpdate: new Date(Date.now() - 90000), lag: 1.5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-weather-normal';
      case 'degraded': return 'bg-weather-elevated';
      case 'offline': return 'bg-weather-severe';
      default: return 'bg-muted';
    }
  };

  const globalStatus = dataSources.every(s => s.status === 'online') ? 'online' : 
                     dataSources.some(s => s.status === 'offline') ? 'offline' : 'degraded';

  return (
    <div className={cn("bg-card border-b border-card-border px-4 py-2 flex items-center justify-between", className)}>
      {/* Left section - System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", getStatusColor(globalStatus))} />
          <span className="font-mono text-sm font-medium">GEOSTORM OPS</span>
        </div>
        
        {/* SOL/MAG/ION Summary */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <span className="w-2 h-2 bg-weather-normal rounded-full mr-1" />
            SOL
          </Badge>
          <Badge variant="outline" className="text-xs">
            <span className="w-2 h-2 bg-weather-elevated rounded-full mr-1" />
            MAG
          </Badge>
          <Badge variant="outline" className="text-xs">
            <span className="w-2 h-2 bg-weather-normal rounded-full mr-1" />
            ION
          </Badge>
        </div>

        {/* Data Sources Quick Status */}
        <div className="flex items-center gap-1">
          {dataSources.map((source) => (
            <div
              key={source.name}
              className="flex items-center gap-1"
              title={`${source.name}: ${source.status} (${source.lag}s lag)`}
            >
              <Satellite className="w-3 h-3" />
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(source.status))} />
            </div>
          ))}
        </div>
      </div>

      {/* Center section - Time */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="flex items-center gap-2 text-sm font-mono">
            <Clock className="w-4 h-4" />
            <span>{format(currentTime, 'yyyy-MM-dd HH:mm:ss')} UTC</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated every 5 min • Last: {format(new Date(Date.now() - 120000), 'HH:mm:ss')}Z
          </div>
        </div>
      </div>

      {/* Right section - System Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" data-testid="button-refresh">
          <Wifi className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid="button-database">
          <Database className="w-4 h-4" />
        </Button>
        <Badge variant={globalStatus === 'online' ? 'default' : 'destructive'}>
          {globalStatus.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}