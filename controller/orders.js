const Order = require('../models/order');
const Product = require('../models/product');

const orderController = {
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await Order.find().populate('userId').populate('products.product');
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },
  getOrderById: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId).populate('userId').populate('products.product');
      if (!order) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  },
  createOrder: async (req, res, next) => {
    try {
      const {
        userId, client, products, status, dateEntry,
      } = req.body;

      // Verifica se todos os produtos existem
      const productPromises = products.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Produto com ID ${item.product} não encontrado`);
        }
      });

      try {
        await Promise.all(productPromises);
      } catch (error) {
        return res.status(404).json({ error: error.message });
      }

      const newOrder = new Order({
        userId, client, products, status, dateEntry,
      });
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      next(error);
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true }).populate('userId').populate('products.product');
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
      }
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
