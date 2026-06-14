import http from "http";

const PORT = process.env.PORT || 3000;
let requestCount = 0;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
  });
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  requestCount++;
  const { method, url } = req;
  try {
    if (method === "GET" && url === "/health")
      return send(res, 200, { status: "ok" });
    if (method === "GET" && url === "/requests")
      return send(res, 200, { count: requestCount });
    if (method === "POST" && url === "/echo") {
      const body = await readBody(req);
      return send(res, 200, body);
    }
    if (method === "POST" && url === "/calculate") {
      const body = await readBody(req);
      const { operation, a, b } = body;
      if (a === undefined || b === undefined || !operation)
        return send(res, 400, { error: "Missing required fields" });
      let result;
      if (operation === "add")           result = a + b;
      else if (operation === "subtract") result = a - b;
      else if (operation === "multiply") result = a * b;
      else if (operation === "divide") {
        if (b === 0) return send(res, 400, { error: "Division by zero" });
        result = a / b;
      } else return send(res, 400, { error: "Unsupported operation" });
      return send(res, 200, { result });
    }

    if (["/health", "/echo", "/calculate", "/requests"].includes(url))
      return send(res, 405, { error: "Method not allowed" });

    return send(res, 404, { error: "Not found" });
  } catch (err) {
    if (err.message === "Invalid JSON")
      return send(res, 400, { error: "Invalid JSON" });
    return send(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default server;