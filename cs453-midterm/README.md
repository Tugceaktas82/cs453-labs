##  CS 453-01_Midterm 2026 ##

REST API for tracking course tasks, built with Express. Data is stored in memory (no database), no authentication.

# Project structure

## Project structure

```
├─ answers.md           # Written answers (Parts 1, 2, 4, 7)
├─ openapi.yaml          # OpenAPI 3.0 spec for the API
├─ README.md             # This file
├─ package.json
├─ package-lock.json
└── src/
    ├── server.js               # App entry point: /health + /api/tasks
    ├── client.js                # Basic client that exercises every endpoint
    ├── data/
    │   └── tasks.js               # In-memory "database" (plain array)
    ├── middleware/
    │   ├── logger.js               # Logs method, path, status, duration
    │   ├── validateTask.js         # Validates POST/PUT/PATCH bodies
    │   └── errorHandler.js         # Centralized 500 error handler
    └── routes/
        └── tasks.js                # REST routes: GET/POST/PUT/PATCH/DELETE
```


# Requirements

- Node.js 18+ (client uses the built-in `fetch`)

# Setup

Install dependencies:

```bash
npm install
```

# Running the server

```bash
npm start
```

You should see:

```
Course Task Tracker API listening on http://localhost:3000
```

Leave this terminal open, the server runs in the foreground. Open a second terminal for testing.

# Routes

|Method |Route          |Description                           |
|------ |-------------- |------------------------------------- |
|GET    |/health        |Health check                          |
|GET    |/api/tasks     |List all tasks                        |
|GET    |/api/tasks/:id |Get one task, or 404                  |
|POST   |/api/tasks     |Create a task                         |
|PUT    |/api/tasks/:id |Replace a task (all fields required)  |
|PATCH  |/api/tasks/:id |Partially update a task               |
|DELETE |/api/tasks/:id |Delete a task (204 No Content)        |

# Testing with curl

In a second terminal, with the server running:

```bash
curl http://localhost:3000/health

curl http://localhost:3000/api/tasks

curl http://localhost:3000/api/tasks/1

# missing required field --> 400
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"No course here"}'

# valid create --> 201
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Read syllabus","course":"CS101"}'

curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Watch Week 3 lecture","course":"CS453","completed":true}'

curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":false}'

curl -X DELETE http://localhost:3000/api/tasks/1 -i
```

# Running the basic client

With the server running, in a second terminal:

```bash
node src/client.js
```

Goes through all the required operations in order:health check,create a task,list all tasks,get one by id,update it,delete it.Prints status code + JSON body at each step.

# Viewing the OpenAPI spec

`openapi.yaml` documents every route with request/response schemas and status codes (200, 201, 204, 400, 404). Paste it into https://editor.swagger.io/ or open with any Swagger/OpenAPI viewer to see it rendered.