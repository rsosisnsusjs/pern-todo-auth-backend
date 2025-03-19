const request = require('supertest');
const { app, server } = require('../server');
const pool = require('../src/db');

jest.mock('../src/db');

const mockUserId = 1;
const mockToken = 'mock-jwt-token'; // Mock JWT token

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(() => ({ user: { id: mockUserId } })), // Mock successful token verification
}));

process.env.jwtSecret = "mock-secret-key";


describe('Todos API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        server.close(); 
    });

    test('Add Todo - Success', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ todo_id: 1, description: 'Test Todo', due_date: '2025-03-20' }] });

        const res = await request(app)
            .post('/dashboard/todos')
            .set('jwt_token', mockToken)
            .send({ description: 'Test Todo', due_date: '2025-03-20' });

        expect(res.statusCode).toBe(200);
        expect(res.body.description).toBe('Test Todo');
    });

    test('Edit Todo - Success', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .put('/dashboard/todos/1')
            .set('jwt_token', mockToken)
            .send({ description: 'Updated Todo' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Todo was updated');
    });

    test('Delete Todo - Success', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .delete('/dashboard/todos/1')
            .set('jwt_token', mockToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Todo was deleted');
    });

    test('Mark as Done - Success', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock ตรวจสอบ todo ว่ามีอยู่
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock การย้ายไป done_todos
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock การลบออกจาก todos

        const res = await request(app)
            .post('/dashboard/done')
            .set('jwt_token', mockToken)
            .send({ todo_id: 1, description: 'Test Todo', due_date: '2025-03-20' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Todo marked as done');
    });
});
