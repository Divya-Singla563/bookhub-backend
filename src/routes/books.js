import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";
import authorise from "../middlewares/authorise.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management APIs
 */

/**
 * @swagger
 * /api/book:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               description:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book added successfully
 */
router.get("/books", authVerify, authorise("user"), Controllers.getAllBooks);
router.get(
  "/my-library",
  authVerify,
  authorise("user"),
  Controllers.getMyLibrary,
);
router.post("/book", authVerify, authorise("user"), Controllers.addBook);
router.put(
  "/update-book-status/:id",
  authVerify,
  authorise("user"),
  Controllers.updateBookStatus,
);

/**
 * @swagger
 * /api/my-books:
 *   get:
 *     summary: Get user's books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by text
 *     responses:
 *       200:
 *         description: Books fetched successfully
 */
router.get(
  "/my-books",
  authVerify,
  authorise("user"),
  Controllers.getUserBooks,
);

/**
 * @swagger
 * /api/my-book/{id}:
 *   get:
 *     summary: Get a specific book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book fetched successfully
 */
router.get(
  "/my-book/:id",
  authVerify,
  authorise("user"),
  Controllers.getMyBookById,
);

/**
 * @swagger
 * /api/book/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               description:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put(
  "/book/:id",
  authVerify,
  authorise("user"),
  Controllers.updateMyBook,
);

/**
 * @swagger
 * /api/book/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete(
  "/book/:id",
  authVerify,
  authorise("user"),
  Controllers.deleteBook,
);

export default router;
