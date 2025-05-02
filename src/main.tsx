import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Galerie from "./pages/Galerie.tsx";
import Admin from "./pages/Admin.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import "./index.css";

// Assure-toi que l'élément #app existe dans ton index.html
const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        {/* Structure des routes à l'intérieur du Router */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.log("L'élément cible #app n'a pas été trouvé dans le DOM.");
}
