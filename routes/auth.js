const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { getUserByEmail } = require('../controller/users');

const { secret } = config;

router.post('/login', async (req, resp, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    // Busca o usuário no banco de dados pelo email
    const user = await getUserByEmail(email);

    if (!user) {
      return resp.status(404).json({ error: 'Credenciais inválidas' });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return resp.status(404).json({ error: 'Credenciais inválidas' });
    }

    // Gera token de autenticação usando o segredo do arquivo de configuração
    const accessToken = jwt.sign({ userId: user._id }, secret);

    return resp.status(200).json({ accessToken, user: { id: user._id, email: user.email, role: user.roles[0] } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
