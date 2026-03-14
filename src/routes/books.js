import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";

const router = Router();

router.post("/book", authVerify, Controllers.addBook);
router.get("/my-books", authVerify, Controllers.getUserBooks);
router.get("/my-book/:id", authVerify, Controllers.getMyBookById);

export default router;
