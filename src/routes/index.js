import { Router } from "express";

import userRoutes from "./users.js";
import uploadRoutes from "./uploads.js";
import booksRoutes from "./books.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/", uploadRoutes);
router.use("/", booksRoutes);

export default router;
