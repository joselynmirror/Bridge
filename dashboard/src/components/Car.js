import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

export const Car = ({ client: direction }) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:9001"
  );

  const [status, setStatus] = useState("waiting");
  const [messages, setMessages] = useState([]);

  const [carData, setCarData] = useState(null);

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      setCarData(data);
    }
  }, [lastMessage, sendMessage, direction]);

  useEffect(() => {
    if (readyState === WebSocket.OPEN && !carData) {
      sendMessage(JSON.stringify({ command: "Generar carro" }));
    }

    if (readyState === WebSocket.OPEN && carData) {
      sendMessage(
        JSON.stringify({ command: "Preguntar si puedo pasar", data: carData })
      );
    }
  }, [readyState, sendMessage, carData]);

  const connectionStatus = {
    0: "Conectando",
    1: "Abierto",
    2: "Cerrando",
    3: "Cerrado",
  }[readyState];

  console.log(carData);

  return (
    <div>
      <h3>Auto </h3>
      <p>Estado de la conexión: {connectionStatus}</p>
      <p>Estado actual: {status}</p>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};
