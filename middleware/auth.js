const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (secret) => async (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer' || !token) {
    console.log('Tipo de autorização inválido ou token ausente');
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.error('Verificação de token falhou:', err.message);

    err.status = 401;
    err.message = 'Token inválido ou expirado';
    next(err);
  }
};

module.exports.isAuthenticated = (req) => !!req.userId;

module.exports.isAdmin = async (req) => {
  const user = await User.findById(req.userId);

  const isAdmin = user && user.roles && user.roles.includes('admin');

  return isAdmin;
};

module.exports.requireAuth = (req, resp, next) => {
  if (!module.exports.isAuthenticated(req)) {
    const error = new Error('Token não fornecido ou inválido');
    error.status = 401;
    throw error;
  }
  next();
};

module.exports.requireAdmin = async (req, resp, next) => {
  if (!module.exports.isAuthenticated(req)) {
    const error = new Error('Token não fornecido ou inválido');
    error.status = 401;
    throw error;
  }

  const isAdmin = await module.exports.isAdmin(req);
  if (!isAdmin) {
    const error = new Error('Permissão de administrador não fornecida');
    error.status = 403;
    throw error;
  }
  next();
};
