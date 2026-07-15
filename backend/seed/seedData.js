// Seeds the database with a demo seller and sample products.
// Run with: npm run seed
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    price: 2999,
    discountPercent: 15,
    countInStock: 25,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your heart rate, steps, and sleep with this water-resistant smart watch.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    price: 4499,
    discountPercent: 10,
    countInStock: 18,
  },
  {
    name: "Men's Running Shoes",
    description: 'Lightweight breathable running shoes with cushioned soles for all-day comfort.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Footwear',
    price: 1899,
    discountPercent: 20,
    countInStock: 40,
  },
  {
    name: 'Cotton Casual Shirt',
    description: '100% cotton slim-fit casual shirt available in multiple colors.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    category: 'Clothing',
    price: 899,
    discountPercent: 5,
    countInStock: 60,
  },
  {
    name: 'Stainless Steel Cookware Set',
    description: '5-piece stainless steel cookware set, dishwasher safe and induction compatible.',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500',
    category: 'Home & Kitchen',
    price: 3499,
    discountPercent: 12,
    countInStock: 15,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact waterproof speaker with rich bass and 12-hour playback.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    price: 1599,
    discountPercent: 8,
    countInStock: 35,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip eco-friendly yoga mat, 6mm thick with carry strap.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    category: 'Sports & Fitness',
    price: 799,
    discountPercent: 0,
    countInStock: 50,
  },
  {
    name: "Women's Handbag",
    description: 'Elegant faux-leather handbag with multiple compartments.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
    category: 'Accessories',
    price: 1299,
    discountPercent: 18,
    countInStock: 30,
  },
];

const importData = async (shouldExit = true) => {
  try {
    if (shouldExit) {
      await connectDB();
    }

    await Product.deleteMany();
    await User.deleteMany({ email: 'seller@shopez.com' });

    const seller = await User.create({
      name: 'ShopEZ Demo Seller',
      email: 'seller@shopez.com',
      password: 'seller123',
      role: 'seller',
    });

    const sampleProducts = products.map((p) => ({ ...p, seller: seller._id }));
    await Product.insertMany(sampleProducts);

    console.log('Demo data imported successfully!');
    console.log('Seller login -> email: seller@shopez.com | password: seller123');
    if (shouldExit) {
      process.exit();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (shouldExit) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

if (require.main === module) {
  importData();
}

module.exports = { importData, products };
