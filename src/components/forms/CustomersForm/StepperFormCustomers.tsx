import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { StepOne, StepTwo, StepThree, StepFour } from "./Steps/StepOne";
import { CustomersFormValues } from "../../types/forms/CustomersForm/CustomersForm";
import { GetCustomerDataByID } from "../../../api/Customers/customers.route";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { SendDataForCreationCustomer, sendDataForUpdateCustomers } from "../../../api/Customers/customers.route";

export const StepperFormCustomers = () => {
  const [customersData, setCustomersData] = useState<any>({});
  const { clienteID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<CustomersFormValues>({
    defaultValues: {
      nombre: "",
      ruc: "",
      direccion: "",
      dv: undefined,
      telefono: "",
      correo: "",
      fechaUltimoPedido: null,
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    setValue,
    getValues,
    control,
    reset,
  } = methods;

  // Obtener datos si estamos en modo editar
  useEffect(() => {
    if (clienteID) {
      setIsLoading(true);
      const fetchCustomerData = async () => {
        try {
          const response = await GetCustomerDataByID({ clienteID });
          console.log('Datos del cliente: ', response);
          setCustomersData(response);
        } catch (error) {
          console.error("Error en StepperFormCustomers", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCustomerData();
    }
  }, [clienteID]);

  // Setear datos una vez en el form si estamos editando
  useEffect(() => {
    if (procedure === "modify" && customersData && Object.keys(customersData).length > 0) {
      reset({
        nombre: customersData.nombre ?? "",
        ruc: customersData.ruc ?? "",
        direccion: customersData.direccion ?? "",
        dv: customersData.dv ?? undefined,
        telefono: customersData.telefono ?? "",
        correo: customersData.correo ?? "",
        nombreBanco: customersData.nombreBanco ?? "",
        fechaUltimoPedido: customersData.fechaUltimoPedido ?? null,
        nombrePersonaContacto: customersData.nombrePersonaContacto ?? null,
        telPersonaContacto: customersData.telPersonaContacto ?? null,
        emailPersonaContacto: customersData.emailPersonaContacto ?? null,
        tipoCuenta: customersData.tipoCuenta ?? null,
        nombreCuenta: customersData.nombreCuenta ?? null,
        numeroCuenta: customersData.numeroCuenta ?? null,
      });
    }
  }, [customersData]);

  // Enviar el formulario
  const onSubmit = async (data: any) => {
    setIsLoading(true);

    // Limpieza de datos
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
const cleanedData = cleanObject<CustomersFormValues>(data);

    // Eliminar fechaUltimoPedido si estamos modificando
    if (procedure === "modify") {
      delete cleanedData.fechaUltimoPedido;
    }

    // Crear o modificar
    if (procedure === "create") {
      const response = await SendDataForCreationCustomer({ data: cleanedData });
      if (response.success) {
        navigate("/home/Customers");
      }
    } else if (procedure === "modify") {
      const response = await sendDataForUpdateCustomers({ data: cleanedData, clienteID });
      if (response.success) {
        navigate("/home/Customers");
      }
    }

    setIsLoading(false);
  };

  // Cambiar pasos
  const nextStep = async () => {
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <section className="flex flex-col items-center w-full" id="InicioDeFormulario">
      <StepperLine step={activeStep} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
          <div className="w-[85%]">
            {activeStep === 0 && (
              <StepOne
                register={register}
                setValue={setValue}
                errors={errors}
                customersData={customersData}
              />
            )}

            {activeStep === 1 && (
              <StepTwo
                register={register}
                setValue={setValue}
                errors={errors}
                customersData={customersData}
              />
            )}

            {activeStep === 2 && (
              <StepThree
                register={register}
                setValue={setValue}
                errors={errors}
                customersData={customersData}
                control={control}
              />
            )}

            {activeStep === 3 && (
              <StepFour
                register={register}
                setValue={setValue}
                errors={errors}
                customersData={customersData}
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
              {activeStep < 3 ? (
                <Button
                  onClick={async () => {
                    const isStepValid = await trigger();
                    if (isStepValid) nextStep();
                  }}
                  className2="p-2 w-full"
                  text="Siguiente"
                  bgColor="bg-[#1B5316]"
                  textColor="text-white"
                />
              ) : (
                <Button
                  type="submit"
                  className2="bg-green-600 p-2 w-full"
                  text="Enviar"
                />
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
