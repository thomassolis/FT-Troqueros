import { 
    UseFormRegister, 
    FieldErrors, 
    Control, 
    UseFormSetValue, 
    UseFormGetValues, 
    UseFormWatch 
  } from 'react-hook-form';

  export interface ProvidersFormValues {
    id_proveedor: string
    nombre: string;    
    personaContacto: string;  
    celular: string;  
    telefono: string;
    email: string;
    nombreCuenta:string;
    numeroCuenta: string;  
    persona_contacto: string;  
    
  }

export interface StepsProviders {
    register: UseFormRegister<ProvidersFormValues>;    
    setValue?: UseFormSetValue<ProvidersFormValues>;
    errors: FieldErrors<ProvidersFormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    control?:any
    providersData?:{
        nombre?: string;
        personaContacto?: string;
        celular?: string;    
        email?: string;        
        telefono?: string;      
        nombreCuenta?: string;     
        numeroCuenta?: string;     
        persona_contacto?: string;           
    }
    }    

    export interface StepsProvidersProps extends StepsProviders {
      // Props adicionales específicas del Paso 1
      customProp?: string;
    }