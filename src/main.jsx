import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import Footer from "./components/Footer/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div>
      <App />
      <Footer />
    </div>
  </React.StrictMode>
);
