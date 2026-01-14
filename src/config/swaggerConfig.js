
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GV Bidder CRM API",
      version: "1.0.0",
      description: "API documentation for Bidder CRM backend",
    },

    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Local Server",
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
  },

  // Paths to scan for Swagger comments
  apis: [
    "./src/routes/*.js", 
    "./src/modules/**/*.js"
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };


// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "GV Bidder CRM API",
//       version: "1.0.0",
//       description: "API documentation for Bidder CRM backend",
//     },
//     servers: [
//       {
//         url: "http://localhost:4000/api",
//         description: "Local Server",
//       },
//     ],
//   },

//   // Path to API docs
//   apis: ["./src/routes/*.js", "./src/modules/**/**/*.js"],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);

// export { swaggerUi, swaggerSpec };


// export const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: { title: "GV Bidder CRM API", version: "1.0.0" },
//   },
//   apis: ["./src/modules/**/*.js"],
// };
