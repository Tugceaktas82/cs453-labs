import net from "node:net";
import { handleCommand, shouldCloseConnection } from "./commands.js";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 3000);

const server = net.createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${clientAddress}`);

  socket.setEncoding("utf8");

  socket.write("Welcome to the CS453 command server.\n");
  socket.write("Commands: ECHO, UPPER, LOWER, REVERSE, TIME, QUIT\n");
 
  /**
     * Added `.trim()` inside the filter condition: `.filter((line) => line.trim().length > 0)`.
     * * The professor's starter code evaluates raw string length, which passes lines consisting 
     * solely of spaces (e.g., "   ") into the command system. My implementation sanitizes 
     * the line at the TCP network layer first, completely filtering out empty whitespace-only 
     * inputs before they hit the processing loop.
     */
  socket.on("data", (data) => {
    // Splits incoming data packet into individual lines safely
    const lines = data.split(/\r?\n/).filter((line) => line.trim().length > 0);

    for (const line of lines) {
      console.log(`Received from ${clientAddress}: ${line}`);

      // Pass the cleaned line into our modular commands system
      const response = handleCommand(line);
      socket.write(`${response}\n`);

      // Safely close the socket connection if the QUIT command was triggered
      if (shouldCloseConnection(line)) {
        socket.end();
        return;
      }
    }
  });

  socket.on("end", () => {
    console.log(`Client disconnected: ${clientAddress}`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error from ${clientAddress}:`, err.message);
  });
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Command server listening on ${HOST}:${PORT}`);
});