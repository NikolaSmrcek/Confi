import * as express from 'express';
import * as _ from 'lodash';
import config from '../config/index';
import logger from '../logger/index';

class ErrorHandler {
  private DEFAULT_MESSAGE: string;
  private CODE_TO_MESSAGE: object;

  constructor () {
    this.DEFAULT_MESSAGE = 'Internal Server Error';
    this.CODE_TO_MESSAGE = {
      500: this.DEFAULT_MESSAGE,
    }
  }

  public handleError (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    const formatted = this.formatError(err, req, res);
    delete formatted.stack;
    if (!res.headersSent && formatted.statusCode >= 300) {
      res.status(formatted.statusCode).send(formatted);
    }
  }

  private createHttpError (error: any, req: express.Request, res: express.Response) {
    const code = error.statusCode || 500;
    const message = this.CODE_TO_MESSAGE[code] || error.message || this.DEFAULT_MESSAGE;
    const err = { message, statusCode: code, stack: error.stack };
    return this.handleLogging(err, req, res);
  }

  private formatError(error: any, req: express.Request, res: express.Response) {
    // If it's a string the its from Promise.reject with default of 400 statusCode
    let err = {
      statusCode: 400,
      message: error,
      stack: null,
    };
    // assuming it is a object
    if (!_.isString(error)) {
      err = error;
      err.statusCode = _.get(error, 'statusCode', 500);
      err.stack = error.stack;
    }
    return this.createHttpError(err, req, res);
  }

  private handleLogging (err: any, req: express.Request, res: express.Response) {
    if (err.statusCode >= 400 && err.statusCode < 500) {
      logger.error({ req, res, err }, 'error');
    } else if (err.statusCode >= 500) {
      logger.fatal({ req, res, err }, 'fatal');
    } else {
      logger.debug({ req, res, err }, 'debug');
    }
    this.shouldLogErrorToConsole(err);
    return err;
  }

  private shouldLogErrorToConsole (err: any) {
    if (err && config.consoleErrors) {
      console.log(err);
    }
  }
}

export default ErrorHandler;
