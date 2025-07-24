import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { Step1, Step2, Step3 } from "./Steps/ProvidersSteps";
import { createNewProvider, getProvidersDataByID, updateProvidersInfo } from "../../../api/Providers/providers.route";
import { ProvidersFormValues } from "../../types/forms/ProvidersForm/providersForm";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";

export const StepperFormProviders = () => {
  const [providersData, setProvidersData] = useState<any>({});
  const { providerID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  const methods = useForm<ProvidersFormValues>({
    defaultValues: {
      nombre: "",            
      email: "",
      telefono: "",      
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

  // Obtener datos por ID en modo editar
  useEffect(() => {
    if (providerID) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const response = await getProvidersDataByID({ providerID });
          setProvidersData(response);
        } catch (error) {
          console.error("Error en StepperFormProviders", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [providerID]);

  // Resetear el formulario si estamos editando
  useEffect(() => {
    if (procedure === "modify" && Object.keys(providersData).length > 0) {
      console.log('providersData: ', providersData);
      reset({
        nombre: providersData.nombre ?? "",                
        telefono: providersData.telefono ?? "",
        personaContacto: providersData.persona_contacto ?? "",
        celular: providersData.celular ?? "",
        email: providersData.email ?? "",
        numeroYappy: providersData.numero_yappy ?? "",
        nombreCuenta: providersData.nombre_cuenta ?? "",
        tipoBanco: providersData.tipo_banco ?? "",
        numeroCuenta: providersData.numero_cuenta ?? "",
      });
    }
  }, [providersData]);

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

  // Utilidad para limpiar el objeto
  function cleanObject<T extends Record<string, any>>(obj: T): T {
    const cleaned = Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value !== "NaN" &&
          !(typeof value === "number" && isNaN(value))
      )
    );
    return cleaned as T;
  }

  const onSubmit = async (data: ProvidersFormValues) => {
    setIsLoading(true);
    const cleanedData = cleanObject<ProvidersFormValues>(data);

    const response =
      procedure === "create"
        ? await createNewProvider({ data: cleanedData })
        : await updateProvidersInfo({ data: cleanedData, providerID });

    if (response.success) {
      navigate("/home/Providers");
    }

    setIsLoading(false);
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
                providersData={providersData}
              />
            )}
            {activeStep === 1 && (
              <Step2
                register={register}
                setValue={setValue}
                errors={errors}
                providersData={providersData}
              />
            )}
            {activeStep === 2 && (
              <Step3
                register={register}
                setValue={setValue}
                errors={errors}
                providersData={providersData}
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
                textColor="text-white"
                text="Atrás"
              />
            </div>

            <div className="w-[10%] flex">
              {activeStep < 2 ? (
                <Button
                  onClick={nextStep}
                  className2="p-2 w-full"
                  bgColor="bg-[#1B5316]"
                  textColor="text-white"
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
