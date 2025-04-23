// server.js (version locale sans MongoDB ni Cloudinary)
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Créer dossier uploads si inexistant
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Stockage local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Sauvegarde "en mémoire" dans un fichier JSON
const DATA_FILE = path.join(__dirname, "images.json");
let images = [];

if (fs.existsSync(DATA_FILE)) {
  images = JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveImagesToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2));
}

app.get("/api/images", (req, res) => {
  res.json(images);
});

app.post("/api/images", upload.single("image"), (req, res) => {
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

  images.unshift(image); // Ajouter en haut de la liste
  saveImagesToFile();

  res.status(201).json(image);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
