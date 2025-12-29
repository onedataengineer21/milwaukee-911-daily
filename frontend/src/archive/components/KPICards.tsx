import { motion } from 'framer-motion';
import { useCallStore } from '../store/callStore';
import { formatNumber } from '../utils/formatNumber';

export function KPICards() {
  const { callData } = useCallStore();

  if (!callData) return null;

  const { stats, districtData, callTypeData, dailyStats } = callData;

  // Find most active district
  const mostActiveDistrict = districtData.length > 0
    ? districtData.reduce((max, d) => (d.count > max.count ? d : max), districtData[0])
    : null;

  // Find most common call type
  const mostCommonType = callTypeData.length > 0
    ? callTypeData[0]
    : null;

  const colorMap = {
    cyan: { bg: '#00d9ff', bgLight: 'rgba(0, 217, 255, 0.2)', border: 'rgba(0, 217, 255, 0.3)' },
    purple: { bg: '#a855f7', bgLight: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.3)' },
    pink: { bg: '#ec4899', bgLight: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.3)' },
    blue: { bg: '#3b82f6', bgLight: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.3)' },
  };

  const kpis = [
    {
      label: 'Total Calls Today',
      value: formatNumber(dailyStats?.totalCallsToday || stats.totalCalls),
      subtitle: dailyStats?.currentDate || 'Today',
      color: 'cyan' as const,
      icon: '📞',
    },
    {
      label: 'Active Calls',
      value: formatNumber(stats.activeCalls),
      subtitle: 'In Progress',
      color: 'purple' as const,
      icon: '🚔',
    },
    {
      label: 'Most Active District',
      value: mostActiveDistrict?.district || 'N/A',
      subtitle: `${formatNumber(mostActiveDistrict?.count || 0)} calls`,
      color: 'pink' as const,
      icon: '📍',
    },
    {
      label: 'Top Call Type',
      value: mostCommonType?.type || 'N/A',
      subtitle: `${formatNumber(mostCommonType?.count || 0)} calls`,
      color: 'blue' as const,
      icon: '🔔',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {kpis.map((kpi, index) => {
        const colors = colorMap[kpi.color];
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass-card p-6 relative overflow-hidden group"
          >
            {/* Background Gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to bottom right, ${colors.bgLight} 0%, transparent 100%)`,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{kpi.icon}</div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: colors.bgLight,
                    border: `1px solid ${colors.border}`,
                    color: colors.bg,
                  }}
                >
                  LIVE
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                  {kpi.label}
                </div>
                <motion.div
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                >
                  {kpi.value}
                </motion.div>
                <div className="text-sm text-gray-500">
                  {kpi.subtitle}
                </div>
              </div>
            </div>

            {/* Neon Border Effect */}
            <div
              className="absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 pointer-events-none"
              style={{
                borderColor: 'transparent',
              }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
