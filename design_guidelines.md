# Geostorm Alerting System - Design Guidelines

## Design Approach
**System-Based Approach**: Following Material Design principles for this data-intensive, mission-critical application. The system prioritizes clarity, consistency, and rapid information processing over visual flair, as operators need to quickly assess space weather conditions and take action.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (system operates 24/7 in control room environments):
- Background: 220 15% 8% (dark slate)
- Surface: 220 12% 12% (elevated panels)
- Primary: 200 100% 60% (operational blue)
- Text: 0 0% 95% (high contrast white)

**Status Colors** (critical for R/S/G indicators):
- Green (Normal): 120 60% 45%
- Yellow (Elevated): 45 90% 55%
- Orange (High): 25 90% 55%
- Red (Severe): 0 85% 55%

### B. Typography
**Google Fonts Implementation**:
- Primary: Inter (interface text, data labels)
- Monospace: JetBrains Mono (timestamps, coordinates, technical data)

**Hierarchy**:
- Display: 32px Inter Bold (dashboard title)
- Headers: 24px Inter SemiBold (panel titles)
- Body: 16px Inter Regular (general content)
- Data: 14px JetBrains Mono (timestamps, coordinates)
- Captions: 12px Inter Medium (status indicators)

### C. Layout System
**Tailwind Spacing Primitives**: Consistent use of 2, 4, 6, 8, 12, 16 units
- Micro spacing: p-2, m-2 (8px) for tight elements
- Standard spacing: p-4, m-4 (16px) for general layout
- Section spacing: p-8, m-8 (32px) for major divisions

**Grid Structure**:
- Top bar: Fixed header with system status
- Three-column layout: Sources (25%) | Main Dashboard (50%) | Alerts/Actions (25%)
- Bottom panel: Collapsible charts and diagnostics

### D. Component Library

**Status Indicators**:
- R/S/G tiles: Large circular indicators with color-coded backgrounds, white text, tooltip explanations
- System health: Small circular dots with green/yellow/red states
- Data freshness: Timestamp with color-coded staleness indicators

**Navigation**:
- Top bar: Minimal, system status focused
- Tab navigation: Underlined active states for different operational views
- Quick actions: Prominent buttons for critical operations

**Data Displays**:
- Cards: Subtle borders, dark surfaces with rounded corners (8px)
- Tables: Zebra striping for data rows, fixed headers
- Charts: High contrast lines against dark backgrounds, synchronized crosshairs

**Forms & Controls**:
- Input fields: Dark backgrounds with bright borders on focus
- Toggles: Clear on/off states with appropriate colors
- Sliders: For time navigation and threshold adjustments

**Overlays**:
- Modals: Semi-transparent dark backdrops with elevated content
- Tooltips: Instant display with technical explanations
- Alert banners: Full-width status strips at top of interface

### E. Interactive Elements

**3D Globe (CesiumJS)**:
- Dark space background
- Earth with realistic textures
- Color-coded event plumes matching R/S/G status colors
- Satellite orbit traces in muted colors
- Interactive time slider with clear timestamps

**Live Solar Imagery**:
- Large panel with SDO/AIA data display
- Time-stepping controls with play/pause functionality
- Multi-wavelength selection tabs
- Zoom and pan capabilities with reset button

**Time Series Charts**:
- Dark backgrounds with bright data lines
- Synchronized crosshairs across all charts
- Color-coded data series matching status indicators
- Zoom and pan with time range selection

## Specialized Features

**Alert Cards**:
- Elevated surfaces with appropriate status color left borders
- Clear hierarchy: Level > Source > Time > Actions
- Quick action buttons with appropriate button variants

**Playbook Interface**:
- Checklist-style layout with clear completion states
- Persona-specific color coding (subtle)
- Progress indicators for multi-step processes

**Data Source Health Panel**:
- Traffic light indicators for each source
- "Last updated" timestamps prominently displayed
- Failover status with clear visual indicators

## Critical Design Principles

1. **Information Density**: Pack maximum useful information without overwhelming
2. **Status Clarity**: Instant recognition of system states through color and typography
3. **Time Awareness**: Prominent timestamps and data freshness indicators throughout
4. **Action Orientation**: Clear paths from information to required actions
5. **Professional Reliability**: Conservative, proven design patterns for mission-critical use

## Performance Considerations
- Minimize animations (only for status transitions)
- Optimize for 24/7 operation in control room lighting
- Ensure readability across multiple monitor setups
- Support for rapid context switching between different operational views

This design system prioritizes operational efficiency and situational awareness while maintaining modern web standards suitable for a professional space weather operations center.