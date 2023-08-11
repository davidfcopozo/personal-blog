const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  toggleLike,
} = require("../controllers/commentController");

router.route("/").get(getComments);
router
  .route("/:id")
  .get(getCommentById)
  .post(auth, createComment)
  .put(auth, toggleLike)
  .delete(auth, deleteCommentById);

export = router;
