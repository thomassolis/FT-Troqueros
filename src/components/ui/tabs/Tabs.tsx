import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import { useState, useEffect } from "react";
import { PrevisualizationTable } from "../Tables/previsualizationTable";    

interface TabsProps {
    tabContent: string[];
    onTabChange: (selectedOption: string) => void; // Prop para enviar la opción al padre
    searchValue: string;
}

export const PrevisualizationTab = ({ tabContent, onTabChange, searchValue }: TabsProps) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>(tabContent[0]);


    const tabHeaders: Record<string, string[]> = {
        "Chasises": ["PLACA", "STATUS", "ACCIONES"],
        "Cabezales": ["PLACA", "STATUS", "ACCIONES"],
        "Furgones": ["PLACA", "STATUS", "ACCIONES"],
    };

    // Ejecutar la función del padre cada vez que cambie la opción
    useEffect(() => {
        onTabChange(selectedOption);
        console.log('selectedOption: ',selectedOption)
    }, [selectedOption, onTabChange]);

    return (
        <Tabs
            className="flex items-center flex-col gap-5"
            selectedIndex={selectedTab}
            onSelect={(index) => {
                setSelectedTab(index);
                setSelectedOption(tabContent[index]);
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

            {tabContent.map((opt, index) => (
                <TabPanel key={index} className="w-[70%]">
                    {tabHeaders[opt] ? (
                        <PrevisualizationTable 
                            headerTable={tabHeaders[opt]} 
                            tabSelected={opt} 
                            searchValue = {searchValue}
                        />
                    ) : (
                        <p className="text-gray-500">No hay datos disponibles para esta categoría.</p>
                    )}
                </TabPanel>
            ))}
        </Tabs>
    );
};
