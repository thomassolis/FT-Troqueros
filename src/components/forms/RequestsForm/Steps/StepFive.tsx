import { InsertMultipleFiles } from "../../../ui/Files/insertMultipleFiles";
import { useFormContext } from "react-hook-form";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { PrevisualizationTab } from "../../../ui/tabs/Tabs";
import { InvoiceTable } from "../../../ui/Tables/AmountTable/InvoiceTable";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { BillTable } from "../../../ui/Tables/AmountTable/BillTable";
import { PaymentTable } from "../../../ui/Tables/PaymentTable/paymentTable";
import { AuthContext } from "../../../../context/auth/authProvider";
import { useContext } from "react";
import { Controller } from "react-hook-form";


export const Step5: React.FC<StepsRequestsProps> = ({useProvider, requestFormData, rows, getValues, activeStep}) => {    
    const { setValue, register, control,formState: { errors }, watch } = useFormContext<RequestsFormValues>();    
    const services = rows?.map((row, index) => ({
        serviceType: row.serviceType,
        rowIndex: index,
    }));    
    const {userRole} = useContext(AuthContext)!;

    return (
        <div className="flex flex-col mt-10 gap-10">
            <h1 className="text-black">Visualización y modificación de tarifa</h1>
            <PrevisualizationTab
                tabContent={services?.map(s => s.serviceType)}
                onTabChange={(selectedOption:any) => console.log('', selectedOption)}                
                rows={rows}
                register={register}
                watch={watch}
                setValue = {setValue}
                useProvider={useProvider}
                requestFormData = {requestFormData}
                errors = {errors}
                getValues = {getValues}  
                activeStep = {activeStep}                
            />

            <h1 className="text-black">Factura total de servicios</h1>
            <div className="flex justify-center">
                <InvoiceTable                                        
                    requestFormData = {requestFormData}                                      
                />
            </div>
            
            <div className="flex justify-center">
                <BillTable/>
            </div>

            {(((requestFormData?.paymentData?.length ?? 0) > 0 && userRole?.toString() === 'ADM')||userRole==='CEO') && (
                <>
                    <h1 className="text-black">Tabla de pagos realizados</h1>
                    <PaymentTable />
                </>
            )}

            

                {userRole === 'CEO' &&

                    <div>
                        <h1 className="text-black mb-10">Adjunte comprobantes de pago</h1>
                        <Controller
                            name="paymentFiles"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <InsertMultipleFiles
                                    value={field.value}
                                    onChange={field.onChange}
                                    name={field.name}
                                />
                            )}
                        />
                    </div>
                }            
      
        </div>
    )
}