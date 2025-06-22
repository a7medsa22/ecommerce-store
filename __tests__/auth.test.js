const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your express app is exported from server.js
const User = require('../models/userModels');

// Connect to a test database before all tests
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/ecommerce-test';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the users collection before each test
beforeEach(async () => {
  await User.deleteMany();
});

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.data.name).toBe('Test User');
  });
}); 