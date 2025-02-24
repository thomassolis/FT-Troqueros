import { useEffect, useState } from "react";
import { DataForRequestTable } from "../../api/Home/home.route";
import { Table } from "../ui/Tables/table";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Button } from "../ui/buttons/button";
import { Icon } from "@iconify/react/dist/iconify.js";


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
}

export const TableTabs = ({ sidebarState }: SidebarProps) => {
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0); 
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        RequestDataForHomeTable(0).catch((error) => console.error("Error en RequestDataForHomeTable: ", error));
    }, []);

    const RequestDataForHomeTable = async (index: number): Promise<void> => {
        const tableSections: string[] = ["incomplete", "pending", "waiting", "InProcess"];
        
        try {
            setIsLoading(true);
            const response = await DataForRequestTable({ tableSection: tableSections[index] });
           
            const formattedData: TableRow[] = response.map((row) => ({
                ID: row["ID"] || "",
                Cliente: row["Cliente"] || "",
                Servicio: row["Servicio"] || "",
                Conductor: row["Conductor"] || "",
                Chasis: row["Chasis"] || "",
                Cabezal: row["Cabezal"] || "",
                Furgón: row["Furgón"] || "",
                Status: row["Status"] || "",
            }));
    
            setTableData(formattedData);
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
                    RequestDataForHomeTable(index).catch((error) =>
                        console.error("Error en RequestDataForHomeTable: ", error)
                    );
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
                            {["Incompletas", "Pendientes", "En Espera", "En Proceso"].map((opt, index) => (
                                <Tab key={index}>
                                    <Button text={opt}isSelected={selectedTab === index} bgColor="bg-[#96B2E4]" hoverBgColor="bg-slate-400"/>
                                </Tab>
                            ))}
                        </div>
                    </div>
                </TabList>

                {/* TabPanels dinámicos */}
                {[0, 1, 2, 3].map((index) => (
                    <TabPanel key={index}>
                        <Table tableData={tableData} sidebarState={sidebarState} isLoading={isLoading}/>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};
