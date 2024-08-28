const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const rutaupload = require('./routes/upload.routes');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 solicitudes por IP
});
const app = express();

app.use(express.static('./public'));
app.use(limiter);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Configura CORS
app.use(cors({
    origin: 'http://centioni.sunnetgestion.test', // Permite solo tu dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));


  app.use('/upload', rutaupload); 


const PORT = 7000;

app.listen(PORT, () => console.log(`Servidor escuchando en: http://localhost:${PORT}`));
