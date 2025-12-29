import { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MilwaukeeMap } from './MilwaukeeMap';
import { DataTable } from './DataTable';

interface DailyStats {
  totalCallsToday: number;
  currentDate: string;
}

interface Stats {
  totalCalls: number;
  activeCalls: number;
}

interface DistrictData {
  district: string;
  count: number;
}

interface CallTypeData {
  type: string;
  count: number;
}

interface TimeSeriesData {
  hour: number;
  count: number;
}

interface HeatmapData {
  lat: number;
  lon: number;
  value: number;
  status?: string;
  callNumber?: string;
  natureOfCall?: string;
}

interface Call {
  callNumber: string;
  timestamp: string;
  district: string;
  natureOfCall: string;
  status: string;
  location: {
    type: string;
    latitude?: number;
    longitude?: number;
  };
}

interface DashboardData {
  stats: Stats;
  dailyStats: DailyStats;
  districtData: DistrictData[];
  callTypeData: CallTypeData[];
  timeSeriesData: TimeSeriesData[];
  heatmapData: HeatmapData[];
  calls: Call[];
}

export function SimpleDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data'>('dashboard');

  useEffect(() => {
    // Fetch dummy data
    axios.get('http://localhost:3001/api/calls/dummy')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading data</div>
      </div>
    );
  }

  const mostActiveDistrict = data.districtData.length > 0
    ? data.districtData.reduce((max, d) => (d.count > max.count ? d : max), data.districtData[0])
    : null;

  const topCallType = data.callTypeData.length > 0 ? data.callTypeData[0] : null;

  return (
    <div className="min-h-screen pt-12 px-8 pb-8" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Navigation */}
        <div className="mb-6 px-4 py-2 rounded-lg" style={{ backgroundColor: '#002147' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#FFB800', fontSize: '1.75rem', marginBottom: 0 }}>
                Milwaukee 911
              </h1>
              <p style={{ color: '#ffffff', opacity: 0.7, fontSize: '0.65rem', marginTop: 0 }}>
                {data.dailyStats.currentDate}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-10 py-4 rounded-xl font-extrabold text-lg transition-all cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: activeTab === 'dashboard' ? '#FFB800' : 'rgba(255, 184, 0, 0.1)',
                  color: activeTab === 'dashboard' ? '#002147' : '#FFB800',
                  border: '4px solid #FFB800',
                  boxShadow: activeTab === 'dashboard' ? '0 6px 16px rgba(255, 184, 0, 0.4)' : '0 2px 8px rgba(255, 184, 0, 0.2)',
                  letterSpacing: '0.5px',
                }}
              >
                DASHBOARD
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className="px-10 py-4 rounded-xl font-extrabold text-lg transition-all cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: activeTab === 'data' ? '#FFB800' : 'rgba(255, 184, 0, 0.1)',
                  color: activeTab === 'data' ? '#002147' : '#FFB800',
                  border: '4px solid #FFB800',
                  boxShadow: activeTab === 'data' ? '0 6px 16px rgba(255, 184, 0, 0.4)' : '0 2px 8px rgba(255, 184, 0, 0.2)',
                  letterSpacing: '0.5px',
                }}
              >
                DATA
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <>
            {/* Big Numbers - Horizontal Layout with Dividers */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex">
          {/* Total Calls Today */}
          <div className="p-10 border-t-4 flex-1" style={{ borderTopColor: '#FFB800' }}>
            <div className="text-xs font-extrabold tracking-wider mb-4" style={{ color: '#002147', opacity: 0.6 }}>
              TOTAL CALLS TODAY
            </div>
            <div className="text-7xl font-extrabold mb-2" style={{ color: '#002147' }}>
              {data.dailyStats.totalCallsToday.toLocaleString()}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px" style={{ backgroundColor: '#e5e7eb' }}></div>

          {/* Active Calls */}
          <div className="p-10 border-t-4 flex-1" style={{ borderTopColor: '#002147' }}>
            <div className="text-xs font-extrabold tracking-wider mb-4" style={{ color: '#002147', opacity: 0.6 }}>
              ACTIVE CALLS
            </div>
            <div className="text-7xl font-extrabold mb-2" style={{ color: '#FFB800' }}>
              {data.stats.activeCalls.toLocaleString()}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px" style={{ backgroundColor: '#e5e7eb' }}></div>

          {/* Most Active District */}
          <div className="p-10 border-t-4 flex-1" style={{ borderTopColor: '#FFB800' }}>
            <div className="text-xs font-extrabold tracking-wider mb-4" style={{ color: '#002147', opacity: 0.6 }}>
              MOST ACTIVE DISTRICT
            </div>
            <div className="text-7xl font-extrabold mb-2" style={{ color: '#002147' }}>
              {mostActiveDistrict ? `D${mostActiveDistrict.district}` : 'N/A'}
            </div>
            <div className="text-lg font-extrabold" style={{ color: '#FFB800' }}>
              {mostActiveDistrict ? `${mostActiveDistrict.count.toLocaleString()} calls` : ''}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px" style={{ backgroundColor: '#e5e7eb' }}></div>

          {/* Top Call Type */}
          <div className="p-10 border-t-4 flex-1" style={{ borderTopColor: '#002147' }}>
            <div className="text-xs font-extrabold tracking-wider mb-4" style={{ color: '#002147', opacity: 0.6 }}>
              TOP CALL TYPE
            </div>
            <div className="text-4xl font-extrabold mb-3" style={{ color: '#002147' }}>
              {topCallType ? topCallType.type : 'N/A'}
            </div>
            <div className="text-lg font-extrabold" style={{ color: '#FFB800' }}>
              {topCallType ? `${topCallType.count.toLocaleString()} calls` : ''}
            </div>
          </div>
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left Column - Charts */}
          <div className="space-y-6">
            {/* Line Chart - Call Volume Over Time */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={getLineChartOptions(data.timeSeriesData)}
              />
            </div>

            {/* Donut Chart - Call Type Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={getDonutChartOptions(data.callTypeData)}
              />
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#002147' }}>
              Active Call Locations
            </h2>
            <MilwaukeeMap heatmapData={data.heatmapData} />
          </div>
        </div>
        </>
        )}

        {/* Data View */}
        {activeTab === 'data' && (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#002147' }}>
              All Calls Today ({data.calls.length} total)
            </h2>
            <DataTable calls={data.calls} />
          </div>
        )}
      </div>
    </div>
  );
}

