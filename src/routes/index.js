import { Router } from "express";

import userRoutes from "./users.js";
import uploadRoutes from "./uploads.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/", uploadRoutes);

export default router;
