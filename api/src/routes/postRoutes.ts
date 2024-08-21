import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  createPost,
  getAllPosts,
  updatePostById,
  deletePostById,
  toggleLike,
  toggleBookmark,
  getPostBySlugOrId,
} from "../controllers/postController";
import { visitsCounter } from "../middleware/visits-counter";

router.route("/").get(getAllPosts).post(auth, createPost);
router.route("/like").put(auth, toggleLike);
router.route("/bookmark").put(auth, toggleBookmark);
router
  .route("/:slugOrId")
  .get(visitsCounter, getPostBySlugOrId)
  .put(auth, updatePostById)
  .delete(auth, deletePostById);

export default router;
