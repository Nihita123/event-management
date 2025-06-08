// 📁 src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar"; // ✅ Make sure this path is correct

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* ✅ Sidebar handles all navigation and role logic */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
