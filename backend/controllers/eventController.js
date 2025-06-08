import Event from "../models/Event.js";
import Guest from "../models/Guest.js";

export const submitGuestList = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const guests = await Guest.find({ eventId });

    if (guests.length === 0) {
      return res
        .status(400)
        .json({ message: "Add at least one guest before submitting." });
    }

    event.status = "submitted";
    await event.save();

    // TODO: Send email to manager (optional)

    return res.status(200).json({ message: "Guest list submitted!" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const approveAllGuests = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user?._id;

  console.log("Received approve-all request for eventId:", eventId);
  console.log("Approving guests by userId:", userId);

  try {
    const result = await Guest.updateMany(
      { eventId, approved: false },
      { approved: true, approvedBy: userId }
    );

    console.log(`Guests approved: ${result.modifiedCount}`);

    res.json({ message: `${result.modifiedCount} guests approved.` });
  } catch (err) {
    console.error("Error in approveAllGuests controller:", err);
    res.status(500).json({ message: "Failed to approve all guests" });
  }
};

// controllers/eventController.js
export const createEvent = async (req, res) => {
  try {
    const { title, location, date, description } = req.body;

    const event = new Event({
      title,
      location,
      date,
      description,
      createdBy: req.user._id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Event creation failed", error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  const events = await Event.find().populate("createdBy", "name");
  res.json(events);
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const updateEvent = async (req, res) => {
  const { title, date, location } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  event.title = title || event.title;
  event.date = date || event.date;
  event.location = location || event.location;
  await event.save();

  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
};
