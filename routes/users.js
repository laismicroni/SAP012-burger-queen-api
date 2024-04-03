const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { getUsers, createUser, updateUser, deleteUser } = require('../controller/users');

const initAdminUser = async (app, next) => {
  try {
    const { adminEmail, adminPassword } = app.get('config');
    if (!adminEmail || !adminPassword) {
      return next();
    }

    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({ email: adminEmail, password: hashedPassword, roles: 'admin' });
      console.log('Admin user created successfully');
    }
    next();
  } catch (err) {
    console.error('Error initializing admin user:', err);
    next(err);
  }
};

module.exports = (app, next) => {
  app.get('/users', requireAdmin, getUsers);
  app.post('/users', requireAdmin, createUser);
  app.put('/users/:uid', requireAdmin, updateUser);
  app.delete('/users/:uid', requireAdmin, deleteUser);
  initAdminUser(app, next);
};
