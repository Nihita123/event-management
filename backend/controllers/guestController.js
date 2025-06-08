import Guest from "../models/Guest.js";
import Event from "../models/Event.js";

export const addGuest = async (req, res) => {
  const { name, email, phone, eventId, type } = req.body;

  if (!type || !["Existing Client", "Prospect", "Staff"].includes(type)) {
    return res.status(400).json({ message: "Invalid guest type" });
  }

  const guest = new Guest({
    name,
    email,
    phone,
    type,
    eventId,
    submittedBy: req.user._id, // ✅ assuming you're using auth middleware
  });

  await guest.save();
  res.status(201).json(guest);
};

export const getGuestsByEvent = async (req, res) => {
  const guests = await Guest.find({ eventId: req.params.eventId });
  res.json(guests);
};

// PATCH /events/:eventId/guests
export const updateGuests = async (req, res) => {
  const { eventId } = req.params;
  const { guests } = req.body; // array of new guests

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existingGuests = await Guest.find({ eventId });

    const countChanged = existingGuests.length !== guests.length;

    // Optional: Delete previous guests if you're replacing all
    await Guest.deleteMany({ eventId });

    // Add new guests
    const insertedGuests = await Guest.insertMany(
      guests.map((g) => ({
        ...g,
        eventId,
        approved: false,
        approvedBy: null,
        submittedBy: req.user._id,
      }))
    );

    // If count changed after submission, revert event to draft and reset approvals
    if (event.status === "submitted" && countChanged) {
      event.status = "draft";
      await event.save();
    }

    res.status(200).json({
      message: "Guest list updated. Re-approval required.",
      guests: insertedGuests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update guests." });
  }
};

export const deleteGuest = async (req, res) => {
  const guest = await Guest.findByIdAndDelete(req.params.id);
  if (!guest) return res.status(404).json({ message: "Guest not found" });
  res.json({ message: "Guest deleted" });
};

export const approveGuest = async (req, res) => {
  const guest = await Guest.findById(req.params.id);
  if (!guest) return res.status(404).json({ message: "Guest not found" });
  guest.approved = true;
  guest.approvedBy = req.user._id;
  await guest.save();
  res.json({ message: "Guest approved" });
};
