import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useState } from "react";

// Definir el contexto del Outlet

export const Layout = () => {
  const [sidebarState, setSidebarState] = useState<boolean>(false);

  const handleSideBarChange = (newState: boolean) => {
    setSidebarState(newState);
  };

  return (
    <section
      id="LAYOUT"
      className={`grid ${sidebarState ? "grid-cols-[15.5%_1fr]" : "grid-cols-[5%_1fr]"} w-full h-screen overflow-y-auto pt-[60px]`}
    >
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <div className="w-full h-full bg-troquerosGray">
        <Sidebar onSidebarChange={handleSideBarChange} />
      </div>

      {/* Contenido dinámico con OutletContext */}
      <div className="bg-troquerosGray shadow-lg text-white p-4">
        <Outlet context={{ sidebarState }} />
      </div>
    </section>
  );
};
