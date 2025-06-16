import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";

const BankerGuestList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [guests, setGuests] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingGuests, setLoadingGuests] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        setEvents(res.data); // assuming backend returns plain array
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    setLoadingGuests(true);
    try {
      const res = await axiosInstance.get(`/guests/event/${eventId}`);
      setGuests(res.data);
    } catch (err) {
      console.error("Error fetching guests:", err);
    } finally {
      setLoadingGuests(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-8">Banker Guest List</h1>

      {loadingEvents ? (
        <p>Loading events...</p>
      ) : (
        <>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium">
              Select Event:
            </label>
            <select
              className="border border-gray-300 rounded-md p-2 w-80"
              value={selectedEvent}
              onChange={handleEventChange}
            >
              <option value="">-- Select an event --</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {loadingGuests ? (
            <p>Loading guests...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guests.length === 0 ? (
                <p>No guests found for this event.</p>
              ) : (
                guests.map((guest) => (
                  <Card key={guest._id} className="shadow-md">
                    <CardContent>
                      <p>
                        <strong>Name:</strong> {guest.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {guest.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {guest.phone}
                      </p>
                      <p>
                        <strong>Type:</strong> {guest.type}
                      </p>
                      <p>
                        <strong>Approved:</strong>{" "}
                        {guest.approved ? "Yes" : "No"}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BankerGuestList;
