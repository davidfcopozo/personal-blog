import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  createPost,
  getAllPosts,
  updatePostBySlugOrId,
  deletePostBySlugOrId,
  toggleLike,
  toggleBookmark,
  getPostBySlugOrId,
  getPostsByCategory,
  previewPost,
  getUserPosts,
} from "../controllers/postController";
import { visitsCounter } from "../middleware/visits-counter";

router.route("/").get(getAllPosts).post(auth, createPost);
router.route("/my-posts").get(auth, getUserPosts);
router.route("/like").put(auth, toggleLike);
router.route("/bookmark").put(auth, toggleBookmark);
router.route("/preview/:slugOrId").get(auth, previewPost);
router
  .route("/:slugOrId")
  .get(visitsCounter, getPostBySlugOrId)
  .patch(auth, updatePostBySlugOrId)
  .delete(auth, deletePostBySlugOrId);
router.route("/category/:category").get(getPostsByCategory);

export default router;
