import { 
    UseFormRegister, 
    FieldErrors, 
    Control, 
    UseFormSetValue, 
    UseFormGetValues, 
    UseFormWatch 
  } from 'react-hook-form';
  
  // Interface para los valores del formulario
  export interface FormValues {
    placa: string;
    fechaRenovacion: string;
    fechaCaducidad: string;
    fechaExpedicion: string;
    numPoliza: string;
    fechaUltRevisado:string;
    foto_revisado?:string;
    foto_poliza?:string;
  }
  
  // Props base que reciben todos los pasos
  export interface StepOne {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    control?:any;
    setValue?: UseFormSetValue<FormValues>;
    getValues?: UseFormGetValues<FormValues>;
    watch?: UseFormWatch<FormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    setPdfFile? :[]
    vehicleData: {
      placa?: string;
      foto_revisado?: string;
      foto_poliza?: string;
    }

    vehicleType: 'Cabezales' | 'Chasises' | 'Furgones'
  }

  export interface StepOneProps extends StepOne {
    // Props adicionales específicas del Paso 1
    customProp?: string;
  }

  export interface StepTwo {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    control?: Control<FormValues>;
    setValue?: UseFormSetValue<FormValues>;
    getValues?: UseFormGetValues<FormValues>;
    watch?: UseFormWatch<FormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    vehicleData: {
      numero_poliza?: string,
      fecha_expedicion_poliza?: string,
      fecha_caducidad_poliza?:string,
      fecha_renovacion_revisado?:string,
      fecha_ultimo_revisado?:string      
    }

    // --
    vehicleType: 'Cabezales' | 'Chasises' | 'Furgones'
  }
  
  // Props específicas para el Paso 1
  export interface StepStepTwoProps extends StepTwo {
    // Props adicionales específicas del Paso 1
    customProp?: string;
  }