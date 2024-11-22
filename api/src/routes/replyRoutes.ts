import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  createReply,
  getReplies,
  getReplyById,
  deleteReplyById,
} from "../controllers/replyController";

router.route("/").get(getReplies);
router.route("/:id").get(getReplyById).post(auth, createReply);
router.route("/:id/:commentId/:replyId").delete(auth, deleteReplyById);

export default router;
