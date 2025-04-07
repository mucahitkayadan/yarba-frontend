/**
 * Debug utility for better logging in development mode
 */

// Check if debug mode is enabled
const isDebugMode = process.env.REACT_APP_DEBUG === 'true';

// Create namespaced logger that only logs in debug mode
export const createDebugger = (namespace: string) => {
  // Return object with console methods that only work in debug mode
  return {
    log: (...args: any[]) => {
      if (isDebugMode) {
        console.log(`[${namespace}]`, ...args);
      }
    },
    info: (...args: any[]) => {
      if (isDebugMode) {
        console.info(`[${namespace}]`, ...args);
      }
    },
    warn: (...args: any[]) => {
      if (isDebugMode) {
        console.warn(`[${namespace}]`, ...args);
      }
    },
    error: (...args: any[]) => {
      // Always log errors, but add namespace in debug mode
      if (isDebugMode) {
        console.error(`[${namespace}]`, ...args);
      } else {
        console.error(...args);
      }
    },
    group: (label: string) => {
      if (isDebugMode) {
        console.group(`[${namespace}] ${label}`);
      }
    },
    groupEnd: () => {
      if (isDebugMode) {
        console.groupEnd();
      }
    },
    table: (data: any) => {
      if (isDebugMode) {
        console.log(`[${namespace}] Table:`);
        console.table(data);
      }
    }
  };
};

// Default debugger
export const debug = createDebugger('App');

export default debug; 