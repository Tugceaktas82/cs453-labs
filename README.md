# CS 453/553 Labs
# TUGCE AKTAS KUCUKTAS

This repository contains small examples and lab exercises for CS 453/553 Client-Server Programming.

The goal of these labs is to build up the core ideas of client/server systems one step at a time: TCP sockets, HTTP, REST APIs, middleware, authentication, service-to-service communication, message queues, WebSockets, GraphQL, and containerized deployment.

## Repository Structure

    cs453-labs/
    ├── docs/
    ├── examples/
    ├── labs/
    └── scripts/

## Directories

| Directory | Purpose |
|---|---|
| `docs/` | Setup guides, quickstarts, troubleshooting notes, and submission instructions. |
| `examples/` | Small complete examples used for lecture, demonstration, or reference. |
| `labs/` | Student lab starters and lab instructions. |
| `scripts/` | Helper scripts for checking the environment, cleaning generated files, and running tests. |

## Getting Started

Start with the setup guide:

    docs/setup.md

Then review these as needed:

    docs/node-quickstart.md
    docs/docker-quickstart.md
    docs/troubleshooting.md
    docs/submitting-labs.md

## Check Your Environment

From the repository root, run:

    ./scripts/check-env.sh

This checks for common tools used in the labs, including Git, Node.js, npm, Docker, Docker Compose, and curl.

## Running an Example

Each example has its own folder and README.

For example:

    cd examples/01-tcp-echo
    npm install
    npm run server

Then open a second terminal:

    cd examples/01-tcp-echo
    npm run client

## Working on a Lab

Each lab has a `starter/` directory.

For example:

    cd labs/lab01-tcp-command/starter
    npm install
    npm test

Read the lab README before starting the lab.

## Run All Tests

From the repository root:

    ./scripts/test-all.sh

This runs tests for examples and labs that contain a `package.json`.

## Clean Generated Files

From the repository root:

    ./scripts/clean.sh

This removes generated files such as `node_modules/`, coverage output, build output, and log files.

## Notes

Do not commit `node_modules/`.

Do commit `package.json` and `package-lock.json` for examples and labs so that dependencies are reproducible.

# TUGCE AKTAS KUCUKTAS
# TCP Command Server Protocol Description

# Protocol Semantics & Message Formats
All messages are transmitted as plain UTF-8 encoded text strings terminated by a newline (`\n` or `\r\n`) character.

# Requests
The client sends requests using the following structure:
`<COMMAND> [argument]`
* **COMMAND**: A case-insensitive token identifying the action.
* **argument**: Optional string payload payload parsed by the server logic.
#Responses
The server processes incoming commands sequentially and issues a single-line string response:
* **Success**: Returns the computed mutation of the string payload or system state.
* **Errors**: Prefixed with `ERROR <reason>` (e.g., `ERROR unknown command: INVALID`).

#Supported Commands
| Command | Argument | Server Response Example | Description |
| :--- | :--- | :--- | :--- |
| `ECHO` | `text` | `text` | Returns the input text unchanged. |
| `UPPER` | `text` | `TEXT` | Converts payload text to uppercase letters. |
| `LOWER` | `text` | `text` | Converts payload text to lowercase letters. |
| `REVERSE`| `text` | `txet` | Reverses the string character order. |
| `TIME` | None | `2026-06-02T21:07:13.802Z` | Returns current server time in ISO 8601 format. |
| `QUIT` | None | `Goodbye.` | Tears down the TCP connection stream. |
