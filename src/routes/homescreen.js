import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";

const router = Router();

router.get("/homescreen", authVerify, Controllers.getHomescreenData);

export default router;
