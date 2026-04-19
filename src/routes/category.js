import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";
import authorise from "../middlewares/authorise.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category Management APIs
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Add a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, image]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category added successfully
 */
router.post(
  "/category",
  authVerify,
  authorise("admin"),
  Controllers.addCategory,
);

router.post(
  "/sub-category",
  authVerify,
  authorise("admin"),
  Controllers.addSubCategory,
);

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of categories to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/category", Controllers.getCategories);
router.get("/sub-category", Controllers.getSubCategories);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, image]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
  "/category/:id",
  authVerify,
  authorise("admin"),
  Controllers.updateCategory,
);

router.put(
  "/sub-category/:id",
  authVerify,
  authorise("admin"),
  Controllers.updateSubCategory,
);
/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category id
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete(
  "/category/:id",
  authVerify,
  authorise("admin"),
  Controllers.deleteCategory,
);

router.delete(
  "/sub-category/:id",
  authVerify,
  authorise("admin"),
  Controllers.deleteSubCategory,
);

router.post("/template", Controllers.addFaq);
router.put("/template/:id", Controllers.updateFaq);
router.get("/template", Controllers.getTemplates);
router.delete("/template/:id", Controllers.deleteFaqTemplate);

export default router;
