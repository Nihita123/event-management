import { useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";

const AddGuest = () => {
  const { eventId } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [type, setType] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      // Include eventId in the body, not in the URL
      const payload = {
        ...form,
        eventId,
        type,
      };

      const res = await axiosInstance.post("/guests", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201) {
        setSuccessMsg("Guest added successfully ✅");
        setForm({ name: "", email: "", phone: "" });
        setType("");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-white">
      <Card className="w-full max-w-lg border border-black shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-6 text-center">Add Guest</h2>

          {successMsg && (
            <p className="text-center mb-4 font-medium text-green-600">
              {successMsg}
            </p>
          )}

          {errorMsg && (
            <p className="text-center mb-4 font-medium text-red-600">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select Guest Type</option>
              <option value="Existing Client">Existing Client</option>
              <option value="Prospect">Prospect</option>
              <option value="Staff">Staff</option>
            </select>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Add Guest"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddGuest;
