exports.config = {
  environment: 'development',
  isDevelopment: true,
  logger: {
    level: 'info',
    db: require('../app/logger').info
  }
};
