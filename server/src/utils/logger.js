export const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    }
  },
  error: (message, error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }
  },
  warn: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
  },
};
