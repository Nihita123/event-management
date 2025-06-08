import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/events", label: "Events" },
  ];

  // Manager & Marketing can view Analytics
  if (user?.role === "manager" || user?.role === "marketing") {
    links.push({ to: "/dashboard/analytics", label: "Analytics" });
  }

  // Marketing can access calendar
  if (user?.role === "marketing") {
    links.push({ to: "/dashboard/calendar", label: "Calendar" });
  }

  return (
    <aside className="w-60 bg-white border-r h-screen p-4 space-y-6 shadow-md">
      <h2 className="text-xl font-bold mb-6">Client Events</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
