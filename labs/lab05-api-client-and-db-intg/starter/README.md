# Lab 5 - API Routes, Clients, and DB Integration

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
npm test
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What This Project Does

Postgres runs in Docker.

The Express server connects to Postgres and creates/seeds the items table on startup.

Full CRUD is implemented
- `GET /health`
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`

Every route validates its input (integer ids, required fields, non-negative quantities) and returns the right status code (200, 201, 204, 400, 404, 500).

SQL queries are parameterized ($1, $2, ...) to avoid SQL injection.

The browser client can load items, add a new item, edit an existing item (pre-fills the form and sends PUT), and delete an item.

All 11 tests in src/server.test.js pass with npm test.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

The biggest difference is that data actually sticks around now. With the in-memory version, restarting the server wiped everything back to the seed data, but with Postgres the items are still there no matter how many times I restart. I also had to switch from just pushing/splicing a JS array to writing real SQL for every operation (SELECT, INSERT, UPDATE, DELETE), and I made sure to use parameterized queries like $1 and $2 instead of building query strings by hand, so I don't open the door to SQL injection. On top of that, database calls can fail in ways form validation never could, so I had to add separate try/catch blocks for database errors instead of just checking the request body.

### 2. When should you use `PUT` instead of `PATCH`?

I'd use `PUT` when the client is sending a full replacement for the resource, and every field gets included, and if something is left out it's basically treated as gone or reset to default. `PATCH` makes more sense when you only want to touch one or two fields and leave the rest alone. That's actually closer to how my edit form behaves in real use, since most of the time a user just wants to bump the quantity up or down without retyping the name.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

Basically all the validation still needs to live on the server, because there's no guarantee a request is even coming from the browser form. Someone could hit the endpoint directly with curl, Postman, or anything else and skip whatever checks the client-side JS does. So things like making sure the id is a real integer, quantity isn't negative, required fields aren't missing, and returning 404 when a row doesn't exist, all of that has to be enforced in the route handlers themselves, not just assumed because the form checked it first.

### 4. How does the browser client help you test the API differently than `curl` alone?

`curl` is great for hitting one endpoint and seeing exactly what comes back, but it doesn't show you what it actually feels like to use the app. With the browser client I can click Edit and watch the form fill in with the item's current values, submit it and see the PUT request go out, and then watch the list refresh automatically. That's a much closer match to how a real user would interact with this than firing off individual requests from the terminal one at a time.

### 5. If you added an extension, what did you add and why?

I did not add an optional extension
