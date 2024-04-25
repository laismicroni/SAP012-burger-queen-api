const express = require('express');
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));
  app.all('*', (req, resp, nextAll) => nextAll(404));
  return next();
};

const registerRoutes = (router, routes, next) => {
  if (!routes.length) {
    return next();
  }

  const currentRoute = routes[0];
  router.use(currentRoute);

  return registerRoutes(router, routes.slice(1), next);
};

module.exports = (app, next) => {
  const router = express.Router();

  const routes = [authRoutes, usersRoutes, productsRoutes, ordersRoutes, root];

  registerRoutes(router, routes, next);

  app.use(router);
};