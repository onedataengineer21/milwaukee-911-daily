# Milwaukee 911 Backend

Express.js API server for serving 911 call data.

## Structure

```
src/
├── routes/
│   └── callsRouter.js          # API endpoints for call data
├── scraper/
│   └── milwaukeeScraper.js     # Web scraping logic
├── services/
│   ├── cacheService.js         # In-memory caching
│   ├── dummyDataService.js     # Dummy data generation
│   └── historicalDataService.js # Historical data handling
└── server.js                   # Main server entry point
```

## API Endpoints

### GET /api/calls/dummy
Returns dummy 911 call data for testing.

**Response:**
```json
{
  "success": true,
  "dummy": true,
  "timestamp": "2025-12-29T...",
  "calls": [...],
  "stats": {
    "totalCalls": 379,
    "activeCalls": 20
  },
  "dailyStats": {
    "totalCallsToday": 379,
    "currentDate": "Sun Dec 29 2025"
  },
  "timeSeriesData": [...],
  "districtData": [...],
  "callTypeData": [...],
  "heatmapData": [...]
}
```

## Running

```bash
npm install
npm start
```

Server runs on port 3001 by default.

## Configuration

- Port: 3001
- CORS: Enabled for localhost:5173, 5174, 3000
- Environment: Development

## Dependencies

- express: Web framework
- cors: CORS middleware
- axios: HTTP client (for future scraping)
- cheerio: HTML parsing (for future scraping)
