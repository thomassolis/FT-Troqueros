import { StepperForm } from "../../../ui/stepper/StepperForm";
import { Back } from "../../../ui/Back/Back";
import { useContext } from "react";
import { vehicleTypeContext } from "../../../../context/vehicleType/vehicleType";

export const  ChasisCreation = () => {    
  const {vehicleType, setVehicleType} = useContext(vehicleTypeContext)!;
  return (
    <section className="flex flex-col">
      <Back text="CREACIÓN DE CHASIS" className2="mb-12 ml-6"/>      
      <div>
        <StepperForm selectedOption = {vehicleType}/>
      </div>      
      
    </section>    
  );
}
