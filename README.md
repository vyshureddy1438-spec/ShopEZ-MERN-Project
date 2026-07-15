# ShopEZ - E-commerce Application (MERN Stack)

ShopEZ is a full-stack e-commerce web application built with MongoDB, Express.js, React.js, and Node.js. It allows buyers to browse products, view details/reviews, add items to cart, and check out, while sellers get a dashboard to manage products and orders.

## Features

**Buyer**
- Browse product catalog with search and category filters
- View detailed product pages with descriptions, discounts, and customer reviews
- Add products to cart, update quantities, remove items
- Secure checkout flow with shipping address and payment method selection
- Instant order confirmation and order history ("My Orders")
- Submit product reviews and ratings

**Seller**
- Dashboard with stats: total products, total orders, revenue, low-stock alerts
- Add, edit, and delete products
- View and manage incoming orders, update order status (Processing → Shipped → Delivered)

**Auth**
- JWT-based authentication with buyer/seller roles
- Protected routes on both frontend and backend

## Tech Stack

- **Frontend:** React.js, React Router, Axios, plain CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (JWT), bcrypt password hashing

## Project Structure

```
shopez/
├── backend/          # Express + MongoDB API
│   ├── config/        # DB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas (User, Product, Order)
│   ├── routes/          # API routes
│   ├── seed/            # Demo data seeder
│   └── server.js
└── frontend/          # React application
    ├── public/
    └── src/
        ├── api/           # Axios instance
        ├── components/     # Reusable UI components
        ├── context/         # Auth & Cart context (state management)
        └── pages/            # Route-level pages
```

## Getting Started

### Prerequisites
- Node.js v16+
- npm v8+
- MongoDB (local install or a free MongoDB Atlas cluster)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string and a JWT secret:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=some_long_random_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

(Optional) Seed the database with a demo seller account and 8 sample products:
```bash
npm run seed
```
This creates a seller login: `seller@shopez.com` / `seller123`.

Start the backend server:
```bash
npm run dev
```
The API will run at `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```

By default `.env` points to `http://localhost:5000/api`, matching the backend above.

Start the React app:
```bash
npm start
```
The app will open at `http://localhost:3000`.

## Usage

1. Register as a **Buyer** to shop, or as a **Seller** to list products.
2. As a buyer: browse products → add to cart → checkout → view order confirmation and order history.
3. As a seller: log in → go to the Dashboard → add products → track and update incoming orders.

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/profile | Get logged-in user | Private |
| GET | /api/products | List products (search/category/pagination) | Public |
| GET | /api/products/:id | Get single product | Public |
| POST | /api/products | Create product | Seller |
| PUT | /api/products/:id | Update product | Seller (owner) |
| DELETE | /api/products/:id | Delete product | Seller (owner) |
| GET | /api/products/seller/mine | Get seller's own products | Seller |
| POST | /api/products/:id/reviews | Add a review | Private |
| POST | /api/orders | Place an order (checkout) | Private |
| GET | /api/orders/mine | Get logged-in user's orders | Private |
| GET | /api/orders/:id | Get single order | Private |
| GET | /api/orders/seller/mine | Get orders for seller's products | Seller |
| PUT | /api/orders/:id/status | Update order status | Seller |

## Notes

- This is built for an internship/learning track project and uses a simplified, demo-style checkout (no real payment gateway is integrated — "Cash on Delivery", "Card", and "UPI" are selectable but not actually charged).
- Feel free to extend it: integrate a real payment gateway (Razorpay/Stripe), add image uploads (Cloudinary/Multer), or add an admin panel.

## License

This project was created for educational/internship purposes.
