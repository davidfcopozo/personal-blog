const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
} = require("../controllers/commentController");

router.route("/").get(getComments);
router
  .route("/:id")
  .get(getCommentById)
  .post(auth, createComment)
  .delete(auth, deleteCommentById);

export = router;
