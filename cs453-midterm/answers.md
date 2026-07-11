
## ANSWERS ##
----------------------------------------------------------------------------------------------------------------------------

### PART 1:Conceptual Foundations ###

1. Sockets vs. HTTP
a)What a raw TCP socket provides: A raw TCP socket gives you a low-level, continuous, and bidirectional communication link between two points over a network. It ensures bytes arrive in the correct order without losing any data, but it treats everything as a simple stream of bytes. It does not understand "methods," "headers," or "content types." 
b)What http adds on top: HTTP is an application-layer protocol built on top of TCP. It organizes that raw byte stream into a clearly defined request-response format. It introduces standard verbs (GET, POST, etc.), headers for metadata (like authentication and content types), and status codes to show the result of an operation. 
c)Why web APIs do not directly expose raw socket protocols: Complexity: Parsing raw bytes, creating routing logic, and handling rare errors from scratch requires a lot of repetitive code on both the client and server sides. Infrastructure Compatibility: Standard internet infrastructure, like firewalls, API gateways, reverse proxies, and load balancers, is designed to inspect and manage HTTP traffic. Raw TCP streams bypass these tools, making security and traffic management very challenging. Resource Management: Most web services work on a "get data and close connection" model. Keeping a raw TCP connection open for every single active user quickly uses up server resources compared to short-lived HTTP requests.
-------------------------------------
2. Request/Response Pattern 
The Request/Response pattern is a basic communication design in which the client initiates the conversation sending a certain message (the request) and the server processes that message and sends back a definite answer (the response). This is a synchronous transaction in nature where the client usually expects a response to close the loop.

Here is what it looks like at the different levels of development:

TCP command server You make all the rules from scratch here. The client connects to a TCP socket and sends a raw string to the socket, e.g. GET_USER:123. The server parses the string until it finds the delimiter (\n), then writes a raw string response down the wire, such as USER_DATA:Alice.

An HTTP API: It’s simple. The client sends a text block with the requested method, path, and headers (eg. GET /users/123 HTTP/1.1 ) to the server. The server parses that text and returns a valid HTTP response block with a status code ( e.g. HTTP/1.1 200 OK ).

A route handler for Express: All this is wrapped up by Express.js in JavaScript. It takes the raw HTTP request, wraps it in a req (Request) object, and gives you a res (Response) object with some helper utilities. So when you write res.status(200).json( user: ‘Alice’ ), Express takes that JavaScript object, converts it back into a normal HTTP text response, and pushes it down the TCP socket.
-------------------------------------
3. Statelessness

For a stateless API, there is no way for the server to store any information, or session data, about the client from one request to the next. A request is sent independent of the next. The client is responsible for sending all required data (like an authentication token, user ID, state flags) in each request.

Advantages (Scalability): Since the server cannot store session information in memory, it is possible to use a load balancer for the application and forward requests to any available server instance.

Disadvantages (Overhead on the Network): As the server has no information about anything, the client has to include bulky authentication tokens (JWTs) and context information in each API call.
-------------------------------------

4)


|Situation                                           |Status Code               |  
|--------------------------------------------------- |------------------------- |  
|A new resource was successfully created             |201 Created               |
|The client requested an item that does not exist    |404 Not Found             |
|The client sent JSON missing a required field       |400 Bad Request           |
|The server had an unexpected error                  |500 Internal Server Error |
|A successful request returns JSON data              |200 OK                    |


Situation                                           |     Justification
|-------------------------------------------------- |-------------------------- |  
|A new resource was successfully created          |Signals that the request succeeded and resulted in a new resource being created (conventionally paired with a Location header pointing to the new resource).|
|The client requested an item that does not exist |The default status code where the server is able to connect with the client, but is not able to locate any resource associated with the requested URI.|
|The client sent JSON missing a required field    |The actual request made by the client is malformed and invalid; the server can’t understand it in its present form and must be remedied by the client himself.|
|The server had an unexpected error               |The generic catch-all code used when the client's request is fine, but the server encounters an unhandled exception or crash internally.|
|A successful request returns JSON data           |The standard status code for a successful HTTP request, showing that the operation worked perfectly and the data is present in the response body.|

----------------------------------------------------------------------------------------------------------------------------

### PART 2:API Design ###

1. Resource URIs  &  
2. Method Semantics 

