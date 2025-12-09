import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API Documentation",
      version: "1.0.0",
      description: "API Documentation for LMS Platform",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
