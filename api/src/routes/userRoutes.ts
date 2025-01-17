import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  toggleFollowUser,
  getUserByUsername,
  uploadImages,
  deleteImages,
} from "../controllers/userController";

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(getUserById)
  .patch(auth, updateUserById)
  .put(auth, toggleFollowUser)
  .delete(auth, deleteUserById);
router;
router.route("/:id/images").post(auth, uploadImages).delete(auth, deleteImages);
router.route("/username/:username").get(getUserByUsername);

export default router;
