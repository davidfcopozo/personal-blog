import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controllers/notificationController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

router.get("/", getNotifications);
router.patch("/:notificationId/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

router.get("/preferences", getNotificationPreferences);
router.put("/preferences", updateNotificationPreferences);

export default router;
