import { Link, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Events", icon: Calendar, path: "/dashboard/events" },
    { label: "Feedback", icon: Star, path: "/dashboard/feedback" },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white shadow-md p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6 text-primary">EventMVP</h2>
        <nav className="flex flex-col gap-3">
          {links.map(({ label, icon: Icon, path }) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition ${
                location.pathname === path ? "bg-muted font-semibold" : ""
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <Button
        variant="outline"
        onClick={logout}
        className="w-full flex justify-start gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
