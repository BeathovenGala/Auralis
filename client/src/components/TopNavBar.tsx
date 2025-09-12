import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Satellite,
  Activity
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface TopNavBarProps {
  className?: string;
}

const mainNavItems = [
  { href: '/', label: 'Overview', icon: Activity },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/visualize', label: 'Visualize', icon: Satellite },
  { href: '/sources', label: 'Data Sources' },
  { href: '/model', label: 'Model' },
];

const operationsNavItems = [
  { href: '/satellite-ops', label: 'Satellite Ops' },
  { href: '/aviation', label: 'Aviation' },
  { href: '/spaceflight', label: 'Human Spaceflight' },
];

const systemNavItems = [
  { href: '/playbooks', label: 'Playbooks' },
  { href: '/settings', label: 'Settings' },
];

export default function TopNavBar({ className }: TopNavBarProps) {
  const [location] = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [notifications] = useState(3); // todo: replace with real notification count

  // todo: replace with real status data
  const systemStatus = {
    SOL: { level: 'normal', value: 'G0' },
    MAG: { level: 'elevated', value: 'S1' },
    ION: { level: 'normal', value: 'R0' },
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'normal': return 'bg-weather-normal';
      case 'elevated': return 'bg-weather-elevated'; 
      case 'high': return 'bg-weather-high';
      case 'severe': return 'bg-weather-severe';
      case 'extreme': return 'bg-weather-extreme';
      default: return 'bg-muted';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchValue);
    // todo: implement search functionality
  };

  const isActivePath = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-14 items-center px-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Satellite className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">AURALIS</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center gap-1 mr-6">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActivePath(item.href) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          {/* Operations Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="nav-operations">
                Operations
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Operational Views</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {operationsNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="nav-system">
                System
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>System Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {systemNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Global Status Chips */}
        <div className="flex items-center gap-2 mr-6">
          {Object.entries(systemStatus).map(([key, status]) => (
            <Badge key={key} variant="outline" className="gap-1 text-xs">
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(status.level))} />
              <span className="font-mono">{key}</span>
              <span className="font-mono font-bold">{status.value}</span>
            </Badge>
          ))}
        </div>

        <div className="flex-1" />

        {/* Right Side - Search, Notifications, User Menu */}
        <div className="flex items-center gap-2">
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search alerts, assets..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-64 pl-7 h-8"
              data-testid="input-search"
            />
          </form>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs rounded-full"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="button-user-menu">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Operator Console</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}