|Operation               |URI                  |Semantic Classification  |Explanation   |
|----------------------- |-------------------- |------------------------ |------------- |  
|Get all tasks           |GET /tasks           |Safe & Idempotent        |Safe because it only retrieves data without changing server state. Idempotent because calling it multiple times always returns the same result (assuming data hasn't changed elsewhere). |
|----------------------- |-------------------- |------------------------ |------------- |  
|Get one task by id      |GET /tasks/{id}      |Safe & Idempotent        |Safe because it is a read-only lookup. Idempotent because repeatedly looking up the same ID yields identical results.|
|----------------------- |-------------------- |------------------------ |------------- |  
|Create a task           |POST /tasks          | Neither                   |It changes server state by inserting a new record (not safe). It is not idempotent because repeating the request will create multiple duplicate records. |
|----------------------- |-------------------- |------------------------ |------------- |  
|Replace a task           |  PUT /tasks/{id}   |Idempotent & Not Safe   |Not safe because it overwrites an existing resource. It is idempotent because sending the exact same payload to the same URI multiple times results in the same final state. |
|----------------------- |-------------------- |------------------------ |------------- |  
|Partially update a task  |  PATCH /tasks/{id} |Neither                 |It modifies state, so it isn't safe. By HTTP semantics, PATCH is only idempotent if the patch describes an absolute end state (such as "set completed to true"); it becomes non-idempotent if it describes a relative change (such as "toggle completed" or "append to title"), since repeating it would keep changing the resource. Since the exam doesn't restrict the patch format, we treat it conservatively as neither safe nor guaranteed idempotent. |
|----------------------- |-------------------- |------------------------ |------------- |  
|Delete a task           |DELETE /tasks/{id}   |Idempotent (Not Safe)   |It changes state (removes a resource), so not safe. It is idempotent because deleting the same id repeatedly leaves the system in the same end state: the task is gone after the first call, and it's still gone after every subsequent call (later calls typically respond 404 instead of 204, but the state doesn't change further).|
_____________________________________________________________________________________________________________________
*Safe = the method does not modify server state (read only).
*Idempotent = making the same request multiple times produces the same end state as making it once (the response can be different, e.g. 200 vs 404, but the underlying resource state converges to the same result).

---------------------
3. JSON Representation

Request body for POST /tasks (creating a new task).The client does not supply an id, since the server assigns it:
   {
  "title": "Submit Assignment 2",
  "course": "CS453",
  "completed": false
   }

The server responds with 201 Created and returns the full resource,including the assigned id:
   {
  "id": "2",
  "title": "Submit Assignment 2",
  "course": "CS453",
  "completed": false
   }

----------------------------------------------------------------------------------------------------------------------------

### Part 4: Middleware ###

# What I implemented

1. Request logger (src/middleware/logger.js) ; logs method, path, status code and how long the request took. Hooked into the "finish" event since the status code and duration aren't known until Express is done sending the response.

2. Validation middleware (src/middleware/validateTask.js) ; checks the request body for POST, PUT and PATCH on /api/tasks. If something required is missing or wrong type, it sends 400 before the request reaches the route handler.

# Why middleware instead of putting this in every route

Logging and validation aren't really what a route is "for" ; POST /api/tasks should be about creating a task, not re-checking timestamps or fields every time. Putting this in every handler would mean copy-pasting the same logic into GET, POST, PUT, PATCH, DELETE, which gets messy and easy to mess up.

Middleware lets me write it once and have it run automatically wherever it's needed. Route handlers stay focused on the actual task logic instead of being full of repeated boilerplate, and if I need to change validation or logging later I only touch one file.

----------------------------------------------------------------------------------------------------------------------------

### Part 7:Reflection ###

1. Code vs. Contract

The Express route is the code that actually runs when someone hits an endpoint - it decides what really happens: which checks run, what gets saved or looked up, what status code comes back. That's the real behavior of the API.

The OpenAPI file is just a description of what the API is supposed to do. It doesn't run anything, it's basically documentation that lists the routes, what needs to be sent in a request, and what comes back in the response. Nothing stops the two from saying different things unless both get updated every time something changes.

So the route code is what happens, and the OpenAPI file is what it says should happen. They're only in sync if someone keeps them that way.

2. Drift

Two examples of how they can end up different:

- I add a new field to a task in the code (like `dueDate`) but forget to add it to the Task schema in openapi.yaml. Now the real response has more fields than the spec says.
- I change a validation rule in validateTask.js, like making `course` optional instead of required, but never go back and update openapi.yaml, so it still says `course` is required even though the server doesn't actually require it anymore.

3. Client Impact

If the docs don't match the real API, whoever is building a client is trusting information that's wrong. They might assume a field will always be there when it's not, send something the docs say is required when the server doesn't even need it, or not handle a status code because it wasn't mentioned in the docs. Usually they won't notice until their code breaks against the real server, and then they have to dig through the server code to figure out what's going on instead of just trusting the documentation, which wastes a lot of time.