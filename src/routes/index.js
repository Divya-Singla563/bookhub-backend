import { Router } from "express";

import userRoutes from "./users.js";

const router = Router();

router.use("/auth", userRoutes);

export default router;
