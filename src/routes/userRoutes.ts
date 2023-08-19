const express = require("express");
const router = express.Router();
//const auth = require("../middleware/auth");
const { getUsers, getUserById } = require("../controllers/userController");

router.route("/").get(getUsers);
router.route("/:id").get(getUserById);

export default router;
