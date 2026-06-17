const request = require('supertest');
const app = require('./server');

describe('API Automated Laboratory Tests', () => {

  test('GET /health returns { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test('GET /items returns a list of items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /items creates a new item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'monitor', quantity: 4 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('monitor');
  });

  test('GET /items/:id can retrieve an item', async () => {
    const res = await request(app).get('/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('PUT /items/:id updates an item', async () => {
    const res = await request(app)
      .put('/items/1')
      .send({ name: 'mechanical keyboard', quantity: 15 });
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(15);
  });

  test('A missing item returns 404', async () => {
    const res = await request(app).get('/items/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Item not found');
  });

  test('DELETE /items/:id deletes an item', async () => {
    const res = await request(app).delete('/items/1');
    expect(res.statusCode).toBe(200);
    
    const checkRes = await request(app).get('/items/1');
    expect(checkRes.statusCode).toBe(404);
  });
});