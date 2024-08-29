const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Configuración de almacenamiento
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    const fileName = `${uniqueSuffix}.${ext}`;
    cb(null, fileName);
  },
  destination: function (req, file, cb) {
    cb(null, `./public`);
  },
});

// Configuración de Multer, incluyendo límite de tamaño de archivo
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10 MB
});

router.post('/', upload.single('file'), (req, res) => {
  try {
    console.log('llegó a la ruta');
    const file = req.file.filename;

    // Obtener la URL base desde las variables de entorno
    const baseUrl = process.env.BASE_URL || 'http://localhost:7000';
    const fileUrl = `${baseUrl}/${file}`;

    console.log('Archivo subido exitosamente');
    res.status(200).send(fileUrl);
  } catch (err) {
    res.status(400).send({ error: 'Error en la carga del archivo' });
  }
});

// Middleware para manejar errores de Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).send({ error: 'El archivo es demasiado grande. El límite es de 10 MB.' });
    } else {
      res.status(500).send({ error: `Multer error: ${err.message}` });
    }
  } else if (err) {
    res.status(500).send({ error: `Error general: ${err.message}` });
  } else {
    next();
  }
});

module.exports = router;
