const mongoose = require('mongoose');
const Product = require('../models/product');

const findProductById = async (productId) => {
  if (mongoose.Types.ObjectId.isValid(productId)) {
    return Product.findById(productId);
  }
  return null;
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name, price, type, image,
    } = req.body;

    if (!name || typeof price !== 'number' || !type || !image) {
      return res.status(400).json({ error: 'Os campos nome, preço, tipo e imagem são obrigatórios' });
    }

    const newProduct = new Product({
      name, price, type, image,
    });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const product = await findProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    Object.assign(product, updateData);

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await findProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await findProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

module.exports = {
  getAllProducts, createProduct, updateProduct, getProductById, deleteProduct,
};
