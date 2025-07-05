import express from "express";
import {
  recordPostView,
  togglePostLike,
  togglePostBookmark,
  toggleCommentLike,
  getPostAnalytics,
  getPostShareAnalytics,
  getCommentAnalytics,
  getUserAnalytics,
  getUserPostInteractions,
  getUserCommentInteractions,
} from "../controllers/analyticsController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/posts/:postId/views", recordPostView);
router.post("/posts/:postId/like", auth, togglePostLike);
router.post("/posts/:postId/bookmark", auth, togglePostBookmark);
router.get("/posts/:postId/analytics", getPostAnalytics);
router.get("/posts/:postId/shares", getPostShareAnalytics);
router.get("/posts/:postId/interactions", auth, getUserPostInteractions);

router.post("/comments/:commentId/like", auth, toggleCommentLike);
router.get("/comments/:commentId/analytics", getCommentAnalytics);
router.get(
  "/comments/:commentId/interactions",
  auth,
  getUserCommentInteractions
);

router.get("/users/:userId/analytics", auth, getUserAnalytics);

export default router;
