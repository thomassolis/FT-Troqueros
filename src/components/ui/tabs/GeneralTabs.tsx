import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { TeamReports } from '../../others/Reports/TeamReports/TeamReports';
import { useState, useEffect } from 'react';
import { ReportsKPI } from '../../others/Reports/ReportsView/ReportsKPI';
import { FiltersSection } from '../../others/Reports/FiltersSection/filtersSection';
import CakeChart from '../charts/cakeGraph';
import { getGeneralReportsData } from '../../../api/Reports/reports.route.ts';
import BarChart from '../charts/barGraph';
type SelectKey = "drivers" | "customers" | "services";
type Option = { value: number | string; label: string;};

export const GeneralTabs = ({options}: {options: string[]}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [filterSelected, setFilterSelected ] = useState<boolean>(false);
    const [dates, setDates] = useState<{startDate?: Date; endDate?: Date}>({});
    const [range, setRange] = useState<{start?: Date; end?: Date}>({}); 
    const [selected, setSelected] = useState<Record<SelectKey, Option | null>>({
        drivers: null,
        customers: null,
        services: null,                
    }); 
    const [reports, setReports] = useState<{
    totalCostos: number;                    
    totalPeticiones: number;                    
    totalVentas: number;
    graphData?: {
        bestCustomers: any; // Replace 'any' with actual type if known
        bestRoutes:any;
    };                    
    }>();

    useEffect(()=>{
        const getGeneralData = async()=>{
            try{
                const response = await getGeneralReportsData({filters: selected, dates:dates});            
                setReports(response);
            }catch(error){
                console.error('Error en getGeneralData: ', error);
            }
        }
        getGeneralData();
    },[selected,dates])

    return(
        <Tabs 
            className={'w-full rounded-md mt-5'} 
            selectedIndex={selectedTab}
            onSelect={(index) => {                
                setSelectedTab(index); 
                // setCurrentPage(1);
            }}        
        >
            
            <TabList  className={'flex gap-1 bg-white text-black p-1 rounded-3xl w-[26.3%]'}>
                {options.map((opt:string, index:number)=>(
                    <Tab key={index} className={`p-2 rounded-3xl cursor-pointer ${selectedTab === index? 'bg-blue-500 text-white font-medium':'font-medium'} hover:opacity-60 `}>
                        {opt}
                    </Tab>
                ))}   
            </TabList>

            <TabPanel>
                <div className="flex gap-5 w-full ">
                    <div className="grid grid-cols-1 w-full h-7">
                        <div className="w-full ml-5 pr-5">
                            <ReportsKPI
                                type="general"
                                reports = {reports}
                                selectedTab={selectedTab}
                                styleReport={
                                    [
                                        {
                                            id:'totalPeticiones',
                                            title: 'Total Movimientos',
                                            icon:'ph:shipping-container-fill',
                                            bgColor: 'bg-blue-50',                                            
                                            borderColor: "border-blue-200",
                                            iconContainerColor: 'bg-blue-500'                                            
                                        },
                                        {
                                            id:'totalCostos',
                                            title: 'Costos Totales',
                                            icon:'mdi:trending-down',
                                            bgColor: 'bg-red-50',                                            
                                            borderColor: "border-blue-200",
                                            iconContainerColor: 'bg-red-500',
                                            prefix: "$",
                                            subType: "percent_of",
                                            subNumeratorId: "totalCostos",
                                            subDenominatorId: "totalVentas",
                                            decimals: 2, // 35.7%
                                            subGood: "lower_is_better",
                                        },
                                        {
                                            id:'totalVentas',
                                            title: 'Ventas Totales',
                                            icon:'mdi:trending-up',
                                            bgColor: 'bg-green-50',                                            
                                            borderColor: "border-blue-200",
                                            iconContainerColor: 'bg-green-500',
                                            prefix: "$",                               
                                        },
                                        {
                                            id:'ganancias',
                                            title: 'Ganancias Netas',
                                            icon:'mdi:finance',
                                            bgColor: 'bg-blue-50',                                            
                                            borderColor: "border-purple-200",
                                            iconContainerColor: 'bg-purple-500',
                                            prefix: "$",
                                            subType: "percent_of",
                                            subNumeratorId: "ganancias",
                                            subDenominatorId: "totalVentas",
                                            decimals: 2,
                                            subGood: "higher_is_better",
                                        }
                                    ]
                                }
                            />
                        </div>           

                        <div className="grid grid-cols-2">
                            {reports?.graphData?.bestCustomers.length>0?(
                                <div className="flex flex-col items-center mt-5">
                                    <h1 className="text-gray-700 text-lg font-bold">Movimientos x clientes</h1>   
                                    <BarChart
                                        graphData = {reports?.graphData?.bestCustomers}
                                    />
                                </div>
                                ):(
                                    null
                                )
                            }
                            {reports?.graphData?.bestCustomers.length>0?(
                                
                                    <CakeChart
                                        data={reports?.graphData?.bestRoutes}
                                    />
                                
                            ):null
                            }
                        </div>                                 
                    </div>

                    <div className="w-[30%]">
                        <FiltersSection 
                            filterSelected = {filterSelected} 
                            setFilterSelected = {setFilterSelected}
                            setDates={setDates}
                            setRange={setRange}
                            range={range}
                            selected={selected}
                            setSelected={setSelected}
                            dates={dates}
                        />
                    </div>
                </div>    
            </TabPanel>

            <TabPanel>
                <TeamReports 
                    selectedTab={selectedTab}                    
                />
            </TabPanel>
        </Tabs>
     
    )

};