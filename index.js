import "./src/config/env.js";

import express from "express";
import cors from "cors";
import connectDB from "./src/db/db.js";
import { Messages } from "./src/constants/index.js";
import { languageMiddleware } from "./src/middlewares/language-middleware.js";
import routes from "./src/routes/index.js";


const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(languageMiddleware);

//routes
app.use("/api", routes);

// global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 400).json({
    success: false,
    message:
      error.message ||
      req.messages?.SOMETHING_WENT_WRONG ||
      Messages.en.SOMETHING_WENT_WRONG,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});

export default app;
