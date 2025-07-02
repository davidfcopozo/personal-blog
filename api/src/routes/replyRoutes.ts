import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import { optionalAuth } from "../middleware/optional-auth";
import {
  createReply,
  getReplies,
  getReplyById,
  deleteReplyById,
} from "../controllers/replyController";
import { toggleLike } from "../controllers/commentController";

router.route("/").get(getReplies);
router.route("/:id").post(auth, createReply);
router
  .route("/:id/:commentId/:replyId")
  .get(optionalAuth, getReplyById)
  .delete(auth, deleteReplyById)
  .put(auth, toggleLike);

export default router;
