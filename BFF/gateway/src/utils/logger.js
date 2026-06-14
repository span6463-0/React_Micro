export const logger = {
  info: (message) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      ...(typeof message === 'string' ? { message } : message),
    }));
  },

  warn: (message) => {
    console.warn(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      ...(typeof message === 'string' ? { message } : message),
    }));
  },

  error: (message) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      ...(typeof message === 'string' ? { message } : message),
    }));
  },

  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify({
        level: 'debug',
        timestamp: new Date().toISOString(),
        ...(typeof message === 'string' ? { message } : message),
      }));
    }
  },
};
