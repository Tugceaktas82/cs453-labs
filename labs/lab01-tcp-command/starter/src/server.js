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

 socket.on("data", (data) => {
    // Splits incoming data packet into individual lines safely
    const lines = data.split(/\r?\n/).filter((line) => line.trim().length > 0);

    for (const line of lines) {
      console.log(`Received from ${clientAddress}: ${line}`);

      // Pass the cleaned line into our modular commands system
      const response = handleCommand(line);
      socket.write(`${response}\n`);

      // Safely sever the socket line if QUIT was triggered
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