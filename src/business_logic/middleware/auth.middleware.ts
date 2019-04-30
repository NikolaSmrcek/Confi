import express from 'express';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import config from '../../config/index';
import UserModel from '../users/user.model';
import RequestWithUser from './auth.interface';

class AuthMiddleware {
  constructor () {
    //
  }

  public isAdminUser (req: RequestWithUser, res: express.Response, next: express.NextFunction) {
    // config.jwt_secret
    const cookies = req.cookies;
    const invalidRightsError = { statusCode: 401, message: 'Insufficient rights.' };
    const authorization = _.get(cookies, 'Authorization', null);
    if (_.isEmpty(cookies) || _.isEmpty(authorization)) {
      return next(invalidRightsError);
    }
    const secret = config.jwt_secret;
    let jwtResponse = {} as any;
    try {
      jwtResponse = jwt.verify(authorization, secret) as any;
    } catch (e) {
      return next(_.merge({} as any, invalidRightsError, { stack: e.stack }));
    }
    const id = jwtResponse._id;
    return UserModel.findById(id)
      .then((user) => {
        if (_.isEmpty(user) || !user.isAdmin) {
          return next(invalidRightsError);
        }
        req.user = user;
        return next();
      })
      .catch(err => next(invalidRightsError));
  }
}

export default AuthMiddleware;
