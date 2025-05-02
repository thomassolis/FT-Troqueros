import { PrevisualizationTable } from "../../ui/Tables/previsualizationTable";
import { Back } from "../../ui/Back/Back";
import { FilterSearch } from "../../ui/FilterSearch/FilterSearch";
import { Button } from "../../ui/buttons/button";
import { useNavigate } from "react-router-dom";

export const CurrentCustomers: React.FC = () => {      
    const navigate = useNavigate();
    return (
      <section className="mt-2 w-full flex flex-col items-center justify-center">          
        <div className="w-full flex justify-between">
          <Back text="Clientes Actuales"/>

          <Button 
            text={`Agregar Cliente`} 
            hoverBgColor="bg-[#1B5316]" 
            bgColor='bg-red-400'
            textColor="white" 
            className2={'w-[14%] font-bold'}
            onClick={() => {                
                navigate(`/home/Customers/create`);
            }} 
          />
        </div>
        
        <div className="w-[70%] flex flex-col items-center gap-5">
          <FilterSearch /*setSearchValue={setSearchValue}*//>
          <PrevisualizationTable headerTable={['Nombre', 'Tipo de Cliente', 'Persona de Contacto', 'Teléfono', 'Email', 'Último Pedido', 'Acciones']}/> 
        </div>          
      </section>
    );
  };
