import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import callsRouter from './routes/callsRouter.js';
import { scrapeMilwaukeeCalls, processCallData } from './scraper/milwaukeeScraper.js';
import { cache } from './services/cacheService.js';
import { historicalData } from './services/historicalDataService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', callsRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Milwaukee 911 Dashboard API',
    version: '1.0.0',
    endpoints: {
      calls: 'GET /api/calls',
      refresh: 'POST /api/calls/refresh',
      health: 'GET /api/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Scheduled scraping job - runs every 5 minutes
// Cron format: */5 * * * * = every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('[Cron] Running scheduled scrape...');
    const calls = await scrapeMilwaukeeCalls();

    // Add to historical data (tracks all calls for the day)
    historicalData.addCalls(calls);

    const processedData = processCallData(calls);
    cache.set('milwaukee-calls', processedData);
    console.log('[Cron] Scheduled scrape completed successfully');
  } catch (error) {
    console.error('[Cron] Scheduled scrape failed:', error.message);
  }
});

// Initial scrape on startup
async function initialScrape() {
  try {
    console.log('[Server] Performing initial data scrape...');
    const calls = await scrapeMilwaukeeCalls();

    // Add to historical data (tracks all calls for the day)
    historicalData.addCalls(calls);

    const processedData = processCallData(calls);
    cache.set('milwaukee-calls', processedData);
    console.log('[Server] Initial scrape completed successfully');
  } catch (error) {
    console.error('[Server] Initial scrape failed:', error.message);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log('🚨 Milwaukee 911 Dashboard API Server');
  console.log('='.repeat(60));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: ${FRONTEND_URL}`);
  console.log(`⏰ Auto-scrape interval: Every 5 minutes`);
  console.log('='.repeat(60));
  console.log('Endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/calls`);
  console.log(`  POST http://localhost:${PORT}/api/calls/refresh`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log('='.repeat(60));

  // Perform initial scrape
  await initialScrape();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
