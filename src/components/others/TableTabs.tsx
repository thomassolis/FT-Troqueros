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
import { useRef } from "react";

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


export const TableTabs = ({selectedOption, setTotalRecords, setPageSize, currentPage, procedure, selectedTab, setSelectedTab, formattedDates }: SidebarProps) => {
    const [tableData, setTableData] = useState<TableRowVariables[]>([]);    
    const [_isLoading, setIsLoading] = useState(false);
    const {searchValue, withInvoice, setWithInvoice, withoutInvoice, setWithoutInvoice} = useContext(searchValueContext)!; 
    // const [withInvoice, setWithInvoice] = useState(true);
    // const [withoutInvoice, setWithoutInvoice] = useState(true);
    
    const reqIdRef = useRef(0);           // 👈 marcador de request “vigente”

    const navigate = useNavigate();

    
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

useEffect(() => {    
    const RequestDataForHomeTable = async () => {
      const myReqId = ++reqIdRef.current;   // 👈 id para esta llamada

      setIsLoading(true);
      setTableData([]);                     // 👈 limpia la tabla al cambiar tab/filtros      

      try {
        setIsLoading(true);
        const tableSections = ['Todos','En Espera','En Proceso','Completado','Cancelado'];
        const status = tableSections[selectedTab];
        const response: any = await DataForRequestTable({
          tableSection: status === 'Todos' ? undefined : status,
          selectedOption, 
           searchValue: searchValue != null ? String(searchValue) : null,
          currentPage, 
          formattedDates,
          withoutInvoice: withoutInvoice,
          withInvoice: withInvoice
        });        

        if (myReqId !== reqIdRef.current) return; // 👈 llegó tarde: ignora

        const transformedData = transformTableData(Array.isArray(response?.data) ? response.data : []);
        setTableData(transformedData);
        setTotalRecords(response?.totalRegistros ?? 0);
        setPageSize(response?.limite ?? 10);        
      } catch (e) {
        if (myReqId !== reqIdRef.current) return; // 👈 ignora si ya cambiaste
        console.error(e);
        setTableData([]);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    };

    RequestDataForHomeTable();
  }, [selectedTab, selectedOption, searchValue, currentPage, formattedDates, withInvoice, withoutInvoice ]);    

    return (
        <div className="w-[90%] overflow-hidden flex justify-end">
            <Tabs
                selectedIndex={selectedTab} 
                onSelect={(index) => {
                    setSelectedTab(index);                     
                }}
                style={{ width: "100%" }}
            >
                <TabList className="flex justify-end w-full flex-col gap-5">
                    <div className="rounded-md bg-white flex justify-start items-center gap-5">
                        <h2 className="text-lg font-semibold p-2 text-black">Filtrar Por: </h2>
                        <div className="flex">
                            <ul className="flex gap-5">
                                <li className="flex gap-2 justify-center">
                                    <input 
                                        type="checkbox" 
                                        id="withInvoice" 
                                        checked={withInvoice} 
                                        onChange={(e) => setWithInvoice(e.target.checked)} 
                                    />                                     
                                    <label className="text-black cursor-pointer" htmlFor="withInvoice">Con Factura</label>
                                </li>

                                <li className="flex gap-2 justify-center">
                                    <input 
                                        type="checkbox" 
                                        id="withoutInvoice" 
                                        checked={withoutInvoice} 
                                        onChange={(e) => setWithoutInvoice(e.target.checked)} 
                                    />                                     
                                    <label className="text-black cursor-pointer" htmlFor="withoutInvoice">Sin Factura</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-between w-full items-end ">
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
                            _isLoading = {_isLoading}
                        />
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};
