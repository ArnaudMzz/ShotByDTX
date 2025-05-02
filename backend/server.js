require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS autorise ton front local et Netlify
const allowedOrigins = ["http://localhost:5173", "https://shotbydtx.netlify.app"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shotbydtx", // Dossier sur Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Types de fichiers acceptés
    transformation: [{ width: 1200, crop: "limit" }],
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

// 📷 GET - Liste des images (publique)
app.get("/api/images", (req, res) => {
  res.json(images);
});

// 📤 POST - Upload image (admin uniquement)
app.post("/api/images", verifyToken, upload.single("image"), async (req, res) => {
  const file = req.file;
  const alt = req.body.alt;

  console.log("✅ Image reçue :", JSON.stringify(file, null, 2));  // Log pour vérifier que le fichier arrive
  console.log("✅ Alt reçu :", JSON.stringify(alt, null, 2));     // Log pour vérifier l'alt

  if (!file || !alt) {
    return res.status(400).json({ error: "Image et alt requis" });
  }

  try {
    const image = {
      id: Date.now().toString(),
      src: file.path, // L'URL Cloudinary ou chemin généré par Multer
      alt,
    };

    console.log("✅ Image à enregistrer :", JSON.stringify(image, null, 2));  // Log pour voir l'image à enregistrer

    images.unshift(image); // Ajouter l'image en haut du tableau
    saveImagesToFile(); // Sauvegarde dans le fichier JSON

    res.status(201).json(image); // Réponse avec l'image ajoutée
  } catch (error) {
    console.error("❌ Erreur lors de l'upload ou de la sauvegarde de l'image :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'upload de l'image." });
  }
});

// 🗑️ DELETE - Supprimer une image
app.delete("/api/images/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const imageToDelete = images.find((img) => img.id === id);
  if (!imageToDelete) return res.status(404).json({ error: "Image introuvable" });

  // Extraire l'ID public de Cloudinary pour supprimer l'image là-bas
  const publicId = imageToDelete.src.split("/").pop().split(".")[0];

  // Supprimer de Cloudinary
  cloudinary.uploader.destroy(publicId, (err, result) => {
    if (err) {
      console.error("❌ Erreur lors de la suppression de l'image Cloudinary :", err);
      return res.status(500).json({ error: "Erreur Cloudinary" });
    }
    console.log("✅ Image supprimée de Cloudinary :", result);

    // Supprimer de la liste locale (JSON)
    images = images.filter((img) => img.id !== id);
    saveImagesToFile();

    res.status(200).json({ success: true });
  });
});

// 🔐 Login admin
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  }
  res.status(401).json({ error: "Identifiants invalides" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend prêt sur http://localhost:${PORT}`);
});
