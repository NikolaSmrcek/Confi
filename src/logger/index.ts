import * as bunyan from 'bunyan';
import * as fs from 'fs';
import * as _ from 'lodash';
import config from '../config/index';
import SpecificLevelStream from '../utils/specific_level_stream_utils';
import serializers from './serializers';
const loglevel = config.loglevel || process.env.LOG_LEVEL;
const loglevelUpper = loglevel && loglevel.toUpperCase();

const MIN_LOG_LEVEL = bunyan[loglevelUpper] || bunyan.DEBUG;
const FILE_STREAMS = [
  {
    level: bunyan.DEBUG,
    type: 'raw',
    stream: new SpecificLevelStream(
      ['debug'],
      fs.createWriteStream('log/debug.log', { flags: 'a', encoding: 'utf8' }),
    ),
  }, {
    level: bunyan.INFO,
    type: 'raw',
    stream: new SpecificLevelStream(
      ['info'],
      fs.createWriteStream('log/info.log', { flags: 'a', encoding: 'utf8' }),
    ),
  }, {
    level: bunyan.WARN,
    type: 'raw',
    stream: new SpecificLevelStream(
      ['warn'],
      fs.createWriteStream('log/warn.log', { flags: 'a', encoding: 'utf8' }),
    ),
  }, {
    level: bunyan.ERROR,
    type: 'raw',
    stream: new SpecificLevelStream(
      ['error'],
      fs.createWriteStream('log/error.log', { flags: 'a', encoding: 'utf8' }),
    ),
  }, {
    level: bunyan.FATAL,
    type: 'raw',
    stream: new SpecificLevelStream(
      ['fatal'],
      fs.createWriteStream('log/fatal.log', { flags: 'a', encoding: 'utf8' }),
    ),
  },
];

const streams = _.filter(FILE_STREAMS, stream => stream.level >= MIN_LOG_LEVEL);

const logger = bunyan.createLogger({
  streams,
  name: 'confi',
  serializers: _.assign({}, bunyan.stdSerializers, serializers),
  env: config.environment,
});

export default logger;
