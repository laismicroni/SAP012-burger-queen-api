const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controller/users');
const { requireAdmin, requireAuth } = require('../middleware/auth');

// Rota para listar todos os usuários (requer autenticação de administrador)
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Rota para obter informações de um usuário pelo ID (requer autenticação)
router.get('/users/:uid', requireAuth, async (req, res, next) => {
  const { uid } = req.params;
  try {
    const user = await getUser(uid);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Rota para criar um novo usuário (requer autenticação de administrador)
router.post('/users', requireAdmin, async (req, res, next) => {
  try {
    const newUser = await createUser(req, res);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para modificar um usuário por ID ou e-mail (requer autenticação)
router.patch('/users/:identifier', requireAuth, async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const { body } = req;

    const user = await getUser(identifier);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const updatedUser = await updateUser(user._id, body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});


// Rota para deletar um usuário por ID ou e-mail (requer autenticação)
router.delete('/users/:identifier', requireAuth, async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const user = await getUser(identifier);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const deletedUser = await deleteUser(user._id);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

module.exports = router;
