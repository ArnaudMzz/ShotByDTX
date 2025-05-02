require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

// Utilisation du port dynamique sur Render ou 3001 en local
const PORT = process.env.PORT || 3001;

// CORS autorise ton front local et Netlify
const allowedOrigins = ["http://localhost:5173", "https://shotbydtx.netlify.app"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shotbydtx",  // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],  // Allowed formats
    transformation: [{ width: 1200, crop: "limit" }],  // Resize images
  },
});

const upload = multer({ storage });

// DB fichier JSON
const DATA_FILE = path.join(__dirname, "images.json");
let images = fs.existsSync(DATA_FILE)
  ? JSON.parse(fs.readFileSync(DATA_FILE))
  : [];

function saveImagesToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2));
}

// Middleware JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalide ou expiré" });
    req.user = decoded;
    next();
  });
}

// Routes

// 🔓 Route publique - Récupérer les images
app.get("/api/images", (req, res) => {
  res.json(images);
});

// 🔐 Route protégée - Upload image
app.post("/api/images", verifyToken, upload.single("image"), (req, res) => {
  const file = req.file;
  const alt = req.body.alt;

  if (!file || !alt) {
    return res.status(400).json({ error: "Image et alt requis" });
  }

  const image = {
    id: Date.now().toString(),
    src: file.path, // URL Cloudinary
    alt,
  };

  images.unshift(image); // Ajoute l'image en haut de la liste
  saveImagesToFile();

  res.status(201).json(image);
});

// 🗑️ DELETE - Supprimer une image
app.delete("/api/images/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const imageToDelete = images.find((img) => img.id === id);

  if (!imageToDelete) return res.status(404).json({ error: "Image introuvable" });

  // (Optionnel) Extraire l'ID Cloudinary pour supprimer là-bas aussi
  // const publicId = imageToDelete.src.split("/").pop().split(".")[0];

  images = images.filter((img) => img.id !== id);
  saveImagesToFile();

  res.status(200).json({ success: true });
});

// 🔐 Login admin (génère un JWT)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
      expiresIn: "2h", // Durée de validité du token
    });
    return res.json({ token });
  }

  res.status(401).json({ error: "Identifiants invalides" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Backend prêt sur http://localhost:${PORT}`);
});
