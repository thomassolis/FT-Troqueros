import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { Step1, Step2, Step3 } from "./Steps/DriversSteps";
import { DriversFormValues } from "../../types/forms/DriversForm/DriversForm";
import { GetDriversDataByID } from "../../../api/Drivers/Drivers.route";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { SendDataForNewDriver, sendDataForUpdateDrivers } from "../../../api/Drivers/Drivers.route";

export const StepperFormDrivers = () => {
  // const name: string = 123; // ❌ number asignado a string

  const [driversData, setDriversData] = useState<any>({});
  const { driverID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const methods = useForm<DriversFormValues>({
    defaultValues: {
      nombre: "",
      cedula: "",      
      telefono: "",
      email: "",            
    }
  });

  const {
    register,
    handleSubmit,
    trigger,    
    formState: { errors },
    setValue,    
    control,
    reset,
  } = methods;

  // Cargar datos del chofer si se está editando
  useEffect(() => {
    if (driverID) {
      setIsLoading(true);
      const fetchDriverData = async () => {
        try {
          const response = await GetDriversDataByID({ driverID });
          setDriversData(response);
        } catch (error) {
          console.error("Error al obtener datos del chofer", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDriverData();
    }
  }, [driverID]);

  // Usar reset cuando llegan los datos
  useEffect(() => {
    if (procedure === "modify" && driversData && Object.keys(driversData).length > 0) {
      reset({
        nombre: driversData.nombre ?? "",
        cedula: driversData.cedula ?? "",        
        telefono: driversData.telefono ?? "",
        email: driversData.email ?? "",
        apellido: driversData.apellido ?? "",
        tipo_licencia: driversData.tipo_licencia ?? "",                
      });
    }
  }, [driversData]);

  // Validación y envío
  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const onSubmit = async (data: DriversFormValues) => {
    try{
      setIsLoading(true);

      const response = procedure === "create"
        ? await SendDataForNewDriver({ data })
        : await sendDataForUpdateDrivers({ data, driverID });

      if (response.success) {
        navigate("/home/Drivers");
      }

      setIsLoading(false);
    }catch(error){
      console.error('error en onSubmit de drivers', error);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center w-full">
      <StepperLine step={activeStep} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
          <div className="w-[85%]">
            {activeStep === 0 && (
              <Step1
                register={register}
                setValue={setValue}
                errors={errors}
                driversData={driversData}
              />
            )}
            {activeStep === 1 && (
              <Step2
                register={register}
                setValue={setValue}
                errors={errors}
                driversData={driversData}
              />
            )}
            {activeStep === 2 && (
              <Step3
                register={register}
                setValue={setValue}
                errors={errors}
                driversData={driversData}
                control={control}
              />
            )}
          </div>

          <div className="w-[90%] flex items-center justify-between mt-12">
            <div className="w-[10%] flex">
              <Button
                onClick={prevStep}
                className2="p-2 w-full"
                bgColor="bg-red-600"
                text="Atrás"
                textColor="text-white"
              />
            </div>

            <div className="w-[10%] flex">
              {activeStep < 2 ? (
                <Button
                  onClick={nextStep}
                  className2="p-2 w-full"
                  textColor="text-white"
                  bgColor="bg-[#1B5316]"
                  text="Siguiente"
                />
              ) : (
                <Button
                  type="submit"
                  className2="bg-green-600 p-2 w-full"
                  text="Enviar"
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
