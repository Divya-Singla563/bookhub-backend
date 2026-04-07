import { Router } from "express";

import userRoutes from "./users.js";
import uploadRoutes from "./uploads.js";
import booksRoutes from "./books.js";
import categoryRoutes from "./category.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/", uploadRoutes);
router.use("/", booksRoutes);
router.use("/", categoryRoutes);

export default router;
