const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(getUserById)
  .patch(auth, updateUserById)
  .delete(auth, deleteUserById);

export default router;
