import { Route, Routes, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Unauthorized from "@/pages/Unauthorized";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 🛡️ Protected Dashboard Route (all roles) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="events" element={<div>Events Page</div>} />
            <Route path="feedback" element={<div>Feedback Page</div>} />
          </Route>

          {/* 🔐 Example: Only managers can access this route */}
          <Route
            path="/manager-panel"
            element={
              <PrivateRoute allowedRoles={["manager"]}>
                <div>Manager Dashboard</div>
              </PrivateRoute>
            }
          />

          {/* 🔐 Example: Only marketing role */}
          <Route
            path="/marketing-panel"
            element={
              <PrivateRoute allowedRoles={["marketing"]}>
                <div>Marketing Dashboard</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
