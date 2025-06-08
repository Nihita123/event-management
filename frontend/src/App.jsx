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
import EventListing from "./pages/EventListing";
import AddGuest from "./pages/AddGuest";
import ApproveGuests from "./pages/ApproveGuests";
import Analytics from "./pages/Analytics";
import EventCalendar from "./pages/Calendar";
import EventCreation from "./pages/dashboard/EventCreation";

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
            <Route index element={<Dashboard />} />
            <Route path="events" element={<EventListing />} />

            {/* Banker & Assistant */}
            <Route
              path="/dashboard/events/:eventId/add-guest"
              element={<AddGuest />}
            />

            {/* Manager only */}
            <Route
              path="/dashboard/events/:eventId/approve-guests"
              element={<ApproveGuests />}
            />

            {/* Marketing only */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="calendar" element={<EventCalendar />} />
            <Route
              path="/dashboard/events/create"
              element={<EventCreation />}
            />
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
