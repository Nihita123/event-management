import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GuestEditModal = ({ eventId, open, onClose, onGuestListUpdated }) => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    if (open && eventId) {
      axiosInstance
        .get(`/guests/event/${eventId}`)
        .then((res) => setGuests(res.data))
        .catch((err) => {
          console.error("Error fetching guests:", err);
          alert("Failed to load guests.");
        });
    }
  }, [eventId, open]);

  const handleChange = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
  };

  const handleAddGuest = () => {
    setGuests((prev) => [
      ...prev,
      { name: "", email: "", phone: "", type: "" },
    ]);
  };

  const handleDelete = async (guestId, index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this guest?"
    );
    if (!confirmDelete) return;

    if (guestId) {
      try {
        await axiosInstance.delete(`/guests/${guestId}`);
        setGuests((prev) => prev.filter((guest) => guest._id !== guestId));
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete guest.");
      }
    } else {
      // For unsaved guests
      const updated = [...guests];
      updated.splice(index, 1);
      setGuests(updated);
    }
  };

  const handleSave = async () => {
    try {
      const sanitizedGuests = guests.map(({ _id, __v, ...rest }) => rest);
      await axiosInstance.patch(`/guests/${eventId}/guests`, {
        guests: sanitizedGuests,
      });
      alert("Guest list updated successfully.");
      onGuestListUpdated?.(); // <-- Notify parent
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[1100px] max-w-none !max-w-none max-h-[85vh] overflow-auto bg-white border border-black text-black px-6 py-4">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Guest List</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {guests.map((guest, index) => (
            <div
              key={guest._id || index}
              className="grid grid-cols-5 gap-6 items-center"
            >
              <Input
                value={guest.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Name"
                className="bg-white border-black text-black"
              />
              <Input
                value={guest.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
                placeholder="Email"
                className="bg-white border-black text-black"
              />
              <Input
                value={guest.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
                placeholder="Phone"
                className="bg-white border-black text-black"
              />

              <Select
                value={guest.type}
                onValueChange={(value) => handleChange(index, "type", value)}
              >
                <SelectTrigger className="bg-white border-black text-black">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Existing Client">
                    Existing Client
                  </SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border border-black text-black hover:bg-gray-100"
                onClick={() => handleDelete(guest._id, index)}
              >
                Delete
              </Button>
            </div>
          ))}

          <div className="pt-2">
            <Button
              onClick={handleAddGuest}
              variant="outline"
              className="w-full border border-black text-black hover:bg-gray-100"
            >
              + Add Guest
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Button
            variant="outline"
            className="border border-black text-black hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-black text-white hover:opacity-90"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestEditModal;
