import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import {
  Sidebar as ProSidebar,  
  Menu,
  MenuItem,
  menuClasses,
  sidebarClasses
} from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
interface SidebarProps {
  onSidebarChange: (newState: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSidebarChange }) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    onSidebarChange(openSideBar);
  }, [openSideBar, onSidebarChange]);


  return (
<div className={`fixed top-[60px] z-50 left-0 h-[calc(100vh-60px)] bottom-0 transition-all duration-300`}
    style={{ width: openSideBar ? "15.5%" : "6%" }} 
>
      <ProSidebar 
        collapsed={!openSideBar}         
        className="h-full transition-all duration-300"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#1E1E2F",
          },
        }}
        style={{width:'100%'}}
      >
        <Menu
          className="w-full text-white h-[full]"
          menuItemStyles={{
            button: {
              [`&.${menuClasses.button}`]: {
                backgroundColor: "#1E1E2F",                
              },
              [`&:hover`]: {
                backgroundColor: "black",                
              },
            },
          }}
        >
          {/* Sidebar Content */}
          <ul className="pt-6 flex flex-col gap-8  h-full ">
            <div>
                <li>
                <MenuItem
                        icon={<Icon icon="iconamoon:menu-burger-horizontal-bold" width="28" height="28" />}
                        onClick={() => setOpenSideBar((prev) => !prev)}
                >
                        {openSideBar && "Menú"}
                </MenuItem>
                </li>
            </div>            

            <div className="gap-2 flex flex-col">
                <li>
                <MenuItem
                        icon={<Icon icon="ix:customer-filled" width="28" height="28" />}
                        onClick={()=> navigate('Customers')}
                >
                        {openSideBar && "Clientes"}
                </MenuItem>
                </li>

                <li>
                <MenuItem
                        icon={<Icon icon="mdi:truck-cargo-container" width="28" height="28" />}
                        onClick={() => navigate('Vehicles')}
                >
                        {openSideBar && "Vehículos"}
                </MenuItem>
                </li>

                <li>
                <MenuItem
                        icon={<Icon icon="healthicons:truck-driver" width="28" height="28" />}
                >
                        {openSideBar && "Conductores"}
                </MenuItem>
                </li>

                <li>
                <MenuItem
                        icon={<Icon icon="eos-icons:service-instance" width="28" height="28" />}
                >
                        {openSideBar && "Servicios"}
                </MenuItem>
                </li>

                <li>
                <MenuItem
                        icon={<Icon icon="fa-solid:hands-helping" width="28" height="28" />}
                >
                        {openSideBar && "Proveedores"}
                </MenuItem>
                </li>
            </div>            

            <div>
                <li>
                <MenuItem
                        icon={<Icon icon="fluent:people-28-filled" width="28" height="28" />}
                >
                        {openSideBar && "Equipo"}
                </MenuItem>
                </li>
            </div>            
          </ul>
        </Menu>
      </ProSidebar>
    </div>
  );
};
