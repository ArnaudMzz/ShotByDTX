import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Galerie from "./pages/Galerie.tsx";
import "./index.css";
import Admin from "./pages/Admin.tsx";
import Contact from "./pages/Contact.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />;
        <Route path="/galerie" element={<Galerie />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
