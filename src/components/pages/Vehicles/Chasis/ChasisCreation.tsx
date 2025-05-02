import { StepperForm } from "../../../forms/VehiclesForm/StepperForm";
import { Back } from "../../../ui/Back/Back";
import { useContext } from "react";
import { vehicleTypeContext } from "../../../../context/vehicleType/vehicleType";
import { useLocation } from "react-router-dom";
import { changeVehicleValue } from "../../../../functions/changeVehicleType/changeVehicleType";
import { StepperFormCustomers } from "../../../forms/CustomersForm/StepperFormCustomers";
export const  ChasisCreation = () => {    
  const {vehicleType, setVehicleType} = useContext(vehicleTypeContext)!;
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean); 
  const moduleType = pathSegments[pathSegments.length - 2];
  const lastSegment = pathSegments[pathSegments.length - 1];
console.log('moduleType: ',moduleType)
  const vehicle = changeVehicleValue(vehicleType)

  return (
    <section className="flex flex-col">
      {lastSegment && lastSegment==='modify' ? (
        <Back text={`EDICIÓN DE ${vehicle}`} className2="mb-12 ml-6"/>      
      ):(
        <Back text={`CREACIÓN DE ${vehicle}`} className2="mb-12 ml-6"/>      
      )}      
      <div>
        {moduleType === 'Customers' ? (
          <StepperFormCustomers/>          
        ):(
          <StepperForm selectedOption = {vehicleType}/>
        )}        
      </div>      
      
    </section>    
  );
}
