import { Router } from "express";
import authRouter from "./authRoutes";
import postRouter from "./postRoutes";
import commentRoutes from "./commentRoutes";
import replyRoutes from "./replyRoutes";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes";

const router = Router();

router.use("/api/v1/users", userRoutes);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/comments", commentRoutes);
router.use("/api/v1/replies", replyRoutes);
router.use("/api/v1/posts", postRouter);
router.use("/api/v1/categories", categoryRoutes);

export default router;
