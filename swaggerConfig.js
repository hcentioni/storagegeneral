const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Esta es la documentación para la API Storage SunNet. Esta api se encarga de gestionar un repositorio de archivos con extension image/jpeg, image/png, image/gif, application/pdf con un límite de 10 MB por archivo. Por seguridad los archivos subidos al storage son renombrados aleatoriamente y se permite un maximo de 100 solicitudes por IP cada 10 minutos. Cuenta solo con dos rutas /public y /temp. La ruta public es persistente y se realizan copias de seguridad a todo su contenido diariamente y la ruta temp se utiliza para archivos de intercambio los cuales son eliminados diariamente a las 3 AM',
      contact: {
        name: 'Soporte Técnico',
        email: 'soporte@sunnet.com.ar'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
  },
  apis: ['./routes/*.js'], // Ruta donde están tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Solo habilitar Swagger en entornos de desarrollo
  if (process.env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger habilitado en el entorno de desarrollo.');
  } else {
    console.log('Swagger no está habilitado en el entorno de producción.');
  }
};
module.exports = setupSwagger;
