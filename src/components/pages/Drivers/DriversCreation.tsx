import { StepperFormDrivers } from "../../forms/DriversForm/StepperFormDrivers"
import { Back } from "../../ui/Back/Back"
import { GetModuleFromURL } from "../../../functions/GetURL/GetURLInfo"
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo"
import { StepperFormProviders } from "../../forms/ProvidersForm/StepperFormProviders"
import { ServicesForm } from "../../forms/Services/servicesForm"
import { StepperFormRequests } from "../../forms/RequestsForm/StepperFormRequest"

export const DriversCreation = () =>{
    const module = GetModuleFromURL();
    const procedure = GetProcedureFromURL();
    return(
        <section>
            {module === 'Drivers' ? (
                <>
                    <Back

                        text={procedure === 'create'?`CREACIÓN DE CONDUCTOR`:'Edición DE CONDUCTOR'}                                                    
                        redirectTo="/home/Drivers"
                    />
                    <StepperFormDrivers/>
                </>
            ):module === 'Providers'? (
                <>
                    <Back
                        text={procedure === 'create'?`CREACIÓN DE Proveedor`:'Edición DE Proveedor'}
                        redirectTo="/home/Providers"
                    />
                    <StepperFormProviders/>
                </>
            ):module === 'Services' ? (
                <>
                    <Back
                        text={`CREACIÓN DE Servicio`}
                        redirectTo="/home/Services"
                    />
                    <ServicesForm/>
                </>
            ): module === 'Request' ? (
                <>
                    <Back
                        text={`CREACIÓN DE PETICIÓN`}
                        redirectTo="/home"
                    />
                    <StepperFormRequests/>
                </>
            ):(null)}            
        </section>
    )
}