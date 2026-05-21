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
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import decryptRequest from "./src/middlewares/decrypt.middleware.js";
import { generateHash, verifyHash } from "./src/utils/crypto.js";

const app = express();

//middlewares
app.use(express.json());
app.use(decryptRequest); // Decrypt incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(languageMiddleware);
app.use(helmet());
// {
//   // contentSecurityPolicy: false,
// }
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests",
});
// app.use(requestLogger); // automatic request logging

//routes
app.use("/api", limiter, routes);

app.set("view engine", "ejs");
// app.set("views", path.join(process.cwd(), "views"));
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
  // Seed.seedCategories();
});

export default app;
