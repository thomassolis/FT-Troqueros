import { StepperFormDrivers } from "../../forms/DriversForm/StepperFormDrivers"
import { Back } from "../../ui/Back/Back"

export const DriversCreation = () =>{
    return(
        <section>
            <Back
                text={`CREACIÓN DE CONDUCTOR`}
                redirectTo="/home/Drivers"
            />
            <StepperFormDrivers/>
        </section>
    )
}