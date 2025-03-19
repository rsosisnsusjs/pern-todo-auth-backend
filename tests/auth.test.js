const request = require('supertest');
const { app, server } = require('../server');
const pool = require('../src/db');
const bcrypt = require('bcrypt');

jest.mock('../src/db', () => ({
    query: jest.fn(), // Mock database query
}));

describe('Authentication API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        server.close();
    });

    test('Register - Success', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // Mock ตรวจสอบว่า user ไม่มีอยู่ก่อน
        pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] }); // Mock user ถูกสร้างสำเร็จ

        const res = await request(app).post('/authentication/register').send({
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('jwtToken');
    });

    test('Login - Success', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1, user_password: hashedPassword }] });

        const res = await request(app).post('/authentication/login').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('jwtToken');
    });

    test('Login - Invalid Credentials', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // Mock ว่า user ไม่มีอยู่จริง

        const res = await request(app).post('/authentication/login').send({
            email: 'wrong@example.com',
            password: 'wrongpassword',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ msg: 'Invalid Credential' }); // ต้องตรวจสอบ response body ว่าเป็น object
    });
});
