import { useState, useContext, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { StepOne, StepTwo, StepThree } from "./Steps";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FormValues } from "../../types/forms/VehicleForm/VehiclesFormTypes";
import { sendDataForCreation, sendDataForUpdate, getVehicleData } from "../../../api/Vehicles/vehicles.routes";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";

interface StepperFormProps {
  selectedOption: 'Cabezales' | 'Chasises' | 'Furgones';
}

type StepField =
  | "placa"
  | "fechaRenovacion"
  | "fechaCaducidad"
  | "fechaExpedicion"
  | "numPoliza"
  | "fechaUltRevisado";

export const StepperForm = ({ selectedOption }: StepperFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>({});
  const { vehicleType } = useContext(vehicleTypeContext)!;
  const { vehicleID } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const currentAction = pathSegments[pathSegments.length - 1];

  const navigate = useNavigate();

  // Form
  const methods = useForm<FormValues>({
    defaultValues: {
      placa: "",
      fechaRenovacion: undefined,
      fechaCaducidad: undefined,
      fechaExpedicion: undefined,
      numPoliza: undefined,
      fechaUltRevisado: undefined,      
      foto_poliza: undefined,
      foto_revisado: undefined,
    }
  });

  const {
    register,
    handleSubmit,
    trigger,    
    formState: { errors },
    setValue,    
    control,
    reset
  } = methods;

  // Cargar datos si estamos editando
  useEffect(() => {
    if (vehicleID) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const data = await getVehicleData({ vehicleType, vehicleID });
          
          setVehicleData(data);
        } catch (error) {
          console.error('Error fetching vehicle data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [vehicleID]);

  // Resetear formulario con los datos precargados
  useEffect(() => {
    if (currentAction === 'modify' && vehicleData && Object.keys(vehicleData).length > 0) {
      reset({
        placa: vehicleData.placa ?? "",
        fechaRenovacion: vehicleData.fecha_renovacion_revisado ?? null,
        fechaCaducidad: vehicleData.fecha_caducidad_poliza ?? null,
        fechaExpedicion: vehicleData.fecha_expedicion_poliza ?? null,
        numPoliza: vehicleData.numero_poliza ?? null,
        fechaUltRevisado: vehicleData.fecha_ultimo_revisado ?? null,        
      });
    }
  }, [vehicleData]);

  const stepFields = {
    Cabezales: [["deliveryDate", "campoStep1_2"], ["campoStep2_1", "campoStep2_2"], ["campoStep4_1", "campoStep4_2"]],
    Chasises: [["deliveryDate", "campoStep1_2"], ["campoStep2_1", "campoStep2_2"], ["campoStep3_1", "campoStep3_2"]],
    Furgones: [["deliveryDate", "campoStep2_2"], ["campoStep1_1", "campoStep1_2"], ["campoStep3_1", "campoStep3_2"]],
  };

  const nextStep = async () => {
    const currentFields = stepFields[selectedOption]?.[activeStep] as StepField[] || [];
    const isStepValid = await trigger(currentFields);
    if (isStepValid) setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try{
      setIsLoading(true);
      const response =
        currentAction === 'create'
          ? await sendDataForCreation({ data, vehicleType })
          : await sendDataForUpdate({ data, vehicleType, vehicleID });

      if (response.success) {
        navigate('/home/Vehicles');
      }

      setIsLoading(false);
    }catch(error){
      console.error('Error en onSubmit de vehiculos: ', error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center w-full" id="InicioDeFormulario">
      <StepperLine selectedOption={selectedOption} step={activeStep} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
          <div className="w-[85%]">
            {activeStep === 0 && (
              <StepOne
                register={register}
                setValue={setValue}
                errors={errors}
                vehicleType={vehicleType}
                vehicleData={vehicleData}
              />
            )}

            {activeStep === 1 && (
              <StepTwo
                register={register}
                setValue={setValue}
                errors={errors}
                control={control}
                vehicleType={vehicleType}
                vehicleData={vehicleData}
              />
            )}

            {activeStep === 2 && (
              <StepThree
                register={register}
                setValue={setValue}
                errors={errors}
                control={control}
                vehicleType={vehicleType}
                vehicleData={vehicleData}
              />
            )}
          </div>

          <div className="w-[90%] flex items-center justify-between mt-12">
            <div className="w-[10%] flex">
              <Button
                onClick={prevStep}
                className2="p-2 w-full"
                text="Atrás"
                bgColor="bg-red-600"
                textColor="text-white"
              />
            </div>

            <div className="w-[10%] flex">
              {activeStep < stepFields[selectedOption]?.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className2="p-2 w-full"
                  text="Siguiente"
                  bgColor="bg-[#1B5316]"
                  textColor="text-white"
                />
              ) : (
                <Button
                  type="submit"
                  className2="bg-green-500 p-2 w-full flex items-center justify-center"
                  isLoading={isLoading}
                  text={
                    isLoading ? (
                      <>
                        <Icon icon="line-md:loading-loop" width="16" height="16" className="mr-2" />
                        Enviando...
                      </>
                    ) : "Enviar"
                  }
                />
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
