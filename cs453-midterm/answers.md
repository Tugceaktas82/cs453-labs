
###PART 1 ###
-------------------------------------
1)
a)What a raw TCP socket provides: A raw TCP socket gives you a low-level, continuous, and bidirectional communication link between two points over a network. It ensures bytes arrive in the correct order without losing any data, but it treats everything as a simple stream of bytes. It does not understand "methods," "headers," or "content types." 
b)What http adds on top: HTTP is an application-layer protocol built on top of TCP. It organizes that raw byte stream into a clearly defined request-response format. It introduces standard verbs (GET, POST, etc.), headers for metadata (like authentication and content types), and status codes to show the result of an operation. 
c)Why web APIs do not directly expose raw socket protocols: Complexity: Parsing raw bytes, creating routing logic, and handling rare errors from scratch requires a lot of repetitive code on both the client and server sides. Infrastructure Compatibility: Standard internet infrastructure, like firewalls, API gateways, reverse proxies, and load balancers, is designed to inspect and manage HTTP traffic. Raw TCP streams bypass these tools, making security and traffic management very challenging. Resource Management: Most web services work on a "get data and close connection" model. Keeping a raw TCP connection open for every single active user quickly uses up server resources compared to short-lived HTTP requests.

-------------------------------------

2. Request/Response Pattern 
The Request/Response pattern is a basic communication design in which the client initiates the conversation sending a certain message (the request) and the server processes that message and sends back a definite answer (the response). This is a synchronous transaction in nature where the client usually expects a response to close the loop.

Here is what it looks like at the different levels of development:

-A TCP command server Here you make the rules from scratch, totally. The client connects and sends a raw string to the socket, e.g. GET_USER:123\n. The server reads the stream until it finds the delimiter (\n), parses the text manually and writes a raw string response back down the wire, such as USER_DATA:Alice\n.

-An HTTP API: The pattern is based on strict, universal rules. The client sends a formatted text block with a method, path and headers (eg. GET /users/123 HTTP/1.1 ) . The server parses this standard structure . By protocol , the server must respond with a valid HTTP response block starting with a status code ( e.g. HTTP/1.1 200 OK ) .

-An Express route handler: All of this is wrapped up by Express.js into JavaScript code. The framework receives the raw HTTP text and raps it into a req (Request) object. It gives you a res (Response) object with some helper utilities. When you write res.status(200).json({ user: 'Alice' }), Express takes that JavaScript object, converts it back into a normal HTTP text response, and pushes it down the TCP socket for you.
-------------------------------------

3. Statelessness
In order for an API to be stateless, the server cannot store any information or session data about the client from one request to another. Each request comes independently and fresh to the server. It is the client's full responsibility to send all necessary information in each request (like authentication tokens, user ID, state flags).

Advantages (Scalability): Since no session information is stored in the memory by the server, it becomes possible to use a load balancer for the application and forward any request to any available server instance. To scale out, all we need to do is launch additional instances, and there is no session information sync to worry about.

Disadvantages (Overhead on the Network): As the server has no information about anything, the client has to include bulky authentication tokens (JWTs) and context information in each API call.

-------------------------------------

4)
Situation                                           |     Status Code   
___________________________________________________________________________________   
A new resource was successfully created             |     201 Created
The client requested an item that does not exist    |     404 Not Found
The client sent JSON missing a required field       |     400 Bad Request
The server had an unexpected error                  |     500 Internal Server Error
A successful request returns JSON data              |     200 OK



Situation                                        |     Justification
___________________________________________________________________________________   
-A new resource was successfully created          |Signals that the request succeeded and resulted in a new resource being created (conventionally paired with a Location header pointing to the new resource).
-The client requested an item that does not exist |The default status code where the server is able to connect with the client, but is not able to locate any resource associated with the requested URI.
-The client sent JSON missing a required field    |The actual request made by the client is malformed and invalid; the server can’t understand it in its present form and must be remedied by the client himself.
-The server had an unexpected error               |The generic catch-all code used when the client's request is fine, but the server encounters an unhandled exception or crash internally.
-A successful request returns JSON data           |The standard status code for a successful HTTP request, showing that the operation worked perfectly and the data is present in the response body.

---------------------------------------------
### PART 2: API Design ###

1. Resource URIs  &  2.Method Semantics 

Operation                |  URI                | Semantic Classification | Explanation
____________________________________________________________________________________________________________________________
Get all tasks            |  GET /tasks         | Safe & Idempotent       | Safe because it only retrieves data without changing server state. Idempotent because calling it multiple times always returns the same result (assuming data hasn't changed elsewhere). 
---
Get one task by id       |  GET /tasks/{id}    | Safe & Idempotent       | Safe because it is a read-only lookup. Idempotent because repeatedly looking up the same ID yields identical results.
---
Create a task            |  POST /tasks        | Neither                 | It changes server state by inserting a new record (not safe). It is not idempotent because repeating the request will create multiple duplicate records. 
---
Replace a task           |  PUT /tasks/{id}    | Idempotent & Not Safe   | Not safe because it overwrites an existing resource. It is idempotent because sending the exact same payload to the same URI multiple times results in the same final state. 
---
Partially update a task  |  PATCH /tasks/{id}  | Neither                 | It modifies state, so it isn't safe. By HTTP semantics, PATCH is only idempotent if the patch describes an absolute end state (such as "set completed to true"); it becomes non-idempotent if it describes a relative change (such as "toggle completed" or "append to title"), since repeating it would keep changing the resource. Since the exam doesn't restrict the patch format, we treat it conservatively as neither safe nor guaranteed idempotent. 
---
Delete a task            |  DELETE /tasks/{id} | Idempotent (Not Safe)   | It changes state (removes a resource), so not safe. It is idempotent because deleting the same id repeatedly leaves the system in the same end state: the task is gone after the first call, and it's still gone after every subsequent call (later calls typically respond 404 instead of 204, but the state doesn't change further).
---
*Safe = the method does not modify server state (read only).
*Idempotent = making the same request multiple times produces the same end state as making it once (the response can be different, e.g. 200 vs 404, but the underlying resource state converges to the same result).

3. JSON Representation

Example 1: request body for POST /tasks (creating a new task, the client doesn't supply id; the server assigns it):
   {
  "title": "Submit Assignment 2",
  "course": "CS453",
  "completed": false
   }

Example 2: The server would respond 201 Created with the full resource, including the server-assigned id:
   {
  "id": "2",
  "title": "Submit Assignment 2",
  "course": "CS453",
  "completed": false
   }