const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');

const normalizeEmail = (email) => email.toLowerCase().trim();

const findUserByIdentifier = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return User.findById(identifier);
  }
  const normalizedEmail = normalizeEmail(identifier);
  return User.findOne({ email: normalizedEmail });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(403).json({ error: 'E-mail já em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      roles: [role],
    });

    await user.save();

    user.password = undefined;

    res.status(200).json(user); 
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { identifier } = req.params;
    const data = req.body;

    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (data.email) {
      const existingUser = await User.findOne({
        email: normalizeEmail(data.email),
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(403).json({ error: 'O e-mail já está em uso por outro usuário' });
      }
    }

    Object.assign(user, data);

    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

const getUser = async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

module.exports = {
  getUsers, getUser, createUser, updateUser, deleteUser, findUserByIdentifier, normalizeEmail,
};
