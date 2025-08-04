import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Modal from "react-modal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getDataForCalendar } from "../../../api/Home/home.route";
import { useNavigate } from "react-router-dom";
import { EventPropGetter } from 'react-big-calendar';
import { CSSProperties } from 'react';

// Configuración de moment para español (opcional)
moment.locale('es', {
  week: {
    dow: 1, // Lunes como primer día de la semana
  }
});

const localizer = momentLocalizer(moment);

Modal.setAppElement("#root");

interface SidebarStatus {
  sidebarState: boolean;
}

const MyCalendar = ({ sidebarState }: SidebarStatus) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await getDataForCalendar();
        console.log('Response Calendar: ', response);
        const formatted = response.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: event.allDay || false
        }));
        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchCalendarData();
  }, []);

  const openModal = (event: any) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  // Estilos personalizados para los eventos según su tipo
const eventStyleGetter: EventPropGetter<any> = (event) => {
  let backgroundColor = "#3174ad";
  let borderColor = "#3174ad";
  
  if (event.type === "Vacio") {
    backgroundColor = "#93A0F4";
    borderColor = "white";
  } else if (event.type === "Peticion" || event.type === "peticion") {
    backgroundColor = "#FFAD4E";
    borderColor = "#F57C00";
  } else if (event.type === "reunion") {
    backgroundColor = "#9C27B0";
    borderColor = "#7B1FA2";
  }

  const style: CSSProperties = {
    backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius: "4px",
    opacity: 0.9,
    color: "white",
    fontSize: "0.85rem",
    padding: "2px 5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const, // Esta es la clave para solucionar el error
    overflow: "hidden",
    textOverflow: "ellipsis"
  };

  return { style };
};

  // Formateador para mostrar horas en formato 24h
  const timeGutterFormat = (date: Date) => {
    return moment(date).format("HH:mm");
  };

  return (
    <div
      className={`bg-white text-gray-800 p-6 shadow-xl rounded-xl w-[90%] transition-all duration-300 ${
        sidebarState ? "" : "ml-6"
      }`}
      style={{ height: "85vh" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        popup
        className="w-full h-full font-sans"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={openModal}
        views={["month", "week", "day", "agenda"]}
        defaultView="week"
        min={new Date(0, 0, 0, 0, 0, 0)} // Desde medianoche
        max={new Date(0, 0, 0, 23, 59, 59)} // Hasta medianoche
        step={30} // Intervalos de 30 minutos
        timeslots={2} // 2 divisiones por intervalo (15 minutos)
        showMultiDayTimes // Mostrar horas en eventos multi-día
        dayLayoutAlgorithm="no-overlap" // Evitar superposición de eventos
        components={{
          timeGutterHeader: () => (
            <div className="text-xs font-semibold">Hora</div>
          ),
        }}
        formats={{
          timeGutterFormat: timeGutterFormat,
          eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
            return localizer?.format(start, "HH:mm", culture) + 
              " - " + 
              localizer?.format(end, "HH:mm", culture);
          }
        }}
        dayPropGetter={() => ({
          style: {
            minHeight: "100px",
            overflow: "visible",
          },
        })}
      />

      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={closeModal}
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-auto mt-20 outline-none border-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        closeTimeoutMS={200}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              {selectedEvent?.type === 'Vacio' ? (
                <h2 className="text-2xl font-bold text-gray-800">
                  Contenedor: {selectedEvent.details?.numero_contenedor || "No especificada"}
                </h2>
                ):
                <h2 className="text-2xl font-bold text-gray-800">
                  Petición: {selectedEvent.details?.peticion || "No especificada"}
                </h2>
              }

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">
                    Cliente:
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {selectedEvent.details?.cliente || "No especificado"}
                </span>
              </div>

              <div className="flex items-start">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">
                    Petición:
                  </span>
                </div>                

                <span
                  onClick={()=>{
                    navigate(`/home/Request/edit/${selectedEvent.details?.peticion}`)
                  }}
                  className={`text-sm px-2 py-1 rounded-full hover:text-blue-400 cursor-pointer ${
                    selectedEvent.type === "Vacio"
                      ? "bg-blue-100 text-blue-800"
                      : selectedEvent.type === "Peticion" || selectedEvent.type === "peticion"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedEvent.details?.peticion || "No especificada"}
                </span>
              </div>

              {selectedEvent?.type === 'Vacio' && (
                <>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-sm font-medium text-gray-500">
                        SH:
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {selectedEvent.details?.sh || "No especificado"}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-sm font-medium text-gray-500">
                        Contenedor:
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {selectedEvent.details?.numero_contenedor || "No especificado"}
                    </span>
                  </div>
                </>
              )}


              <div className="flex items-start">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">
                    Tipo:
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {selectedEvent.type}
                </span>
              </div>

              {selectedEvent?.type === 'Proveedor' && (
                <div className="flex items-start">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-500">
                      Proveedor:
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {selectedEvent.details.nombre_proveedor}
                  </span>
                </div>
              )

              }

              <div className="flex items-start">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">
                    Inicio:
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>

              <div className="flex items-start">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">
                    Fin:
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {moment(selectedEvent.end).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyCalendar;