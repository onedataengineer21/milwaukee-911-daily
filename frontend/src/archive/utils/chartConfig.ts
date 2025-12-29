import type { Options } from 'highcharts';

/**
 * Dark theme configuration for Highcharts
 * Matches the glassmorphic design with neon accents
 */
export const darkTheme: Partial<Options> = {
  chart: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    style: {
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    spacing: [20, 20, 20, 20],
  },
  title: {
    style: {
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: 'bold',
    },
  },
  subtitle: {
    style: {
      color: '#a0aec0',
      fontSize: '14px',
    },
  },
  xAxis: {
    gridLineColor: 'rgba(255, 255, 255, 0.1)',
    labels: {
      style: {
        color: '#a0aec0',
        fontSize: '12px',
      },
    },
    lineColor: 'rgba(255, 255, 255, 0.2)',
    tickColor: 'rgba(255, 255, 255, 0.2)',
    title: {
      style: {
        color: '#ffffff',
      },
    },
  },
  yAxis: {
    gridLineColor: 'rgba(255, 255, 255, 0.1)',
    labels: {
      style: {
        color: '#a0aec0',
        fontSize: '12px',
      },
    },
    lineColor: 'rgba(255, 255, 255, 0.2)',
    tickColor: 'rgba(255, 255, 255, 0.2)',
    title: {
      style: {
        color: '#ffffff',
      },
    },
  },
  legend: {
    itemStyle: {
      color: '#ffffff',
      fontSize: '12px',
    },
    itemHoverStyle: {
      color: '#00d9ff',
    },
    itemHiddenStyle: {
      color: '#4a5568',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderColor: '#00d9ff',
    borderRadius: 8,
    borderWidth: 1,
    style: {
      color: '#ffffff',
      fontSize: '13px',
    },
    shadow: {
      color: 'rgba(0, 217, 255, 0.3)',
      offsetX: 0,
      offsetY: 0,
      opacity: 0.5,
      width: 10,
    },
  },
  plotOptions: {
    series: {
      animation: {
        duration: 1000,
      },
      dataLabels: {
        color: '#ffffff',
        style: {
          fontSize: '11px',
          textOutline: 'none',
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
};

/**
 * Neon color palette for charts
 */
export const neonColors = {
  cyan: '#00d9ff',
  purple: '#a855f7',
  pink: '#ec4899',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  orange: '#f97316',
};

/**
 * Vibrant color array for multi-series charts (pie, bar, etc.)
 * Optimized for dark backgrounds with good contrast
 */
export const chartColorPalette = [
  '#00d9ff', // Cyan
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#f97316', // Orange
  '#06b6d4', // Light Cyan
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#eab308', // Yellow
];

/**
 * Gradient colors for area charts
 */
export const gradientColors = [
  {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
      [0, 'rgba(0, 217, 255, 0.5)'],
      [1, 'rgba(0, 217, 255, 0.05)'],
    ],
  },
  {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
      [0, 'rgba(168, 85, 247, 0.5)'],
      [1, 'rgba(168, 85, 247, 0.05)'],
    ],
  },
];
