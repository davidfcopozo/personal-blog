const { Router } = require("express");
const authRouter = require("./authRoutes");
const postRouter = require("./postRoutes");
const commentRoutes = require("./commentRoutes");
const replyRoutes = require("./replyRoutes");
import userRoutes from "./userRoutes";

const router = Router();

router.use("/api/v1/users", userRoutes);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/comments", commentRoutes);
router.use("/api/v1/replies", replyRoutes);
router.use("/api/v1/posts", postRouter);

module.exports = router;
