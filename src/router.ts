// new controller
// import PostsController from './posts/posts.controller';
import express from 'express';

class Router {
  public app: express.Application;
  constructor(app) {
    this.app = app;
  }

  public init() {
    this.app.get('/api/ping', (req, res, next) => res.send({ ping: { pong: true } }));
  }
}

export default Router;
