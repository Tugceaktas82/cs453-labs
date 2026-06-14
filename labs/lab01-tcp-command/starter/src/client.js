import net from "node:net";
import readline from "node:readline";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 3000);

const socket = net.createConnection({ host: HOST, port: PORT }, () => {
  console.log(`Connected to echo server at ${HOST}:${PORT}`);
});

socket.setEncoding("utf8");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});

/**
 * Added an 'rlClosed' boolean flag to explicitly track the lifecycle of the readline interface.
 * This prevents asynchronous network callbacks from interacting with a closed input stream.
 */
let rlClosed = false;  // track readline state manually

// Handle data coming from the server
socket.on("data", (data) => {
  process.stdout.write(data);

  /**
   * Added the check `&& !rlClosed` to the conditional statement.
   * This is a critical safety measure against asynchronous race conditions. If the server sends
   * data at the exact moment the client is shutting down, it prevents calling `rl.prompt()`
   * on a closed interface, avoiding runtime warnings or graphical console glitches.
   */

  if (!socket.destroyed && !rlClosed) {
    rl.prompt();
  }
});

socket.on("end", () => {
  console.log("Disconnected from server.");
  rl.close();
});

socket.on("error", (err) => {
  console.error("Client error:", err.message);
  rl.close();
});

rl.on("line", (line) => {
  socket.write(`${line}\n`);

  if (line.trim().toUpperCase() === "QUIT") {
    /**
     * Immediately flip the state flag to true right before triggering `rl.close()`.
     * This ensures that any pending or simultaneous data packets from the socket stream
     * will immediately acknowledge that the interface is closed.
     */
    rlClosed = true; 
    rl.close();
  }
});

rl.on("close", () => {
  /**
   * Enforce deterministic state management by explicitly updating 'rlClosed' to true
   * as soon as the terminal interface closes (e.g., via QUIT or a CTRL+C interrupt signal),
   * ensuring all asynchronous operational scopes stay fully synchronized.
   */
  rlClosed = true; 
  if (!socket.destroyed) {
    socket.end();
  }
});
