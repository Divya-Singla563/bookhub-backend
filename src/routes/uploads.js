import { Router } from "express";
import { uploadImage } from "../controllers/upload.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/upload", upload.single("image"), uploadImage);
router.post("/upload-file", upload.single("file"), uploadImage);

export default router;
