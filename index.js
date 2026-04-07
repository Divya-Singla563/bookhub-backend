import "./src/config/env.js";

import express from "express";
import cors from "cors";
import connectDB from "./src/db/db.js";
import { Messages } from "./src/constants/index.js";
import * as Seed from "./src/seed/index.js";
import { languageMiddleware } from "./src/middlewares/language-middleware.js";
import routes from "./src/routes/index.js";
import requestLogger from "./src/middlewares/request-logger.js";
import errorHandler from "./src/middlewares/error-handler.js";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();

//middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(languageMiddleware);
// app.use(requestLogger); // automatic request logging

//routes
app.use("/api", routes);

// app.use(errorHandler); //centralized error logging

// global error handler
app.use((error, req, res, next) => {
  console.log(next, error);

  res.status(error.status || 400).json({
    success: false,
    message:
      error.message ||
      req.messages?.SOMETHING_WENT_WRONG ||
      Messages.en.SOMETHING_WENT_WRONG,
  });
});

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
  // Seed.seedCategories();
});

export default app;
