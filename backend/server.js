require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
console.log("🧪 URI MONGO :", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));

// Mongoose model
const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
});

const Image = mongoose.model("Image", ImageSchema);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ROUTE TEST - page d'accueil
app.get("/", (req, res) => {
  res.send("🚀 Backend ShotByDTX en ligne !");
});

// ROUTE GET - liste des images
app.get("/api/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    console.error("❌ Erreur Mongo :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ROUTE POST - ajout d'image
app.post("/api/images", upload.single("image"), async (req, res) => {
  const { alt } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Aucun fichier uploadé" });
  }

  const newImage = new Image({
    src: `/uploads/${file.filename}`,
    alt,
  });

  await newImage.save();
  res.status(201).json(newImage);
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
