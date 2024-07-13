const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let carsOnBridge = new Set();
const maxCarsOnBridge = 3;

wss.on("connection", (ws) => {
  const clientData = {
    id: uuidv4(),

    velocity: Math.floor(Math.random() * 10) + 5,
    currentProgress: 0,
    color:
      "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0"),
    running: false,

    delay: Math.floor(Math.random() * 2000) + 1000,
    currentDelay: null,
    count: 0,
  };
  clientData.currentDelay = clientData.delay;
  ws.clientData = clientData;

  console.log(`Nuevo cliente conectado con ID: ${clientData.id}`);

  ws.on("message", (message) => {
    const { command, data } = JSON.parse(message);

    if (command === "Generar carro") {
      ws.send(JSON.stringify(clientData));
    }

    if (command === "Preguntar si puedo pasar") {
      data.currentDelay =
        data.currentDelay > 0 ? data.currentDelay - 1 : data.currentDelay;

      if (
        carsOnBridge.size < maxCarsOnBridge &&
        !carsOnBridge.has(data.id) &&
        data.currentDelay <= 0
      ) {
        data.currentDelay = data.delay;
        ws.send(JSON.stringify({ ...data, running: true }));
        carsOnBridge.add(data.id);
        return;
      }

      if (carsOnBridge.has(data.id)) {
        const currentProgress = data.currentProgress + data.velocity / 100;
        const running = currentProgress <= 100;
        if (!running) {
          data.count += 1;
          carsOnBridge.delete(data.id);
        }

        ws.send(
          JSON.stringify({
            ...data,
            currentProgress: running ? currentProgress : 0,
            running,
          })
        );
        return;
      }

      ws.send(JSON.stringify(data));
    }
  });

  ws.on("close", () => {
    console.log(`Cliente desconectado con ID: ${clientData.id}`);
  });
});

const PORT = 9001;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
