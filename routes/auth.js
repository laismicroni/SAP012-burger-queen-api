
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/users');
const { secret } = config;

module.exports = (app, nextMain) => {

  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    try {
      // Busca o usuário pelo e-mail fornecido
      const user = await User.findOne({ email });

      // Se o usuário não foi encontrado ou a senha não corresponde, retorna erro de autenticação
      if (!user || !(await user.comparePassword(password))) {
        return next(401);
      }

      // Se chegou até aqui, o usuário foi autenticado com sucesso
      // Gera o token JWT
      const token = jwt.sign({
        email: user.email,
        role: user.roles,
      }, secret);

      // Envia o token JWT como resposta
      resp.json({ token });

      next();
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      return next(500);
    }
  });

  return nextMain();
};
