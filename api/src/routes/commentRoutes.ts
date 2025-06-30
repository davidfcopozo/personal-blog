import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import { optionalAuth } from "../middleware/optional-auth";
import {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  updateCommentById,
  toggleLike,
} from "../controllers/commentController";

router.route("/post/:postId").get(optionalAuth, getComments);
router
  .route("/:id")
  .get(optionalAuth, getCommentById)
  .post(auth, createComment)
  .put(auth, toggleLike);

router
  .route("/:id/:commentId")
  .delete(auth, deleteCommentById)
  .patch(auth, updateCommentById);

export default router;
