import { Icon } from "@iconify/react/dist/iconify.js";
import { TableTabs } from "./TableTabs";
import NotificationsCalendar from "../ui/calendar/calendar";
import { useNavigate } from "react-router-dom";

interface MyComponentProps {
    sidebarState: boolean;
}

export const HomeOptions: React.FC<MyComponentProps> = ({ sidebarState }) => {        
    const navigate = useNavigate()
    return(
        <section className="mt-3">
            <div className="flex items-center gap-1 mb-4">
                <h1 className={`font-bebas text-black text-2xl  ${sidebarState ? "ml-12" : "ml-16"} max-md:ml-9 max-sm:ml-9`}>PETICIONES</h1>
                <Icon 
                    icon="icon-park-outline:add" 
                    className="text-black hover:text-gray-500 cursor-pointer" 
                    width="28" height="28" 
                    onClick={()=>navigate('/home/Request/create')}
                />
            </div>             

            <div className="w-full flex items-center justify-center">
                <TableTabs sidebarState={sidebarState}/>                
            </div> 
            
            <h1 className={`font-bebas text-black text-2xl mt-16 ${sidebarState ? "ml-12" : 'ml-16'} max-md:ml-9 max-sm:ml-9`}>AGENDA</h1>    
            <div className="w-full flex flex-col justify-center items-center pb-14 ">                
                <NotificationsCalendar sidebarState={sidebarState}/>
            </div>
        </section>
    )
}
