import { Router } from "express";
import * as Controllers from "../controllers/index.js";

const router = Router();

router.post("/signup", Controllers.signUp);
router.post("/verify", Controllers.verify);

export default router;
