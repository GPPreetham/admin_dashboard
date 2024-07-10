import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

// Create a context to hold the configuration
const ConfigContext = React.createContext();

axios
  .get(`${process.env.PUBLIC_URL}/config/config.json`)
  .then((response) => {
    const config = response.data;

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <ConfigContext.Provider value={config}>
          <App />
        </ConfigContext.Provider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Failed to load config", error);
  });

reportWebVitals();

export { ConfigContext };
