const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create new order (checkout)
// @route POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let itemsPrice = 0;
    const preparedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const price = +(product.price - (product.price * product.discountPercent) / 100).toFixed(2);
      itemsPrice += price * item.qty;

      preparedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price,
        qty: item.qty,
      });

      product.countInStock -= item.qty;
      await product.save();
    }

    const shippingPrice = itemsPrice > 999 ? 0 : 49;
    const totalPrice = +(itemsPrice + shippingPrice).toFixed(2);

    const order = await Order.create({
      user: req.user._id,
      orderItems: preparedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'Cash on Delivery' ? false : true,
      paidAt: paymentMethod === 'Cash on Delivery' ? undefined : Date.now(),
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user's orders
// @route GET /api/orders/mine
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single order by id
// @route GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'seller'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get orders containing seller's products
// @route GET /api/orders/seller/mine
exports.getSellerOrders = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = products.map((p) => p._id.toString());

    const orders = await Order.find({ 'orderItems.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status (seller)
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
