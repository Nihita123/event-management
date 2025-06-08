import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";

const ApproveGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { eventId } = useParams();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/guests/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const guestData = Array.isArray(res.data) ? res.data : [];
        setGuests(guestData);
        setErrorMsg("");
      } catch (error) {
        setErrorMsg(
          error?.response?.data?.message ||
            "Failed to load guests. Please try again."
        );
        setGuests([]);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchGuests();
  }, [eventId]);

  const approveGuest = async (id) => {
    try {
      setApprovingId(id);
      setErrorMsg("");
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `/guests/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGuests((prev) =>
        prev.map((guest) =>
          guest._id === id ? { ...guest, approved: true } : guest
        )
      );
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Approval failed. Please try again."
      );
    } finally {
      setApprovingId(null);
    }
  };

  const handleApproveAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        `/events/${eventId}/approve-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve guests.");
    }
  };

  const groupByType = (guests) => {
    return guests.reduce((acc, guest) => {
      const type = guest.type || "Unknown";
      if (!acc[type]) acc[type] = [];
      acc[type].push(guest);
      return acc;
    }, {});
  };

  const groupedGuests = groupByType(guests);

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading guests...</p>;

  if (guests.length === 0)
    return <p className="text-center mt-10 text-gray-600">No guests found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-black mb-6 text-center">
        Approve Guest Requests
      </h1>

      {errorMsg && (
        <p className="text-center mb-4 text-sm text-red-600 font-medium">
          {errorMsg}
        </p>
      )}

      <div className="mb-4 text-right">
        <Button onClick={handleApproveAll} className="bg-black text-white">
          Approve All Guests
        </Button>
      </div>

      {Object.entries(groupedGuests).map(([type, typeGuests]) => (
        <div key={type} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {type} ({typeGuests.length})
          </h2>

          <div className="space-y-4">
            {typeGuests.map((guest) => (
              <Card
                key={guest._id}
                className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="flex justify-between items-center px-6 py-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-black">
                      {guest.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-700">
                      {guest.email?.trim()
                        ? guest.email
                        : "Email: Not provided"}
                    </CardDescription>
                    <p className="text-sm text-gray-600">
                      Phone:{" "}
                      {guest.phone?.trim() ? guest.phone : "Not provided"}
                    </p>
                  </div>

                  <div>
                    {guest.approved ? (
                      <span className="text-sm font-semibold text-gray-800 border border-gray-400 px-3 py-1 rounded">
                        Approved
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => approveGuest(guest._id)}
                        disabled={approvingId === guest._id}
                        className="border-black text-black hover:bg-gray-100"
                      >
                        {approvingId === guest._id ? "Approving..." : "Approve"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproveGuests;
