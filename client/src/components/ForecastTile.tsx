import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

interface ForecastData {
  scale: 'R' | 'S' | 'G';
  low: number;    // R1-R2, S1, G1 probability
  medium: number; // R3, S2, G2 probability  
  high: number;   // R4-R5, S3-S5, G3-G5 probability
}

interface ForecastTileProps {
  day: number; // 1, 2, or 3
  date: Date;
  forecasts: ForecastData[];
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-weather-severe" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-weather-normal" />;
    default: return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'high': return 'text-weather-normal';
    case 'medium': return 'text-weather-elevated';
    case 'low': return 'text-weather-severe';
    default: return 'text-muted-foreground';
  }
};

export default function ForecastTile({ 
  day, 
  date, 
  forecasts, 
  confidence, 
  trend, 
  className 
}: ForecastTileProps) {
  
  const handleForecastClick = () => {
    console.log(`Day ${day} forecast clicked - showing detailed forecast`);
  };

  return (
    <Card 
      className={cn("hover-elevate cursor-pointer", className)}
      onClick={handleForecastClick}
      data-testid={`forecast-day-${day}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Day {day}
          </CardTitle>
          <div className="flex items-center gap-1">
            {getTrendIcon(trend)}
            <Badge 
              variant="outline" 
              className={cn("text-xs", getConfidenceColor(confidence))}
            >
              {confidence}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          {format(date, 'MMM dd, yyyy')}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {forecasts.map((forecast) => (
            <div key={forecast.scale} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="w-8 text-xs">
                  {forecast.scale}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <div className="text-right">
                  <div className="flex gap-1 text-xs">
                    <span className="text-weather-elevated">
                      {forecast.low}%
                    </span>
                    <span className="text-weather-high">
                      {forecast.medium}%
                    </span>
                    <span className="text-weather-severe">
                      {forecast.high}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Min • Mod • Maj
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-3 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Overall activity: {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}