import { StepOne, StepThree, StepTwo } from "../../forms/VehiclesForm/Steps";

export const stepConfig: Record<string, string[]> = {
    Cabezales: ["Datos Generales", "Información Básica", "Documentos"],
    Chasises: ["Datos Generales", "Información Básica", "Documentos"],
    Furgones: ["Datos Generales", "Información Básica", "Documentos"],
  };

  export const stepConfigCustomers: Record<string, string[]> = {
    Customers: ['Información de Empresa', 'Persona de Contacto', 'Datos Bancarios', 'Adjuntos']
  }

  export const stepConfigDrivers: Record<string, string[]> = {
    Drivers: ['Información del Conductor', 'Información de Contacto', 'Documentos']
  }

  export const stepConfigProviders: Record<string, string[]> = {
    Providers: ['Información General', 'Información de Contacto', 'Datos Bancarios']
  }

  export const stepConfigRequests: Record<string, string[]> = {
    Request: ['Información General', 'Información de Proveedor', 'Selección de Servicio', 'Selección de Equipo', 'Tarifa']
  }
  
  // 📌 Mapeo de los componentes de cada paso
  export const formSteps: Record<string, any[]> = {
    Cabezales: [StepOne, StepTwo, StepThree],
    Chasis: [StepOne, StepTwo, StepThree],
    Furgones: [StepOne, StepTwo, StepThree],
  };
  