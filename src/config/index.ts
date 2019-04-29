import * as _ from 'lodash';
import defaultConfig from './app.json';

const env = process.env.NODE_ENV || 'development';

const config = _.merge({}, defaultConfig, _.get(defaultConfig, `environments.${env}`, {}));
config.environment = env;
delete config.environments;

export default config;
