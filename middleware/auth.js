const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

function verifyToken(req,res, next) {
  const bearerToken = req.headers.authorization;
  if (typeof bearerToken !== 'undefined' ){
    let token = bearerToken.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {      
      if (err) {
        return res.json({ mensaje: 'Token inválida' }).sendStatus=(401);    
      } else {
        req.decoded = decoded; 
        next();
      }
    });
  }else{
      res.sendStatus=(401);
  }
 }
 module.exports = { verifyToken };