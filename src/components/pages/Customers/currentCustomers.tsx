import { PrevisualizationTable } from "../../ui/Tables/previsualizationTable";
import { Back } from "../../ui/Back/Back";
import { FilterSearch } from "../../ui/FilterSearch/FilterSearch";
import { Button } from "../../ui/buttons/button";
import { useNavigate } from "react-router-dom";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo"
import { ServicesTableManagement } from "../Services/ServicesFather";

export const CurrentCustomers: React.FC = () => {      
    const navigate = useNavigate();
    const module = GetProcedureFromURL();


    // Definir el texto y la acción antes del retorno del JSX
    const buttonText = module === 'Customers' ? 'Agregar Cliente' :module ==='Drivers'? 'Agregar Conductor':module === 'Services'? 'Agregar Servicio':module === 'Providers'? 'Agregar Proveedor':null;
    const handleClick = () => {
        if (module === 'Customers') {
            navigate(`/home/Customers/create`);
        } else if (module === 'Drivers'){
            navigate(`/home/Drivers/create`);
        }else if (module === 'Services'){
            navigate(`/home/Services/create`);
        }else if (module === 'Providers'){
            navigate(`/home/Providers/create`);
        }
    };

    return (
      <section className="mt-2 w-full flex flex-col items-center justify-center">          
        <div className="w-[95%] flex justify-between">

          <div className="w-[50%]">
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
            ): module === 'Services' ? (
              <Back 
                text="Servicios Actuales"
                redirectTo="/home"
              />
            ):module === 'Providers'?(
              <Back 
                text="Proveedores Actuales"
                redirectTo="/home"
              />
            ):(null)
            }            
          </div>          

          <div className="w-[20%]">
            <Button               
              text={buttonText} 
              onClick={handleClick}              
              bgColor='bg-[#1B5316]'
              textColor="white" 
              className2={'font-bold'}
            />
          </div>          
        </div>
        
        <div className="w-[70%] flex flex-col items-center gap-5">
          <FilterSearch />

          {module === 'Customers' ? (
            <PrevisualizationTable 
              headerTable={['Nombre', 'Persona de Contacto', 'Teléfono', 'Email', 'Último Pedido', 'Acciones']}              
            /> 
          ): module === 'Drivers' ? (
            <PrevisualizationTable 
              headerTable={['Nombre', 'Cédula', 'Email', 'Teléfono', 'STATUS', 'Acciones']}              
            /> 
          ): module === 'Services' ? (                                  
              <ServicesTableManagement module = {module}/>      
          ): module === 'Providers' ? (
            <PrevisualizationTable 
              headerTable={['Nombre', 'Persona de Contacto', 'Celular','Teléfono','Email', 'Acciones']}              
            /> 
          ):null
          }          
        </div>          
      </section>
    );
  };
