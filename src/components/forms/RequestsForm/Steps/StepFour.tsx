
import { useFormContext } from "react-hook-form";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { SelectionTeamTable } from "../../../ui/Tables/RequestsForm/selectionTeamTable";
import { NeonWarning } from "../../../ui/Warning/NeonWarning";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

export const Step4: React.FC<StepsRequestsProps> = ({useProvider, rows, requestFormData, setRequestFormData, activeStep, userRole, procedure}) => {      
    
    const { control, setValue } = useFormContext<RequestsFormValues>();           
    return(
        <div className="flex flex-col mt-10 gap-10">
            
            <h1 className="text-black">Completa el formulario para crear una nueva petición</h1>
            <SelectionTeamTable
                title = {['Tipo de Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón']}
                control = {control}
                useProvider = {useProvider}
                rows={rows}
                requestFormData = {requestFormData}                                
                setValue= {setValue}         
                setRequestFormData={setRequestFormData}   
                activeStep={activeStep}    
                userRole={userRole}
                procedure={procedure}
            />
            {useProvider &&
                <NeonWarning message={'Se utilizará el equipo del proveedor designado.'}/>
            }            
        </div>
    )
}