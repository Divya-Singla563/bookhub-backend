import { Router } from "express";
import { uploadImage } from "../controllers/upload.js";
import upload from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload APIs
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post("/upload", upload.single("image"), uploadImage);

export default router;
