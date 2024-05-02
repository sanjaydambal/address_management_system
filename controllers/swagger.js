import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Address Management system',
      version: '1.0.0',
      description: 'API documentation using Swagger/OpenAPI',
    },
    servers: [
      {
        url: 'https://address-management-system.onrender.com', 
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app, swaggerUrl) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerUrl));
  }
