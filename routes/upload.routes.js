const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Función de almacenamiento común
const createStorage = (destinationPath) => {
  return multer.diskStorage({
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const uniqueSuffix = crypto.randomBytes(6).toString('hex');
      const fileName = `${uniqueSuffix}.${ext}`;
      cb(null, fileName);
    },
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
  });
};

// Configuración de almacenamiento para ./public
const storagePublic = createStorage('./public');

// Configuración de almacenamiento para ./public/temp
const storageTemp = createStorage('./public/temp');

// Configuración de Multer, incluyendo límite de tamaño de archivo
const uploadPublic = multer({ 
  storage: storagePublic,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10 MB
});

const uploadTemp = multer({ 
  storage: storageTemp,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10 MB
});

// Ruta para cargar archivos en ./public
router.post('/public', uploadPublic.single('file'), (req, res) => {
  try {
    console.log('Ruta public');
    const file = req.file.filename;
    const baseUrl = process.env.BASE_URL || 'http://localhost:7000';
    const fileUrl = `${baseUrl}/${file}`;
    console.log('Archivo subido exitosamente a public');
    res.status(200).send(fileUrl);
  } catch (err) {
    res.status(400).send({ error: 'Error en la carga del archivo en public' });
  }
});

// Ruta para cargar archivos en ./public/temp
router.post('/temp', uploadTemp.single('file'), (req, res) => {
  try {
    console.log('Ruta temp');
    const file = req.file.filename;
    const baseUrl = process.env.BASE_URL || 'http://localhost:7000';
    const fileUrl = `${baseUrl}/temp/${file}`;
    console.log('Archivo subido exitosamente a temp');
    res.status(200).send(fileUrl);
  } catch (err) {
    res.status(400).send({ error: 'Error en la carga del archivo en temp' });
  }
});

// Ruta para eliminar archivos
router.delete('/public/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send({ error: 'No se pudo eliminar el archivo' });
    }
    res.status(200).send({ message: 'Archivo eliminado exitosamente' });
  });
});

router.delete('/temp/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/temp', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send({ error: 'No se pudo eliminar el archivo' });
    }
    res.status(200).send({ message: 'Archivo eliminado exitosamente' });
  });
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
/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Operaciones relacionadas con la carga de archivos.
 */

/**
 * @swagger
 * upload/public:
 *   post:
 *     summary: Sube un archivo al storage y lo hace público para poder accederlo a través de una ruta pública
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: URL del archivo subido
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "http://localhost:7000/upload/public/filename.jpg"
 *       400:
 *         description: Error en la subida del archivo
 */

/**
 * @swagger
 * upload/temp:
 *   post:
 *     summary: Sube un archivo al storage en la sección de temporales, lo hace público para poder accederlo a través de una ruta pública y se elimina diariamente a las 3 AM
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: URL del archivo subido
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "http://localhost:7000/upload/temp/filename.jpg"
 *       400:
 *         description: Error en la subida del archivo
 */

/**
 * @swagger
 * upload/public/{filename}:
 *   delete:
 *     summary: Elimina un archivo de la sección pública
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         description: Nombre del archivo a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Archivo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo eliminado exitosamente"
 *       500:
 *         description: Error al eliminar el archivo
 */

/**
 * @swagger
 * upload/temp/{filename}:
 *   delete:
 *     summary: Elimina un archivo de la sección temporal
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         description: Nombre del archivo a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Archivo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo eliminado exitosamente"
 *       500:
 *         description: Error al eliminar el archivo
 */
