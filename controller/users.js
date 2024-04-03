const User = require('../models/users');

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find(); 
      res.json(users); 
    } catch (err) {
      console.error('Error fetching users:', err);
      next(err); 
    }
  },

  createUser: async (req, res, next) => {
    try {
      const newUser = new User(req.body); 
      await newUser.save(); 
      res.status(201).send(newUser); 
    } catch (err) {
      console.error('Error creating user:', err);
      next(err); 
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { uid } = req.params; 
      const updatedUser = await User.findByIdAndUpdate(uid, req.body, { new: true }); // Return updated user
      res.json(updatedUser); 
    } catch (err) {
      console.error('Error updating user:', err);
      next(err); 
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { uid } = req.params; 
      await User.findByIdAndDelete(uid); 
      res.sendStatus(204); 
    } catch (err) {
      console.error('Error deleting user:', err);
      next(err); 
    }
  }
};
