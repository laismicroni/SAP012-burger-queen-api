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

    // Verify user identity using `decodedToken.userId`
    // Here you can fetch user data from the database if needed
    req.userId = decodedToken.userId;
    next();
  });
};

module.exports.isAuthenticated = (req) => (
  // Decide based on the request information whether the user is authenticated
  !!req.userId
);

module.exports.isAdmin = async (req) => {
  // Aqui você precisa buscar as informações do usuário com base no ID fornecido pelo token
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
