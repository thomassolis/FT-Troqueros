import { Back } from "../../ui/Back/Back"
import { FiltersSection } from "../../others/Reports/FiltersSection/filtersSection"
import { useState, useEffect } from "react"
import { ReportsKPI } from "../../others/Reports/ReportsView/ReportsKPI"
import { getGeneralReportsData } from "../../../api/Reports/reports.route.ts"
import BarChart from "../../ui/charts/barGraph.tsx"
import CakeChart from "../../ui/charts/cakeGraph.tsx"

type SelectKey = "drivers" | "customers" | "services";
type Option = { value: number | string; label: string;};

export const ReportsPage = () => {
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
        <div className="flex flex-col">        
            <div className="w-full gap-5 flex">
                <div className="flex justify-between flex-1 ml-5"> {/* Cambia w-[80%] por flex-1 */}
                    <div>
                        <Back text={'Reportes'}/>
                    </div>                  
                </div>                                                            
            </div>
            
            <div className="flex gap-5">
                <div className="grid grid-cols-1 w-full h-7">
                    <div className="w-full ml-5 pr-5">
                        <ReportsKPI
                            reports = {reports}
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
        </div>
    )
}