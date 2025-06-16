import express from "express";
import {
  addGuest,
  approveGuest,
  getGuestsByEvent,
  updateGuests,
  deleteGuest,
} from "../controllers/guestController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();
router.route("/").post(protect, addGuest);
router.route("/:id").delete(protect, deleteGuest);
router.route("/:id/approve").patch(protect, approveGuest);
router
  .route("/event/:eventId")
  .get(protect, authorizeRoles("organizer", "banker"), getGuestsByEvent);
router.patch("/:eventId/guests", protect, updateGuests);

export default router;
