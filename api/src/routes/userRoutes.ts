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
  getImagesByUserId,
  updateImage,
} from "../controllers/userController";

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(getUserById)
  .patch(auth, updateUserById)
  .put(auth, toggleFollowUser)
  .delete(auth, deleteUserById);
router;
router
  .route("/:id/images")
  .get(auth, getImagesByUserId)
  .post(auth, uploadImages)
  .patch(auth, updateImage)
  .delete(auth, deleteImages);
router.route("/username/:username").get(getUserByUsername);

export default router;
