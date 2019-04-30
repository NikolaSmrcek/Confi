import express from 'express';
import * as _ from 'lodash';
import RequestWithUser from '../middleware/auth.interface';
import EventModel from './event.model';

class EventController {
  private eventId: string;
  private mongoObjectIdregex: RegExp;

  constructor () {
    // Should not be hardcoded but for purpose of requirements it can be for now.
    this.eventId = '5cc7562e1c9d440000d0eef6'; // Only event we have in db.
    this.mongoObjectIdregex = /^[0-9a-fA-F]{24}$/;
  }

  public removeParticipant (req: RequestWithUser, res: express.Response, next: express.NextFunction) {
    const userId = req.params.id;
    if (_.isEmpty(userId) || !this.isMongoObjectId(userId)) {
      return next({ statusCode: 400, message: 'Invalid mongoObject id.' });
    }
    return EventModel.findById(this.eventId)
      .then((event) => {
        event.participants = event.participants.filter(p => p.toString() !== userId);
        return event.save();
      })
      .then(event => res.status(204).send())
      .catch(next);
  }

  private isMongoObjectId (id: string) {
    return this.mongoObjectIdregex.test(id);
  }
}

export default EventController;
