import { StepperForm } from "../../../forms/VehiclesForm/StepperForm";
import { Back } from "../../../ui/Back/Back";
import { useContext } from "react";
import { vehicleTypeContext } from "../../../../context/vehicleType/vehicleType";
import { changeVehicleValue } from "../../../../functions/changeVehicleType/changeVehicleType";
import { StepperFormCustomers } from "../../../forms/CustomersForm/StepperFormCustomers";
import { GetModuleFromURL } from "../../../../functions/GetURL/GetURLInfo";
import { GetProcedureFromURL } from "../../../../functions/GetURL/GetURLInfo";

export const  ChasisCreation = () => {    
  const {vehicleType} = useContext(vehicleTypeContext)!;
    
  const module = GetModuleFromURL();
  const procedure = GetProcedureFromURL();
  const vehicle = changeVehicleValue(vehicleType)

  return (
    <section className="flex flex-col">

{
  module === "Customers" ? (
    procedure === 'modify' ? (
      <Back text={`EDICIÓN DE CLIENTE`} className2="mb-12 ml-6" />
    ) : procedure === 'create' ? (
      <Back text={`CREACIÓN DE CLIENTE`} className2="mb-12 ml-6" />
    ) : null
  ) : module === "Chasises" || module === "Furgones" || module === "Cabezales" ? (
    procedure === 'modify' ? (
      <Back text={`EDICIÓN DE ${vehicle}`} className2="mb-12 ml-6" />
    ): procedure === 'create' ? (
      <Back text={`CREACIÓN DE ${vehicle}`} className2="mb-12 ml-6" />
    ): null
  ):null
}



      <div>
        {module === 'Customers' ? (
          <StepperFormCustomers/>
        ):(
          <StepperForm selectedOption = {vehicleType}/>
        )}        
      </div>      
      
    </section>    
  );
}
