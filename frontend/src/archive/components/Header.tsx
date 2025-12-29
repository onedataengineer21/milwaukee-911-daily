import { motion } from 'framer-motion';
import { useCallStore } from '../store/callStore';
import { formatDistance } from 'date-fns';

export function Header() {
  const { lastUpdate, isLoading } = useCallStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="text-5xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🚨
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold neon-text-cyan">
              Milwaukee 911
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Real-Time Emergency Call Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-neon-cyan ${isLoading ? 'animate-pulse' : 'live-pulse'}`} />
            <span className="text-sm font-medium text-gray-300">
              {isLoading ? 'UPDATING' : 'LIVE'}
            </span>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="text-sm text-gray-400 text-right">
              <div className="font-medium text-gray-300">Last Updated</div>
              <div>{formatDistance(lastUpdate, new Date(), { addSuffix: true })}</div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
