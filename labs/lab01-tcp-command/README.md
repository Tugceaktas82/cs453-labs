# Lab 1 - TCP Command Server

In this lab, you will extend a simple TCP echo server into a small command-based TCP server.

The lecture example showed a basic client/server program where the client sends text and the server echoes the same text back. This lab builds on that idea by adding a simple command protocol.

## Learning Goals

By the end of this lab, you should be able to:

* Explain the difference between a TCP client and a TCP server.
* Run a TCP server and connect to it with a client.
* Send and receive text over a socket.
* Implement simple command parsing.
* Use automated tests to check server command behavior.
* Describe a small text-based protocol.

## Starter Code Structure

The starter code is located in:

```
labs/lab01-tcp-command/starter/
```

The starter project has this structure:

```
starter/
├── package.json
├── src/
│   ├── client.js
│   ├── commands.js
│   └── server.js
└── test/
    └── commands.test.js
```

### File Descriptions

| File                    | Purpose                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `src/server.js`         | Starts the TCP server, accepts client connections, reads client input, and sends responses. |
| `src/client.js`         | Provides a simple command-line TCP client for testing the server manually.                  |
| `src/commands.js`       | Contains the command-handling logic. Most of your work will be here.                        |
| `test/commands.test.js` | Contains automated tests for the command-handling logic.                                    |
| `package.json`          | Defines project metadata, dependencies, and npm scripts.                                    |

## Required Features

1. The server must accept TCP client connections on a configurable port.
2. The client must send one command at a time.
3. The server must support `ECHO`, `UPPER`, `LOWER`, and `QUIT`.
4. The server must return an error for unknown commands.
5. The server must not crash when the client sends an empty line.
6. The README must describe the protocol.

### Graduate Students

7. Implement `REVERSE` or `TIME` or add a new command and document it. 

## Command Protocol

The server accepts one text command per line.

Commands are case-insensitive, but the command arguments should be handled as normal text.

| Client sends    | Server responds     |
| --------------- | ------------------- |
| `ECHO hello`    | `hello`             |
| `UPPER hello`   | `HELLO`             |
| `LOWER HELLO`   | `hello`             |
| `REVERSE hello` | `olleh`             |
| `TIME`          | current server time |
| `QUIT`          | closes connection   |
| unknown command | error message       |

## Running the Lab

First, move into the starter directory:

```
cd labs/lab01-tcp-command/starter
```

Install dependencies:

```
npm install
```

Start the server:

```
npm run server
```

In a second terminal, move into the same starter directory and run the client:

```
npm run client
```

You should be able to type commands into the client and see responses from the server.

Example:

```
> ECHO hello
hello

> UPPER hello
HELLO

> QUIT
Goodbye.
```

## Configuring the Port

The server should use port `3000` by default.

You can run the server on a different port by setting the `PORT` environment variable:

```
PORT=4000 npm run server
```

Then run the client using the same port:

```
PORT=4000 npm run client
```

## Testing

This lab includes automated tests for the command-handling logic.

Run the tests from the starter directory:

```
npm test
```

The tests are focused on `src/commands.js`.

That means you can work on the command behavior without needing to manually start the TCP server every time.

The main function being tested is:

```
handleCommand(line)
```

The tests check that commands such as `ECHO`, `UPPER`, `LOWER`, `REVERSE`, `TIME`, and `QUIT` return the expected responses.

Some tests may fail when you first receive the starter code. Your job is to update the implementation until the required tests pass.

You may also run the tests in watch mode if supported by the starter project:

```
npm run test:watch
```

## Suggested Workflow

1. Run the server and client before changing anything.
2. Try the existing commands manually.
3. Run the automated tests.
4. Open `src/commands.js`.
5. Implement one command at a time.
6. Run `npm test` after each change.
7. Once the tests pass, test manually with the client.
8. Update this README to describe the final protocol.

## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between the client and the server?
Answer1:The server is a program that just sits there running in the background(on port 3000) and waiting for connections.When someone connects,it processes whatever commands they send,and because of how it's built, it can easily handle multiple clients at the same time.On the other hand, the client is just a temporary program the user opens to connect to the server.It takes whatever you type,sends it over,and prints the server's response on the screen.So while the server stays up for everyone,each client is just an individual session that ends whenever the user decides to quit.
2. Why does the server need to keep running after handling one request?
Answer2:Because TCP is a persistent, connection-based protocol.Unlike a one shot request model,the server maintains an open connection with the client and handles multiple commands in a single session.It must keep running to serve future clients as well.
3. What happens if two clients connect at the same time?
Answer3:Node.js takes care of this through its event loop. Every client gets their own socket and their own set of event handlers, so each one is dealt with on its own terms.Additionally,no one's waiting on anyone else, and no one's getting in the way.
4. How is this different from HTTP?
Answer4:Basically,HTTP is stateless and works on a strict request-response basis, meaning every single request is completely independent. Our TCP setup, on the other hand, is stateful and persistent, so the connection just stays open for as long as you want to send commands.Plus, HTTP comes with a lot of extra baggage like headers, status codes, and methods like GET or POST, whereas our TCP protocol is just a super simple, custom text-based system.We can type ten different commands back-to-back, and the server keeps talking to us on that exact same open pipeline until we finally type 'QUIT'.
## Submission

Submit your completed lab according to the course submission instructions.

Your submission should include:

* Your updated source code.
* Your completed `commands.js`.
* Your updated README protocol description.
* Your answers to the reflection questions.
* Any graduate extension work, if applicable.

Before submitting, verify that:

```
npm test
```

runs successfully.
