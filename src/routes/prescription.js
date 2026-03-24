import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post(
  "/add-prescription",
  authVerify,
  Controllers.addPrescription
);

router.get("/prescriptions", authVerify, Controllers.getMyPrescriptions);

export default router;
