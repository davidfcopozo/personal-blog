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
  toggleBookmark,
  getPostBySlug,
} from "../controllers/postController";
import { visitsCounter } from "../middleware/visits-counter";

router.route("/").get(getAllPosts).post(auth, createPost);
router.route("/like").put(auth, toggleLike);
router.route("/bookmark").put(auth, toggleBookmark);
router
  .route("/:id")
  .get(visitsCounter, getPostById)
  .put(auth, updatePostById)
  .delete(auth, deletePostById);

router.route("/:slug").get(visitsCounter, getPostBySlug);

export default router;
