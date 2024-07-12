const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let carsOnBridge = 0;
const maxCarsOnBridge = 3;

wss.on("connection", (ws) => {
  const clientData = {
    id: uuidv4(),
    direction: Math.round(Math.random() * 1) ? "LTR" : "RTL",
    velocity: 1,
    currentProgress: 0,
    delayTime: Math.floor(Math.random() * 20) + 1,
    color:
      "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0"),
    running: false,
  };
  ws.clientData = clientData;

  console.log(`Nuevo cliente conectado con ID: ${clientData.id}`);

  ws.on("message", (message) => {
    const { command, data } = JSON.parse(message);
    console.log("here", command);

    if (command === "Generar carro") {
      ws.send(JSON.stringify({ newCar: clientData }));
    }

    if (command === "Preguntar si puedo pasar") {
      if (carsOnBridge < maxCarsOnBridge) {
        ws.send(JSON.stringify({ ...data, running: true }));
      }
    }
  });

  ws.on("close", () => {
    console.log(`Cliente desconectado con ID: ${clientData.id}`);
  });
});

server.listen(9001, () => {
  console.log("Servidor escuchando en http://localhost:5000");
});
