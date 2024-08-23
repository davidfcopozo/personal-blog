import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  getCategoryById,
  createCategory,
  deleteCategoryById,
  getAllCategories,
  updateCategoryById,
  getCategoriesByTopic,
} from "../controllers/categoryController";

router.route("/").get(getAllCategories).post(auth, createCategory);
router.route("/topic/:topic").get(getCategoriesByTopic);
router
  .route("/:id")
  .get(getCategoryById)
  .put(auth, updateCategoryById)
  .delete(auth, deleteCategoryById);

export default router;
