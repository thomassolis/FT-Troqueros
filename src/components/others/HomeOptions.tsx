import { Icon } from "@iconify/react/dist/iconify.js";
import { TableTabs } from "./TableTabs";
import NotificationsCalendar from "../ui/calendar/calendar";
import { useNavigate } from "react-router-dom";
import { FilterSearch } from "../ui/FilterSearch/FilterSearch";
import { useState } from "react";
import { Paginacion } from "../ui/paginación/pagination";
import { Back } from "../ui/Back/Back";
import { GetProcedureFromURL } from "../../functions/GetURL/GetURLInfo";
import { FaFileExcel } from 'react-icons/fa';
import { DownloadRequestExcel } from "../../api/Home/home.route";
import { useContext } from "react";
import { searchValueContext } from "../../context/searchValueForFilter/searchValue";

interface MyComponentProps {
    sidebarState: boolean;
}
 
export const HomeOptions: React.FC<MyComponentProps> = ({ sidebarState }) => {        
    const navigate = useNavigate()    
    const procedure = GetProcedureFromURL()   
    const {searchValue} = useContext(searchValueContext)!;     
    const [selectedTab, setSelectedTab] = useState<number>(0); 
    //ESTADO QUE MANEJARÁ EL VALOR SELECCIONADO DENTRO DEL FILTRADOR DE LA TABLA DE PETICIONES
    const [selectedOption, setSelectedOption] = useState<{value: string, label: string} | null>({value: 'id', label: 'ID'});    

    //Paginación
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const tableSections: string[] = ["","En Espera", "En Proceso", "Completado", 'Cancelado'];
    // Estado para almacenar las fechas formateadas
    const [formattedDates, setFormattedDates] = useState<{
        start: string | null;
        end: string | null;
    }>({
        start: null,
        end: null,
    });


    const handlePageClick = (selectedPage: number) => {        
        setCurrentPage(selectedPage);
    };  

    const downloadExcel = async() => {
        try{
            await DownloadRequestExcel({selectedOption:selectedOption, searchValue:searchValue, selectedTab:selectedTab, tableSections:tableSections, formattedDates:formattedDates});
        }catch(error){
            console.error('Error en downloadExcel: ', error);
        }

    }

    return(
        <section className="mt-3">
            <div className="flex items-center gap-1 mb-4">
                {procedure === 'completeRequestHistory'?(<Back text={'Historial de Peticiones'}/>) : (
                    <h1 className={`font-bebas text-black text-2xl  ${sidebarState ? "ml-12" : "ml-16"} max-md:ml-9 max-sm:ml-9`}>PETICIONES</h1>
                )}                
                <Icon 
                    icon="icon-park-outline:add" 
                    className="text-black hover:text-gray-500 cursor-pointer" 
                    width="28" height="28" 
                    onClick={()=>navigate('/home/Request/create')}
                />
            </div>             

            <div className="w-full flex flex-col items-start">
                <div className="pl-[5%] flex justify-between w-[95%]">
                    <FilterSearch 
                        selectedOption={selectedOption} 
                        setSelectedOption={setSelectedOption} 
                        setFormattedDates = {setFormattedDates}
                        formattedDates = {formattedDates}
                    />                    
                    <button
                        onClick={downloadExcel}
                        className="
                        bg-gradient-to-r from-green-500 to-green-600
                        hover:from-green-600 hover:to-green-700
                        text-white font-medium py-2 px-4 rounded-lg
                        shadow-md hover:shadow-lg
                        transition-all duration-300 ease-in-out
                        transform hover:-translate-y-0.5
                        flex items-center justify-center
                        space-x-2
                        border border-green-700
                        min-w-[180px]
                        "
                    >
                        <FaFileExcel className="text-xl" />
                        <span>Descargar Excel</span>
                    </button>
                </div>                
                <div className="w-full flex justify-center flex-col items-center pt-8">
                    <TableTabs 
                        sidebarState={sidebarState} 
                        selectedOption={selectedOption} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        setTotalRecords={setTotalRecords} 
                        totalRecords={totalRecords}
                        setPageSize={setPageSize}
                        procedure = {procedure}
                        // tableSections = {tableSections}
                        selectedTab = {selectedTab}
                        setSelectedTab = {setSelectedTab}                         
                        formattedDates = {formattedDates}
                    />                
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-100 rounded-sm border border-gray-400">

                            </div>
                            <p className="text-black">Proveedor</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-100 rounded-sm border border-gray-400">

                            </div>
                            <p className="text-black">Varios Servicios</p>
                        </div>

                    </div>
                    <Paginacion pageSize= {pageSize} totalRecords={totalRecords} handlePageClick = {handlePageClick}/>            
                </div>                    
            </div> 
            
            
            {procedure === 'home' && (
                <>
                    <h1 className={`font-bebas text-black text-2xl mt-16 ${sidebarState ? "ml-12" : 'ml-16'} max-md:ml-9 max-sm:ml-9`}>AGENDA</h1>    
                    <div className="w-full flex flex-col justify-center items-center pb-14 ">                
                        <NotificationsCalendar sidebarState={sidebarState}/>
                    </div>
                </>
            )}
        </section>
    )
}
