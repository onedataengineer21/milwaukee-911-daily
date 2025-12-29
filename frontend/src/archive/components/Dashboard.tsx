import { Header } from './Header';
import { KPICards } from './KPICards';
import { CallVolumeChart } from './charts/CallVolumeChart';
import { CallTypeBreakdown } from './charts/CallTypeBreakdown';
import { DistrictAnalytics } from './charts/DistrictAnalytics';
import { GeographicHeatmap } from './charts/GeographicHeatmap';
import { useCallData } from '../hooks/useCallData';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { isLoading, isError, error, callData } = useCallData();

  if (isLoading && !callData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4 animate-pulse">🚨</div>
          <h2 className="text-2xl font-bold neon-text-cyan mb-2">Loading Dashboard...</h2>
          <p className="text-gray-400">Fetching live Milwaukee 911 data</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="glass-card p-12 text-center border-2 border-red-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'Failed to fetch call data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 glass-card hover:bg-neon-cyan/20 transition-all rounded-lg font-semibold"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        <Header />

        <KPICards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CallVolumeChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CallTypeBreakdown />
          <DistrictAnalytics />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <GeographicHeatmap />
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>
            Data sourced from{' '}
            <a
              href="https://itmdapps.milwaukee.gov/MPDCallData/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              Milwaukee Police Department
            </a>
          </p>
          <p className="mt-2">Auto-refreshes every 5 minutes</p>
        </motion.footer>
      </div>
    </div>
  );
}
