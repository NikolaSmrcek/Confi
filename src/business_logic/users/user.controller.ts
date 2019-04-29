import express from 'express';
import * as _ from 'lodash';
import config from '../../config/index';
import EmailService from '../../services/email';
import EventModel from '../events/event.model';
import UserModel from './user.model';

class UserController {
  private emailRegex: RegExp;
  private eventId: string;
  private emailOptionsTemplate: object;

  constructor () {
    this.emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    // Should not be hardcoded but for purpose of requirements it can be for now.
    this.eventId = '5cc7562e1c9d440000d0eef6'; // Only event we have in db.
    this.emailOptionsTemplate = {
      from: config.mail.user,
      subject: 'NoReply: Conference participation confirmed!',
    };
  }

  public register (req: express.Request, res: express.Response, next: express.NextFunction): any {
    const userData = req.body;
    const invalidProperties = ['firstName', 'lastName', 'phoneNumber', 'email'].filter(i => !_.isString(userData[i]));
    if (invalidProperties.length > 0) {
      return next({ statusCode: 400, message: 'Invalid user data for registration!' });
    }
    if (!this.isValidEmailFormat(userData.email)) {
      return next({ statusCode: 400, message: 'Invalid email format.' });
    }
    // check if the user exists
    let user = {} as any;
    return UserModel.findOne({ email: userData.email })
      .then((foundUser) => {
        if (!_.isEmpty(foundUser)) {
          return Promise.reject({ statusCode: 400, message: 'User with the provided email already exists.' });
        }
        const createdUser = new UserModel(userData);
        return createdUser.save();
      })
      .then((savedUser) => {
        // adding user to the event
        user = savedUser;
        return EventModel.findById(this.eventId);
      })
      .then((event) => {
        event.participants.push(user);
        return event.save();
      })
      .then((savedEvent) => {
        const message = `Successfully applied for conference ${savedEvent.name} starting ${savedEvent.startDate}!`;
        res.status(201).send({ message, status: 'success' });
        let emailOptions = _.merge({} as any, this.emailOptionsTemplate);
        emailOptions.to = user.email;
        emailOptions.text = `${message}. See you there!`;
        return EmailService.sendMail(emailOptions);
      })
      .catch(next);
  }

  private isValidEmailFormat (email) {
    return this.emailRegex.test(email);
  }
}

export default UserController;
