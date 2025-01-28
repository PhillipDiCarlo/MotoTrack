// tests/vehicleRoutes.test.js
const request = require('supertest');
const app = require('../src/index'); // ensure your index.js exports the Express app

describe('Vehicle Routes', () => {
  let token;

  beforeAll(async () => {
    // Suppose you have a test user or sign up a user:
    // 1. Create user
    // 2. Login to get JWT
    // or mock JWT if you prefer a simpler approach
    const signupRes = await request(app)
      .post('/auth/signup')
      .send({ email: '[email protected]', password: 'test123' });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: '[email protected]', password: 'test123' });
    token = loginRes.body.token;
  });

  it('should create a vehicle', async () => {
    const res = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        year: 2018,
        make: 'Honda',
        model: 'Civic',
        color: 'White',
        vin: 'ABC123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.vehicleId).toBeDefined();
  });

  it('should get an empty array of vehicles if none exist', async () => {
    const res = await request(app)
      .get('/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
