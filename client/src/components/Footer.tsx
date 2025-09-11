import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const lastModelRun = new Date(Date.now() - 180000); // 3 minutes ago
  const version = "v2.1.3"; // todo: replace with real version

  return (
    <footer className={cn(
      "border-t border-border bg-muted/30 px-4 py-3",
      className
    )}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        
        {/* Left side - Copyright and version */}
        <div className="flex items-center gap-4">
          <span>© {currentYear} Space Weather Operations Center</span>
          <Badge variant="outline" className="text-xs">
            {version}
          </Badge>
        </div>

        {/* Center - Last model run */}
        <div className="flex items-center gap-4">
          <span className="font-mono">
            Last model run: {format(lastModelRun, 'yyyy-MM-dd HH:mm:ss')}Z
          </span>
        </div>

        {/* Right side - Data license */}
        <div className="flex items-center gap-4">
          <span>Data: NOAA/SWPC, NASA/GSFC, BGS</span>
          <span>License: Public Domain</span>
        </div>
      </div>
    </footer>
  );
}