const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getPost).put(updatePost).delete(deletePost);

export = router;
