import { useEffect, useState } from "react";
import "./App.css";
import { TbArrowsRight, TbArrowsLeft, TbCar } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { v4 } from "uuid";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Car } from "./components/Car";

function App() {
  const [time, setTime] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);

  const addClient = (newClient) => {
    setClients((prevClients) => [...prevClients, newClient]);
  };

  const handleClick = async () => {
    const newClient = {
      id: v4(),
    };

    addClient(newClient);

    // setVehicles((prevState) => {
    //   return [...prevState, newClient].sort(
    //     (a, b) => a.delayTime - b.delayTime
    //   );
    // });
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prevTime) => {
        return prevTime + 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    setVehicles((prevState) => {
      return prevState.map((vehicle) => {
        if (vehicle.delayTime <= time) {
          return {
            ...vehicle,
            currentProgress: vehicle.currentProgress + vehicle.velocity * 10,
          };
        }

        return vehicle;
      });
    });
  }, [time]);

  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: "90%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>Tiempo: {time}</div>

      <div style={{ paddingTop: "64px" }}>
        <div>Controles</div>
        <div>
          <button onClick={handleClick}>Añadir cliente</button>
          <div>Estado actual</div>
          <div>
            <div>Velocidad</div>
            <input />
          </div>
          <div>
            <div>Tiempo promedio de retraso despues de cruzar</div>
            <input />
          </div>
          <div>
            <div>Direccion de rumbo inicial</div>
            <input />
          </div>

          <div>Numero de veces que cruza el puente</div>
        </div>
      </div>

      {clients.map((client, index) => (
        <Car key={index} client={client} />
      ))}

      <div style={{ paddingTop: "64px" }}>
        <div>Puente</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100px",
              background: "#BB9AB1",
              display: "flex",
              justifyContent: "space-around",
              color: "#EECEB9",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TbArrowsLeft fontSize={32} />
            <TbArrowsLeft fontSize={32} />
            <TbArrowsLeft fontSize={32} />
            <TbArrowsLeft fontSize={32} />
            <div style={{ position: "absolute", width: "100%" }}>
              {vehicles
                .filter((vehicle) => {
                  return (
                    vehicle.delayTime <= time && vehicle.direction === "RTL"
                  );
                })
                .map((vehicle) => {
                  return (
                    <TbCar
                      fontSize={64}
                      style={{
                        color: vehicle.color,
                        position: "relative",
                        left: `calc(100% - ${vehicle.currentProgress}%)`,
                        transform: "rotateY(180deg)",
                      }}
                    />
                  );
                })}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div>Cola RTL</div>
            <div>
              {vehicles
                .filter((vehicle) => {
                  return (
                    vehicle.delayTime > time && vehicle.direction === "RTL"
                  );
                })
                .map((vehicle) => {
                  return (
                    <div>
                      <a
                        style={{ display: "block", color: vehicle.color }}
                        id={`tooltip-${vehicle.id}`}
                      >
                        <TbCar
                          fontSize={64}
                          style={{
                            position: "relative",
                            transform: "rotateY(180deg)",
                          }}
                        />
                      </a>

                      <Tooltip
                        anchorSelect={`#${`tooltip-${vehicle.id}`}`}
                        place="top"
                      >
                        <div>
                          <div>Tiempo de espera: {vehicle.delayTime}</div>
                          <div>Dirección: {vehicle.direction}</div>
                        </div>
                      </Tooltip>
                    </div>
                  );
                })}
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "100px",
              background: "#EECEB9",
              display: "flex",
              justifyContent: "space-around",
              color: "#BB9AB1",
              alignItems: "center",
            }}
          >
            <TbArrowsRight fontSize={32} />
            <TbArrowsRight fontSize={32} />
            <TbArrowsRight fontSize={32} />
            <TbArrowsRight fontSize={32} />
            <div style={{ position: "absolute", width: "100%" }}>
              {vehicles
                .filter((vehicle) => {
                  return (
                    vehicle.delayTime <= time && vehicle.direction === "LTR"
                  );
                })
                .map((vehicle) => {
                  return (
                    <TbCar
                      fontSize={64}
                      style={{
                        color: vehicle.color,
                        position: "relative",
                        left: `${vehicle.currentProgress}%`,
                      }}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div>Cola LTR</div>
        <div>
          {vehicles
            .filter((vehicle) => {
              return vehicle.delayTime > time && vehicle.direction === "LTR";
            })
            .map((vehicle) => {
              return (
                <div>
                  <a
                    style={{ display: "block", color: vehicle.color }}
                    id={`tooltip-${vehicle.id}`}
                  >
                    <TbCar
                      fontSize={64}
                      style={{
                        position: "relative",
                      }}
                    />
                  </a>

                  <Tooltip
                    anchorSelect={`#${`tooltip-${vehicle.id}`}`}
                    place="top"
                  >
                    <div>
                      <div>Tiempo de espera: {vehicle.delayTime}</div>
                      <div>Dirección: {vehicle.direction}</div>
                    </div>
                  </Tooltip>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
