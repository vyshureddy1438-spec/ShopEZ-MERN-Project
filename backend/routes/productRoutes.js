const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { addReview } = require('../controllers/reviewController');
const { protect, seller } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/seller/mine', protect, seller, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, seller, updateProduct);
router.delete('/:id', protect, seller, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
