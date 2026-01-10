import path from "path";

const defaultConfig = {
  development: {
    transport: {
      targets: [{
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'SYS:standard',
        }
      }]
    },
    level: 'debug'
  },
  production: {
    transport: {
      targets: [{
        target: 'pino/file',
        level: 'info',
        options: {
          destination: path.join(__dirname, '../../logs/app.log'),
          mkdir: true,
          sync: false
        }
      }]
    },
    level: 'info',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    messageKey: 'message',
    base: {
      env: process.env.NODE_ENV,
      version: process.env.npm_package_version
    }
  }
};

export default defaultConfig;