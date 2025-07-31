import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useState } from "react";
import { Profile } from "../others/Profile/Profile";
// Definir el contexto del Outlet

export const Layout = () => {
  const [sidebarState, setSidebarState] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSideBarChange = (newState: boolean) => {
    setSidebarState(newState);
  };

  return (
    <section
      id="LAYOUT"
      className={`grid ${sidebarState ? "grid-cols-[15.5%_1fr]" : "grid-cols-[5%_1fr]"} w-full h-screen overflow-y-auto pt-[60px]`}
    >
      {/* Navbar */}
      <Navbar setShowProfile={setShowProfile} showProfile={showProfile}/>

      {/* Sidebar */}
      <div className="w-full h-full bg-troquerosGray flex flex-col">
        <Sidebar onSidebarChange={handleSideBarChange} />        
      </div>

      {/* Contenido dinámico con OutletContext */}
      <div className="bg-troquerosGray shadow-lg text-white p-4">        
        <Outlet context={{ sidebarState }} />
      </div>

      {showProfile && (
        <div className="absolute top-2 right-2 z-50 bg-gray-100 w-[25%] h-[25%] rounded-md">
          <Profile setShowProfile={setShowProfile} showProfile={showProfile}/>
        </div>
      )}
    </section>
  );
};
