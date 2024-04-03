const { requireAuth, requireAdmin } = require('./auth');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));
  app.all('*', (req, resp, nextAll) => nextAll(404));
  return next();
};

// Função para registrar os middlewares e rotas
const register = (app, routes, cb) => {
  if (!routes.length) {
    return cb();
  }

  routes[0](app, (err) => {
    if (err) {
      return cb(err);
    }
    return register(app, routes.slice(1), cb);
  });
};

// Exporta o módulo que registra as rotas e middlewares
module.exports = (app, next) => register(app, [
  requireAuth, // Middleware para autenticação
  requireAdmin, // Middleware para exigir autenticação de administrador
  users, // Rotas relacionadas aos usuários
  products, // Rotas relacionadas aos produtos
  orders, // Rotas relacionadas aos pedidos
  root, // Rota raiz
], next);
