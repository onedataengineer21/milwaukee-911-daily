import axios from 'axios';
import * as cheerio from 'cheerio';

const MILWAUKEE_PD_URL = process.env.MILWAUKEE_PD_URL || 'https://itmdapps.milwaukee.gov/MPDCallData/';

/**
 * Scrapes the Milwaukee PD Call Data website and parses 911 call information
 * @returns {Promise<Array>} Array of call objects
 */
export async function scrapeMilwaukeeCalls() {
  try {
    console.log('[Scraper] Fetching data from Milwaukee PD...');
    const response = await axios.get(MILWAUKEE_PD_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const calls = [];

    // Find the table - inspect actual HTML structure
    // The site uses a table to display call data
    $('table tr').each((index, row) => {
      // Skip header row
      if (index === 0) return;

      const cells = $(row).find('td');

      // Make sure we have enough cells
      if (cells.length < 5) return;

      try {
        const callNumber = $(cells[0]).text().trim();
        const dateTimeText = $(cells[1]).text().trim();
        const locationText = $(cells[2]).text().trim();
        const districtText = $(cells[3]).text().trim();
        const natureText = $(cells[4]).text().trim();
        const statusText = $(cells[5]) ? $(cells[5]).text().trim() : 'Unknown';

        // Skip if essential data is missing
        if (!callNumber || !dateTimeText) return;

        const call = {
          callNumber,
          timestamp: parseDateTime(dateTimeText),
          location: parseLocation(locationText),
          district: districtText,
          natureOfCall: natureText,
          status: statusText,
        };

        calls.push(call);
      } catch (err) {
        console.warn('[Scraper] Error parsing row:', err.message);
      }
    });

    console.log(`[Scraper] Successfully scraped ${calls.length} calls`);
    return calls;

  } catch (error) {
    console.error('[Scraper] Error scraping Milwaukee PD data:', error.message);
    throw new Error(`Failed to scrape data: ${error.message}`);
  }
}

/**
 * Parse date/time string from Milwaukee PD format
 * Expected format: "12/28/2025 14:30" or similar
 * @param {string} dateTimeText
 * @returns {Date}
 */
function parseDateTime(dateTimeText) {
  try {
    // Milwaukee PD format: "MM/DD/YYYY HH:MM"
    const cleaned = dateTimeText.trim();
    const date = new Date(cleaned);

    if (isNaN(date.getTime())) {
      // Fallback to current time if parsing fails
      console.warn(`[Scraper] Invalid date format: "${dateTimeText}", using current time`);
      return new Date();
    }

    return date;
  } catch (err) {
    console.warn(`[Scraper] Error parsing date "${dateTimeText}":`, err.message);
    return new Date();
  }
}

/**
 * Parse location string - handles both coordinates and addresses
 * Format 1: "LL: 43.0389, -87.9065" (coordinates)
 * Format 2: "123 MAIN ST" (street address)
 * @param {string} locationText
 * @returns {Object} Location object with type and coordinates or address
 */
function parseLocation(locationText) {
  const cleaned = locationText.trim();

  // Check for coordinate format: "LL: lat, lon"
  if (cleaned.startsWith('LL:')) {
    try {
      const coordStr = cleaned.replace('LL:', '').trim();
      const parts = coordStr.split(',').map(s => s.trim());

      if (parts.length >= 2) {
        const latitude = parseFloat(parts[0]);
        const longitude = parseFloat(parts[1]);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          return {
            type: 'coordinates',
            latitude,
            longitude,
          };
        }
      }
    } catch (err) {
      console.warn('[Scraper] Error parsing coordinates:', err.message);
    }
  }

  // Treat as street address
  return {
    type: 'address',
    address: cleaned || 'Unknown Location',
  };
}

/**
 * Process scraped calls into analytics data
 * @param {Array} calls - Raw call data
 * @returns {Object} Processed analytics
 */
export function processCallData(calls) {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Filter calls from last 24 hours
  const recentCalls = calls.filter(call => call.timestamp >= last24Hours);

  // Time series data (hourly buckets)
  const hourlyData = new Map();
  for (let i = 0; i < 24; i++) {
    const hourTime = new Date(now.getTime() - i * 60 * 60 * 1000);
    hourTime.setMinutes(0, 0, 0);
    hourlyData.set(hourTime.getHours(), { hour: hourTime.getHours(), count: 0 });
  }

  recentCalls.forEach(call => {
    const hour = call.timestamp.getHours();
    if (hourlyData.has(hour)) {
      hourlyData.get(hour).count++;
    }
  });

  const timeSeriesData = Array.from(hourlyData.values())
    .sort((a, b) => a.hour - b.hour);

  // District aggregation
  const districtMap = new Map();
  calls.forEach(call => {
    const district = call.district || 'UNKNOWN';
    districtMap.set(district, (districtMap.get(district) || 0) + 1);
  });

  const districtData = Array.from(districtMap.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count);

  // Call type aggregation
  const callTypeMap = new Map();
  calls.forEach(call => {
    const type = call.natureOfCall || 'Unknown';
    callTypeMap.set(type, (callTypeMap.get(type) || 0) + 1);
  });

  const callTypeData = Array.from(callTypeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Heatmap data (only calls with coordinates)
  const heatmapData = calls
    .filter(call => call.location.type === 'coordinates')
    .map(call => ({
      lat: call.location.latitude,
      lon: call.location.longitude,
      value: 1,
    }));

  // Status aggregation
  const activeCalls = calls.filter(call =>
    call.status && call.status.toLowerCase().includes('progress')
  ).length;

  return {
    calls,
    recentCalls,
    timeSeriesData,
    districtData,
    callTypeData,
    heatmapData,
    stats: {
      totalCalls: calls.length,
      activeCalls,
      last24HoursCalls: recentCalls.length,
      callsWithCoordinates: heatmapData.length,
    },
  };
}
