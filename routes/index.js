const express = require('express');
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');
const router = express.Router();

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
  const pkg = app.get('pkg');
  router.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));

  const routes = [authRoutes, usersRoutes, productsRoutes, ordersRoutes];

  registerRoutes(router, routes, next);

  app.use(router);
};