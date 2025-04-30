require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DEBUG : Vérifie que les variables d’environnement sont bien chargées
console.log("✅ Identifiants attendus :", process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

// Créer dossier uploads si inexistant
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Chargement du "fichier DB"
const DATA_FILE = path.join(__dirname, "images.json");
let images = [];
if (fs.existsSync(DATA_FILE)) {
  images = JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveImagesToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2));
}

// Middleware JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalide ou expiré" });
    req.user = decoded;
    next();
  });
}

// ROUTES

// 🔓 Route publique
app.get("/api/images", (req, res) => {
  res.json(images);
});

// 🔐 Route protégée - upload
app.post("/api/images", verifyToken, upload.single("image"), (req, res) => {
  const file = req.file;
  const alt = req.body.alt;

  if (!file || !alt) {
    return res.status(400).json({ error: "Image et alt requis" });
  }

  const image = {
    id: Date.now().toString(),
    src: `/uploads/${file.filename}`,
    alt,
  };

  images.unshift(image);
  saveImagesToFile();

  res.status(201).json(image);
});

// 🔐 Route protégée - suppression
app.delete("/api/images/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const imageToDelete = images.find((img) => img.id === id);
  if (!imageToDelete) return res.status(404).json({ error: "Image introuvable" });

  const imagePath = path.join(__dirname, imageToDelete.src);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.warn("⚠️ Fichier non supprimé :", err.message);
    }
  });

  images = images.filter((img) => img.id !== id);
  saveImagesToFile();

  res.status(200).json({ success: true });
});

// 🔐 Login avec JWT
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Log pour debug
  console.log("➡️ Tentative login avec :", username, password);

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  }

  console.warn("❌ Échec login : identifiants invalides");
  res.status(401).json({ error: "Identifiants invalides" });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
