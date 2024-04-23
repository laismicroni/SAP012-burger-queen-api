const express = require('express');

const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controller/users');
const { requireAdmin, requireAuth } = require('../middleware/auth');

router.get('/users', requireAdmin, getUsers);
router.get('/users/:identifier', requireAuth, getUser);
router.post('/users', requireAdmin, createUser);
router.patch('/users/:identifier', requireAuth, updateUser);
router.delete('/users/:identifier', requireAuth, deleteUser);

module.exports = router;
