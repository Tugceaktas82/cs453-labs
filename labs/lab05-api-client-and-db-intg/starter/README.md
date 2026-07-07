# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes

## Graduate Extension

Add one more resource or relationship, such as categories, projects, or tags,
and connect it to the database.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

Data now persists across server restarts instead of resetting every time the server process restarted. I had to write actual SQL (SELECT, INSERT,UPDATE, DELETE) instead of manipulating a JavaScript array, and I had to use parameterized queries ($1, $2, ...) to avoid SQL injection. I also had to handle async database errors separately from validation errors.

### 2. When should you use `PUT` instead of `PATCH`?

PUT should be used when you want to replace the entire resource with a complete new representation — the client sends every field, and any field left out is expected to be treated as missing or reset. PATCH is better when you only want to change one or two fields without resending the whole object, which is what my client's edit form actually does in practice.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

The API must always re-validate, because it can never trust the client.Anyone can call the endpoints directly with curl or another tool, bypassing the browser entirely. So type checks (integer id, non-negative quantity), required-field checks, and existence checks (404 if the row isn't found) all have to live in the API, not just the client-side form.

### 4. How does the browser client help you test the API differently than `curl` alone?

The browser client lets me see the full user-facing flow: clicking Edit pre-fills a form, submitting it calls PUT, and the list re-renders
automatically. curl only tests one request/response pair at a time and doesn't show how the UI reacts to success or error states, so the browser client is closer to how a real user would actually interact with the app.

### 5. If you added an extension, what did you add and why?

I did not add an optional extension
