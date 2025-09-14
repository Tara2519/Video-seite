const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Public-Ordner für HTML, CSS, JS
app.use(express.static('public'));

// Uploads-Ordner öffentlich machen
app.use('/uploads', express.static('uploads'));

// Speicher-Konfiguration für Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Speicherort
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // eindeutiger Dateiname
  }
});

const upload = multer({ storage: storage });

// Upload-Route für Videos
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('❌ Kein Video hochgeladen!');
  }
  res.send(`
    ✅ Video erfolgreich hochgeladen! <br>
    <a href="/uploads/${req.file.filename}">Video ansehen</a>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
