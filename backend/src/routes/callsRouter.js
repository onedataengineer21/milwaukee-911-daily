import express from 'express';
import { scrapeMilwaukeeCalls, processCallData } from '../scraper/milwaukeeScraper.js';
import { cache } from '../services/cacheService.js';
import { historicalData } from '../services/historicalDataService.js';
import { getDummyData } from '../services/dummyDataService.js';

const router = express.Router();

const CACHE_KEY = 'milwaukee-calls';

/**
 * GET /api/calls
 * Returns current Milwaukee 911 call data with analytics
 * Data is cached for 5 minutes
 */
router.get('/calls', async (req, res) => {
  try {
    // Check cache first
    const cachedData = cache.get(CACHE_KEY);

    // Get historical stats for the entire day
    const dailyStats = historicalData.getStats();

    if (cachedData) {
      console.log('[API] Returning cached data');
      return res.json({
        success: true,
        cached: true,
        timestamp: new Date().toISOString(),
        ...cachedData,
        dailyStats, // Add cumulative daily statistics
      });
    }

    // Cache miss - scrape fresh data
    console.log('[API] Cache miss - scraping fresh data');
    const calls = await scrapeMilwaukeeCalls();

    // Add to historical data
    historicalData.addCalls(calls);

    const processedData = processCallData(calls);

    // Store in cache
    cache.set(CACHE_KEY, processedData);

    res.json({
      success: true,
      cached: false,
      timestamp: new Date().toISOString(),
      ...processedData,
      dailyStats, // Add cumulative daily statistics
    });

  } catch (error) {
    console.error('[API] Error fetching call data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call data',
      message: error.message,
    });
  }
});

/**
 * GET /api/calls/refresh
 * Forces a refresh of the cached data
 */
router.post('/calls/refresh', async (req, res) => {
  try {
    console.log('[API] Force refresh requested');
    cache.clear(CACHE_KEY);

    const calls = await scrapeMilwaukeeCalls();

    // Add to historical data
    historicalData.addCalls(calls);

    const processedData = processCallData(calls);

    cache.set(CACHE_KEY, processedData);

    // Get historical stats
    const dailyStats = historicalData.getStats();

    res.json({
      success: true,
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString(),
      ...processedData,
      dailyStats, // Add cumulative daily statistics
    });

  } catch (error) {
    console.error('[API] Error refreshing data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh call data',
      message: error.message,
    });
  }
});

/**
 * GET /api/calls/dummy
 * Returns dummy data for testing (full day of calls)
 */
router.get('/calls/dummy', (req, res) => {
  try {
    console.log('[API] Returning dummy data');
    const dummyData = getDummyData();

    res.json({
      success: true,
      dummy: true,
      timestamp: new Date().toISOString(),
      ...dummyData,
    });
  } catch (error) {
    console.error('[API] Error generating dummy data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate dummy data',
      message: error.message,
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const cacheStats = cache.getStats();

  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache: cacheStats,
  });
});

export default router;
