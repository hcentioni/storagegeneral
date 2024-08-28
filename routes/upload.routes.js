const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const fileName = Date.now();
    //cb(null, `${fileName}.${ext}`); 
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, `./public`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  console.log('llego ala ruta');
  const file = req.file.filename;
  console.log('Subio Archivo')
  res.status(200).send('http://localhost:7000/' + file);
  console.log('Archivo subido exitosamente');

});

// Middleware para manejar errores de Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Maneja errores específicos de Multer
    res.status(500).send({ error: `Multer error: ${err.message}` });
  } else if (err) {
    // Maneja cualquier otro tipo de error
    res.status(500).send({ error: `General error: ${err.message}` });
  } else {
    next();
  }
});

module.exports = router;

// router.post("/", upload.single("file"), (req, res) => {
//   try {
//     if (!req.file) {
//       console.log('No Pudo Subir Archivo')
//       res.status(400).send('No adjunto ningún archivo.');
//     } else {
//       const file = req.file.filename;
//       console.log('Subio Archivo')
//       res.status(200).send('https://apistoragews.sunnet.com.ar/' + file);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).send(error);
//   }

// });
// module.exports = router;