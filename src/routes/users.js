import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";

const router = Router();

router.post("/signup", Controllers.signUp);
router.post("/verify", Controllers.verify);
router.post("/login", Controllers.login);
router.get("/profile", authVerify, Controllers.getProfile);
router.put("/profile", authVerify, Controllers.updateProfile);
router.post("/forgot-password", Controllers.forgotPassword);
router.post("/reset-password", authVerify, Controllers.resetPassword);
router.post("/change-password", authVerify, Controllers.changePassword);

export default router;
