import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";
import authorise from "../middlewares/authorise.js";

const router = Router();

router.post("/book", authVerify, authorise("user"), Controllers.addBook);
router.get(
  "/my-books",
  authVerify,
  authorise("user"),
  Controllers.getUserBooks,
);
router.get(
  "/my-book/:id",
  authVerify,
  authorise("user"),
  Controllers.getMyBookById,
);
router.put(
  "/book/:id",
  authVerify,
  authorise("user"),
  Controllers.updateMyBook,
);
router.delete(
  "/book/:id",
  authVerify,
  authorise("user"),
  Controllers.deleteBook,
);

export default router;
