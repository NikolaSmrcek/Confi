import * as _ from 'lodash';
import defaultConfig from './app.json';

const env = process.env.NODE_ENV || 'development';

const config = _.merge({}, defaultConfig, _.get(defaultConfig, `environments.${env}`, {}));
config.environment = env;
delete config.environments;
config.mongo.path = process.env.MONGO_URI || config.mongo.uri;
config.mail.user = process.env.MAIL_USER || config.mail.user;
config.mail.password = process.env.MAIL_PW || config.mail.password;

export default config;
