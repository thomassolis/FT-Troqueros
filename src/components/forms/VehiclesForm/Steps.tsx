import React from "react";
import { Input } from "../../ui/inputs/input";
import { InsertFiles } from "../../ui/Files/insertFiles";
import { SmallLabel } from "../../ui/Labels/smallLabel";
import { StepOneProps } from "../../types/forms/VehicleForm/VehiclesFormTypes";
import { StepStepTwoProps } from "../../types/forms/VehicleForm/VehiclesFormTypes";
import { Controller } from "react-hook-form";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";
import { useContext } from "react";
import { changeVehicleValue } from "../../../functions/changeVehicleType/changeVehicleType";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const StepOne: React.FC<StepOneProps> = ({register, errors}) => {  
  const {vehicleType} = useContext(vehicleTypeContext)!;
  const vehicle = changeVehicleValue(vehicleType);

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

export const StepTwo: React.FC<StepStepTwoProps> = ({register, control, errors}) => {
  
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
                type="text" 
                className2={'py-5'}                
                {...register('numPoliza')}                   
              />
              </div>            

              <Controller
                name="fechaExpedicion"
                control={control}                
                render={({ field }) => {
                  // 👇 Convertir el valor del formulario a un objeto `dayjs` (acepta ambos formatos)
                  const parsedDate = field.value
                    ? dayjs(
                        field.value,
                        field.value.includes('/') ? 'DD/MM/YYYY' : 'YYYY-MM-DD'
                      )
                    : null;

                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} sx={{ width: '100%' }}>
                        <DatePicker
                          label="Selecciona una fecha"
                          format="DD/MM/YYYY"
                          value={parsedDate}
                          onChange={(date) => {
                            // 👇 Guardar siempre en formato YYYY-MM-DD
                            const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
                            field.onChange(formattedDate);
                          }}
                          slotProps={{
                            textField: {
                              error: !!errors.fechaExpedicion,
                              helperText: errors.fechaExpedicion?.message,
                              sx: { backgroundColor: 'white' },
                              fullWidth: true,
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  );
                }}
              />

              <Controller
                name="fechaCaducidad"
                control={control}                
                render={({ field }) => {
                  // 👇 Convertir el valor del formulario a un objeto `dayjs` (acepta ambos formatos)
                  const parsedDate = field.value
                    ? dayjs(
                        field.value,
                        field.value.includes('/') ? 'DD/MM/YYYY' : 'YYYY-MM-DD'
                      )
                    : null;

                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} sx={{ width: '100%' }}>
                        <DatePicker
                          label="Selecciona una fecha"
                          format="DD/MM/YYYY"
                          value={parsedDate}
                          onChange={(date) => {
                            // 👇 Guardar siempre en formato YYYY-MM-DD
                            const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
                            field.onChange(formattedDate);
                          }}
                          slotProps={{
                            textField: {
                              error: !!errors.fechaExpedicion,
                              helperText: errors.fechaExpedicion?.message,
                              sx: { backgroundColor: 'white' },
                              fullWidth: true,
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  );
                }}
              />

              <Controller
                name="fechaUltRevisado"
                control={control}                
                render={({ field }) => {
                  // 👇 Convertir el valor del formulario a un objeto `dayjs` (acepta ambos formatos)
                  const parsedDate = field.value
                    ? dayjs(
                        field.value,
                        field.value.includes('/') ? 'DD/MM/YYYY' : 'YYYY-MM-DD'
                      )
                    : null;

                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} sx={{ width: '100%' }}>
                        <DatePicker
                          label="Selecciona una fecha"
                          format="DD/MM/YYYY"
                          value={parsedDate}
                          onChange={(date) => {
                            // 👇 Guardar siempre en formato YYYY-MM-DD
                            const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
                            field.onChange(formattedDate);
                          }}
                          slotProps={{
                            textField: {
                              error: !!errors.fechaExpedicion,
                              helperText: errors.fechaExpedicion?.message,
                              sx: { backgroundColor: 'white' },
                              fullWidth: true,
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  );
                }}
              />

              <Controller
                name="fechaRenovacion"
                control={control}                
                render={({ field }) => {
                  // 👇 Convertir el valor del formulario a un objeto `dayjs` (acepta ambos formatos)
                  const parsedDate = field.value
                    ? dayjs(
                        field.value,
                        field.value.includes('/') ? 'DD/MM/YYYY' : 'YYYY-MM-DD'
                      )
                    : null;

                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} sx={{ width: '100%' }}>
                        <DatePicker
                          label="Selecciona una fecha"
                          format="DD/MM/YYYY"
                          value={parsedDate}
                          onChange={(date) => {
                            // 👇 Guardar siempre en formato YYYY-MM-DD
                            const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
                            field.onChange(formattedDate);
                          }}
                          slotProps={{
                            textField: {
                              error: !!errors.fechaExpedicion,
                              helperText: errors.fechaExpedicion?.message,
                              sx: { backgroundColor: 'white' },
                              fullWidth: true,
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  );
                }}
              />


            {/* <Input 
                type="date" 
                className2={'py-5'}                
                {...register('fechaRenovacion')}
                /> */}
            </div>
          </div>      
      </div>
    </section>    
  );
};

export const StepThree: React.FC<StepOneProps> = ({vehicleData, control}) => {

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
                          onFileReady={(file) => field.onChange(file)}
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
                          onFileReady={(file) => field.onChange(file)}
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