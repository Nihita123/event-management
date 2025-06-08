import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  submitGuestList,
} from "../controllers/eventController.js";
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
// POST /api/events/:eventId/approve-all
router.post("/:eventId/approve-all", protect, isManager, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Bulk approve guests
    await Guest.updateMany({ event: eventId }, { $set: { approved: true } });

    res.status(200).json({ message: "All guests approved successfully." });
  } catch (err) {
    console.error("Approve All Guests Error:", err);
    res.status(500).json({ message: "Server error during approval." });
  }
});

export default router;
