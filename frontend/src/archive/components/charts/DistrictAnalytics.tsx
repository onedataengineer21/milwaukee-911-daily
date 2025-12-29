import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { motion } from 'framer-motion';
import { useCallStore } from '../../store/callStore';
import { darkTheme } from '../../utils/chartConfig';

export function DistrictAnalytics() {
  const { callData } = useCallStore();

  if (!callData) return null;

  const { districtData } = callData;

  // Sort by district number (excluding "CITY")
  const sortedData = [...districtData]
    .filter(d => d.district !== 'CITY')
    .sort((a, b) => {
      const numA = parseInt(a.district);
      const numB = parseInt(b.district);
      return numA - numB;
    });

  // Color gradient from cyan (low) -> purple (mid) -> pink (high)
  const maxCount = Math.max(...sortedData.map(d => d.count), 1);
  const getColor = (count: number) => {
    const ratio = count / maxCount;

    // Smooth gradient interpolation
    if (ratio < 0.5) {
      // Cyan to Purple
      const localRatio = ratio * 2; // 0 to 1
      return interpolateColor('#00d9ff', '#a855f7', localRatio);
    } else {
      // Purple to Pink
      const localRatio = (ratio - 0.5) * 2; // 0 to 1
      return interpolateColor('#a855f7', '#ec4899', localRatio);
    }
  };

  // Helper function to interpolate between two hex colors
  const interpolateColor = (color1: string, color2: string, ratio: number) => {
    const hex = (x: string) => parseInt(x, 16);
    const r1 = hex(color1.substring(1, 3));
    const g1 = hex(color1.substring(3, 5));
    const b1 = hex(color1.substring(5, 7));
    const r2 = hex(color2.substring(1, 3));
    const g2 = hex(color2.substring(3, 5));
    const b2 = hex(color2.substring(5, 7));

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const options: Highcharts.Options = {
    ...darkTheme,
    chart: {
      ...darkTheme.chart,
      type: 'column',
      height: 400,
    },
    title: {
      text: '📍 Activity by Police District',
      style: darkTheme.title?.style,
    },
    subtitle: {
      text: 'Districts 1-7',
      style: darkTheme.subtitle?.style,
    },
    xAxis: {
      ...darkTheme.xAxis,
      categories: sortedData.map(d => `District ${d.district}`),
      title: {
        text: 'Police District',
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
      pointFormat: '<b>{point.y} calls</b><br/>',
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        borderRadius: 8,
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          style: {
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold',
            textOutline: 'none',
          },
        },
      },
    },
    series: [
      {
        type: 'column',
        name: 'Calls',
        showInLegend: false,
        data: sortedData.map((item) => ({
          name: `District ${item.district}`,
          y: item.count,
          color: getColor(item.count),
        })),
      },
    ],
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </motion.div>
  );
}
