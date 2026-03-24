import "./src/config/env.js";

import express from "express";
import cors from "cors";
import connectDB from "./src/db/db.js";
import routes from "./src/routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api", routes);


// global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 400).json({
    success: false,
    message:
      error.message ||
      req.messages?.SOMETHING_WENT_WRONG
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});

export default app;
