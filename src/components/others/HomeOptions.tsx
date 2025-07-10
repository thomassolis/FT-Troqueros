import { Icon } from "@iconify/react/dist/iconify.js";
import { TableTabs } from "./TableTabs";
import NotificationsCalendar from "../ui/calendar/calendar";
import { useNavigate } from "react-router-dom";
import { FilterSearch } from "../ui/FilterSearch/FilterSearch";
import { useState } from "react";
import { Paginacion } from "../ui/paginación/pagination";

interface MyComponentProps {
    sidebarState: boolean;
}
 
export const HomeOptions: React.FC<MyComponentProps> = ({ sidebarState }) => {        
    const navigate = useNavigate()
    //ESTADO QUE MANEJARÁ EL VALOR SELECCIONADO DENTRO DEL FILTRADOR DE LA TABLA DE PETICIONES
    const [selectedOption, setSelectedOption] = useState<{value: string, label: string} | null>({value: 'id', label: 'ID'});    

    //Paginación
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePageClick = (selectedPage: number) => {        
        setCurrentPage(selectedPage);
    };  
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

            <div className="w-full flex flex-col items-start">
                <div className="ml-[5%]">
                    <FilterSearch selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
                </div>                
                <div className="w-full flex justify-center flex-col items-center">
                    <TableTabs 
                        sidebarState={sidebarState} 
                        selectedOption={selectedOption} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        setTotalRecords={setTotalRecords} 
                        totalRecords={totalRecords}
                        setPageSize={setPageSize}
                    />                
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-300 rounded-sm border border-gray-400">

                            </div>
                            <p className="text-black">Proveedor</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-200 rounded-sm border border-gray-400">

                            </div>
                            <p className="text-black">Varios Servicios</p>
                        </div>

                    </div>
                    <Paginacion pageSize= {pageSize} totalRecords={totalRecords} handlePageClick = {handlePageClick}/>            
                </div>                    
            </div> 
            
            <h1 className={`font-bebas text-black text-2xl mt-16 ${sidebarState ? "ml-12" : 'ml-16'} max-md:ml-9 max-sm:ml-9`}>AGENDA</h1>    
            <div className="w-full flex flex-col justify-center items-center pb-14 ">                
                <NotificationsCalendar sidebarState={sidebarState}/>
            </div>
        </section>
    )
}
