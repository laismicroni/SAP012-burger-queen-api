const bcrypt = require('bcrypt');
const User = require('../models/user');

// Função para listar todos os usuários
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Função para obter informações de um usuário pelo ID
const getUserById = async (req, res, next) => {
  const { uid } = req.params;
  try {
    const user = await User.findById(uid).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Função para criar um novo usuário
const createUser = async (req, res, next) => {
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
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Função para modificar um usuário pelo ID
const updateUser = async (req, res, next) => {
  const { uid } = req.params;
  try {
    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Função para deletar um usuário pelo ID
const deleteUser = async (req, res, next) => {
  const { uid } = req.params;
  try {
    const user = await User.findByIdAndDelete(uid).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error(`Erro ao buscar usuário pelo e-mail: ${error.message}`);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getUserByEmail };
