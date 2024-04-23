const express = require('express');

const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controller/products');

router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);
router.post('/products', createProduct);
router.patch('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

module.exports = router;
