import * as bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import config from './config/index';
import logger from './logger/index';
import Router from './router';
import ErrorHandler from './utils/error_handler_utils';

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
    this.initializeErrorHandler();
  }

  public listen () {
    this.app.listen(this.port, () => {
      console.log(`App in ${this.env} mode, listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares () {
    this.app.use(bodyParser.json());
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

  private connectToDatabase () {
    mongoose.connect(config.mongo.uri, { useNewUrlParser: true })
      .catch((err) => {
        console.log(`Error connecting to mongo database: ${err}`);
        process.exit(1);
      });
  }
}

export default App;
