// Navigation routing setup with Wouter
import { Link, useRoute } from 'wouter';
import { ReactNode } from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

export const mainNavItems: NavItem[] = [
  { path: '/', label: 'Overview' },
  { path: '/alerts', label: 'Alerts' },
  { path: '/visualize', label: 'Visualize' },
  { path: '/sources', label: 'Data Sources' },
  { path: '/model', label: 'ML Training' },
];

export const operationalNavItems: NavItem[] = [
  { path: '/satellite-ops', label: 'Satellite Ops' },
  { path: '/aviation', label: 'Aviation' },
  { path: '/spaceflight', label: 'Human Spaceflight' },
];

export const systemNavItems: NavItem[] = [
  { path: '/playbooks', label: 'Playbooks' },
  { path: '/settings', label: 'Settings' },
];

// Custom hook for active route checking
export const useActiveRoute = (path: string): boolean => {
  const [isMatch] = useRoute(path);
  return isMatch;
};
