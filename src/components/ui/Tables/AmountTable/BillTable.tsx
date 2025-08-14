import { Input } from "../../inputs/input"
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import InfoTooltip from "../../ToolTip/ToolTip";
export const BillTable = () => {
    const { control } = useFormContext<RequestsFormValues>();
    return(
        <div className="flex gap-5 w-[50%] items-center">
            <div className="flex items-center">
                <label htmlFor="billNumber" className="text-black">Número de Factura</label>
                <InfoTooltip content='En caso de ser más de 1 separar con ;'/>
            </div>            
            <Controller
                name="numero_factura"
                control={control}
                render={({ field }) => (
                    <Input 
                        {...field}
                        value={field.value ?? ''} 
                        type="text"                
                        id="billNumber"
                        className2={'w-[40%] py-4'}
                    />
                )}
            />
        </div>

    )
}