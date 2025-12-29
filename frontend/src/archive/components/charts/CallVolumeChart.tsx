import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { motion } from 'framer-motion';
import { useCallStore } from '../../store/callStore';
import { darkTheme } from '../../utils/chartConfig';

export function CallVolumeChart() {
  const { callData } = useCallStore();

  if (!callData) return null;

  const { timeSeriesData } = callData;

  const options: Highcharts.Options = {
    ...darkTheme,
    chart: {
      ...darkTheme.chart,
      type: 'areaspline',
      height: 350,
    },
    title: {
      text: '📈 Call Volume Over Time',
      style: darkTheme.title?.style,
    },
    subtitle: {
      text: 'Last 24 Hours (Hourly)',
      style: darkTheme.subtitle?.style,
    },
    xAxis: {
      ...darkTheme.xAxis,
      categories: timeSeriesData.map(d => `${d.hour}:00`),
      title: {
        text: 'Hour of Day',
        style: darkTheme.xAxis?.title?.style,
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
      shared: true,
      crosshairs: true,
    },
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(0, 217, 255, 0.5)'],
            [1, 'rgba(0, 217, 255, 0.05)'],
          ],
        },
        lineColor: '#00d9ff',
        lineWidth: 3,
        marker: {
          enabled: true,
          fillColor: '#00d9ff',
          radius: 4,
          states: {
            hover: {
              radius: 6,
              lineWidth: 2,
              lineColor: '#ffffff',
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
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </motion.div>
  );
}
