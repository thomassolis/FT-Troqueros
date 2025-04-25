import React from "react";
import { Input } from "../inputs/input";
import { InsertFiles } from "../Files/insertFiles";
import { SmallLabel } from "../Labels/smallLabel";
import { StepOneProps } from "../../types/VehiclesFormTypes";
import { StepStepTwoProps } from "../../types/VehiclesFormTypes";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

export const StepOne: React.FC<StepOneProps> = ({register, vehicleData, setValue}) => {  
  useEffect(() => {    
    // Verificación más explícita    
    if (vehicleData && setValue) {      
      setValue('placa', vehicleData.placa);
    }
  }, [vehicleData, setValue]);
  
  return (
    <div className="mt-14  " id="Step1">
      <p className="text-black mt-6 text-left">Llena el siguiente formulario para crear una nueva petición:</p>      
      <div className="flex gap-20 items-center w-full justify-center mt-12">
        <SmallLabel text="Número de placa:"/>        
        <Input 
          type="text" 
          className2={'py-5'}
          {...register('placa')}
          defaultValue={vehicleData?.placa || ''}          
        />
      </div>      
    </div>
  );
};

export const StepTwo: React.FC<StepStepTwoProps> = ({register, vehicleData, setValue}) => {
  const convertirFechaString = (fecha: string) => {
    if (!fecha) return ''; // por si acaso viene vacío
    const [dia, mes, anio] = fecha.split('/');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };
  
  useEffect(() => {
    if (vehicleData && setValue) {
      setValue('numPoliza', vehicleData.numero_poliza);
  
      if (vehicleData.fecha_expedicion_poliza) {
        setValue('fechaExpedicion', convertirFechaString(vehicleData.fecha_expedicion_poliza));
      }
      if (vehicleData.fecha_caducidad_poliza) {
        setValue('fechaCaducidad', convertirFechaString(vehicleData.fecha_caducidad_poliza));
      }
      if (vehicleData.fecha_ultimo_revisado) {
        setValue('fechaUltRevisado', convertirFechaString(vehicleData.fecha_ultimo_revisado));
      }
      if (vehicleData.fecha_renovacion_revisado) {
        setValue('fechaRenovacion', convertirFechaString(vehicleData.fecha_renovacion_revisado));
      }
    }
  }, [vehicleData, setValue]);
  
  return (
    <section id="Step2 w-full">
      <h1 className="text-black mt-6 ml-6">Complete la documentación del nuevo chasis</h1>      

        <div className="mt-1 ml-6 flex flex-col items-center">      

          <div className="flex flex-col w-[70%] ">
            <div className="flex gap-20 items-center w-full justify-center mt-12">
              <SmallLabel text='Número de póliza del vehículo'/>
              <Input 
                type="string" 
                className2={'py-5'}                
                {...register('numPoliza')}                   
              />
            </div>      

            <div className="flex gap-20 items-center w-full justify-center mt-12">
              <SmallLabel text='Fecha de expedición de póliza'/>
              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaExpedicion')}
                
                />
            </div>      

            <div className="flex gap-20 items-center w-full justify-center mt-12">
              <SmallLabel text='Fecha de caducidad de póliza'/>
              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaCaducidad')}
                />
            </div>

            <div className="flex gap-20 items-center w-full justify-center mt-12">
              <SmallLabel text='Fecha de último revisado'/>
              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaUltRevisado')}
                />
            </div>  

            <div className="flex gap-20 items-center w-full justify-center mt-12">
              <SmallLabel text='Fecha de renovación de revisado'/>
              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaRenovacion')}
                />
            </div>            
          </div>      
      </div>
    </section>    
  );
};

export const StepThree: React.FC<StepOneProps> = ({vehicleType}) => {
  return(
    <section id="Step3" >
      <h1 className="text-black mt-6 ml-6 items-center">Adjunto de documentos</h1>      

      <div className="mt-1 ml-6 flex flex-col items-center">      

        <div className="flex flex-col w-full">    

          <div className="flex gap-20 items-center w-full justify-center mt-12">
            <label htmlFor="nombre" className="text-black ">Adjunto de póliza del chasis</label>            
            <InsertFiles/>
          </div>
          
          <div className="flex gap-20 items-center w-full justify-center mt-12">
            <label htmlFor="nombre" className="text-black ">Adjunto de revisado del chasis</label>
            <InsertFiles/>
          </div>

        </div>      
      </div>
    </section>
  )
}