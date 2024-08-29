require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { verifyToken } = require('./middleware/auth'); // Importa el middleware de autenticación
const uploadRoutes = require('./routes/upload.routes'); // Importa las rutas de upload

const app = express();

// Middleware de limitación de tasa de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // Límite de 100 solicitudes por IP
});

// Configuración básica de la aplicación
app.use(express.static('./public'));
app.use(limiter);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configura CORS
app.use(cors({
    origin: (origin, callback) => {
        const allowedDomains = [
            'https://sunnet.com.ar',
            'https://sunnetgestion.com.ar',
            'https://sunnetventas.com.ar',
            'https://sunnetpreventas.com.ar',
            'http://localhost',
            'http://centioni.sunnetgestion.test',
            'http://192.168.50.239'
        ];
        if (!origin || allowedDomains.some(domain => origin.startsWith(domain))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Aplica el middleware de autenticación para todas las rutas
app.use(verifyToken);

// Rutas para subir archivos
app.use('/upload', uploadRoutes);

// Configurar el puerto
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Servidor escuchando en: http://localhost:${PORT}`));
