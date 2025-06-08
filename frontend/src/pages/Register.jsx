import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "banker",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await registerUser(form);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="banker">Banker</option>
                <option value="assistant">Assistant</option>
                <option value="manager">Manager</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground justify-center">
          Already have an account?{" "}
          <a href="/login" className="ml-1 underline">
            Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
