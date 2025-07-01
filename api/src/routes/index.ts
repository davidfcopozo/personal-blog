import { Router } from "express";
import authRouter from "./authRoutes";
import postRouter from "./postRoutes";
import commentRoutes from "./commentRoutes";
import replyRoutes from "./replyRoutes";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes";
import topicRoutes from "./topicRoutes";
import notificationRoutes from "./notificationRoutes";
import analyticsRoutes from "./analyticsRoutes";

const router = Router();

router.use("/api/v1/users", userRoutes);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/comments", commentRoutes);
router.use("/api/v1/replies", replyRoutes);
router.use("/api/v1/posts", postRouter);
router.use("/api/v1/categories", categoryRoutes);
router.use("/api/v1/topics", topicRoutes);
router.use("/api/v1/notifications", notificationRoutes);
router.use("/api/v1/analytics", analyticsRoutes);

export default router;
