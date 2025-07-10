import { Button } from "../buttons/button"
import { Input } from "../inputs/input"
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { searchValueContext } from "../../../context/searchValueForFilter/searchValue";
import Select from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface FilterSearchProps{
    vehicleType?: string | null | undefined
    selectedOption: SelectOption | null;
    setSelectedOption: React.Dispatch<React.SetStateAction<SelectOption | null>>;
}
interface submitData {
    id_chasis: string    
}

export const FilterSearch = ({vehicleType, selectedOption, setSelectedOption}:FilterSearchProps) =>{
        const { handleSubmit, formState: { errors } } = useForm<submitData>();
        const location = useLocation();
        const pathSegments = location.pathname.split('/').filter(Boolean); 
        const lastSegment = pathSegments[pathSegments.length - 1];    
        const {searchValue, setSearchValue} = useContext(searchValueContext)!;

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {                        
                setSearchValue(event.target.value);                         
        };   
        const onSubmit: SubmitHandler<submitData> = (data) => {            
        };        
    return(
        <div className="flex">

                {lastSegment === 'home' ? (
                    <Select
                        options={[
                            {value: 'id', label: 'ID'}, 
                            {value: 'nameService', label: 'Servicio'}, 
                            {value: 'nameDriver', label: 'Conductor'}, 
                            {value: 'nameCustomer', label: 'Cliente'}
                        ]}  
                                               
                        className="text-black max-w-[35%] min-w-[20%]"        
                        value={selectedOption} // Valor controlado por estado
                        onChange={(optionselected)=>{setSelectedOption(optionselected)}}                                       
                        styles={{
                            control: (base) => ({                                
                            ...base,
                            borderRadius: 0,
                            borderColor: 'gray',
                            padding: '2px',
                            color: 'black'
                            }),
                            singleValue: (base) => ({
                            ...base,
                            color: 'black'
                            }),
                            menu: (base) => ({
                            ...base,
                            zIndex: 9999, // Valor alto para asegurar que esté por encima
                            marginTop: '2px' // Espacio entre el control y el menú
                            }),
                            menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999 // Necesario si usas menuPortalTarget
                            })
                        }}
                    />
                ): (
                    <div className="flex w-[8%] px-12  items-center justify-center py-2 border border-gray-400 bg-white">
                        <h1 className="text-black">
                            {lastSegment === 'Customers'||lastSegment==='Drivers'||lastSegment==='Services'||lastSegment==='Providers' ? (
                                'Nombre'
                                ):lastSegment === 'Vehicles' ? (
                                    'Placa'
                                ):''

                            }                        
                        </h1>
                    </div>
                )

                }

                <form onSubmit={handleSubmit(onSubmit)} className="flex">
                <div className="">                   
                        <Input 
                            type="text" 
                            placeholder=
                                {lastSegment === 'Customers' ? (
                                    `Buscar cliente por nombre`
                                ): lastSegment === 'Vehicles' ? (
                                    `Buscar ${vehicleType} por número de placa`
                                ): lastSegment === 'Drivers' ? (
                                    `Buscar Conductor por Nombre`
                                ):lastSegment === 'home' ? (
                                    `Buscar Petición por ${selectedOption?.label}`
                                ):''
                            }                                
                            
                            className2={"py-5 rounded-none border border-gray-400"}
                            onChange={handleInputChange}                                
                        />
                    
                </div>                

                <div className="">

                {lastSegment != 'home' ? (
                    <Button 
                        type="submit" 
                        text="Buscar" 
                        bgColor="bg-gray-200" 
                        className2={"py-2 rounded-none border border-gray-400"}                         
                    />
                ): null
                }                            



                </div>
            </form>
        </div>                        
    )
}