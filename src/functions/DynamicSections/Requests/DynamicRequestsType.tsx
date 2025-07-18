import Select from "react-select"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Input } from "../../../components/ui/inputs/input"
import { useEffect, useState } from "react"
import { SelectData } from "../../../api/Requests/requests.route"
import { TransformSelectData } from "../../transformSelectData/TransformSelectData"
import { SelectOptionTypes } from "../../../components/types/Select/select"

interface ServiceType {
  id: number;
  selectedValue: string;
  quantity: number;
  serviceID?: string;
}

interface DynamicRequestsTypeProps {
  id: number;
  selectedValue: string;
  quantity: number;
onUpdate: (id: number, field: keyof ServiceType, name: string| number, value: string | number) => void;
  onDelete: (id: number) => void;
  setServicesSelect: React.Dispatch<React.SetStateAction<SelectOptionTypes[]>>;
  servicesSelect: SelectOptionTypes[];  
}


export const DynamicRequestsType: React.FC<DynamicRequestsTypeProps> = ({    
  id,
  selectedValue,
  quantity,
  onUpdate,
  servicesSelect,
  setServicesSelect,
  onDelete,  
  requestFormData,
  isEditMode,
  serviceTypes
}) => {    
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getSelectData = async () => {
            try {
                setIsLoading(true);
                const response = await SelectData({ type: 'services' });                
                const transformedData = TransformSelectData({type:'service', data: response});
                setServicesSelect(transformedData || []);                             
            } catch (error) {
                console.error('Error en: getSelectData', error);
            } finally {
                setIsLoading(false);
            }
        };
        getSelectData();
    }, [requestFormData]);

    return !isEditMode ? (
        <div className="grid grid-cols-[0.4fr_0.2fr_0.1fr] gap-4 w-[80%] items-center justify-center">
            <div className="flex flex-col">
                <Select
                    className="text-black"                    
                    options={servicesSelect}
                    value={servicesSelect.find(opt => opt.label === selectedValue)}
                    onChange={(option) => onUpdate(
                        id,
                        'selectedValue',  // field
                        option?.label??"",    // name (label)
                        option?.value??""     // value
                    )}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                />
            </div>

            <div>
                <Input                    
                    type="number"
                    className2={'w-full h-9'}
                    value={quantity}
                    onChange={(e) => onUpdate(id, 'quantity', Number(e.target.value), 'value')}
                />
            </div>

            <button
            type="button"
            onClick={() => onDelete(id)}
            disabled={serviceTypes.length === 1}
            className={`text-red-700 hover:text-red-500 disabled:text-gray-400 disabled:cursor-not-allowed`}
            >
            <Icon icon="material-symbols:delete" width="24" height="24" />
            </button>

        </div>

    ):null
    
}