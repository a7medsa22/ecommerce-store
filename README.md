# 🛒 Node.js E-commerce Store (Backend)

A powerful and modular backend for an E-commerce application built with **Node.js**, **Express**, and **MongoDB**. This project provides a complete RESTful API for managing an online store with advanced features like image uploads, user authentication, product management, and more.

---

## 📌 Project Overview

This project provides the backend logic and API for an online store. It manages user authentication, product listings, categories, brands, reviews, and file uploads with a robust architecture following best practices.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization** (JWT-based)
- 👥 **User Management** (CRUD operations)
- 🛍️ **Product Management** (CRUD with image uploads)
- 📂 **Category & Subcategory Management**
- 🏷️ **Brand Management**
- ⭐ **Review System**
- 📸 **Image Upload & Processing** (Multer + Sharp)
- 📧 **Email Functionality** (Password reset, notifications)
- 🛡️ **Security Features** (Rate limiting, validation, error handling)
- 📊 **Advanced Filtering & Pagination**
- 🧪 **Testing Suite** (Jest)
- 🔧 **Development Tools** (ESLint, Prettier)

---

## 🧰 Tech Stack

### Core Technologies
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers

### File Handling
- **Multer** - File upload middleware
- **Sharp** - Image processing
- **UUID** - Unique file naming

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Morgan** - HTTP request logging

### Utilities
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **compression** - Response compression
- **slugify** - URL-friendly slugs
- **nodemailer** - Email sending

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

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
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /forgotPassword` - Request password reset
- `POST /resetCode` - Verify reset code
- `POST /resetPassword` - Reset password

### Users (`/api/v1/users/`)
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (Admin only)
- `PUT /changePassword/:id` - Change password
- `GET /getMe` - Get current user profile
- `PUT /updateMe` - Update current user profile
- `DELETE /deleteMe` - Delete current user account

### Categories (`/api/v1/categories/`)
- `GET /` - Get all categories
- `POST /` - Create category (Admin only)
- `GET /:id` - Get category by ID
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)

### Subcategories (`/api/v1/subcategories/`)
- `GET /` - Get all subcategories
- `POST /` - Create subcategory (Admin only)
- `GET /:id` - Get subcategory by ID
- `PUT /:id` - Update subcategory (Admin only)
- `DELETE /:id` - Delete subcategory (Admin only)

### Brands (`/api/v1/brands/`)
- `GET /` - Get all brands
- `POST /` - Create brand (Admin only)
- `GET /:id` - Get brand by ID
- `PUT /:id` - Update brand (Admin only)
- `DELETE /:id` - Delete brand (Admin only)

### Products (`/api/v1/products/`)
- `GET /` - Get all products (with filtering, sorting, pagination)
- `POST /` - Create product (Admin only)
- `GET /:id` - Get product by ID
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)

### Reviews (`/api/v1/reviews/`)
- `GET /` - Get all reviews
- `POST /` - Create review (Authenticated users)
- `GET /:id` - Get review by ID
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

---

## 📁 Project Structure

```
nodejs-ecommerce-stor/
├── config/
│   └── connectDB.js          # Database connection
├── middleware/
│   ├── errorMiddleware.js    # Global error handling
│   ├── uploadImageMiddleware.js # Image upload handling
│   └── validatormiddleware.js   # Request validation
├── models/
│   ├── userModels.js         # User schema
│   ├── productModels.js      # Product schema
│   ├── categoryModels.js     # Category schema
│   ├── subCategoryModels.js  # Subcategory schema
│   ├── brandModels.js        # Brand schema
│   └── reviewModels.js       # Review schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # User management routes
│   ├── productRoutes.js      # Product routes
│   ├── categoryRoutes.js     # Category routes
│   ├── subCategoryRoutes.js  # Subcategory routes
│   ├── brandRoutes.js        # Brand routes
│   └── reviewRoutes.js       # Review routes
├── services/
│   ├── authService.js        # Authentication logic
│   ├── userService.js        # User management logic
│   ├── productService.js     # Product management logic
│   ├── categoryService.js    # Category management logic
│   ├── subCategoryService.js # Subcategory management logic
│   ├── brandService.js       # Brand management logic
│   ├── reviewService.js      # Review management logic
│   └── handlerFactors.js     # Common handlers
├── utils/
│   ├── apiError.js           # Custom error class
│   ├── apiFeature.js         # Advanced filtering & pagination
│   ├── createToken.js        # JWT token creation
│   ├── sendEmail.js          # Email functionality
│   └── validators/           # Request validation schemas
├── uploads/                  # File upload directory
│   ├── users/               # User profile images
│   ├── products/            # Product images
│   ├── categories/          # Category images
│   └── brands/              # Brand images
├── __tests__/               # Test files
├── server.js                # Main application file
└── package.json
```

---

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 8000)
- `NODE_ENV` - Environment mode (development/production)
- `DB_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_USER` - Email username
- `EMAIL_PASSWORD` - Email password

### File Upload Configuration
- Supported formats: JPEG, PNG, JPG
- Maximum file size: 5MB
- Automatic image optimization with Sharp
- Unique file naming with UUID

---

## 🧪 Testing

The project includes comprehensive testing with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## 🚀 Deployment

### Production Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up environment variables
4. Use `npm run start:prod` to start the server

### Docker Deployment (Optional)
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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Created with ❤️ for building robust e-commerce solutions.

---

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy Coding! 🚀**
