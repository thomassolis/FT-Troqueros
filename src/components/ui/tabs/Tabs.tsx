import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import { useState, useEffect } from "react";
import { PrevisualizationTable } from "../Tables/previsualizationTable";    
import { AmountTable } from "../Tables/AmountTable/AmountTable";
import { RequestsFormValues } from "../../types/forms/RequestsForm/requestsForm";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { RouteRow } from "../../../context/Requests/DynamicRequestsOptions";
interface TabsProps {
    tabContent: string[];
    onTabChange: any; // Prop para enviar la opción al padre
    useProvider?: boolean;    
    services?:[{
        serviceType: string;
        rowIndex:number;
    }];
    rows: RouteRow[];
    register?: UseFormRegister<RequestsFormValues>;
    watch?: UseFormWatch<RequestsFormValues>;
    setValue?: UseFormSetValue<RequestsFormValues>;
}

export const PrevisualizationTab = ({ tabContent, onTabChange, services, rows, register, watch, setValue, useProvider, requestFormData, errors }: TabsProps) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>(tabContent[0]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [filteredRows, setFilteredRows] = useState<string[]>([]);

    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const module = pathSegments[pathSegments.length - 1];

    const tabHeaders: Record<string, string[]> = {
        "Chasises": ["PLACA", "STATUS", "ACCIONES"],
        "Cabezales": ["PLACA", "STATUS", "ACCIONES"],
        "Furgones": ["PLACA", "STATUS", "ACCIONES"],
    };

    // Ejecutar la función del padre cada vez que cambie la opción
    useEffect(() => {
        onTabChange(selectedOption);
    }, [selectedOption, onTabChange]);
        
    // Filtra los rows que coincidan con el índice seleccionado (por grupo)
  useEffect(() => {
    if (module != "Vehicles" && rows.length) {        
      const newRows = rows.filter((row) => row.rowIndex === selectedTab);      
      setFilteredRows(newRows);      
    }
  }, [module, rows, selectedTab]); 
    

    return (
        <Tabs
            className="flex items-center flex-col"
            selectedIndex={selectedTab}
            onSelect={(index) => {
                setSelectedTab(index);
                setSelectedOption(tabContent[index]);
                setSelectedIndex(index);
            }}
        >
            <TabList className="bg-troquerosOrange p-2 flex w-[70%] rounded-lg gap-2">
                {tabContent.map((opt, index) => (
                    <Tab
                        key={index}
                        className={`w-full rounded-lg cursor-pointer p-1 text-black flex justify-center ${
                            selectedTab === index ? "bg-white" : "bg-[#FFBF85]"
                        }`}
                    >
                        {opt}
                    </Tab>
                ))}
            </TabList>

            {module === 'Vehicles' ? (
                tabContent.map((opt, index) => (
                <TabPanel key={index} className="w-[70%]">
                    {tabHeaders[opt] ? (
                        <PrevisualizationTable 
                            headerTable={tabHeaders[opt]} 
                            tabSelected={opt}                             
                        />
                    ) : (
                        <p className="text-gray-500">No hay datos disponibles para esta categoría.</p>
                    )}
                </TabPanel>
            ))
            ): (
                <div className="flex flex-col gap-12 w-full items-center">
                    <AmountTable              
                        selectedIndex={selectedTab}      
                        services={services}
                        filteredServiceData={filteredRows}
                        setFilteredServiceData = {setFilteredRows}
                        register ={register}
                        watch={watch}
                        setValue = {setValue}
                        useProvider={useProvider}
                        requestFormData={requestFormData}
                        errors={errors}
                    />

                </div>
            )}
        </Tabs>
    );
};
