import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, AlertTriangle, CheckCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: {
    id: string;
    level: 'WATCH' | 'ADVISORY' | 'WARNING';
    tier: 'strategic' | 'imminent';
    title: string;
    description: string;
    timestamp: Date;
    expiresAt?: Date;
    sources: string[];
    confidence: number;
    impactedAssets: string[];
    geometry?: string;
    acknowledged?: boolean;
  };
  onAcknowledge?: (alertId: string) => void;
  onEscalate?: (alertId: string) => void;
  onRunPlaybook?: (alertId: string) => void;
  className?: string;
}

const getLevelConfig = (level: string) => {
  switch (level) {
    case 'WATCH':
      return { color: 'bg-weather-elevated', borderColor: 'border-l-weather-elevated', icon: Clock };
    case 'ADVISORY':
      return { color: 'bg-weather-high', borderColor: 'border-l-weather-high', icon: AlertTriangle };
    case 'WARNING':
      return { color: 'bg-weather-severe', borderColor: 'border-l-weather-severe', icon: AlertTriangle };
    default:
      return { color: 'bg-muted', borderColor: 'border-l-muted', icon: AlertTriangle };
  }
};

export default function AlertCard({ alert, onAcknowledge, onEscalate, onRunPlaybook, className }: AlertCardProps) {
  const levelConfig = getLevelConfig(alert.level);
  const Icon = levelConfig.icon;
  
  const handleAcknowledge = () => {
    console.log(`Acknowledging alert ${alert.id}`);
    onAcknowledge?.(alert.id);
  };

  const handleEscalate = () => {
    console.log(`Escalating alert ${alert.id}`);
    onEscalate?.(alert.id);
  };

  const handleRunPlaybook = () => {
    console.log(`Running playbook for alert ${alert.id}`);
    onRunPlaybook?.(alert.id);
  };

  return (
    <Card 
      className={cn(
        "border-l-4 hover-elevate transition-all duration-200",
        levelConfig.borderColor,
        alert.acknowledged ? "opacity-75" : "",
        className
      )}
      data-testid={`alert-card-${alert.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Icon className="w-4 h-4 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={alert.level === 'WARNING' ? 'destructive' : 'secondary'}>
                  {alert.level}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {alert.tier}
                </Badge>
                {alert.acknowledged && (
                  <CheckCircle className="w-4 h-4 text-weather-normal" />
                )}
              </div>
              <h3 className="font-semibold mt-1">{alert.title}</h3>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-foreground">{alert.description}</p>

        {/* Alert Details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{format(alert.timestamp, 'yyyy-MM-dd HH:mm:ss')}Z</span>
            {alert.expiresAt && (
              <span className="text-muted-foreground">
                • Expires {format(alert.expiresAt, 'HH:mm')}Z
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Sources: {alert.sources.join(', ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Confidence:</span>
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  alert.confidence >= 0.8 ? "bg-weather-normal" : 
                  alert.confidence >= 0.6 ? "bg-weather-elevated" : "bg-weather-severe"
                )}
                style={{ width: `${alert.confidence * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs">{(alert.confidence * 100).toFixed(0)}%</span>
          </div>

          {alert.impactedAssets.length > 0 && (
            <div>
              <span className="font-medium">Impacted: </span>
              <span className="text-muted-foreground">
                {alert.impactedAssets.slice(0, 3).join(', ')}
                {alert.impactedAssets.length > 3 && ` +${alert.impactedAssets.length - 3} more`}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          {!alert.acknowledged && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAcknowledge}
              data-testid="button-acknowledge"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Ack
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEscalate}
            data-testid="button-escalate"
          >
            Escalate
          </Button>
          
          <Button 
            size="sm" 
            variant="default" 
            onClick={handleRunPlaybook}
            data-testid="button-run-playbook"
          >
            <Play className="w-3 h-3 mr-1" />
            Run Playbook
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}