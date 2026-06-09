## Reflection Questions

*1. What is the difference between a TCP message and an HTTP request?*
TCP is just raw bytes moving between two machines.It has no idea what those bytes mean. HTTP sits on top of TCP and adds structure: a method, a path, headers, and a body. So an HTTP request is essentially a TCP message that follows a specific format both sides agree on.

*2. What does the Content-Type: application/json header tell the server?*
It tells the server how to interpret the request body.In this case, that it's JSON, not plain text or form data. Without it, the server would have to guess, and it might get it wrong.

*3. Why should a server return different HTTP status codes for different situations?*
Because the client needs to know what actually happened.A 200 means everything worked.A 400 means the client sent something wrong.A 404 means the route doesn't exist. A 500 means something broke on the server side. Without distinct codes, the client can't tell success from failure.

*4. What happens if the client sends invalid JSON?*
The JSON.parse() call throws an error.If that error isn't caught, the server crashes.That's why we wrap body parsing in a try/catch and return a 400 with{ "error": "Invalid JSON" } instead of letting it take the whole server down.

*5. How is this lab different from Lab 1?*
Lab 1 used raw TCP.We defined our own custom command format from scratch. Lab 2 uses HTTP, which gives us a standard structure (methods, paths, status codes, headers) that already exists and that every client understands. We went from building our own protocol to using one the whole web runs on.
