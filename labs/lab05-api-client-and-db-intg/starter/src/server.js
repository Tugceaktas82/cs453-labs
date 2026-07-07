import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

export function createApp() {
  const app = express();

  app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    /\.app\.github\.dev$/
  ]
}));

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed."
      });
    }
  });

  // Starter route: return every item from the database.
  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name, quantity
        FROM items
        ORDER BY id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  // Starter route: create one item so the client can demonstrate a write.
  app.post("/api/items", async (req, res) => {
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);

    if (!name || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    try {
      const result = await pool.query(
        `
          INSERT INTO items (name, quantity)
          VALUES ($1, $2)
          RETURNING id, name, quantity
        `,
        [name, quantity]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add item."
      });
    }
  });

  // Return one item by ID.
  app.get("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "id must be a positive integer."
      });
    }

    try {
      const result = await pool.query(
        `SELECT id, name, quantity FROM items WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `No item with id ${id}.`
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to load item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load item."
      });
    }
  });

  // Replace one item by ID.
  app.put("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "id must be a positive integer."
      });
    }

    if (!name || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    try {
      const result = await pool.query(
        `
          UPDATE items
          SET name = $1, quantity = $2
          WHERE id = $3
          RETURNING id, name, quantity
        `,
        [name, quantity, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `No item with id ${id}.`
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to replace item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to replace item."
      });
    }
  });

  // Partially update one item by ID.
  app.patch("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "id must be a positive integer."
      });
    }

    const fields = [];
    const values = [];
    let i = 1;

    if (req.body?.name !== undefined) {
      const name = req.body.name.trim();
      if (!name) {
        return res.status(400).json({
          error: "Bad Request",
          message: "name cannot be empty."
        });
      }
      fields.push(`name = $${i++}`);
      values.push(name);
    }

    if (req.body?.quantity !== undefined) {
      const quantity = Number(req.body.quantity);
      if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "quantity must be a non-negative integer."
        });
      }
      fields.push(`quantity = $${i++}`);
      values.push(quantity);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Provide at least one field to update."
      });
    }

    values.push(id);

    try {
      const result = await pool.query(
        `UPDATE items SET ${fields.join(", ")} WHERE id = $${i} RETURNING id, name, quantity`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `No item with id ${id}.`
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to update item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update item."
      });
    }
  });

  // Delete one item by ID.
  app.delete("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "id must be a positive integer."
      });
    }

    try {
      const result = await pool.query(
        `DELETE FROM items WHERE id = $1 RETURNING id`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `No item with id ${id}.`
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete item."
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0)
    )
  `);
  } 
export async function closePool() {
  await pool.end();
}
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity)
        VALUES ($1, $2), ($3, $4), ($5, $6)
      `,
      ["Keyboard", 10, "Mouse", 5, "Monitor", 3]
    );
  }


const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const app = createApp();

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}