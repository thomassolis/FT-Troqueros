import React from "react";
import { Input } from "../../ui/inputs/input";
import { InsertFiles } from "../../ui/Files/insertFiles";
import { SmallLabel } from "../../ui/Labels/smallLabel";
import { StepOneProps } from "../../types/forms/VehicleForm/VehiclesFormTypes";
import { StepStepTwoProps } from "../../types/forms/VehicleForm/VehiclesFormTypes";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";
import { useContext } from "react";
import { changeVehicleValue } from "../../../functions/changeVehicleType/changeVehicleType";

export const StepOne: React.FC<StepOneProps> = ({register, vehicleData, setValue, errors}) => {  
  const {vehicleType} = useContext(vehicleTypeContext)!;
  const vehicle = changeVehicleValue(vehicleType);

  useEffect(() => {    
    if (vehicleData && setValue && vehicleData.placa) {      
      setValue('placa', vehicleData.placa);
    }
  }, [vehicleData, setValue]);
  
  
  return (
    <div className="" id="Step1">
      <h1 className="text-black mt-10 ml-6 text-lg font-semibold">{`Llena el siguiente formulario para crear el nuevo ${vehicle} `}</h1>      

      <div className="flex gap-20 items-center w-full justify-center mt-12">
        <SmallLabel text="Número de placa: " />        

        <div className="gap-5 flex items-center">
          <Input 
            type="text"                   
            className2={'py-5'}
            {...register('placa', { required: "Required" })} 
          />
          {errors.placa && (
            <span className="text-red-500">{errors.placa.message}</span>
          )}
        </div>        
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
      setValue('numPoliza', vehicleData.numero_poliza ?? '');
  
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
      <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete la documentación del nuevo chasis</h1>      

        <div className="mt-1 ml-6 flex flex-col items-center">      

          <div className="flex w-[70%]">
            <div className="flex flex-col gap-12 items-start w-full  mt-12 ">
              <div className="h-10 flex items-center">
                <SmallLabel text='Número de póliza del vehículo'/>
              </div>
              
              <div className="h-10 flex items-center">
                <SmallLabel text='Fecha de expedición de póliza'/>
              </div>              

              <div className="h-10 flex items-center">
                <SmallLabel text='Fecha de caducidad de póliza'/>
              </div>              

              <div className="h-10 flex items-center">
                <SmallLabel text='Fecha de último revisado'/>
              </div>              

              <div className="h-10 flex items-center">
                <SmallLabel text='Fecha de renovación de revisado'/>
              </div>              
            </div>      

            <div className="flex flex-col gap-12 items-center w-full justify-center mt-12 ">
              <div className="h-10">
              <Input 
                type="string" 
                className2={'py-5'}                
                {...register('numPoliza')}                   
              />
              </div>            


              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaExpedicion')}
                
              />

              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaCaducidad')}
              />

              <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaUltRevisado')}
                />

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

export const StepThree: React.FC<StepOneProps> = ({register, setValue, vehicleData, control}) => {

  const procedure = GetProcedureFromURL();
  const {vehicleType} = useContext(vehicleTypeContext)!;

  const vehicle = changeVehicleValue(vehicleType);
  

  return(
    <section id="Step3" >
      <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Adjunto de documentos</h1>      

      <div className="mt-1 ml-6 flex flex-col items-center">      

        <div className="flex flex-col w-full">    

          <div className="flex gap-20 items-center w-full justify-center mt-12">
            <label htmlFor="nombre" className="text-black ">{`Adjunto de póliza del ${vehicle}`}</label>            
              <Controller
                  name="foto_poliza"
                  control={control}                  
                  render={({ field }) => (
                      <InsertFiles
                          files={procedure === 'modify' ? (Array.isArray(vehicleData.foto_poliza) ? vehicleData.foto_poliza : []) : []}
                          procedure={procedure}
                          onFileReady={(file, name) => field.onChange(file)}
                          fileName={field.name}
                      />
                  )}
              />
          </div>
          
          <div className="flex gap-20 items-center w-full justify-center mt-12">
            <label htmlFor="nombre" className="text-black ">{`Adjunto de revisado del ${vehicle}`}</label>
              <Controller
                  name="foto_revisado"
                  control={control}
                  render={({ field }) => (
                      <InsertFiles
                          files={procedure === 'modify' ? (Array.isArray(vehicleData.foto_revisado) ? vehicleData.foto_revisado : []) : []}
                          procedure={procedure}
                          onFileReady={(file, name) => field.onChange(file)}
                          fileName={field.name}
                      />
                  )}
              />
          </div>

        </div>      
      </div>
    </section>
  )
}