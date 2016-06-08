/**
 * Default Configuration.
 * See https://github.com/mozilla/node-convict/blob/master/README.md for details.
 */
var convict = require('convict');
var fs = require('fs');

module.exports = function () {

  var env = process.env.NODE_ENV || 'dev';
  var configFile = process.env.FREIGHT_CONFIG || __dirname + '/' + env + '.json';

  var conf = convict({
    env: {
      doc: 'The applicaton environment.',
      format: [ 'dev', 'test', 'stage', 'prod', 'production' ],
      default: 'dev',
      env: 'NODE_ENV'
    },
    log: {
      level: {
        default: 'info',
        env: 'LOG_LEVEL'
      }
    },
    ip: {
      doc: 'The IP address to bind.',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'IP_ADDRESS'
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 8872,
      env: 'PORT'
    },
    limit: {
      doc: 'The bundle transmission size limit, in kb.',
      format: 'nat',
      default: 500,
      env: 'LIMIT'
    },
    password: {
      doc: 'The password that is used to create Freight bundles.',
      format: String,
      default: '',
      env: 'FREIGHT_PASSWORD'
    },
    storage: {
      // TODO: You need to create this directory if it does not exist.
      // This directory is also used as a static file directory for Freight bundles.
      doc: 'Default bundle storage directory. Make sure it is somewhere in the Freight Server directory.',
      format: String,
      default: __dirname + '/../storage',
      env: 'STORAGE_DIRECTORY'
    },
    tempDir: {
      // TODO: You need to create this directory if it does not exist.
      doc: 'Default directory for temporary files.',
      format: String,
      default: __dirname + '/../temp',
      env: 'TEMP_DIRECTORY'
    },
    // Redis config, see https://github.com/learnboost/kue#redis-connection-settings
    redis: {
      port: {
        doc: 'Redis Port',
        format: 'port',
        default: 6379,
        env: 'REDIS_PORT'
      },
      host: {
        doc: 'Redis IP address to bind.',
        format: String,
        default: '127.0.0.1',
        env: 'REDIS_HOST'
      },
      auth: {
        doc: 'Redis Password.',
        format: String,
        default: '',
        env: 'REDIS_PASSWORD'
      },
      // TODO : see how we can extract redis options from env variables
      options: {
        doc: 'Redis Options.',
        format: Object,
        default: {}
      }
    },
    track: {
      delay: {
        doc: 'Repository update check delay in milliseconds',
        format: 'nat',
        default: 60 * 60000,
        env: 'TRACK_DELAY'
      }
    }
  });

  // load environment dependent configuration
  if (fs.existsSync(configFile)) {
    // TODO: development only for now, change it later.
    conf.loadFile(configFile);
  }
  // perform configuration validation
  conf.validate();

  return conf;
};
