/**
 * Static dummy data for production deployment
 * Generated once for consistent demo data
 */

// Helper function to generate dummy data
function generateDummyData() {
  const CALL_TYPES = [
    'ALARM', 'BATTERY', 'BURGLARY', 'COMPLAINT', 'DISTURBANCE',
    'PARKING', 'PROPERTY DAMAGE', 'SUSPICIOUS ACTIVITY', 'THEFT',
    'TRAFFIC STOP', 'TRESPASSING', 'WELFARE CHECK'
  ];

  const DISTRICTS = ['1', '2', '3', '4', '5', '6', '7'];

  const calls: any[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let callCounter = 1;

  // Generate calls for each hour
  for (let hour = 0; hour < 24; hour++) {
    let callsPerHour;
    if (hour >= 10 && hour < 14) {
      callsPerHour = 15 + Math.floor(Math.random() * 10);
    } else if (hour >= 16 && hour < 22) {
      callsPerHour = 20 + Math.floor(Math.random() * 15);
    } else if (hour >= 22 || hour < 6) {
      callsPerHour = 5 + Math.floor(Math.random() * 5);
    } else {
      callsPerHour = 10 + Math.floor(Math.random() * 8);
    }

    for (let i = 0; i < callsPerHour; i++) {
      const timestamp = new Date(today);
      timestamp.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

      const lat = 42.917 + Math.random() * (43.192 - 42.917);
      const lon = -88.055 + Math.random() * (-87.882 + 88.055);

      calls.push({
        callNumber: `2025-${String(callCounter).padStart(6, '0')}`,
        timestamp: timestamp.toISOString(),
        location: {
          type: 'coordinates',
          latitude: parseFloat(lat.toFixed(4)),
          longitude: parseFloat(lon.toFixed(4))
        },
        district: DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)],
        natureOfCall: CALL_TYPES[Math.floor(Math.random() * CALL_TYPES.length)],
        status: 'Completed'
      });

      callCounter++;
    }
  }

  // Mark 20 random calls as active
  const activeIndices = new Set<number>();
  while (activeIndices.size < 20 && activeIndices.size < calls.length) {
    activeIndices.add(Math.floor(Math.random() * calls.length));
  }

  activeIndices.forEach(index => {
    calls[index].status = Math.random() > 0.5 ? 'Dispatched' : 'Enroute';
  });

  return calls;
}

// Process data into analytics format
function processDummyData(calls: any[]) {
  // Time series
  const timeSeriesMap = new Map<number, number>();
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

  // District data
  const districtMap = new Map<string, number>();
  calls.forEach(call => {
    districtMap.set(call.district, (districtMap.get(call.district) || 0) + 1);
  });

  const districtData = Array.from(districtMap.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => a.district.localeCompare(b.district));

  // Call type data
  const callTypeMap = new Map<string, number>();
  calls.forEach(call => {
    callTypeMap.set(call.natureOfCall, (callTypeMap.get(call.natureOfCall) || 0) + 1);
  });

  const callTypeData = Array.from(callTypeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Heatmap data
  const heatmapData = calls.map(call => ({
    lat: call.location.latitude,
    lon: call.location.longitude,
    value: 1,
    status: call.status,
    callNumber: call.callNumber,
    natureOfCall: call.natureOfCall
  }));

  // Stats
  const activeCalls = calls.filter(call =>
    call.status === 'Dispatched' || call.status === 'Enroute'
  ).length;

  return {
    calls,
    timeSeriesData,
    districtData,
    callTypeData,
    heatmapData,
    stats: {
      totalCalls: calls.length,
      activeCalls
    },
    dailyStats: {
      totalCallsToday: calls.length,
      currentDate: new Date().toDateString()
    }
  };
}

// Generate and export the data
const generatedCalls = generateDummyData();
export const dummyData = processDummyData(generatedCalls);
