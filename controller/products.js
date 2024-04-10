const Product = require('../models/product');

const productController = {
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
  
  getProductById: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
  
  createProduct: async (req, res, next) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      next(error);
    }
  },
  
  updateProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  
  deleteProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      await Product.findByIdAndDelete(productId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
