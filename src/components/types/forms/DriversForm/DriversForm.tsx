import { 
    UseFormRegister, 
    FieldErrors,     
    UseFormSetValue,     
  } from 'react-hook-form';

  export interface DriversFormValues {
    nombre: string;
    apellido: string;
    cedula: string;  
    tipo_licencia: string;  
    telefono: string;
    email: string;
    pass: string; 
  }

export interface StepsDrivers {
    register: UseFormRegister<DriversFormValues>;    
    setValue?: UseFormSetValue<DriversFormValues>;
    errors: FieldErrors<DriversFormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    control?:any
    driversData?:{
        nombre?: string;
        apellido?: string;
        cedula?: string;    
        email?: string;
        pass?: string;
        telefono?: string;
        tipo_licencia?:string;   
    }
    }    

    export interface StepsDriversProps extends StepsDrivers {
      // Props adicionales específicas del Paso 1
      customProp?: string;
    }