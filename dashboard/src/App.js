import { useState } from "react";
import "./App.css";
import { TbArrowsLeft } from "react-icons/tb";
import { v4 } from "uuid";
import { Car } from "./components/Car";

function App() {
  const [clients, setClients] = useState([]);

  const handleClick = async () => {
    setClients((prevClients) => [...prevClients, v4()]);
  };

  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: "90%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ paddingTop: "64px" }}>
        <div>Controles</div>
        <div>
          <button onClick={handleClick}>Añadir cliente</button>
        </div>
      </div>

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
              width: "60%",
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
              {clients.map((client, index) => (
                <Car key={client} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
