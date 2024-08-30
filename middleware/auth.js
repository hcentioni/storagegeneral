const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const bearerToken = req.headers.authorization;
  
  // Verificar si se envió la cabecera Authorization
  if (typeof bearerToken === 'undefined') {
    return res.status(401).json({ mensaje: 'Authorization header is missing' });
  }

  // Extraer el token
  let token = bearerToken.split(" ")[1];

  // Verificar el token JWT
  jwt.verify(token, secretKey, (err, decoded) => {      
    if (err) {
      return res.status(401).json({ mensaje: 'Token inválida' });
    } else {
      req.decoded = decoded; 
      next();
    }
  });
}

module.exports = { verifyToken };
