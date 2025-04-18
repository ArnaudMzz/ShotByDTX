require("dotenv").config(); // 🔐 Charge les variables depuis .env

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Sert les fichiers uploadés

// Connexion MongoDB Atlas
console.log("🧪 URI MONGO :", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));

// Schéma & modèle
const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
});
const Image = mongoose.model("Image", ImageSchema);

// Config stockage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
app.get("/api/images", async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.json(images);
});

app.post("/api/images", upload.single("image"), async (req, res) => {
  const { alt } = req.body;
  const file = req.file;

  if (!file) return res.status(400).send("No file uploaded");

  const newImage = new Image({
    src: `/uploads/${file.filename}`,
    alt,
  });

  await newImage.save();
  res.status(201).json(newImage);
});

// Start serveur
app.listen(PORT, () =>
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`)
);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 20000, // 20s au lieu de 10
});

app.get("/", (req, res) => {
  res.send("✅ Backend ShotByDTX is live and working !");
});
