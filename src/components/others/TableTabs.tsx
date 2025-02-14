import { useEffect, useState } from "react"
import { DataForRequestTable } from "../../api/Home/home.route"
import { Table } from "../ui/Tables/table";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button } from "../ui/buttons/button";
import { Icon } from "@iconify/react/dist/iconify.js";

type TableDataState = Record<string, string>[];

interface sidebarProps {
    sidebarState: boolean
}

export const TableTabs = ({sidebarState}: sidebarProps) =>{

    const [tableData, setTableData] = useState<TableDataState>([]);

    useEffect(()=>{
        const fetchData = async () =>{
            const response = await DataForRequestTable();            
            setTableData(response);                   
        }        
        fetchData();
    }, [])

    return(
        <div className=" w-[90%] overflow-y-hidden overflow-x-hidden flex justify-end ">
            <Tabs style={{width:'100%'}}>
                <TabList className={'flex justify-end w-full'}>

                    <div className="flex justify-between w-full items-end">

                        <div className="  rounded-t-lg text-black flex w-[23%] justify-between items-center pr-1 pl-1 bg-slate-100">
                            <p className="text-red-600 font-semibold">Ver tabla completa</p>
                            <Icon icon="lucide:expand" width="15" height="15" className="cursor-pointer" />
                        </div>

                        <div className="flex gap-1">
                            <Tab>
                                <Button text="Incompletas"/>                        
                            </Tab>                    

                            <Tab>
                                <Button text="Pendientes"/>                        
                            </Tab>                    

                            <Tab>
                                <Button text="En Espera"/>                        
                            </Tab>              

                            <Tab>
                                <Button text="En Proceso"/>                        
                            </Tab>                          
                        </div>

                    </div>                    

                </TabList>




                <TabPanel className={'w-full'}>
                <div className="w-full">
                    <Table tableData={tableData} sidebarState={sidebarState}/>
                </div>                 
                </TabPanel>

                <TabPanel>
                    
                </TabPanel>
            </Tabs>            

        </div>
    )
}