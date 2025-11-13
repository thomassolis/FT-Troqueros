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
import FileViewer from "../../../ui/Files/showFiles";
export const Step5: React.FC<StepsRequestsProps> = ({useProvider, requestFormData, rows, procedure, setRequestFormData}) => {    
    const { setValue, register, control, watch } = useFormContext<RequestsFormValues>();    
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
                onTabChange={(selectedOption:any) => console.log(selectedOption)}                
                rows={rows}
                register={register}
                watch={watch}
                setValue = {setValue}
                useProvider={useProvider}
                requestFormData = {requestFormData}                                                                
                procedure={procedure}
            />
            
            <div className="flex justify-center">
                <InvoiceTable                                        
                    requestFormData = {requestFormData}       
                    setRequestFormData = {setRequestFormData}                                                              
                />
            </div>
            
            <div className="flex justify-center">
                <BillTable/>
            </div>

            {userRole === 'ADM' &&
            <>
                {requestFormData?.files && (
                    <div className="mt-6 flex justify-center w-full">
                        <div className="w-[80%]">
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Archivos Subidos ({requestFormData.files.length})</h3>
                            <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
                                {(requestFormData.files as { url: string; nombre: string }[]).map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 transition-colors duration-150 hover:bg-gray-300  cursor-pointer " onClick={() => window.open(file.url, "_blank")}>
                                        <div className="flex items-center min-w-0 flex-1"
>
                                            <div className="text-gray-400 mr-3">
                                                <i className="fas fa-file"></i>
                                            </div>
                                            <span className="truncate text-gray-800">{(file as { nombre: string }).nombre}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                                            
                                            <div className="flex space-x-2">
                                                <button className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded" title="Descargar">
                                                    <i className="fas fa-download text-sm"></i>
                                                </button>
                                                <button className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded" title="Eliminar">
                                                    <i className="fas fa-trash text-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div>                    
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
            </>

            }     

            {userRole === 'CEO' && (requestFormData?.files?.length ?? 0) > 0 && (
                <div>                    
                    <FileViewer files={requestFormData?.files || []}/>
                </div>
            )}                   

            {(((requestFormData?.paymentData?.length ?? 0) > 0 && userRole?.toString() === 'ADM')||userRole==='CEO') && (
                <>                    
                    <PaymentTable />
                </>
            )}    
      
        </div>
    )
}