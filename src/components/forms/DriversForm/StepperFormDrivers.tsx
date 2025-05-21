import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { Step1, Step2, Step3 } from "./Steps/DriversSteps";
import { DriversFormValues } from "../../types/DriversForm/DriversForm";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetDriversDataByID } from "../../../api/Drivers/Drivers.route";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { SendDataForNewDriver } from "../../../api/Drivers/Drivers.route";
import { sendDataForUpdateDrivers } from "../../../api/Drivers/Drivers.route";

export const StepperFormDrivers = () => {
  const [driversData, setDriversData] = useState({});
  const {driverID} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();
  console.log('procedure', procedure);
  useEffect(()=>{

    if(driverID){
      console.log('if useEffect');
      setIsLoading(true);
      const FetchCustomerDataByID = async() =>{
        try{
          const response = await GetDriversDataByID(driverID);     
          console.log('response: ', response);
          setDriversData(response);
        }catch(error){
          console.error('Error en StepperFormCustomers', error);
        } finally{
          setIsLoading(false);
        }
      }

      FetchCustomerDataByID();
    }
    
  }, [driverID])


  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    setValue,
    getValues,    
    control,
  } = useForm<DriversFormValues>();

  const navigate = useNavigate();
  const formData = watch();

  // Navegar al siguiente paso con validación
  const nextStep = async () => {    
      setActiveStep((prev) => prev + 1);    
  };

  // Navegar al paso anterior
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  // Enviar el formulario
  const values = getValues()

  const onSubmit = async (data: any) => {
    console.log('data: ', data);
    setIsLoading(true);
    if(procedure === 'create'){
      console.log('createeee');
      const response = await SendDataForNewDriver({data});
      if(response.success){
        navigate('/home/Drivers');
      }
    } else if (procedure === 'modify'){
        console.log('clienteID: ', data);
        const response = await sendDataForUpdateDrivers({data, driverID});
        if(response.success){
          navigate('/home/Drivers');
        }
      }
    
    setIsLoading(false);            
  };


  return (
    <section className="flex flex-col items-center w-full" id="InicioDeFormulario">
      <StepperLine step={activeStep} />
      
      <form onSubmit={handleSubmit(onSubmit)} /*enctype="multipart/form-data"*/ className="w-full flex flex-col items-center">
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
              className2="bg-gray-500 p-2 w-full"
              text="Atrás"
            />
          </div>

          <div className="w-[10%] flex">
            {activeStep < 2 ? (
              <Button
                onClick={async () => {
                  const isStepValid = await trigger(); // valida los campos actuales
                  if (isStepValid) nextStep();
                }}
                className2="bg-blue-500 p-2 w-full"
                text="Siguiente"
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
    </section>
  );
};