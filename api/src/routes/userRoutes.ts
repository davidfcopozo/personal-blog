import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  toggleFollowUser,
  getUserByUsernameOrId,
} from "../controllers/userController";

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(getUserById)
  .patch(auth, updateUserById)
  .delete(auth, deleteUserById);
router.route("/username/:usernameOrId").get(getUserByUsernameOrId);
router.route("/username/:usernameOrId/follow").put(auth, toggleFollowUser);

export default router;
