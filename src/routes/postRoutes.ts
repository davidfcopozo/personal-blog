const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(auth, createPost);
router
  .route("/:id")
  .get(getPost)
  .put(auth, updatePost)
  .delete(auth, deletePost);

export = router;
