import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  // Dummy data example — replace with your real analytics data fetched from backend
  const eventStats = {
    labels: ["Event 1", "Event 2", "Event 3", "Event 4"],
    datasets: [
      {
        label: "Attendees",
        data: [150, 200, 100, 175],
        backgroundColor: "rgba(255, 107, 107, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Event Attendance Analytics",
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Analytics Panel</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,450</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approved Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,200</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardContent>
          <Bar options={options} data={eventStats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
