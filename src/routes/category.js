import { Router } from "express";
import * as Controllers from "../controllers/index.js";
import { authVerify } from "../middlewares/token-verification.js";
import authorise from "../middlewares/authorise.js";

const router = Router()

router.post('/category', authVerify, authorise('admin',), Controllers.addCategory)
router.get('/category', Controllers.getCategories)
router.put('/category/:id', authVerify, authorise('admin',), Controllers.updateCategory)
router.delete('/category/:id', authVerify, authorise('admin',), Controllers.deleteCategory)

export default router