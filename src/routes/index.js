import { Router } from "express";

import userRoutes from "./users.js";
import uploadRoutes from "./uploads.js";
import homescreenRoutes from "./homescreen.js";
import prescriptionRoutes from "./prescription.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/", uploadRoutes);
router.use("/", homescreenRoutes);
router.use("/", prescriptionRoutes);

export default router;
