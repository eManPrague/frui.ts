import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>

        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}>
          <Link to="/customers">Customers</Link> | <Link to="/invoices">Invoices</Link>
        </nav>

        <Outlet />
      </header>
    </div>
  );
}

export default App;
