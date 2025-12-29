export interface Call911 {
  callNumber: string;
  timestamp: string | Date;
  location: {
    type: 'address' | 'coordinates';
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  district: string;
  natureOfCall: string;
  status: string;
}

export interface TimeSeriesData {
  hour: number;
  count: number;
}

export interface DistrictData {
  district: string;
  count: number;
}

export interface CallTypeData {
  type: string;
  count: number;
}

export interface HeatmapPoint {
  lat: number;
  lon: number;
  value: number;
}

export interface CallDataStats {
  totalCalls: number;
  activeCalls: number;
  last24HoursCalls: number;
  callsWithCoordinates: number;
}

export interface DailyStats {
  totalCallsToday: number;
  currentDate: string;
  oldestCall: string | null;
  newestCall: string | null;
}

export interface CallDataResponse {
  success: boolean;
  cached: boolean;
  timestamp: string;
  calls: Call911[];
  recentCalls: Call911[];
  timeSeriesData: TimeSeriesData[];
  districtData: DistrictData[];
  callTypeData: CallTypeData[];
  heatmapData: HeatmapPoint[];
  stats: CallDataStats;
  dailyStats?: DailyStats; // Cumulative stats for entire day
}
