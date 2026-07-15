const Product = require('../models/Product');

// @desc Get all products (with search, category filter, pagination)
// @route GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...categoryFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product
// @route GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a product (seller only)
// @route POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, image, category, price, discountPercent, countInStock } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      image,
      category,
      price,
      discountPercent: discountPercent || 0,
      countInStock: countInStock || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a product (seller who owns it)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const fields = ['name', 'description', 'image', 'category', 'price', 'discountPercent', 'countInStock'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a product (seller who owns it)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get products for the logged-in seller
// @route GET /api/products/seller/mine
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
