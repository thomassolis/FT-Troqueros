
import { useFormContext } from "react-hook-form";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { PrevisualizationTab } from "../../../ui/tabs/Tabs";
import { InvoiceTable } from "../../../ui/Tables/AmountTable/InvoiceTable";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

export const Step5: React.FC<StepsRequestsProps> = ({useProvider, requestFormData, rows, getValues}) => {    
    const { setValue, register, formState: { errors }, watch } = useFormContext<RequestsFormValues>();    
    const services = rows?.map((row, index) => ({
        serviceType: row.serviceType,
        rowIndex: index,
    }));
    
// console.log('Paso 5')

    return (
        <div className="flex flex-col mt-10 gap-10">
            <h1 className="text-black">Visualización y modificación de tarifa</h1>
            <PrevisualizationTab
                tabContent={services?.map(s => s.serviceType)}
                onTabChange={(selectedOption:any) => console.log('Opción seleccionada2:', selectedOption)}                
                rows={rows}
                register={register}
                watch={watch}
                setValue = {setValue}
                useProvider={useProvider}
                requestFormData = {requestFormData}
                errors = {errors}
                getValues = {getValues}                
            />

            <h1 className="text-black">Factura total de servicios</h1>
            <div className="flex justify-center">
                <InvoiceTable                                        
                    requestFormData = {requestFormData}                    
                />
            </div>
        </div>
    )
}