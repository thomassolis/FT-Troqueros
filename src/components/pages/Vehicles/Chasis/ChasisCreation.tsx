import { StepperLine } from "../../../ui/stepper/Stepper";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Back } from "../../../ui/Back/Back";
export const  ChasisCreation = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col">
      <Back text="CREACIÓN DE CHASIS"/>
      <div>
        <StepperLine/>
      </div>      
    </section>    
  );
}
