/**
 * Performance utilities to prevent crashes and improve app responsiveness
 */

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to ensure a function is called at most once in a specified time period
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Safe async wrapper to prevent unhandled promise rejections
 * @param {Promise} promise - The promise to wrap
 * @param {any} defaultValue - Default value to return on error
 * @returns {Promise} - Wrapped promise that won't reject
 */
export const safeAsync = async (promise, defaultValue = null) => {
  try {
    return await promise;
  } catch (error) {
    console.error('Safe async error:', error);
    return defaultValue;
  }
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} - Result of the function
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  delay = 1000,
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

/**
 * Batch multiple function calls into a single execution
 * @param {Function} func - The function to batch
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} - The batched function
 */
export const batchCalls = (func, wait = 100) => {
  let timeout;
  let calls = [];
  
  return function executedFunction(...args) {
    calls.push(args);
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      if (calls.length > 0) {
        func(calls);
        calls = [];
      }
    }, wait);
  };
};

/**
 * Memoize function results to avoid redundant calculations
 * @param {Function} func - The function to memoize
 * @returns {Function} - The memoized function
 */
export const memoize = (func) => {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * Create a cancelable promise
 * @param {Promise} promise - The promise to make cancelable
 * @returns {Object} - Object with promise and cancel function
 */
export const makeCancelable = (promise) => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(value => (isCanceled ? reject({isCanceled}) : resolve(value)))
      .catch(error => (isCanceled ? reject({isCanceled}) : reject(error)));
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
};

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the wait
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if app is in idle state (no user interaction)
 * @param {number} timeout - Timeout in milliseconds
 * @param {Function} callback - Callback to execute when idle
 * @returns {Function} - Cleanup function
 */
export const onIdle = (timeout = 60000, callback) => {
  let idleTimer;
  
  const resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(callback, timeout);
  };
  
  // Reset timer on any user interaction
  const events = ['touchstart', 'touchmove', 'touchend'];
  events.forEach(event => {
    document?.addEventListener?.(event, resetTimer);
  });
  
  resetTimer();
  
  // Return cleanup function
  return () => {
    clearTimeout(idleTimer);
    events.forEach(event => {
      document?.removeEventListener?.(event, resetTimer);
    });
  };
};

/**
 * Safely parse JSON without throwing errors
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} - Parsed object or default value
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
};

/**
 * Deep clone an object safely
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
export const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Deep clone error:', error);
    return obj;
  }
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} - True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Format error message for display
 * @param {Error|string} error - Error object or string
 * @returns {string} - Formatted error message
 */
export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};

/**
 * Cleanup function to prevent memory leaks
 * @param {Array} cleanupFunctions - Array of cleanup functions
 * @returns {Function} - Combined cleanup function
 */
export const createCleanup = (...cleanupFunctions) => {
  return () => {
    cleanupFunctions.forEach(fn => {
      try {
        if (typeof fn === 'function') fn();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
  };
};
