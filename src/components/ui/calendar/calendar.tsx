import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SidebarProps } from "react-pro-sidebar";

const localizer = momentLocalizer(moment);

interface sidebarStatus {
  sidebarState : boolean
}
const MyCalendar = ({sidebarState}:sidebarStatus) => {
  const [events, setEvents] = useState([
    {
      title: "Reunión importante",
      start: new Date(2025, 1, 15),
      end: new Date(2025, 1, 17),
    },
    {
      title: "Llamada con cliente",
      start: new Date(2025, 1, 16),
      end: new Date(2025, 1, 16),
    },
  ]);

  return (
<div className={`h-[60vh] bg-white text-gray-700 p-4 shadow-md rounded-lg w-[90%] ${sidebarState ? " " : "ml-6  "}`}>
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    className="w-full h-full"
    dayPropGetter={(date) => ({
      style: { minHeight: "90px", padding:'98px', marginBottom:'40px'}, // Permite que las filas crezcan según su contenido      
    })}
  />
</div>

  );
};

export default MyCalendar;
