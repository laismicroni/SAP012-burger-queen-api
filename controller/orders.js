const Order = require('../models/order');

const orderController = {
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },
  
  getOrderById: async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);
      res.json(order);
    } catch (error) {
      next(error);
    }
  },
  
  createOrder: async (req, res, next) => {
    try {
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      next(error);
    }
  },
  
  updateOrder: async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
  
  deleteOrder: async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      await Order.findByIdAndDelete(orderId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
