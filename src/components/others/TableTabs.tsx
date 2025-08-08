import { useEffect, useState } from "react";
import { DataForRequestTable } from "../../api/Home/home.route";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Button } from "../ui/buttons/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext } from "react";
import { searchValueContext } from "../../context/searchValueForFilter/searchValue";
import { TableRowVariables } from "../ui/Tables/RequestTable/PrincipalRequestTable";
import { useNavigate } from "react-router-dom";
import { RequestCollapsibleTable } from "../ui/Tables/RequestTable/PrincipalRequestTable";
// Definir primero la interfaz para los servicios

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
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  formattedDates: {
    start: string | null;
    end: string | null;
  };
}


export const TableTabs = ({selectedOption, setCurrentPage, setTotalRecords, setPageSize, currentPage, procedure, selectedTab, setSelectedTab, formattedDates }: SidebarProps) => {
    const [tableData, setTableData] = useState<TableRowVariables[]>([]);    
    const [_isLoading, setIsLoading] = useState(false);
    const {searchValue} = useContext(searchValueContext)!;       
    
    const navigate = useNavigate();

    useEffect(() => {
        RequestDataForHomeTable(selectedTab).catch((error) => console.error("Error en RequestDataForHomeTable: ", error));
    }, [selectedTab, selectedOption, searchValue, currentPage, formattedDates]);

    const transformTableData = (data: any[]): TableRowVariables[] => {
    return data.map(item => ({
        ...item,
        // Mapeo de campos con nombres diferentes
        id: item.id_peticion || item.id || '',
        nombreCliente: item.cliente || item.nombreCliente || '',
        id_proveedor: item.proveedor || item.id_proveedor || '',
        // Asegurar que services sea un array
        services: item.services || []
    }));
    };

    const RequestDataForHomeTable = async (index: number): Promise<void> => {
        const tableSections: string[] = ["","En Espera", "En Proceso", "Completado", 'Cancelado'];
        
        try {
            setIsLoading(true);
            console.log('selectedOption', selectedOption);
            const response: any  = await DataForRequestTable({ tableSection: tableSections[index], selectedOption: selectedOption, searchValue: searchValue, currentPage:currentPage, formattedDates:formattedDates });                                   
            console.log('response: ', response);
            const transformedData = transformTableData(response.data);
            setTableData(transformedData);
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
                            <div className="rounded-t-lg text-black flex w-[23%] justify-between items-center pr-2 pl-2 bg-slate-100 shadow-2xl cursor-pointer bg-red-" onClick={()=>{navigate('/home/completeRequestHistory')}}>
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
                {[0, 1, 2, 3, 4].map((index) => (
                    <TabPanel key={index}>                        
                        <RequestCollapsibleTable
                            tableData={tableData} 
                            setTableData={setTableData} 
                            procedure = {procedure}
                        />
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};
