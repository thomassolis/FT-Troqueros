import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Modal from "react-modal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getDataForCalendar } from "../../../api/Home/home.route";
import { useNavigate } from "react-router-dom";
import { EventPropGetter } from 'react-big-calendar';
import { CSSProperties } from 'react';
import { vacioEntregadoStatus } from "../../../api/Home/home.route";

interface EventDetails {
  id_Pedido_Servicio: number;
  vacio_entregado: boolean | null;
  cliente: string;
  numero_contenedor: string | null;
  peticion: string;
  sh: string | null;
  size_contenedor: string | null;
}

interface CalendarEvent {
  allDay: boolean;
  details: EventDetails;
  end: Date;
  start: Date;
  title: string;
  type: string;
}

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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]); // NUEVO: guardar todos los eventos originales
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filters, setFilters] = useState({ // MOVER filters aquí al componente principal
    entregasVacio: true,
    peticiones: true,
    entregasProveedores: true
  });
  const navigate = useNavigate();

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToToday = () => toolbar.onNavigate('TODAY');

    const label = () => {
      const date = toolbar.date;
      return moment(date).format('MMMM YYYY');
    };

    const toggleFilter = (filterName: keyof typeof filters) => {
      setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    return (
      <div className="mb-4">
        {/* Toolbar principal */}
        <div className="rbc-toolbar mb-3">
          <span className="rbc-btn-group">
            <button type="button" onClick={goToToday}>Today</button>
            <button type="button" onClick={goToBack}>Back</button>
            <button type="button" onClick={goToNext}>Next</button>
          </span>

          <span className="rbc-toolbar-label font-bold text-lg">
            {label()}
          </span>

          <span className="rbc-btn-group">
            {toolbar.views.map((view: string) => (
              <button
                key={view}
                type="button"
                className={toolbar.view === view ? 'rbc-active' : ''}
                onClick={() => toolbar.onView(view)}
              >
                {view === 'month' ? 'Month' : view === 'week' ? 'Week' : view === 'day' ? 'Day' : 'Agenda'}
              </button>
            ))}
          </span>
        </div>

        {/* Barra de filtros */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Filtrar eventos:</span>
          
          <button
            onClick={() => toggleFilter('entregasVacio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filters.entregasVacio
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white text-red-600 border border-red-600'
            }`}
          >
            <span className={`w-4 h-4 flex items-center justify-center rounded-sm ${filters.entregasVacio ? 'text-red-900 bg-white' : 'border border-red-600 text-gray-400'}`}>
              {filters.entregasVacio && '✓'}
            </span>
            Entregas de Vacío
          </button>

          <button
            onClick={() => toggleFilter('peticiones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filters.peticiones
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-orange-600 border border-orange-600'
            }`}
          >
            <span className={`w-4 h-4 flex items-center justify-center rounded-sm bg-white text-orange-700 ${filters.peticiones ? 'text-orange-900' : 'text-gray-400 border border-orange-600'}`}>
              {filters.peticiones && '✓'}
            </span>
            Peticiones
          </button>

          <button
            onClick={() => toggleFilter('entregasProveedores')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filters.entregasProveedores
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white border border-blue-600 text-blue-600'
            }`}
          >
            <span className={`w-4 h-4 flex items-center justify-center bg-white rounded-sm text-blue-900 ${filters.entregasProveedores ? 'text-blue-900' : 'text-gray-400 border border-blue-600'}`}>
              {filters.entregasProveedores && '✓'}
            </span>
            Entregas de Proveedores
          </button>
        </div>
      </div>
    );
  };

  // NUEVO: useEffect para filtrar eventos cuando cambian los filtros
  useEffect(() => {
    const filteredEvents = allEvents.filter(event => {
      // Filtrar por tipo de evento
      if (event.type === "Vacio" && !filters.entregasVacio) {
        return false;
      }
      
      if ((event.type === "Peticion" || event.type === "peticion") && !filters.peticiones) {
        return false;
      }
      
      // Verificar si el evento es de proveedor (puede ser por title o type)
      const isProveedorEvent = event.title?.startsWith('Entrega Proveedor:') || event.type === 'Proveedor';
      if (isProveedorEvent && !filters.entregasProveedores) {
        return false;
      }
      
      return true;
    });
    
    setEvents(filteredEvents);
  }, [filters, allEvents]);

  const changeVacioEntregado = async(value:boolean, id:number) => {      
    try{
      const response = await vacioEntregadoStatus(value, id);
      if(response.success){
        // Actualizar allEvents (la fuente de verdad)
        setAllEvents(prevEvents => 
          prevEvents.map(event => ({
            ...event,
            details: event.details ? {
              ...event.details,
              vacio_entregado: event.details.id_Pedido_Servicio === id ? value : event.details.vacio_entregado
            } : event.details
          }))
        );        
      }
    }catch(error){
      console.error('error en changeVacioEntregado', error);
    }
  };

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await getDataForCalendar();        
        const formatted = response.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: event.allDay || false
        }));
        setAllEvents(formatted); // Guardar en allEvents
        setEvents(formatted); // Inicialmente mostrar todos
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
      borderColor = "white";
      if(event.details.vacio_entregado){
        backgroundColor = "#93A0F4";
      }else{
        backgroundColor = "#A81F1F";
      }        
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
      style={{ height: "95vh" }}
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
        min={new Date(0, 0, 0, 0, 0, 0)}
        max={new Date(0, 0, 0, 23, 59, 59)}
        step={30}
        timeslots={2}
        showMultiDayTimes
        dayLayoutAlgorithm="no-overlap"
        components={{
          toolbar: CustomToolbar,
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
            minHeight: "150px",
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

              {selectedEvent.type==='Vacio'?(
                <>
                  <div className="flex items-center ">
                    <div className="w-24 flex-shrink-0 ">
                      <span className="text-sm font-medium text-gray-500">
                        Fecha Límite de entrega:
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {moment(selectedEvent.start).format("DD/MM/YYYY")}
                    </span>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-24 flex-shrink-0 ">
                      <label className="text-sm font-medium text-gray-500" htmlFor="vacio_entregado">
                        Entregado
                      </label>
                    </div>
                      <input 
                        name="vacio_entregado"
                        type="checkbox" 
                        checked={selectedEvent?.details?.vacio_entregado || false}
                        onChange={(e) => {
                          // Actualización optimista: cambia el estado ANTES de la llamada API
                          setSelectedEvent((prev:any) => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              vacio_entregado: e.target.checked
                            }
                          }));
                          
                          // Luego llama a la API
                          changeVacioEntregado(e.target.checked, selectedEvent.details.id_Pedido_Servicio);
                        }}
                      />              
                  </div>
                </>
              ):(
                <>
                  <div className="flex items-start ">
                    <div className="w-24 flex-shrink-0 ">
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
                </>
              )

              } 
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