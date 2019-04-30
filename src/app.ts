import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import swagger from 'swagger-ui-express';
import YAML from 'yamljs';
import config from './config/index';
import logger from './logger/index';
import Router from './router';
import ErrorHandler from './utils/error_handler_utils';
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

class App {
  public app: express.Application;
  public env: string;
  public port: number;
  private router: Router;
  private errorHandler: ErrorHandler;

  constructor () {
    this.app = express();
    this.env = config.environment;
    this.port = config.port;
    this.errorHandler = new ErrorHandler();

    // TODO change the call flow so that we call rest after the connection is established.
    this.connectToDatabase();
    this.initializeMiddlewares();

    // Initializing routes
    this.router = new Router(this.app);
    this.router.init();
    this.initSwaggerDocs();
    this.initializeErrorHandler();
  }

  public listen () {
    this.app.listen(this.port, () => {
      console.log(`App in ${this.env} mode, listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares () {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      function afterResponse() {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);
        if (res.statusCode && res.statusCode < 300) {
          logger.debug({ res, req, err: {} }, 'debug');
        }
      }

      res.on('finish', afterResponse);
      res.on('close', afterResponse);
      next();
    });
  }

  private initializeErrorHandler () {
    this.app.use(this.errorHandler.handleError.bind(this.errorHandler));
  }

  private initSwaggerDocs () {
    if (config.shouldLoadSwagger) {
      this.app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));
    }
  }

  private connectToDatabase () {
    mongoose.connect(config.mongo.uri, { useNewUrlParser: true })
      .catch((err) => {
        console.log(`Error connecting to mongo database: ${err}`);
        process.exit(1);
      });
  }
}

export default App;
