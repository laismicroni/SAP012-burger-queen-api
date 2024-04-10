const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    
    req.userId = decodedToken.userId;
    next();
  });
};

module.exports.isAuthenticated = (req) => (
  !!req.userId
);

module.exports.isAdmin = async (req) => {
  const user = await User.findById(req.userId);
  
  // Verifique se o usuário existe e se tem permissão de administrador
  return user && user.role === 'admin';
};

module.exports.requireAuth = (req, resp, next) => (
  !module.exports.isAuthenticated(req)
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
      ? next(403)
      : next()
);
