import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "👥",
      title: "Role-Based Approvals",
      desc: "Streamlined approval workflows with automated notifications and intelligent routing.",
    },
    {
      icon: "📋",
      title: "Guest Management",
      desc: "Comprehensive handling of guest types including Clients, Prospects, and Staff.",
    },
    {
      icon: "🔄",
      title: "Dynamic Adjustments",
      desc: "Real-time updates with automatic re-approval triggers and smart notifications.",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      desc: "Instant alerts for pending approvals, follow-ups, and critical updates.",
    },
  ];

  const stats = [
    { value: "90%", label: "Reduced Manual Work", icon: "⚡" },
    { value: "50%", label: "Faster Approvals", icon: "🚀" },
    { value: "100%", label: "Real-time Tracking", icon: "📊" },
    { value: "24/7", label: "System Availability", icon: "🌐" },
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Event Creation",
      desc: "CEM team sets criteria and parameters",
    },
    {
      step: "2",
      title: "Guest Nomination",
      desc: "Bankers propose and submit guests",
    },
    {
      step: "3",
      title: "Manager Approval",
      desc: "Managers review and approve lists",
    },
    {
      step: "4",
      title: "Final Consolidation",
      desc: "CEM team finalizes event details",
    },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-black/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative text-center py-32 px-4">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 text-black leading-tight">
            Streamline Client
            <br />
            <span className="text-gray-700">Event Management</span>
          </h1>
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Revolutionize your bank's event management process with our
            comprehensive platform designed for Client Engagement and Marketing
            excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="group relative px-10 py-4 bg-black text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                Get Started Today
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>

            <button className="px-10 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-800 hover:bg-gray-50 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage client events efficiently and
              effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group relative bg-white border-2 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer ${
                  activeFeature === idx
                    ? "border-black shadow-black/10"
                    : "border-gray-200"
                }`}
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div
                  className={`absolute inset-0 bg-black opacity-0 group-hover:opacity-2 rounded-2xl transition-opacity duration-300`}
                ></div>
                <div className="relative">
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Simplified Workflow
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to manage your events seamlessly
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gray-300"></div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:border-gray-800 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.step}
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xl font-bold mb-3 text-black">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Proven Results
            </h2>
            <p className="text-xl text-gray-600">
              See the impact of our platform on banking operations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:border-gray-800 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-extrabold mb-3 text-black">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl mb-10 text-gray-300">
            Join leading banks who trust our platform for their client
            engagement success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-black font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="px-10 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gray-900 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">EventMVP</h3>
              <p className="text-gray-400">
                Bank of Singapore Client Event Management System
              </p>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; 2025 EventMVP. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
