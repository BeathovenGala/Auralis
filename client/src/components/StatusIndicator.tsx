import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  level: 'normal' | 'elevated' | 'high' | 'severe' | 'extreme';
  scale: 'R' | 'S' | 'G';
  value: number;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelConfig = {
  normal: { color: 'bg-weather-normal', textColor: 'text-white' },
  elevated: { color: 'bg-weather-elevated', textColor: 'text-black' },
  high: { color: 'bg-weather-high', textColor: 'text-white' },
  severe: { color: 'bg-weather-severe', textColor: 'text-white' },
  extreme: { color: 'bg-weather-extreme', textColor: 'text-white' },
};

const sizeConfig = {
  sm: { container: 'w-8 h-8', text: 'text-xs', scale: 'text-xs' },
  md: { container: 'w-12 h-12', text: 'text-sm', scale: 'text-sm' },
  lg: { container: 'w-16 h-16', text: 'text-lg', scale: 'text-lg font-bold' },
};

export default function StatusIndicator({ 
  level, 
  scale, 
  value, 
  description, 
  size = 'md', 
  className 
}: StatusIndicatorProps) {
  const config = levelConfig[level];
  const sizeConf = sizeConfig[size];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div 
        className={cn(
          "rounded-full flex items-center justify-center font-mono font-bold",
          config.color,
          config.textColor,
          sizeConf.container,
          sizeConf.text
        )}
        title={description}
      >
        {scale}{value}
      </div>
      {description && (
        <span className={cn("text-center text-muted-foreground", sizeConf.scale)}>
          {description}
        </span>
      )}
    </div>
  );
}