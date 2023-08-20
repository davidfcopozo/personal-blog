const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUsers,
  getUserById,
  updateUserById,
} = require("../controllers/userController");

router.route("/").get(getUsers);
router.route("/:id").get(getUserById).patch(auth, updateUserById);

export default router;
