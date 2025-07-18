import { useEffect, useState } from "react";
import { DataForRequestTable } from "../../api/Home/home.route";
import { RequestsTable } from "../ui/Tables/PrincipalRequestsTable/PrincipalTable";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Button } from "../ui/buttons/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext } from "react";
import { searchValueContext } from "../../context/searchValueForFilter/searchValue";
import { useNavigate } from "react-router-dom";

export interface TableRowVariables {
  cabezal: string;
  chasis: string;
  cliente: string;
  conductor: string;
  fecha_creacion: string;
  fecha_finalizacion: string;
  fecha_salida: string;
  furgon: string;
  hora_salida: string;
  id_peticion: string;
  monto: number;
  precio_proveedor: number;
  profit: number;
  proveedor: string;
  services?: TableRowVariables[]; // Optional if nested
  servicio: string;
  status: string;
    customerId: string;  // Add missing property
  date: string; 

}

interface SidebarProps {
    sidebarState: boolean;
      procedure:string
    selectedOption: null | {
        value:string;
        label: string
    };
     totalRecords: number;  
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalRecords: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}


export const TableTabs = ({ sidebarState, selectedOption, setCurrentPage, setTotalRecords, setPageSize, currentPage, procedure, selectedTab, setSelectedTab, formattedDates, setFormattedDates }: SidebarProps) => {
    const [tableData, setTableData] = useState<TableRowVariables[]>([]);    
    const [isLoading, setIsLoading] = useState(false);
    const {searchValue} = useContext(searchValueContext)!;       
    const [selectedStatus, setSelectedStatus] = useState<{value: string, label: string} | null>({value: '', label: ''});       
    const navigate = useNavigate();

    useEffect(() => {
        RequestDataForHomeTable(selectedTab).catch((error) => console.error("Error en RequestDataForHomeTable: ", error));
    }, [selectedTab, selectedOption, searchValue, currentPage, selectedStatus, formattedDates]);

    const RequestDataForHomeTable = async (index: number): Promise<void> => {
        const tableSections: string[] = ["En Espera", "En Proceso", "Completado", 'Cancelado'];
        
        try {
            setIsLoading(true);
            const response: any  = await DataForRequestTable({ tableSection: tableSections[index], selectedOption: selectedOption, searchValue: searchValue, currentPage:currentPage, formattedDates:formattedDates });                       
            setTableData(response.data as unknown as TableRowVariables[]);
            setTotalRecords(response.totalRegistros); 
            setPageSize(response.limite);
            setCurrentPage(Number(response.paginaActual) || 1);

        } catch (e) {
            console.error("Error en RequestDataForHomeTable", e);
        }finally{
            setIsLoading(false);
        }
    };
    

    return (
        <div className="w-[90%] overflow-hidden flex justify-end">
            <Tabs
                selectedIndex={selectedTab} 
                onSelect={(index) => {
                    setSelectedTab(index); 
                    setCurrentPage(1);
                }}
                style={{ width: "100%" }}
            >
                <TabList className="flex justify-end w-full">
                    <div className="flex justify-between w-full items-end">
                        {/* Botón de expansión */}
                        {procedure === 'home' && (
                            <div className="rounded-t-lg text-black flex w-[23%] justify-between items-center pr-2 pl-2 bg-slate-100 shadow-2xl cursor-pointer" onClick={()=>{navigate('/home/completeRequestHistory')}}>
                                <p className="text-red-600 font-semibold">Ver tabla completa</p>
                                <Icon icon="lucide:expand" width="15" height="15"  />
                            </div>
                        )}

                        {/* Tabs dinámicos */}
                        <div className={`flex gap-1 ${procedure === 'completeRequestHistory' ? 'w-full justify-end':''}`}>
                            {['Todos',"En Espera", "En Proceso", 'Completadas', 'Canceladas'].map((opt, index) => (
                                <Tab key={index}>
                                    <Button text={opt} isSelected={selectedTab === index} bgColor="bg-[#96B2E4]" hoverBgColor="bg-slate-400"/>
                                </Tab>
                            ))}
                        </div>
                    </div>
                </TabList>

                {/* TabPanels dinámicos */}
                {[0, 1, 2, 3].map((index) => (
                    <TabPanel key={index}>
                        <RequestsTable 
                            tableData={tableData} 
                            sidebarState={sidebarState} 
                            isLoading={isLoading} 
                            selectedTab = {selectedTab}
                            procedure = {procedure}
                        />
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};
