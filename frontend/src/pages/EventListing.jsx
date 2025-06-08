import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        if (Array.isArray(res.data)) {
          setEvents(res.data);
          setFiltered(res.data);
        } else {
          setEvents([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
        setEvents([]);
        setFiltered([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const result = events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, events]);

  const handleSubmitGuestList = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        `/events/${eventId}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const isBankerOrAssistant =
    user?.role === "banker" || user?.role === "assistant";
  const isManager = user?.role === "manager";
  const isMarketing = user?.role === "marketing";

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Event Listings
        </h1>

        <div className="mb-8 max-w-lg mx-auto">
          <Input
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {user?.role === "marketing" && (
          <div className="mb-6 text-right">
            <Link to="/dashboard/events/create">
              <Button className="bg-green-600 text-white hover:bg-green-700">
                + Create New Event
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <Card
              key={event._id}
              className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 space-y-2">
                <h2 className="text-xl font-semibold text-black">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">{event.location}</p>
                <p className="text-sm text-gray-800 line-clamp-3">
                  {event.description}
                </p>

                <div className="flex flex-col gap-2 pt-4">
                  {/* Guests management for allowed roles */}
                  {(isBankerOrAssistant || isManager) && (
                    <>
                      <Link
                        to={`/dashboard/events/${event._id}/approve-guests`}
                      >
                        <Button
                          variant="outline"
                          className="w-full border border-black text-black hover:bg-gray-100"
                        >
                          Manage Guests
                        </Button>
                      </Link>
                    </>
                  )}

                  {/* Add Guest only for banker or assistant */}
                  {isBankerOrAssistant && event.status === "draft" && (
                    <Link to={`/dashboard/events/${event._id}/add-guest`}>
                      <Button className="w-full bg-black text-white hover:opacity-90">
                        Add Guest
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Submit button for banker or assistant */}
                {isBankerOrAssistant &&
                  (event.status === "draft" ? (
                    <Button
                      onClick={() => handleSubmitGuestList(event._id)}
                      className="bg-blue-600 text-white mt-2"
                    >
                      Submit Guest List
                    </Button>
                  ) : (
                    <p className="text-sm text-green-700 mt-2">
                      Submitted to Manager ✅
                    </p>
                  ))}

                {/* Manager note (optional) */}
                {isManager && event.status === "submitted" && (
                  <p className="text-sm text-blue-700 mt-2">
                    Awaiting your approval
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-12 text-lg">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventListing;
