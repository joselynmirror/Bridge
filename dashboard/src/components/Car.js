import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { TbCar } from "react-icons/tb";
import { Tooltip } from "react-tooltip";

export const Car = ({ index }) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:9001",
    {}
  );
  const [data, setData] = useState(null);

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      setData(data);
    }
  }, [lastMessage, sendMessage]);

  useEffect(() => {
    if (readyState === WebSocket.OPEN && !data) {
      sendMessage(JSON.stringify({ command: "Generar carro" }));
    }

    if (readyState === WebSocket.OPEN && data) {
      sendMessage(
        JSON.stringify({ command: "Preguntar si puedo pasar", data })
      );
    }
  }, [readyState, sendMessage, data]);

  const connectionStatus = {
    0: "Conectando",
    1: "Abierto",
    2: "Cerrando",
    3: "Cerrado",
  }[readyState];

  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        left: data.running
          ? `calc(100% - ${data.currentProgress}% - ${index * 64}px)`
          : `calc(100% - ${data.currentProgress}%)`,
        display: "inline-block",
      }}
    >
      <a
        style={{ display: "block", color: data.color }}
        id={`tooltip-${data.id}`}
      >
        <TbCar
          fontSize={64}
          style={{
            color: data.color,

            transform: "rotateY(180deg)",
          }}
        />
      </a>

      <Tooltip anchorSelect={`#${`tooltip-${data.id}`}`} place="top">
        <div>
          <div>ID: {data.id}</div>
          <div>Estado del socket: {connectionStatus}</div>
          <div>
            Estado en el puente: {data.running ? "Enviando datos" : "Esperando"}
          </div>
          <div>Velocidad: {data.velocity}</div>
          <div>Tiempo de espera: {data.currentDelay}</div>
          <div>Dirección: {data.direction}</div>
          <div>Numero de veces que cruza el puente: {data.count}</div>
        </div>
      </Tooltip>
    </div>
  );
};
