const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ordner für Uploads
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer Speicher-Konfiguration (max 2GB)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
});

// Statische Dateien
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadFolder));

// Upload-Route mit Fehlerbehandlung
app.post("/upload", (req, res) => {
  upload.single("video")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") return res.send("❌ Datei zu groß! Max. 2GB.");
      return res.send("❌ Multer Error: " + err.message);
    } else if (err) {
      return res.send("❌ Fehler beim Upload: " + err.message);
    }
    res.redirect("/");
  });
});

// Liste hochgeladener Videos
app.get("/list-videos", (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.status(500).send("Fehler beim Lesen der Videos.");
    let fileLinks = files.map(
      (f) => `<li><a href="/uploads/${f}" target="_blank">${f}</a></li>`
    );
    res.send(`<h1>Alle Videos</h1><ul>${fileLinks.join("")}</ul>`);
  });
});

app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
