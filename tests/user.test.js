const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

// Mock Data
const adminUser = {
    fullName: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
};

const regularUser = {
    fullName: 'Regular User',
    email: 'user@test.com',
    password: 'password123'
};

let adminToken;
let userToken;

// Setup and Teardown
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({}); // Clear DB

    // Register Admin
    await request(app).post('/api/auth/signup').send(adminUser);
    // Manually update role to admin since signup defaults to user
    await User.findOneAndUpdate({ email: adminUser.email }, { role: 'admin' });
    const adminLogin = await request(app).post('/api/auth/login').send({
        email: adminUser.email,
        password: adminUser.password
    });
    adminToken = adminLogin.body.token;

    // Register Regular User
    const userRes = await request(app).post('/api/auth/signup').send(regularUser);
    userToken = userRes.body.token;
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

// TEST SUITE
describe('User Management System Tests', () => {

    // Test 1: User Registration
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                fullName: 'New User',
                email: 'new@test.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    // Test 2: Login Authentication
    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: regularUser.email,
                password: regularUser.password
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // Test 3: Admin Access Control
    it('should allow admin to access all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
    });

    // Test 4: RBAC Protection
    it('should NOT allow regular user to access user list', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
    });

    // Test 5: Profile Update
    it('should allow user to update their profile', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ fullName: 'Updated Name' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.fullName).toEqual('Updated Name');
    });
});