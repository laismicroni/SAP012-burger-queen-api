const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
    lowercase: true 
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

// Método para comparar a senha fornecida com a senha armazenada no banco de dados
userSchema.methods.comparePassword = async function(clientPassword) {
  try {
    return await bcrypt.compare(clientPassword, this.password);
  } catch (error) {
    console.error('Senha incorreta:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