// Line Chart Configuration
function getLineChartOptions(timeSeriesData: TimeSeriesData[]): Highcharts.Options {
  return {
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      height: 315,
    },
    title: {
      text: 'Call Volume Over Time',
      style: {
        color: '#002147',
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
    subtitle: {
      text: 'Hourly Distribution',
      style: {
        color: '#002147',
        opacity: 0.6,
      },
    },
    xAxis: {
      categories: timeSeriesData.map(d => `${d.hour}:00`),
      title: {
        text: 'Hour of Day',
        style: { color: '#002147' },
      },
      labels: {
        style: { color: '#002147' },
      },
    },
    yAxis: {
      title: {
        text: 'Number of Calls',
        style: { color: '#002147' },
      },
      labels: {
        style: { color: '#002147' },
      },
      min: 0,
    },
    tooltip: {
      shared: true,
      backgroundColor: '#002147',
      style: { color: '#ffffff' },
    } as any,
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(255, 184, 0, 0.3)'],
            [1, 'rgba(255, 184, 0, 0.05)'],
          ],
        },
        lineColor: '#FFB800',
        lineWidth: 3,
        marker: {
          enabled: true,
          fillColor: '#FFB800',
          radius: 4,
          states: {
            hover: {
              radius: 6,
              lineWidth: 2,
              lineColor: '#002147',
            },
          },
        },
      },
    },
    series: [
      {
        type: 'areaspline',
        name: 'Calls',
        data: timeSeriesData.map(d => d.count),
        showInLegend: false,
      },
    ],
    credits: { enabled: false },
  };
}

// Donut Chart Configuration
function getDonutChartOptions(callTypeData: CallTypeData[]): Highcharts.Options {
  const topCallTypes = callTypeData.slice(0, 8);

  // Color palette with variations of Oxford Blue and Selective Yellow
  const colorPalette = [
    '#002147', // Oxford Blue
    '#FFB800', // Selective Yellow
    '#003D7A', // Lighter Oxford Blue
    '#FFC933', // Lighter Yellow
    '#00152E', // Darker Oxford Blue
    '#E6A600', // Darker Yellow
    '#0056A3', // Medium Blue
    '#FFD666', // Light Yellow
  ];

  return {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 315,
    },
    title: {
      text: 'Call Type Distribution',
      style: {
        color: '#002147',
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
    subtitle: {
      text: 'Top Call Types',
      style: {
        color: '#002147',
        opacity: 0.6,
      },
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b><br/>Count: {point.y}',
      backgroundColor: '#002147',
      style: { color: '#ffffff' },
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br/>{point.percentage:.1f}%',
          distance: 10,
          style: {
            color: '#002147',
            fontSize: '11px',
            textOutline: 'none',
          },
        },
        borderWidth: 0,
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Calls',
        data: topCallTypes.map((item, index) => ({
          name: item.type,
          y: item.count,
          color: colorPalette[index % colorPalette.length],
        })),
      } as any,
    ],
    credits: { enabled: false },
  };
}

