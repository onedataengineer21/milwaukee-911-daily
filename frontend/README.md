# Milwaukee 911 Frontend

React + TypeScript dashboard for visualizing Milwaukee 911 call data.

## Structure

```
src/
├── components/
│   ├── SimpleDashboard.tsx  # Main dashboard with KPIs, charts, and navigation
│   ├── MilwaukeeMap.tsx     # Interactive Leaflet map component
│   └── DataTable.tsx        # Sortable data table view
├── styles/
│   └── globals.css          # Global styles and Tailwind config
├── archive/                 # Archived/unused components
├── App.tsx                  # Root component
└── main.tsx                 # Entry point
```

## Components

### SimpleDashboard.tsx
Main dashboard component featuring:
- Two-tab navigation (Dashboard / Data)
- Four KPI cards showing key metrics
- Line chart for call volume over time
- Donut chart for call type distribution
- Interactive Milwaukee map
- Responsive grid layout

### MilwaukeeMap.tsx
Interactive map using Leaflet and OpenStreetMap:
- Centers on Milwaukee (43.0389, -87.9065)
- Red markers for active calls
- Gray markers for completed calls
- Interactive popups with call details
- Zoom level: 11

### DataTable.tsx
Sortable table showing all calls:
- Columns: Call Number, Time, District, Nature, Status, Location
- Color-coded status badges
- Sorted by timestamp (newest first)
- Striped rows for readability

## Design System

### Colors
- Oxford Blue: `#002147`
- Selective Yellow: `#FFB800`
- Background: `#f5f5f5`
- Active: `#DC2626`
- Completed: `#9CA3AF`

### Charts
- Highcharts for visualizations
- Custom color palette alternating between Oxford Blue and Selective Yellow
- Transparent backgrounds
- Clean, minimal styling

## Running

```bash
npm install
npm run dev
```

Runs on port 5173 or 5174 if 5173 is occupied.

## Building

```bash
npm run build
```

Outputs to `dist/` directory.

## Dependencies

### Core
- React 19
- TypeScript
- Vite

### UI/Visualization
- Highcharts + highcharts-react-official
- Leaflet + react-leaflet
- Tailwind CSS v4

### Data/State
- Axios (API calls)
- @tanstack/react-query (future use)
- Zustand (future use)

## Configuration

- Vite config: `vite.config.ts`
- Tailwind config: `tailwind.config.js`
- TypeScript config: `tsconfig.json`
- PostCSS config: `postcss.config.js`
