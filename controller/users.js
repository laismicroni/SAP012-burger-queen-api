const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');

// Função para listar todos os usuários
const getUsers = async () => {
  try {
    const users = await User.find({}).select('-password');
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    throw new Error('Erro ao buscar usuários');
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      roles: [role]
    });
    await user.save();
    // Remova a senha do usuário antes de enviar a resposta
    user.password = undefined;
    return user; // Retorna o usuário criado
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};


// Função para modificar um usuário pelo ID
const updateUser = async (uid, data) => {
  try {
    const user = await User.findByIdAndUpdate(uid, data, { new: true }).select('-password');
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    throw error;
  }
};

// Função para buscar um usuário pelo ID ou e-mail
const getUser = async (identifier) => {
  try {
    let user;

    // Verificar se o identificador é um ID MongoDB válido
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier).select('-password');
    } else {
      const normalizedEmail = identifier.trim().toLowerCase();
      user = await User.findOne({ email: normalizedEmail }).select('-password');
    }

    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

// Função para deletar um usuário pelo ID
const deleteUser = async (uid) => {
  try {
    const user = await User.findByIdAndDelete(uid).select('-password');
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
    throw error;
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
