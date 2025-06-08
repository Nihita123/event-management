import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Event Calendar</h1>
      <Calendar onChange={setDate} value={date} />
      <p className="mt-4 text-center">Selected Date: {date.toDateString()}</p>
    </div>
  );
};

export default EventCalendar;
