# Milwaukee 911 Daily Dashboard

A real-time dashboard displaying Milwaukee Police Department 911 call data with interactive visualizations and analytics.

## Project Structure

```
milwaukee-911-daily/
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── scraper/      # Web scraping logic for Milwaukee PD data
│   │   ├── services/     # Business logic (cache, dummy data, historical data)
│   │   └── server.js     # Main server entry point
│   └── package.json
│
├── frontend/             # React + TypeScript dashboard
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── SimpleDashboard.tsx  # Main dashboard layout
│   │   │   ├── MilwaukeeMap.tsx     # Interactive Leaflet map
│   │   │   └── DataTable.tsx        # Call data table view
│   │   ├── styles/       # Global CSS styles
│   │   ├── archive/      # Unused/legacy components
│   │   ├── App.tsx       # Root component
│   │   └── main.tsx      # Entry point
│   └── package.json
│
└── README.md
```

## Features

- **Real-time Dashboard**: Live 911 call data visualization
- **Big Number KPIs**: Total calls today, active calls, most active district, top call type
- **Interactive Map**: Milwaukee map with active call locations (red markers for active, gray for completed)
- **Time Series Chart**: Call volume over 24 hours
- **Call Type Distribution**: Donut chart showing breakdown by call type
- **Data Table**: Sortable table view of all calls with filters

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Highcharts (charts & visualizations)
- Leaflet + react-leaflet (interactive maps)
- Tailwind CSS v4
- Axios

### Backend
- Node.js + Express
- Cheerio (web scraping)
- CORS enabled for cross-origin requests
- In-memory caching

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server** (runs on port 3001)
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Dev Server** (runs on port 5173 or 5174)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Dashboard**
   - Open your browser to the URL shown in the frontend terminal (typically http://localhost:5173 or http://localhost:5174)

## API Endpoints

### Backend API
- `GET /api/calls/dummy` - Returns dummy 911 call data for testing
  - Generates realistic data for a full day (~300-400 calls)
  - Exactly 20 calls marked as active (Dispatched/Enroute)
  - Includes time series, district, and call type analytics

## Design System

### Color Palette
- **Oxford Blue**: `#002147` - Primary color for headers and text
- **Selective Yellow**: `#FFB800` - Accent color for highlights
- **Background**: `#f5f5f5` - Light gray page background
- **Active Calls**: `#DC2626` - Red for active call markers
- **Completed Calls**: `#9CA3AF` - Gray for completed call markers

### Typography
- Font: Inter, system-ui, -apple-system, sans-serif
- Weights: Bold (700), Extra Bold (800)

## Data Model

```typescript
interface Call {
  callNumber: string;        // e.g., "2025-000123"
  timestamp: string;         // ISO 8601 format
  district: string;          // "1" through "7"
  natureOfCall: string;      // e.g., "ALARM", "BATTERY", "THEFT"
  status: string;            // "Dispatched", "Enroute", "Completed"
  location: {
    type: 'coordinates';
    latitude: number;
    longitude: number;
  }
}
```

## Deployment

### Deploy to Netlify (Frontend Only)

The repository includes `netlify.toml` configuration for easy deployment:

1. **Connect your GitHub repository to Netlify**
   - The build settings are already configured in `netlify.toml`
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Manual deployment**
   ```bash
   cd frontend
   npm run build
   # Deploy the 'dist' folder to Netlify
   ```

3. **Important**: The frontend uses dummy data. For production, you'll need to:
   - Deploy the backend to a service like Railway, Render, or Heroku
   - Update the API endpoint in the frontend to point to your deployed backend
   - Update CORS settings in the backend to allow your Netlify domain

### Deploy Backend (Optional)

For full functionality, deploy the backend separately:

1. **Railway/Render/Heroku**
   - Set base directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variable: `PORT=3001`

2. **Update frontend API endpoint**
   - Change `http://localhost:3001` to your deployed backend URL in `SimpleDashboard.tsx`

## Development Notes

- The application currently uses dummy data for testing
- Real-time scraping logic exists in `backend/src/scraper/milwaukeeScraper.js`
- Frontend auto-reloads on file changes (Vite HMR)
- Backend requires manual restart on code changes

## Future Enhancements

- [ ] Connect to real Milwaukee PD data source
- [ ] Add auto-refresh every 5 minutes
- [ ] Implement data export functionality
- [ ] Add historical data comparison
- [ ] Create district-specific filtering
- [ ] Add call status transition tracking

## License

Private project for data engineering portfolio

## Author

Umesh Beena Purushothama
