export const logger = {
  info: (msg) => console.log(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), ...(typeof msg === 'string' ? { message: msg } : msg) })),
  warn: (msg) => console.warn(JSON.stringify({ level: 'warn', timestamp: new Date().toISOString(), ...(typeof msg === 'string' ? { message: msg } : msg) })),
  error: (msg) => console.error(JSON.stringify({ level: 'error', timestamp: new Date().toISOString(), ...(typeof msg === 'string' ? { message: msg } : msg) })),
  debug: (msg) => process.env.NODE_ENV !== 'production' && console.debug(JSON.stringify({ level: 'debug', timestamp: new Date().toISOString(), ...(typeof msg === 'string' ? { message: msg } : msg) })),
};
