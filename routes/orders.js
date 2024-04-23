const express = require('express');

const router = express.Router();
const orderController = require('../controller/orders');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/orders', requireAdmin, orderController.getAllOrders);
router.get('/orders/:orderId', requireAuth, orderController.getOrderById);
router.post('/orders', requireAuth, orderController.createOrder);
router.patch('/orders/:orderId', requireAuth, orderController.updateOrder);
router.delete('/orders/:orderId', requireAuth, orderController.deleteOrder);

module.exports = router;
