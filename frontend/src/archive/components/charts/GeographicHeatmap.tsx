import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { motion } from 'framer-motion';
import { useCallStore } from '../../store/callStore';
import { darkTheme } from '../../utils/chartConfig';

export function GeographicHeatmap() {
  const { callData } = useCallStore();

  if (!callData) return null;

  const { heatmapData, districtData } = callData;

  // If no coordinate data available, show district bar chart fallback
  if (heatmapData.length === 0) {
    const options: Highcharts.Options = {
      ...darkTheme,
      chart: {
        ...darkTheme.chart,
        type: 'bar',
        height: 400,
      },
      title: {
        text: '🗺️ Geographic Distribution',
        style: darkTheme.title?.style,
      },
      subtitle: {
        text: 'Calls by District (Map view requires coordinate data)',
        style: darkTheme.subtitle?.style,
      },
      xAxis: {
        ...darkTheme.xAxis,
        categories: districtData.map(d => `District ${d.district}`),
        title: {
          text: '',
        },
      },
      yAxis: {
        ...darkTheme.yAxis,
        title: {
          text: 'Number of Calls',
          style: darkTheme.yAxis?.title?.style,
        },
        min: 0,
      },
      tooltip: {
        ...darkTheme.tooltip,
        pointFormat: '<b>{point.y} calls</b>',
      },
      plotOptions: {
        bar: {
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: {
              color: '#ffffff',
              fontSize: '12px',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Calls',
          showInLegend: false,
          data: districtData.map((item, index) => ({
            name: `District ${item.district}`,
            y: item.count,
            color: ['#00d9ff', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#f97316'][index % 8],
          })),
        },
      ],
    };

    return (
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <HighchartsReact highcharts={Highcharts} options={options} />
      </motion.div>
    );
  }

  // Scatter plot on coordinate system for calls with lat/lon
  const options: Highcharts.Options = {
    ...darkTheme,
    chart: {
      ...darkTheme.chart,
      type: 'scatter',
      height: 500,
      zoomType: 'xy',
    },
    title: {
      text: '🗺️ Geographic Distribution',
      style: darkTheme.title?.style,
    },
    subtitle: {
      text: 'Call Locations (Click and drag to zoom)',
      style: darkTheme.subtitle?.style,
    },
    xAxis: {
      ...darkTheme.xAxis,
      title: {
        text: 'Longitude',
        style: darkTheme.xAxis?.title?.style,
      },
      gridLineWidth: 1,
    },
    yAxis: {
      ...darkTheme.yAxis,
      title: {
        text: 'Latitude',
        style: darkTheme.yAxis?.title?.style,
      },
    },
    tooltip: {
      ...darkTheme.tooltip,
      pointFormat: 'Lat: {point.y:.4f}<br/>Lon: {point.x:.4f}<br/>Intensity: {point.z}',
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 6,
          states: {
            hover: {
              enabled: true,
              lineColor: '#ffffff',
              lineWidth: 2,
            },
          },
        },
        states: {
          hover: {
            marker: {
              enabled: false,
            },
          },
        },
      },
    },
    series: [
      {
        type: 'scatter',
        name: 'Call Locations',
        showInLegend: false,
        data: heatmapData.map(point => ({
          x: point.lon,
          y: point.lat,
          z: point.value,
          color: getHeatColor(point.value, Math.max(...heatmapData.map(p => p.value))),
        })),
      },
    ],
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </motion.div>
  );
}

// Helper function to get heat color based on intensity
function getHeatColor(value: number, max: number): string {
  const ratio = value / max;

  if (ratio < 0.25) return '#10b981'; // Green (low)
  if (ratio < 0.5) return '#f59e0b'; // Amber
  if (ratio < 0.75) return '#f97316'; // Orange
  return '#ef4444'; // Red (high)
}
