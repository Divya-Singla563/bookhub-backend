import express from "express";
import cors from "cors";
import connectDB from "./src/db/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});

export default app;
