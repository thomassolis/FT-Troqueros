import { StepOne, StepThree, StepTwo } from "../../forms/VehiclesForm/Steps";

export const stepConfig: Record<string, string[]> = {
    Cabezales: ["Datos Generales", "Información Básica", "Documentos"],
    Chasises: ["Datos Generales", "Información Básica", "Documentos"],
    Furgones: ["Datos Generales", "Información Básica", "Documentos"],
  };

  export const stepConfigCustomers: Record<string, string[]> = {
    Customers: ['Información de Empresa', 'Persona de Contacto', 'Contacto Financiero', 'Adjuntos']
  }
  
  // 📌 Mapeo de los componentes de cada paso
  export const formSteps: Record<string, any[]> = {
    Cabezales: [StepOne, StepTwo, StepThree],
    Chasis: [StepOne, StepTwo, StepThree],
    Furgones: [StepOne, StepTwo, StepThree],
  };
  