import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { motion } from 'framer-motion';
import { useCallStore } from '../../store/callStore';
import { darkTheme, chartColorPalette } from '../../utils/chartConfig';

export function CallTypeBreakdown() {
  const { callData } = useCallStore();

  if (!callData) return null;

  const { callTypeData } = callData;

  // Take top 10 call types
  const topCallTypes = callTypeData.slice(0, 10);

  const options: Highcharts.Options = {
    ...darkTheme,
    chart: {
      ...darkTheme.chart,
      type: 'pie',
      height: 400,
    },
    title: {
      text: '🔔 Call Type Distribution',
      style: darkTheme.title?.style,
    },
    subtitle: {
      text: 'Top 10 Call Types',
      style: darkTheme.subtitle?.style,
    },
    tooltip: {
      ...darkTheme.tooltip,
      pointFormat: '<b>{point.percentage:.1f}%</b><br/>Count: {point.y}',
    },
    plotOptions: {
      pie: {
        innerSize: '50%', // Donut chart
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br/>{point.percentage:.1f}%',
          distance: 10,
          style: {
            color: '#ffffff',
            fontSize: '11px',
            textOutline: 'none',
          },
        },
        borderWidth: 0,
        states: {
          hover: {
            brightness: 0.1,
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Calls',
        colorByPoint: true,
        data: topCallTypes.map((item, index) => ({
          name: item.type,
          y: item.count,
          color: chartColorPalette[index % chartColorPalette.length],
        })),
      },
    ],
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </motion.div>
  );
}
