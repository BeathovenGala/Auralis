import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusIndicator from "./StatusIndicator";
import { cn } from "@/lib/utils";

interface SpaceWeatherTileProps {
  scale: 'R' | 'S' | 'G';
  title: string;
  current: {
    level: 'normal' | 'elevated' | 'high' | 'severe' | 'extreme';
    value: number;
    description: string;
  };
  past24h: {
    max: number;
    events: number;
  };
  className?: string;
}

const scaleDescriptions = {
  R: "Radio Blackouts",
  S: "Solar Radiation Storms", 
  G: "Geomagnetic Storms"
};

const levelDescriptions = {
  normal: "No impact expected",
  elevated: "Minor impacts possible",
  high: "Moderate impacts likely", 
  severe: "Strong impacts expected",
  extreme: "Extreme impacts certain"
};

export default function SpaceWeatherTile({ 
  scale, 
  title, 
  current, 
  past24h, 
  className 
}: SpaceWeatherTileProps) {
  
  const handleTileClick = () => {
    console.log(`${scale} scale tile clicked - showing detailed view`);
  };

  return (
    <Card 
      className={cn("hover-elevate cursor-pointer transition-all duration-200", className)}
      onClick={handleTileClick}
      data-testid={`tile-${scale.toLowerCase()}-scale`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="text-xs font-mono">
            {scale}-Scale
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {scaleDescriptions[scale]}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          {/* Current Status */}
          <div className="flex flex-col items-center">
            <StatusIndicator
              level={current.level}
              scale={scale}
              value={current.value}
              size="lg"
            />
            <div className="text-center mt-2">
              <div className="text-sm font-medium">Current</div>
              <div className="text-xs text-muted-foreground">
                {current.description}
              </div>
            </div>
          </div>

          {/* Past 24h Stats */}
          <div className="text-right">
            <div className="space-y-1">
              <div>
                <div className="text-xl font-mono font-bold">
                  {scale}{past24h.max}
                </div>
                <div className="text-xs text-muted-foreground">
                  24h Max
                </div>
              </div>
              <div>
                <div className="text-lg font-mono">
                  {past24h.events}
                </div>
                <div className="text-xs text-muted-foreground">
                  Events
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Description */}
        <div className="mt-4 p-2 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            {levelDescriptions[current.level]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}