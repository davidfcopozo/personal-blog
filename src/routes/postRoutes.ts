const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  toggleLike,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(auth, createPost).put(auth, toggleLike);
router
  .route("/:id")
  .get(getPostById)
  .put(auth, updatePostById)
  .delete(auth, deletePostById);

export = router;
