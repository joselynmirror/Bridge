const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

app.use(cors());

let clients = {};

wss.on("connection", (ws, request, clientId) => {
  console.log(`Nuevo cliente conectado con ID: ${clientId}`);
  clients[clientId] = ws;

  ws.on("message", (message) => {
    console.log(`Mensaje recibido de ${clientId}: ${message}`);
  });

  ws.on("close", () => {
    console.log(`Cliente desconectado con ID: ${clientId}`);
    delete clients[clientId];
  });
});

// Ruta HTTP para crear una nueva conexión WebSocket
app.get("/connect", (req, res) => {
  const clientId = uuidv4();
  const ws = new WebSocket(`ws://localhost:3000/${clientId}`);

  ws.on("open", () => {
    console.log(`WebSocket abierto para cliente ${clientId}`);
  });

  clients[clientId] = ws;

  res.json({ clientId });
});

// Emitir mensajes continuamente a todos los clientes conectados
setInterval(() => {
  const message = JSON.stringify({ data: "Mensaje continuo" });
  for (const clientId in clients) {
    const client = clients[clientId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}, 1000); // Emitir un mensaje cada segundo

server.on("upgrade", (request, socket, head) => {
  const pathname = request.url.split("/")[1];
  if (clients[pathname]) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, pathname);
    });
  } else {
    socket.destroy();
  }
});

server.listen(3001, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
