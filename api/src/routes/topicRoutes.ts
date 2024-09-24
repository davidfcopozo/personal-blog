import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  getTopicById,
  createTopic,
  deleteTopicById,
  getAllTopics,
  updateTopicById,
} from "../controllers/topicController";

router.route("/").get(getAllTopics).post(auth, createTopic);
router
  .route("/:id")
  .get(getTopicById)
  .put(auth, updateTopicById)
  .delete(auth, deleteTopicById);

export default router;
