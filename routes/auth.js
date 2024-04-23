const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/user'); 

const { secret } = config;

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ error: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ error: 'Credenciais inválidas' });
    }

    const accessToken = jwt.sign({ userId: user._id }, secret);

    res.status(200).json({
      accessToken,
      user: { id: user._id, email: user.email, role: user.roles[0] },
    });
  } catch (error) {
    console.error('Erro ao processar login:', error);
    next(error);
  }
});

module.exports = router;
