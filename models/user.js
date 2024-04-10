const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['user'] // Por padrão, cada novo usuário terá o papel 'user'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;