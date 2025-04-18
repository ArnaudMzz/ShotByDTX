// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage avec multer + cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shotbydtx",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ MongoDB error", err));

// Schéma d'image
const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
});
const Image = mongoose.model("Image", ImageSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 API ShotByDTX avec Cloudinary");
});

app.get("/api/images", async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.json(images);
});

app.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    console.log("✅ POST /api/images");
    console.log("📸 File:", req.file);
    console.log("📝 Body:", req.body);

    if (!req.file?.path) {
      return res.status(400).json({ error: "Image non uploadée" });
    }

    const newImage = new Image({
      src: req.file.path, // ✅ URL Cloudinary ici
      alt: req.body.alt,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
