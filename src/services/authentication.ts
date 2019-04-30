import * as bcrypt from 'bcrypt';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import User from '../business_logic/users/user.interface';
import UserModel from '../business_logic/users/user.model';
import config from '../config/index';

class AuthenticationController {
  constructor () {
    //
  }

  public login (req: express.Request, res: express.Response, next: express.NextFunction) {
    const loginData = req.body;
    const invalidDataError = { statusCode: 400, message: 'Invalid login data provided.' };
    if (!_.isString(loginData.email) || !_.isString(loginData.password)) {
      return next(invalidDataError);
    }
    // Finding the user with email provided
    let user = {} as any;
    return UserModel.findOne({ email: loginData.email })
      .then((userData) => {
        if (_.isEmpty(userData)) {
          return Promise.reject(invalidDataError);
        }
        user = userData;
        return bcrypt.compare(loginData.password, userData.password);
      })
      .then((matches) => {
        if (!matches) {
          return next(invalidDataError);
        }
        user.password = undefined;
        const tokenData = this.createToken(user);
        res.setHeader('X-Set-Cookie', [this.createCookie(tokenData)]);
        return res.status(200).send({ status: 'success' });
      })
      .catch(next);

  }

  private createCookie(tokenData: any) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User) {
    const expiresIn = 60 * 60 * 24; // 24 hours
    const secret = config.jwt_secret;
    const dataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationController;
