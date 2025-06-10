import React from "react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const roleTitle = {
    banker: "Banker",
    assistant: "Assistant",
    manager: "Manager",
    marketing: "Marketing Team",
  };

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white border rounded-lg ${className}`}>{children}</div>
  );

  const CardHeader = ({ children }) => (
    <div className="p-6 pb-4">{children}</div>
  );

  const CardTitle = ({ children, className = "" }) => (
    <h3 className={className}>{children}</h3>
  );

  const CardContent = ({ children }) => (
    <div className="px-6 pb-6">{children}</div>
  );

  const LinkCard = ({ href, children }) => (
    <a href={href} className="group block">
      {children}
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-black mb-3">
            Welcome back, {user?.name || "User"}
          </h1>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">Role:</span>
            <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
              {roleTitle[user?.role] || "Guest"}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {/* View Events */}
          <LinkCard href="/dashboard/events">
            <Card className="h-full border-2 border-gray-100 hover:border-black transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black transition-colors duration-200">
                  <span className="text-2xl group-hover:text-white">📅</span>
                </div>
                <CardTitle className="text-xl font-bold text-black">
                  View Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Browse and manage all listed events in your organization.
                </p>
              </CardContent>
            </Card>
          </LinkCard>

          {/* Banker/Assistant */}
          {(user?.role === "banker" || user?.role === "assistant") && (
            <LinkCard href="/dashboard/my-guests">
              <Card className="h-full border-2 border-gray-100 hover:border-black transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black transition-colors duration-200">
                    <span className="text-2xl group-hover:text-white">👥</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-black">
                    My Guests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Add new guests or update existing guest information for your
                    events.
                  </p>
                </CardContent>
              </Card>
            </LinkCard>
          )}

          {/* Manager */}
          {user?.role === "manager" && (
            <LinkCard href="/dashboard/pending-approvals">
              <Card className="h-full border-2 border-gray-100 hover:border-black transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black transition-colors duration-200">
                    <span className="text-2xl group-hover:text-white">✅</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-black">
                    Approve Guests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Review pending guest submissions and provide approval
                    decisions.
                  </p>
                </CardContent>
              </Card>
            </LinkCard>
          )}

          {/* Marketing */}
          {user?.role === "marketing" && (
            <LinkCard href="/dashboard/events/create">
              <Card className="h-full border-2 border-gray-100 hover:border-black transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black transition-colors duration-200">
                    <span className="text-2xl group-hover:text-white">➕</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-black">
                    Create New Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Plan, configure, and publish new client events for your
                    organization.
                  </p>
                </CardContent>
              </Card>
            </LinkCard>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Need help? Contact your system administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
