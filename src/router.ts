import express from 'express';
import EventController from './business_logic/events/event.controller';
import AuthMiddleware from './business_logic/middleware/auth.middleware';
import UserController from './business_logic/users/user.controller';
import AuthenticationController from './services/authentication';

const authMiddleware = new AuthMiddleware();
const userController = new UserController();
class Router {
  public app: express.Application;
  constructor(app) {
    this.app = app;
  }

  public init() {
    this.app.get('/api/ping', (req, res, next) => res.send({ ping: { pong: true } }));
    this.app.post('/api/register', (req, res, next) => userController.register(req, res, next));
    this.app.post('/api/login', (req, res, next) => new AuthenticationController().login(req, res, next));
    this.app.get('/api/admin/bookings',
                 (req, res, next) => authMiddleware.isAdminUser(req, res, next),
                 (req, res, next) => userController.bookings(req, res, next),
    );
    this.app.delete('/api/admin/bookings/:id',
                    (req, res, next) => authMiddleware.isAdminUser(req, res, next),
                    (req, res, next) => new EventController().removeParticipant(req, res, next),
    );
  }
}

export default Router;
