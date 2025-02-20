import { HomeOptions } from "../../others/HomeOptions";
import { useOutletContext } from "react-router-dom";


// Definir el tipo de contexto esperado
interface OutletContextType {
    sidebarState: boolean;
  }
  
  export const Home = () => {
    // Obtener el estado de sidebar desde el Outlet
    const { sidebarState } = useOutletContext<OutletContextType>();
  
    return (
      <div>
        <HomeOptions sidebarState={sidebarState} />
      </div>
    );
  };