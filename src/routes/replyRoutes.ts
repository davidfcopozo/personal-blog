const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createReply,
  getReplies,
  getAReply,
  deleteReply,
} = require("../controllers/replyController");

router.route("/").get(getReplies);
router
  .route("/:id")
  .get(getAReply)
  .post(auth, createReply)
  .delete(auth, deleteReply);

export = router;
