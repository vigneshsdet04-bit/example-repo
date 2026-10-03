'use strict';

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'aws-devops-api',
  appVersion: process.env.APP_VERSION || '1.0.0',
};

module.exports = config;
