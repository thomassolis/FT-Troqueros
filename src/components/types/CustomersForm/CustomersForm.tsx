import { 
    UseFormRegister, 
    FieldErrors, 
    Control, 
    UseFormSetValue, 
    UseFormGetValues, 
    UseFormWatch 
  } from 'react-hook-form';

  export interface FormValues {
    nombre: string;
    ruc: string;
    direccion: string;    
    nombrePersonaContacto: string;
    TelPersonaContacto: string;
    emailPersonaContacto: string;
  }

export interface StepOneCustomers {
    register: UseFormRegister<FormValues>;    
    setValue?: UseFormSetValue<FormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    setPdfFile? :[]
    vehicleData: {
      placa: string    
    }    
  }

    export interface StepOneCustomerProps extends StepOneCustomers {
      // Props adicionales específicas del Paso 1
      customProp?: string;
    }