import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  submitGuestList,
} from "../controllers/eventController.js";
import { approveAllGuests } from "../controllers/eventController.js";
import {
  protect,
  isManager,
  isMarketing,
} from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";
import Guest from "../models/Guest.js";

const router = express.Router();
router
  .route("/")
  .post(protect, isMarketing, createEvent)
  .get(protect, getAllEvents);
router
  .route("/:id")
  .get(protect, getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);
router.post("/:eventId/submit", protect, submitGuestList);

router.post("/:eventId/approve-all", protect, approveAllGuests);

router.get("/:eventId/guests", async (req, res) => {
  const { eventId } = req.params;
  try {
    const guests = await Guest.find({ eventId }); // ✅ use eventId
    if (!guests || guests.length === 0)
      return res.status(404).json({ message: "No guests found" });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
