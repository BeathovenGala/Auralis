# Geostorm Alerting System - Enhanced Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles enhanced with Bureau of Meteorology's clean, professional aesthetic. Emphasizes modular card-based layouts, scientific data clarity, and operational efficiency for 24/7 control room environments.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (optimized for extended control room operation):
- Background: 220 15% 8% (deep operational slate)
- Surface: 220 12% 14% (elevated card surfaces)
- Primary: 205 85% 65% (Bureau-inspired operational blue)
- Secondary: 220 20% 25% (subtle panel dividers)
- Text Primary: 0 0% 95% (maximum contrast)
- Text Secondary: 0 0% 75% (supporting information)

**Scientific Status Colors** (R/S/G space weather indicators):
- Green (Quiet): 120 55% 50% (stable conditions)
- Yellow (Active): 45 85% 60% (elevated activity)
- Orange (Minor Storm): 25 90% 58% (storm conditions)
- Red (Major Storm): 0 85% 58% (severe events)

### B. Typography
**Google Fonts Implementation**:
- Primary: Inter (clean, professional interface text)
- Data/Scientific: JetBrains Mono (precise technical displays)

**Professional Hierarchy**:
- Dashboard Title: 28px Inter Bold
- Section Headers: 20px Inter SemiBold  
- Card Titles: 16px Inter SemiBold
- Body Text: 14px Inter Regular
- Data Values: 16px JetBrains Mono Medium
- Timestamps: 12px JetBrains Mono Regular
- Captions: 11px Inter Medium

### C. Layout System
**Tailwind Spacing Primitives**: 2, 4, 6, 8, 12, 16 units for consistent rhythm
- Card internal spacing: p-4, p-6 (professional breathing room)
- Grid gaps: gap-4, gap-6 (modular separation)
- Section margins: mb-8, mt-12 (clear hierarchical divisions)

**Modular Grid Structure**:
- Top status bar: System health and time indicators
- Primary grid: 3-column responsive (sidebar 20% | main 55% | alerts 25%)
- Card-based modules: Standardized heights with overflow handling
- Bottom panel: Collapsible detailed charts and diagnostics

### D. Component Library

**Enhanced Card System**:
- Base cards: Elevated surfaces (shadow-lg) with rounded-lg corners
- Status cards: Left border indicators matching R/S/G colors
- Data cards: Integrated mini-charts and trend indicators
- Action cards: Clear CTAs with appropriate button hierarchy

**Key Indices Display**:
- Large numerical displays with scientific units
- Color-coded backgrounds for status levels
- Interactive tooltips with scientific explanations
- Historical comparison indicators (arrows, percentages)

**Scientific Tooltips**:
- Dark surfaces with bright borders
- Technical definitions with units and ranges
- Context-aware positioning
- Instant display with fade transitions

**Enhanced Data Visualization**:
- Dst prediction charts: High-contrast time series with confidence intervals
- Multi-panel layouts: Synchronized time axes across related data
- Status timeline: Horizontal strips showing R/S/G progression
- Geographic displays: Professional cartographic styling

**Professional Controls**:
- Time range selectors: Clean tab-based interfaces
- Data source toggles: Clear on/off states with source health
- Export functions: Subtle but accessible action buttons
- Filter panels: Collapsible sidebars with professional form styling

### E. Bureau of Meteorology Enhancements

**Clean Professional Aesthetics**:
- Subtle drop shadows for depth without distraction
- Consistent use of whitespace for information hierarchy
- Professional button styling with clear interactive states
- Minimal use of decorative elements

**Operational Interface Elements**:
- System status indicators in header with real-time updates
- Quick action toolbar for common operations
- Breadcrumb navigation for complex workflows
- Professional alert banners with appropriate severity styling

**Enhanced Information Architecture**:
- Critical data prominently featured in primary viewport
- Supporting information accessible via progressive disclosure
- Clear visual pathways from alerts to required actions
- Contextual help system with scientific explanations

## Specialized Features

**Real-time Dst Predictions**:
- Large prediction charts with uncertainty bands
- Color-coded forecast periods
- Historical context overlays
- Confidence indicators with scientific methodology tooltips

**Enhanced Alert Management**:
- Tiered alert cards with Bureau-style severity indicators
- Automatic alert prioritization with visual hierarchy
- One-click acknowledgment and action workflows
- Historical alert context panels

## Critical Design Principles

1. **Scientific Accuracy**: Precise data representation with appropriate uncertainty indicators
2. **Operational Efficiency**: Minimal clicks from data to action
3. **Professional Clarity**: Bureau-inspired clean layouts with excellent information hierarchy
4. **Modular Flexibility**: Card-based system allowing customizable dashboards
5. **24/7 Reliability**: Optimized for extended operation in professional environments
6. **Progressive Disclosure**: Complex data accessible without overwhelming primary interface

## Images
No large hero images required. Interface relies on data visualization, charts, and scientific displays. Small institutional logos may appear in header for operational context.