const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createReply,
  getReplies,
  /*   getComments,
  getAComment,
  deleteComment, */
} = require("../controllers/replyController");

/* router.route("/").get(getComments); */
router.route("/").get(getReplies);
router.route("/:id").get(getReplies).post(auth, createReply);
/* router
  .route("/:id")
  .get(getAComment)
  .delete(auth, deleteComment); */

export = router;
