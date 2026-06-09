import { test, expect, afterAll } from "vitest";
import http from "http";
import server from "../src/server.js";

function req(method, path, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost", port: 3000, path, method,
      headers: { "Content-Type": "application/json",
        ...(data && { "Content-Length": Buffer.byteLength(data) }) }
    };
    const r = http.request(options, (res) => {
      let raw = "";
      res.on("data", c => (raw += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    if (data) r.write(data);
    r.end();
  });
}

afterAll(() => server.close());

test("GET /health returns status ok", async () => {
  const res = await req("GET", "/health");
  expect(res.status).toBe(200);
  expect(res.body.status).toBe("ok");
});

test("POST /echo returns same body", async () => {
  const res = await req("POST", "/echo", { message: "hello" });
  expect(res.status).toBe(200);
  expect(res.body.message).toBe("hello");
});

test("POST /calculate add", async () => {
  const res = await req("POST", "/calculate", { operation: "add", a: 2, b: 3 });
  expect(res.body.result).toBe(5);
});

test("POST /calculate divide by zero", async () => {
  const res = await req("POST", "/calculate", { operation: "divide", a: 10, b: 0 });
  expect(res.status).toBe(400);
});

test("POST /calculate unsupported operation", async () => {
  const res = await req("POST", "/calculate", { operation: "sqrt", a: 9, b: 0 });
  expect(res.status).toBe(400);
});

test("GET /requests returns count", async () => {
  const res = await req("GET", "/requests");
  expect(res.status).toBe(200);
  expect(typeof res.body.count).toBe("number");
});

test("Unknown route returns 404", async () => {
  const res = await req("GET", "/unknown");
  expect(res.status).toBe(404);
});
