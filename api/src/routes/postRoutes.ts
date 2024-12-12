import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  createPost,
  getAllPosts,
  updatePostBySlugOrId,
  deletePostById,
  toggleLike,
  toggleBookmark,
  getPostBySlugOrId,
  getPostsByCategory,
} from "../controllers/postController";
import { visitsCounter } from "../middleware/visits-counter";

router.route("/").get(getAllPosts).post(auth, createPost);
router.route("/like").put(auth, toggleLike);
router.route("/bookmark").put(auth, toggleBookmark);
router
  .route("/:slugOrId")
  .get(visitsCounter, getPostBySlugOrId)
  .patch(auth, updatePostBySlugOrId);
router.route("/:id").delete(auth, deletePostById);
router.route("/category/:category").get(getPostsByCategory);

export default router;
