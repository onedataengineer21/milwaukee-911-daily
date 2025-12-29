/**
 * Service to track historical call data throughout the day
 * Stores all calls and resets at midnight
 */
class HistoricalDataService {
  constructor() {
    this.dailyCalls = [];
    this.currentDate = new Date().toDateString();
    this.resetAtMidnight();
  }

  /**
   * Add new calls to historical data
   * @param {Array} calls - Array of call objects
   */
  addCalls(calls) {
    const today = new Date().toDateString();

    // Reset data if it's a new day
    if (today !== this.currentDate) {
      console.log('[Historical] New day detected, resetting data');
      this.dailyCalls = [];
      this.currentDate = today;
    }

    // Add new calls (avoid duplicates by call number)
    calls.forEach(call => {
      const exists = this.dailyCalls.some(c => c.callNumber === call.callNumber);
      if (!exists) {
        this.dailyCalls.push(call);
      }
    });

    console.log(`[Historical] Total calls today: ${this.dailyCalls.length}`);
  }

  /**
   * Get all calls for today
   * @returns {Array}
   */
  getTodaysCalls() {
    return this.dailyCalls;
  }

  /**
   * Get statistics for today
   * @returns {Object}
   */
  getStats() {
    return {
      totalCallsToday: this.dailyCalls.length,
      currentDate: this.currentDate,
      oldestCall: this.dailyCalls.length > 0 ? this.dailyCalls[0].timestamp : null,
      newestCall: this.dailyCalls.length > 0 ? this.dailyCalls[this.dailyCalls.length - 1].timestamp : null,
    };
  }

  /**
   * Schedule automatic reset at midnight
   */
  resetAtMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow - now;

    setTimeout(() => {
      console.log('[Historical] Midnight reset triggered');
      this.dailyCalls = [];
      this.currentDate = new Date().toDateString();
      this.resetAtMidnight(); // Schedule next reset
    }, timeUntilMidnight);

    console.log(`[Historical] Next reset scheduled in ${Math.round(timeUntilMidnight / 1000 / 60)} minutes`);
  }
}

export const historicalData = new HistoricalDataService();
