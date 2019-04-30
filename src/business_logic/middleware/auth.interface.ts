import { Request } from 'express';
import UserInterface from '../users/user.interface';

interface RequestWithUser extends Request {
  user?: UserInterface;
}

export default RequestWithUser;
