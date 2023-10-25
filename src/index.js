import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-nestable/dist/styles/index.css";
import "@nosferatu500/react-sortable-tree/style.css";

import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
