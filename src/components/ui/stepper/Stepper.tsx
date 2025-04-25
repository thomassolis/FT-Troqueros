import { StepOne, StepTwo } from "./Steps";


export const stepConfig: Record<string, string[]> = {
    Cabezales: ["Datos Generales", "Motor", "Estructura", "Finalización"],
    Chasises: ["Información Básica", "Revisión Técnica", "Estado Final"],
    Furgones: ["Paso 1", "Paso 2", "Paso 3", "Paso 4"],
  };
  
  // 📌 Mapeo de los componentes de cada paso
  export const formSteps: Record<string, any[]> = {
    Cabezales: [StepOne, StepTwo],
    Chasis: [StepOne, StepTwo],
    Furgones: [StepTwo, StepOne],
  };
  