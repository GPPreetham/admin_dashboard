import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom"; // Import only Router here
import AppRoutes from "./Routes"; // Import the routes

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <AppRoutes /> {/* Use the imported routes */}
        </main>
        <footer>{/* Your footer content */}</footer>
      </div>
    </Router>
  );
}

export default App;
