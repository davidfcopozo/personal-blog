const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createReply,
  getReplies,
  getReplyById,
  deleteReplyById,
} = require("../controllers/replyController");

router.route("/").get(getReplies);
router
  .route("/:id")
  .get(getReplyById)
  .post(auth, createReply)
  .delete(auth, deleteReplyById);

export = router;
