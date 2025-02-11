import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import {
  Sidebar as ProSidebar,  // En v2+ "ProSidebar" ya no existe, ahora es "Sidebar"
  Menu,
  MenuItem,
  SubMenu,
  menuClasses // Para personalizar estilos en v2+
} from "react-pro-sidebar";
// import "react-pro-sidebar/dist/styles.css"; // Para react-pro-sidebar v2+



interface SidebarProps {
  onSidebarChange: (newState: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSidebarChange }) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  useEffect(() => {
    onSidebarChange(openSideBar);
  }, [openSideBar, onSidebarChange]);

  return (
    <ProSidebar collapsed={!openSideBar} className="w-3 h-full bg-black duration-0">
      <Menu className="w-full text-white">
        <div className="mt-6">
            <div>
                <MenuItem 
                        icon={<Icon icon="iconamoon:menu-burger-horizontal-bold" />} 
                        onClick={() => setOpenSideBar((prev) => !prev)}>
                        Menú
                </MenuItem>
            </div>

            <div className="">            
                <MenuItem 
                        icon={<Icon icon="iconamoon:menu-burger-horizontal-bold" />} 
                        onClick={() => setOpenSideBar((prev) => !prev)}>
                        Menú
                </MenuItem>
            </div>        
        </div>
        
      </Menu>
    </ProSidebar>
  );
};
