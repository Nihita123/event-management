import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { exportToCSV } from "@/utils/exportCSV";
import { toast, Toaster } from "react-hot-toast";
import GuestEditModal from "./GuestEditModal";

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [guests, setGuests] = useState([]);
  const [editModeEventId, setEditModeEventId] = useState(null);
  const [initialGuestsForEdit, setInitialGuestsForEdit] = useState([]);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ New loading state

  const fetchGuestsForEvent = async (eventId) => {
    try {
      const res = await axiosInstance.get(`/events/${eventId}/guests`);
      if (Array.isArray(res.data)) setGuests(res.data);
      else setGuests([]);
    } catch (err) {
      console.error("Failed to fetch guests", err);
      setGuests([]);
    }
  };

  const fetchGuestApprovalStatusForEvents = async (eventsList) => {
    const updatedEvents = await Promise.all(
      eventsList.map(async (event) => {
        try {
          const res = await axiosInstance.get(`/events/${event._id}/guests`);
          const guests = Array.isArray(res.data) ? res.data : [];
          const allApproved =
            guests.length > 0 && guests.every((g) => g.approved);
          return { ...event, allGuestsApproved: allApproved };
        } catch {
          return { ...event, allGuestsApproved: false };
        }
      })
    );
    return updatedEvents;
  };

  const handleExport = () => {
    if (!guests.length) return;
    const headers = ["Name", "Email", "Phone", "Type", "Approved"];
    const rows = guests.map((g) => [
      g.name,
      g.email || "",
      g.phone || "",
      g.type || "",
      g.approved ? "Yes" : "No",
    ]);
    exportToCSV(`guests_event_${selectedEventId}.csv`, headers, rows);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // ✅ Start loading
      try {
        const res = await axiosInstance.get("/events");
        if (Array.isArray(res.data)) {
          const eventsWithApproval = await fetchGuestApprovalStatusForEvents(
            res.data
          );
          setEvents(eventsWithApproval);
          setFiltered(eventsWithApproval);
        } else {
          setEvents([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
        setEvents([]);
        setFiltered([]);
      } finally {
        setLoading(false); // ✅ End loading
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

  const openEditGuestModal = async (eventId) => {
    try {
      const res = await axiosInstance.get(`/events/${eventId}/guests`);
      setInitialGuestsForEdit(res.data || []);
      setEditModeEventId(eventId);
    } catch (err) {
      alert("Failed to fetch guests");
    }
  };

  useEffect(() => {
    if (!isManager) return;
    let lastCount = 0;

    const fetchPendingApprovals = async () => {
      try {
        const res = await axiosInstance.get("/events?status=submitted");
        if (Array.isArray(res.data)) {
          const events = res.data;
          let pendingCount = 0;
          await Promise.all(
            events.map(async (event) => {
              try {
                const guestRes = await axiosInstance.get(
                  `/events/${event._id}/guests`
                );
                const guests = Array.isArray(guestRes.data)
                  ? guestRes.data
                  : [];
                const hasPendingGuests = guests.some((g) => !g.approved);
                if (hasPendingGuests) pendingCount++;
              } catch {
                pendingCount++;
              }
            })
          );

          setPendingApprovalCount(pendingCount);

          if (pendingCount > 0 && pendingCount !== lastCount) {
            toast(
              `⚠️ You have ${pendingCount} event(s) with guests pending approval!`
            );
          }
          lastCount = pendingCount;
        }
      } catch (error) {
        console.error("Failed to fetch pending approvals", error);
      }
    };

    fetchPendingApprovals();
    const intervalId = setInterval(fetchPendingApprovals, 20000);
    return () => clearInterval(intervalId);
  }, [isManager]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Event Listings
        </h1>

        {isManager && pendingApprovalCount > 0 && (
          <div className="bg-yellow-300 text-black p-3 mb-6 rounded text-center font-semibold">
            ⚠️ You have {pendingApprovalCount} event(s) pending approval! Please
            review.
          </div>
        )}

        <div className="mb-8 max-w-lg mx-auto">
          <Input
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {isMarketing && (
          <div className="mb-6 text-right">
            <Link to="/dashboard/events/create">
              <Button className="bg-green-600 text-white hover:bg-green-700">
                + Create New Event
              </Button>
            </Link>
          </div>
        )}

        {/* ✅ Loader display */}
        {loading ? (
          <p className="text-center text-lg text-gray-600 mt-20">
            Loading events...
          </p>
        ) : (
          <>
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
                      {isManager && (
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
                      )}

                      {isBankerOrAssistant && event.status === "draft" && (
                        <Link to={`/dashboard/events/${event._id}/add-guest`}>
                          <Button className="w-full bg-black text-white hover:opacity-90">
                            Add Guest
                          </Button>
                        </Link>
                      )}
                    </div>

                    {isBankerOrAssistant && event.status === "submitted" && (
                      <Button
                        onClick={() => openEditGuestModal(event._id)}
                        variant="outline"
                        className="w-full border border-black text-black hover:bg-gray-100 mt-2"
                      >
                        Update Guest List
                      </Button>
                    )}

                    {isMarketing && (
                      <Button
                        onClick={() => {
                          setSelectedEventId(event._id);
                          fetchGuestsForEvent(event._id).then(() => {
                            handleExport();
                          });
                        }}
                        variant="outline"
                        className="w-full border border-black text-black hover:bg-gray-100 mt-2"
                      >
                        Export Guest List CSV
                      </Button>
                    )}

                    {isBankerOrAssistant &&
                      (event.status === "draft" ? (
                        <Button
                          onClick={() => handleSubmitGuestList(event._id)}
                          variant="outline"
                          className="w-full border border-black text-black hover:bg-gray-100 mt-2"
                        >
                          Submit Guest List
                        </Button>
                      ) : (
                        <p className="text-sm text-green-700 mt-2">
                          Submitted to Manager ✅
                        </p>
                      ))}

                    {isManager && event.status === "submitted" && (
                      <p
                        className={`text-sm mt-2 ${
                          event.allGuestsApproved
                            ? "text-green-700"
                            : "text-blue-700"
                        }`}
                      >
                        {event.allGuestsApproved
                          ? "All guests approved 🎉"
                          : "Awaiting your approval"}
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
          </>
        )}

        <GuestEditModal
          eventId={editModeEventId}
          open={!!editModeEventId}
          onClose={() => {
            setEditModeEventId(null);
            setInitialGuestsForEdit([]);
          }}
          onGuestListUpdated={() => {
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
};

export default EventListing;
