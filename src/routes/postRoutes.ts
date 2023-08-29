import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  toggleLike,
} from "../controllers/postController";

router.route("/").get(getAllPosts).post(auth, createPost).put(auth, toggleLike);
router
  .route("/:id")
  .get(getPostById)
  .put(auth, updatePostById)
  .delete(auth, deletePostById);

export default router;
