
// tests/authController.test.js
const { login } = require('../src/controllers/authController');
const { dbPool } = require('../src/index'); // or your db config
jest.mock('../src/index', () => ({
  dbPool: {
    query: jest.fn(),
  },
}));

describe('Auth Controller - login', () => {
  it('should return 401 if user not found', async () => {
    // Mock dbPool.query to return empty rows
    dbPool.query.mockResolvedValueOnce({ rows: [] });

    // Simulate Express req/res
    const req = { body: { email: '[email protected]', password: 'secret' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  // More tests...
});
