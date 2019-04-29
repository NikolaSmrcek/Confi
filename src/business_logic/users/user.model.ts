import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  address: addressSchema,
  email: String,
  isAdmin: Boolean,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  password: String,
});

const userModel = mongoose.model<User & mongoose.Document>('users', userSchema);

export default userModel;
