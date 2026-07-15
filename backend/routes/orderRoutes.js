const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, seller } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/seller/mine', protect, seller, getSellerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, seller, updateOrderStatus);

module.exports = router;
