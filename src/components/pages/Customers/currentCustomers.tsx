import { PrevisualizationTable } from "../../ui/Tables/previsualizationTable";
import { Back } from "../../ui/Back/Back";
import { FilterSearch } from "../../ui/FilterSearch/FilterSearch";
import { Button } from "../../ui/buttons/button";
import { useNavigate } from "react-router-dom";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { useEffect } from "react";

export const CurrentCustomers: React.FC = () => {      
    const navigate = useNavigate();
    const module = GetProcedureFromURL();

    // Definir el texto y la acción antes del retorno del JSX
    const buttonText = module === 'Customers' ? 'Agregar Cliente' : 'Agregar Conductor';
    const handleClick = () => {
        if (module === 'Customers') {
            navigate(`/home/Customers/create`);
        } else {
            navigate(`/home/Drivers/create`);
        }
    };

    return (
      <section className="mt-2 w-full flex flex-col items-center justify-center">          
        <div className="w-[95%] flex justify-between">

          <div className="w-[40%]">
            {module === 'Customers'?(
              <Back 
                text="Clientes Actuales"
                redirectTo="/home"
              />
            ): module === 'Drivers' ? (
              <Back 
                text="Conductores Actuales"
                redirectTo="/home"
              />
            ): (null)
            }            
          </div>          

          <div className="w-[20%]">
            <Button               
              text={buttonText} 
              onClick={handleClick}
              hoverBgColor="bg-[#1B5316]" 
              bgColor='bg-red-400'
              textColor="white" 
              className2={'font-bold'}
            />
          </div>          
        </div>
        
        <div className="w-[70%] flex flex-col items-center gap-5">
          <FilterSearch /*setSearchValue={setSearchValue}*//>

          {module === 'Customers' ? (
            <PrevisualizationTable 
              headerTable={['Nombre', 'Tipo de Cliente', 'Persona de Contacto', 'Teléfono', 'Email', 'Último Pedido', 'Acciones']}              
            /> 
          ): module === 'Drivers' ? (
            <PrevisualizationTable 
              headerTable={['Nombre', 'Cédula', 'Teléfono', 'Email', 'Status', 'Acciones']}              
            /> 
          ): null
          }          
        </div>          
      </section>
    );
  };
