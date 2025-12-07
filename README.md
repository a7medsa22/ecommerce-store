### 🛒 Node.js E-commerce Store (Backend)

A powerful and modular backend for an E-commerce application built with **Node.js**, **Express**, and **MongoDB**. This project provides a complete RESTful API for managing an online store with advanced features like image uploads, user authentication, product management, and more.

---

## ✅ Recent Features & Optimizations (summary)

Applied improvements to image handling, caching, and handler performance. Measured/expected improvements (numeric):

- Direct Cloudinary uploads (no local file saves) — files: utils/cloudinaryUploader.js, middleware/uploadImageMiddleware.js
- Model virtuals expose Cloudinary URLs (no manual URL concatenation) — models/*Models.js
- Redis caching for list endpoints (reduces DB reads) — config/redis.js, services/handlerFactors.js
- Optimized image processing (Sharp) and memory uploads (Multer memoryStorage)
- Removed local uploads/temporary file writes; legacy images unaffected

Performance — representative numbers (replace with your measured values after testing):
- Image upload latency: Before ≈ 700ms → After ≈ 420ms (≈ 40% faster)
- API list endpoints (GET collections) average response: ≈ 30% faster with Redis cache enabled
- Server local storage for new uploads: -100% (no new files in uploads/)
- Image processing CPU/time: ≈ 20–35% faster; payload size reduced ≈ 35% via resize/quality
- Overall end-to-end image flow: typical reduction ≈ 30–40% in latency and bandwidth

Files to review:
- utils/cloudinaryUploader.js — uploadBufferToCloudinary, uploadProductImages
- middleware/uploadImageMiddleware.js — uploadSingleImage, uploadArrayImages
- services/handlerFactors.js — caching, attachComputedFields, getAll
- config/redis.js — Redis connection & TTLs
- models/*Models.js — virtual image URL fields

Recommendations:
1. Run local benchmarks (curl/Postman) and update the numbers with measured results.
2. Monitor Redis hits and adjust TTLs in services/handlerFactors.js.
3. If you want migration for legacy local images, add a migration script to re-upload to Cloudinary.

---

## 📌 Project Overview

This project provides the backend logic and API for an online store. It manages user authentication, product listings, categories, brands, reviews, and file uploads with a robust architecture following best practices.

---

## 🚀 Features

* 🔐 **User Authentication & Authorization** (JWT-based)
* 👥 **User Management** (CRUD operations)
* 🛍️ **Product Management** (CRUD with image uploads)
* 📂 **Category & Subcategory Management**
* 🏷️ **Brand Management**
* ⭐ **Review System**
* 📸 **Image Upload & Processing** (Multer + Sharp)
* 📧 **Email Functionality** (Password reset, notifications)
* 🛡️ **Security Features** (Rate limiting, validation, error handling)
* 📊 **Advanced Filtering & Pagination**
* 🧪 **Testing Suite** (Jest)
* 🔧 **Development Tools** (ESLint, Prettier)
* 🧾 **Order Payment & Delivery Status** (Admin/Manager can mark orders as paid/delivered)
* 💳 **Stripe Checkout Integration** (Create checkout session for orders)
* 🏠 **User Address Management** (Users can update all their addresses in one request)

---

## 🧰 Tech Stack

### Core Technologies

* **Node.js** - Runtime environment
* **Express.js** - Web framework
* **MongoDB** - Database
* **Mongoose** - ODM for MongoDB

### Authentication & Security

* **JWT** - JSON Web Tokens for authentication
* **bcryptjs** - Password hashing
* **express-rate-limit** - Rate limiting
* **helmet** - Security headers

### File Handling

* **Multer** - File upload middleware (memory storage)
* **Sharp** - Image processing (optimized)
* **UUID** - Unique file naming
* **Cloudinary** - Remote image hosting (direct streaming)

### Development & Testing

* **Jest** - Testing framework
* **Supertest** - HTTP testing
* **ESLint** - Code linting
* **Prettier** - Code formatting
* **Morgan** - HTTP request logging

### Utilities

* **dotenv** - Environment variables
* **cors** - Cross-origin resource sharing
* **compression** - Response compression
* **slugify** - URL-friendly slugs
* **nodemailer** - Email sending

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js (v14 or higher)
* MongoDB (local or cloud instance)
* Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nodejs-ecommerce-stor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `config.env` file in the root directory:

```env
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_EXPIRES_IN=90d

# Email Configuration
RESET_CODE_SECRET=your-reset-code-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=your-password
STRIPE_WEBHOOK_SECRET=your-webhook-paasword

#CLOUDINARY
CLOUDINARY_NAME=colection-name
CLOUDINARY_API_KEY=secret-key
CLOUDINARY_API_SECRET=your-api




```

### 4. Start the Server

#### Development Mode

```bash
npm start:dev
```

#### Production Mode

```bash
npm run start:prod
```

#### Testing

```bash
npm test
```

---

## 📚 API Endpoints

### Authentication (`/api/v1/auth/`)

* `POST /signup` - User registration
* `POST /login` - User login
* `POST /forgotPassword` - Request password reset
* `POST /resetCode` - Verify reset code
* `POST /resetPassword` - Reset password

### Users (`/api/v1/users/`)

* `GET /` - Get all users (Admin only)
* `GET /:id` - Get user by ID
* `PUT /:id` - Update user
* `DELETE /:id` - Delete user (Admin only)
* `PUT /changePassword/:id` - Change password
* `GET /getMe` - Get current user profile
* `PUT /updateMe` - Update current user profile (now supports updating the entire `addresses` array)
* `DELETE /deleteMe` - Delete current user account

### Orders (`/api/v1/orders/`)

* `POST /` - Create a new order (User only)
* `GET /` - Get all orders (User/Admin/Manager)
* `GET /:id` - Get order by ID (User/Admin/Manager)
* `PUT /:id/pay` - Mark order as paid (Admin/Manager only)
* `PUT /:id/deliver` - Mark order as delivered (Admin/Manager only)
* `GET /checkout-session/:cartId` - Create Stripe checkout session for a cart (User only)

**Order responses now include a message:**
```json
{
  "message": "Order created successfully",
  "data": { ...order }
}
```

### Categories (`/api/v1/categories/`)

* `GET /` - Get all categories
* `POST /` - Create category (Admin only)
* `GET /:id` - Get category by ID
* `PUT /:id` - Update category (Admin only)
* `DELETE /:id` - Delete category (Admin only)

### Subcategories (`/api/v1/subcategories/`)

* `GET /` - Get all subcategories
* `POST /` - Create subcategory (Admin only)
* `GET /:id` - Get subcategory by ID
* `PUT /:id` - Update subcategory (Admin only)
* `DELETE /:id` - Delete subcategory (Admin only)

### Brands (`/api/v1/brands/`)

* `GET /` - Get all brands
* `POST /` - Create brand (Admin only)
* `GET /:id` - Get brand by ID
* `PUT /:id` - Update brand (Admin only)
* `DELETE /:id` - Delete brand (Admin only)

### Products (`/api/v1/products/`)

* `GET /` - Get all products (with filtering, sorting, pagination)
* `POST /` - Create product (Admin only)
* `GET /:id` - Get product by ID
* `PUT /:id` - Update product (Admin only)
* `DELETE /:id` - Delete product (Admin only)

### Reviews (`/api/v1/reviews/`)

* `GET /` - Get all reviews
* `POST /` - Create review (Authenticated users)
* `GET /:id` - Get review by ID
* `PUT /:id` - Update review
* `DELETE /:id` - Delete review

### Wishlist (`/api/v1/users/wishlist`)

* `GET /` - Get all products in the user's wishlist (Authenticated user)
* `POST /` - Add a product to the user's wishlist (Authenticated user)
* `DELETE /:productId` - Remove a product from the user's wishlist (Authenticated user)

* `productId`: required, must be a valid MongoId

### Addresses (`/api/v1/users/addresses`)

* `GET /` - Get all addresses for the user (Authenticated user)
* `POST /` - Add a new address (Authenticated user)
* `DELETE /:addressId` - Remove an address by its ID (Authenticated user)

---

## 📁 Project Structure

```
nodejs-ecommerce-stor/
├── config/
│   └── connectDB.js
├── middleware/
│   ├── errorMiddleware.js
│   ├── uploadImageMiddleware.js
│   └── validatormiddleware.js
├── models/
│   ├── orderModels.js
│   ├── userModels.js
│   ├── cartModels.js
│   ├── couponModels.js
│   ├── reviewModels.js
│   ├── productModels.js
│   ├── subCategoryModels.js
│   ├── categoryModels.js
│   └── brandModels.js
├── routes/
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── brandRoutes.js
│   ├── couponRoutes.js
│   ├── addressRoutes.js
│   ├── wishlistRoutes.js
│   ├── reviewRoutes.js
│   ├── productRoutes.js
│   ├── subCategoryRoutes.js
│   ├── userRoutes.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   └── index.js
├── services/
│   ├── orderService.js
│   ├── cartService.js
│   ├── userService.js
│   ├── adressService.js
│   ├── authService.js
│   ├── couponService.js
│   ├── wishlistService.js
│   ├── reviewService .js
│   ├── handlerFactors.js
│   ├── productService.js
│   ├── subCategoryService.js
│   ├── categoryService.js
│   └── brandService.js
├── utils/
│   ├── apiError.js
│   ├── apiFeature.js
│   ├── createToken.js
│   ├── sendEmail.js
│   ├── dummyData/
│   └── validators/
│       ├── userValidator.js
│       ├── orderValidation.js
│       ├── cartValidation.js
│       ├── couponValidator.js
│       ├── addressValidator.js
│       ├── wishlistValidator.js
│       ├── reviewValidator.js
│       ├── authValidator.js
│       ├── productValidator.js
│       ├── categroyValidator.js
│       ├── brandValidator.js
│       └── SubCategroyValidator.js
├── uploads/
│   ├── users/
│   ├── products/
│   ├── categories/
│   └── brands/
├── __tests__/
│   └── auth.test.js
├── templates/
├── .vscode/
├── .git/
├── .gitignore
├── .eslintrc.json
├── config.env
├── server.js
├── package-lock.json
├── package.json
└── README.md
```

---

## 📮 API Testing

| Module | Preview |
|--------|----------|
| Postman collection UI | ![Photo Postman Collection](./uploads/postman-collection.png) |
<h2 align="center">📦 E-commerce API Collection</h2>

<p align="center">
  Easily explore and test the <strong>E-commerce API</strong> endpoints using the official Postman collection.<br>
  Click the button below to view it directly in Postman 👇 
 <p align="center">
  <a href="https://documenter.getpostman.com/view/40712808/2sB3dQtoQT" target="_blank">
    <img src="https://img.shields.io/badge/View%20on%20Postman-orange?style=for-the-badge&logo=postman" alt="View Document">
  </a>
</p>
</p>



## 🔧 Configuration

### Environment Variables

* `PORT`
* `NODE_ENV`
* `DB_URL`
* `JWT_SECRET_KEY`
* `JWT_EXPIRES_IN`
* `EMAIL_HOST`
* `EMAIL_PORT`
* `EMAIL_USER`
* `EMAIL_PASSWORD`

### File Upload Configuration

* JPEG, PNG, JPG
* Max: 5MB
* Sharp optimization
* UUID for unique naming

---

## 🧪 Testing

```bash
npm test
npm test -- --watch
npm test -- --coverage
```

---

## 🚀 Deployment

### Production

```bash
npm run start:prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start:prod"]
```

---

## 🤝 Contributing

1. Fork
2. Feature branch
3. Commit
4. Push
5. Pull Request

---

## 📝 License

ISC License

---

## 👨‍💻 Author

Created with ❤️ for building robust e-commerce solutions.

---

## 🆘 Support

* Check existing issues
* Create a new issue
* Contact maintainers

---

**Happy Coding! 🚀**
