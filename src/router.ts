import express from 'express';
import UserController from './business_logic/users/user.controller';

class Router {
  public app: express.Application;
  constructor(app) {
    this.app = app;
  }

  public init() {
    this.app.get('/api/ping', (req, res, next) => res.send({ ping: { pong: true } }));
    this.app.post('/api/register', (req, res, next) => new UserController().register(req, res, next));
  }
}

export default Router;
