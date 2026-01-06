import { Back } from "../../ui/Back/Back"
import { GeneralTabs } from "../../ui/tabs/GeneralTabs.tsx"

export const ReportsPage = () => {

    
    return(
        <div className="flex flex-col ml-5">        
            <div className="w-full gap-5 flex">
                <div className="flex justify-between flex-1"> {/* Cambia w-[80%] por flex-1 */}
                    <div>
                        <Back text={'Reportes'}/>
                    </div>                  
                </div>                                                            
            </div>
            
            <GeneralTabs options={["Reportería General", "Detalles del Equipo"]}/>                        
            

        </div>
    )
}