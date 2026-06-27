# Lab 03 - REST-style API with Express

A lightweight, REST-style API built with Node.js and Express to manage an in-memory collection of inventory items. This project demonstrates basic CRUD operations, automated route testing, and complete API specification using OpenAPI 3.0.

## Features
- **Express Framework:** Utilizes Express for modern, structured routing and request handling.
- **REST Semantics:** Maps standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) directly to CRUD capabilities.
- **In-Memory Data Store:** Operates on an ephemeral data collection that automatically resets upon server restart.
- **Automated Validation:** Leverages Jest and Supertest for continuous integration and structural route verification.
- **OpenAPI Documentation:** Comes with an exact schema definition file (`openapi.yaml`).

## Project Structure
```text
├── node_modules/         # Installed project dependencies
├── openapi.yaml          # OpenAPI 3.0 API documentation contract
├── package.json          # Node.js project manifest and script definitions
├── package-lock.json     # Lockfile for precise dependency trees
├── server.js             # Core Express server implementation and routing logic
└── server.test.js        # Automated test suites for all route conditions

//
**Getting Started**

*Prerequisites

Node.js (v18 or higher recommended)
npm (comes bundled with Node.js)


*Installation
-Clone the repository and install the dependencies:

bash
npm install
-Running the Server

bash
npm start
-The server will start on http://localhost:3000 by default.

-Running Tests
This project uses Jest and Supertest for automated testing of all routes.

bash
npm test

All 7 tests should pass, covering health checks, item retrieval, creation, updates, deletion, and 404 handling.

*Example Requests*

////bash
# Health check
curl http://localhost:3000/health

# Get all items
curl http://localhost:3000/items

# Get a single item by ID
curl http://localhost:3000/items/1

# Create a new item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"mouse","quantity":5}'

# Update an existing item
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"keyboard","quantity":20}'

# Delete an item
curl -X DELETE http://localhost:3000/items/1

**API Documentation**

The full API contract is defined in openapi.yaml. You can view it interactively by pasting its contents into editor.swagger.io.

*API Endpoints

MethodRouteDescriptionGET/healthHealth check responseGET/itemsReturn all itemsGET/items/:idReturn one item by IDPOST/itemsCreate a new itemPUT/items/:idUpdate an existing itemDELETE/items/:idDelete an existing item

//
**Reflection Questions
1. What makes this API more “REST-like” than the previous HTTP/JSON lab?
Answer 1: In the previous lab, we handled everything using generic request handlers with basic if/else logic based purely on raw URLs, which often feels messy. This lab is significantly more "REST-like" because we explicitly use appropriate HTTP methods (GET, POST, PUT, DELETE) to match specific semantic operations (CRUD) on a clearly defined resource collection (/items). Additionally, using Express routers allowed us to isolate and structure paths natively, while relying on explicit HTTP status codes (like 201 Created or 404 Not Found) instead of generic 200 responses for everything.

2. What is the purpose of a route parameter such as /items/:id?
Answer 2: A route parameter acts as a dynamic placeholder in the URL path. Instead of hardcoding every single item's endpoint or relying heavily on complex query strings (like /items?id=1), the parameter /items/:id allows Express to capture whatever value is passed in that position (accessible via req.params.id). This makes the API intuitive, scalable, and follows clean REST routing conventions for accessing specific individual resources.

3. Why should POST, PUT, and DELETE use different HTTP methods?
Answer 3: Using different HTTP methods provides semantic clarity and safety. Each method communicates the developer's exact intent to both the server and the client:
-POST is used to create a new resource, and it is non-idempotent (sending it twice creates two separate items).
-PUT is used to completely update or replace a specific existing resource, and it is idempotent (updating the same resource with the same data multiple times leaves it in the exact same state).
-DELETE is explicitly reserved for removing a resource.
Separating these operations prevents accidental destructive actions and aligns with standard web architecture.

4. What is the difference between a 400 error and a 404 error?
Answer 4: Both are client-side errors, but they mean very different things:
-400 Bad Request: The server understands the path, but the client sent an invalid, malformed, or incomplete payload. For example, trying to POST a new item without providing the required name or quantity fields.
-404 Not Found: The server cannot locate the requested resource. This happens either because the endpoint path does not exist at all, or because a route parameter points to a specific resource identifier (like /items/999) that does not exist in the collection.

5. How does the OpenAPI file relate to your Express server code?
Answer 5: The OpenAPI file (openapi.yaml) serves as the official contract and single source of truth for the API. It does not run the code itself, but it accurately describes exactly how the Express server is implemented—detailing the available routes, expected JSON payloads, and response status codes. It ensures that the documentation and the actual backend code are perfectly synchronized, making it easier for automated tools or frontend developers to understand and consume the service without reading the raw JavaScript source file.