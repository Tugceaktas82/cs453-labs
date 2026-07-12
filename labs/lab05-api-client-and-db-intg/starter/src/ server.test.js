//server.test.js
import request from "supertest";
import { createApp, initializeDatabase, closePool } from "./server.js";

const app = createApp();

beforeAll(async () => {
  await initializeDatabase();
});

afterAll(async () => {
  await closePool();
});

describe("Lab 5 API", () => {
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("GET /api/items returns an array", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  let createdId;

  test("POST /api/items creates a new item", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "Test Widget", quantity: 4 });
    expect(res.statusCode).toBe(201);
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item.name).toBe("Test Widget");
    createdId = res.body.item.id;
  });

  test("POST /api/items with missing fields returns 400", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "Incomplete" });
    expect(res.statusCode).toBe(400);
  });

  test("GET /api/items/:id returns the created item", async () => {
    const res = await request(app).get(`/api/items/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.item.id).toBe(createdId);
  });

  test("GET /api/items/:id with invalid id returns 400", async () => {
    const res = await request(app).get("/api/items/abc");
    expect(res.statusCode).toBe(400);
  });

  test("GET /api/items/:id with missing id returns 404", async () => {
    const res = await request(app).get("/api/items/999999");
    expect(res.statusCode).toBe(404);
  });

  test("PUT /api/items/:id replaces the item", async () => {
    const res = await request(app)
      .put(`/api/items/${createdId}`)
      .send({ name: "Updated Widget", quantity: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.item.name).toBe("Updated Widget");
    expect(res.body.item.quantity).toBe(10);
  });

  test("PATCH /api/items/:id updates only given fields", async () => {
    const res = await request(app)
      .patch(`/api/items/${createdId}`)
      .send({ quantity: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.item.name).toBe("Updated Widget");
    expect(res.body.item.quantity).toBe(20);
  });

  test("DELETE /api/items/:id removes the item", async () => {
    const res = await request(app).delete(`/api/items/${createdId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/api/items/${createdId}`);
    expect(check.statusCode).toBe(404);
  });

  test("DELETE /api/items/:id on missing item returns 404", async () => {
    const res = await request(app).delete("/api/items/999999");
    expect(res.statusCode).toBe(404);
  });
});