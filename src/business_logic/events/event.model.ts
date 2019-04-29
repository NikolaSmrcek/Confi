import * as mongoose from 'mongoose';
import Event from './event.interface';

const eventSchema = new mongoose.Schema({
  city: String,
  name: String,
  startDate: String,
  participants: [
    {
      ref: 'users',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const eventModel = mongoose.model<Event & mongoose.Document>('events', eventSchema);

export default eventModel;
