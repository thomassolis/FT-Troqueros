import { useEffect, useState } from "react";
import { DataForRequestTable } from "../../api/Home/home.route";
import { RequestsTable } from "../ui/Tables/PrincipalRequestsTable/PrincipalTable";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Button } from "../ui/buttons/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext } from "react";
import { searchValueContext } from "../../context/searchValueForFilter/searchValue";

interface TableRow {
    ID: string;
    Cliente: string;
    Servicio: string;
    Conductor: string;
    Chasis: string;
    Cabezal: string;
    Furgón: string;
    Status: string;
}

interface SidebarProps {
    sidebarState: boolean;
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

export const TableTabs = ({ sidebarState, selectedOption, setCurrentPage, setTotalRecords, setPageSize, currentPage }: SidebarProps) => {
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0); 
    const [isLoading, setIsLoading] = useState(false);
    const {searchValue} = useContext(searchValueContext)!;    

    useEffect(() => {
        RequestDataForHomeTable(selectedTab).catch((error) => console.error("Error en RequestDataForHomeTable: ", error));
    }, [selectedTab, selectedOption, searchValue, currentPage]);

    const RequestDataForHomeTable = async (index: number): Promise<void> => {
        const tableSections: string[] = ["En Espera", "En Proceso", "Completado"];
        
        try {
            setIsLoading(true);
            const response = await DataForRequestTable({ tableSection: tableSections[index], selectedOption: selectedOption, searchValue: searchValue, currentPage:currentPage });           
    
            setTableData(response.data);
            setTotalRecords(response.totalRegistros); 
            setPageSize(response.limite);
            setCurrentPage(response.paginaActual)

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
                        <div className="rounded-t-lg text-black flex w-[23%] justify-between items-center pr-2 pl-2 bg-slate-100 shadow-2xl">
                            <p className="text-red-600 font-semibold">Ver tabla completa</p>
                            <Icon icon="lucide:expand" width="15" height="15" className="cursor-pointer" />
                        </div>

                        {/* Tabs dinámicos */}
                        <div className="flex gap-1">
                            {["En Espera", "En Proceso", 'Terminadas'].map((opt, index) => (
                                <Tab key={index}>
                                    <Button text={opt} isSelected={selectedTab === index} bgColor="bg-[#96B2E4]" hoverBgColor="bg-slate-400"/>
                                </Tab>
                            ))}
                        </div>
                    </div>
                </TabList>

                {/* TabPanels dinámicos */}
                {[0, 1, 2].map((index) => (
                    <TabPanel key={index}>
                        <RequestsTable tableData={tableData} sidebarState={sidebarState} isLoading={isLoading} selectedTab = {selectedTab}/>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};
