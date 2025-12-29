/**
 * Generate realistic dummy data for testing
 * Simulates a full day of 911 calls
 */

// Common call types from Milwaukee PD
const CALL_TYPES = [
  'ALARM',
  'BATTERY',
  'BURGLARY',
  'COMPLAINT',
  'DISTURBANCE',
  'PARKING',
  'PROPERTY DAMAGE',
  'SUSPICIOUS ACTIVITY',
  'THEFT',
  'TRAFFIC STOP',
  'TRESPASSING',
  'WELFARE CHECK',
];

const DISTRICTS = ['1', '2', '3', '4', '5', '6', '7'];

const STATUSES = ['Arrived', 'Dispatched', 'Enroute', 'Completed'];

// Milwaukee approximate bounds
const MILWAUKEE_BOUNDS = {
  minLat: 42.917,
  maxLat: 43.192,
  minLon: -88.055,
  maxLon: -87.882,
};

/**
 * Generate a random coordinate within Milwaukee
 */
function generateCoordinate() {
  const lat = MILWAUKEE_BOUNDS.minLat + Math.random() * (MILWAUKEE_BOUNDS.maxLat - MILWAUKEE_BOUNDS.minLat);
  const lon = MILWAUKEE_BOUNDS.minLon + Math.random() * (MILWAUKEE_BOUNDS.maxLon - MILWAUKEE_BOUNDS.minLon);
  return {
    type: 'coordinates',
    latitude: parseFloat(lat.toFixed(4)),
    longitude: parseFloat(lon.toFixed(4)),
  };
}

/**
 * Generate dummy calls for the entire day
 * More calls during peak hours (afternoon/evening)
 * Only 20 calls will be marked as active
 */
export function generateDailyDummyCalls() {
  const calls = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let callCounter = 1;

  // Generate calls for each hour of the day
  for (let hour = 0; hour < 24; hour++) {
    // Peak hours: 10am-2pm and 4pm-10pm have more calls
    let callsPerHour;
    if (hour >= 10 && hour < 14) {
      callsPerHour = 15 + Math.floor(Math.random() * 10); // 15-25 calls
    } else if (hour >= 16 && hour < 22) {
      callsPerHour = 20 + Math.floor(Math.random() * 15); // 20-35 calls
    } else if (hour >= 22 || hour < 6) {
      callsPerHour = 5 + Math.floor(Math.random() * 5); // 5-10 calls (night)
    } else {
      callsPerHour = 10 + Math.floor(Math.random() * 8); // 10-18 calls
    }

    for (let i = 0; i < callsPerHour; i++) {
      const timestamp = new Date(today);
      timestamp.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

      const call = {
        callNumber: `2025-${String(callCounter).padStart(6, '0')}`,
        timestamp: timestamp.toISOString(),
        location: generateCoordinate(),
        district: DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)],
        natureOfCall: CALL_TYPES[Math.floor(Math.random() * CALL_TYPES.length)],
        status: 'Completed', // Default to completed
      };

      calls.push(call);
      callCounter++;
    }
  }

  // Randomly select 20 calls to be active
  const activeIndices = new Set();
  while (activeIndices.size < 20 && activeIndices.size < calls.length) {
    const randomIndex = Math.floor(Math.random() * calls.length);
    activeIndices.add(randomIndex);
  }

  // Mark selected calls as active
  const activeStatuses = ['Dispatched', 'Enroute'];
  activeIndices.forEach(index => {
    calls[index].status = activeStatuses[Math.floor(Math.random() * activeStatuses.length)];
  });

  return calls;
}

/**
 * Process dummy calls data into analytics format
 */
export function processDummyData(calls) {
  // Time series (hourly buckets)
  const timeSeriesMap = new Map();
  for (let h = 0; h < 24; h++) {
    timeSeriesMap.set(h, 0);
  }

  calls.forEach(call => {
    const hour = new Date(call.timestamp).getHours();
    timeSeriesMap.set(hour, (timeSeriesMap.get(hour) || 0) + 1);
  });

  const timeSeriesData = Array.from(timeSeriesMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour - b.hour);

  // District aggregation
  const districtMap = new Map();
  calls.forEach(call => {
    districtMap.set(call.district, (districtMap.get(call.district) || 0) + 1);
  });

  const districtData = Array.from(districtMap.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => a.district.localeCompare(b.district));

  // Call type aggregation
  const callTypeMap = new Map();
  calls.forEach(call => {
    callTypeMap.set(call.natureOfCall, (callTypeMap.get(call.natureOfCall) || 0) + 1);
  });

  const callTypeData = Array.from(callTypeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Heatmap data with status
  const heatmapData = calls
    .filter(call => call.location.type === 'coordinates')
    .map(call => ({
      lat: call.location.latitude,
      lon: call.location.longitude,
      value: 1,
      status: call.status,
      callNumber: call.callNumber,
      natureOfCall: call.natureOfCall,
    }));

  // Stats
  const activeCalls = calls.filter(call => call.status === 'Dispatched' || call.status === 'Enroute').length;

  return {
    calls,
    recentCalls: calls.slice(-50), // Last 50 calls
    timeSeriesData,
    districtData,
    callTypeData,
    heatmapData,
    stats: {
      totalCalls: calls.length,
      activeCalls,
      last24HoursCalls: calls.length,
      callsWithCoordinates: heatmapData.length,
    },
    dailyStats: {
      totalCallsToday: calls.length,
      currentDate: new Date().toDateString(),
      oldestCall: calls.length > 0 ? calls[0].timestamp : null,
      newestCall: calls.length > 0 ? calls[calls.length - 1].timestamp : null,
    },
  };
}

// Generate and cache dummy data
let cachedDummyData = null;

export function getDummyData() {
  if (!cachedDummyData) {
    console.log('[Dummy] Generating full day of dummy data...');
    const calls = generateDailyDummyCalls();
    cachedDummyData = processDummyData(calls);
    console.log(`[Dummy] Generated ${calls.length} dummy calls for today`);
  }
  return cachedDummyData;
}

// Reset dummy data (for testing)
export function resetDummyData() {
  cachedDummyData = null;
}
