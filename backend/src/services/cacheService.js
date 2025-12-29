/**
 * Simple in-memory cache service for Milwaukee 911 call data
 * Stores data with TTL (time-to-live) and provides automatic expiration
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Store data in cache with timestamp
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   */
  set(key, data) {
    const entry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.ttl,
    };

    this.cache.set(key, entry);
    console.log(`[Cache] Stored data for key "${key}" (expires in ${this.ttl / 1000}s)`);
  }

  /**
   * Retrieve data from cache if not expired
   * @param {string} key - Cache key
   * @returns {*} Cached data or null if expired/not found
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`[Cache] Cache miss for key "${key}"`);
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      console.log(`[Cache] Cache expired for key "${key}"`);
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] Cache hit for key "${key}"`);
    return entry.data;
  }

  /**
   * Check if cache has valid data for key
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const data = this.get(key);
    return data !== null;
  }

  /**
   * Clear specific key from cache
   * @param {string} key - Cache key
   */
  clear(key) {
    this.cache.delete(key);
    console.log(`[Cache] Cleared cache for key "${key}"`);
  }

  /**
   * Clear all cached data
   */
  clearAll() {
    this.cache.clear();
    console.log('[Cache] Cleared all cache entries');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const valid = entries.filter(e => Date.now() <= e.expiresAt).length;
    const expired = entries.length - valid;

    return {
      totalEntries: this.cache.size,
      validEntries: valid,
      expiredEntries: expired,
      ttlSeconds: this.ttl / 1000,
    };
  }
}

// Export singleton instance
export const cache = new CacheService();
