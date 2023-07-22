const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createComment,
  getComments,
  getAComment,
  deleteComment,
} = require("../controllers/commentController");

router.route("/").get(getComments);
router
  .route("/:id")
  .get(getAComment)
  .post(auth, createComment)
  .delete(auth, deleteComment);

export = router;
