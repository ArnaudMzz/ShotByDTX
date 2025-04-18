require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config pour Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shotbydtx", // nom du dossier dans ton espace Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ MongoDB error", err));

// Schéma Mongoose
const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
});

const Image = mongoose.model("Image", ImageSchema);

// Route test
app.get("/", (req, res) => {
  res.send("🚀 API ShotByDTX with Cloudinary is live");
});

// GET images
app.get("/api/images", async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.json(images);
});

// POST image
app.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    const result = req.file; // Cloudinary renvoie l’objet complet
    const newImage = new Image({
      src: result.path, // URL complète fournie par Cloudinary
      alt: req.body.alt,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
