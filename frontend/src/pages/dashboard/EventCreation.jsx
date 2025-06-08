import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";

const EventCreation = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/events",
        { title, location, date, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Event created!");
      navigate("/dashboard/events");
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <textarea
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" className="bg-blue-600 text-white">
          Create Event
        </Button>
      </form>
    </div>
  );
};

export default EventCreation;
