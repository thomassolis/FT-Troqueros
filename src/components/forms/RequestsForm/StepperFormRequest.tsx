import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";

import { CreateNewRequest } from "../../../api/Requests/requests.route";
import { getProvidersDataByID } from "../../../api/Providers/providers.route";
import { updateProvidersInfo } from "../../../api/Providers/providers.route";
// import { ProvidersFormValues } from "../../types/ProvidersForm/providersForm";
import { RequestsFormValues } from "../../types/forms/RequestsForm/requestsForm";
import { Step1, Step2, Step3, Step4, Step5 } from "./Steps/RequestsSteps";

export const StepperFormRequests = () => {
  const [providersData, setProvidersData] = useState({});
  const {providerID} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();  
  const [useProvider, setUseProvider] = useState(false);    //Estado que validará si una petición será manejada por un proveedor o no
  const [requestFormData, setRequestFormData]= useState<RequestsFormValues>({} as RequestsFormValues);
  //Obtendrá los datos por ID
  useEffect(()=>{

    if(providerID){      
      setIsLoading(true);
      const FetchCustomerDataByID = async() =>{
        try{
          const response = await getProvidersDataByID({providerID});               
          setProvidersData(response);
        }catch(error){
          console.error('Error en StepperFormCustomers', error);
        } finally{
          setIsLoading(false);
        }
      }

      FetchCustomerDataByID();
    }
    
  }, [providerID])


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
  } = useForm<RequestsFormValues>();

  useEffect(() => {
  const subscription = watch((value) => {
     console.log("📋 Formulario actualizado:", value);    
     setRequestFormData(value);
  });
  return () => subscription.unsubscribe();
}, [watch]);


  const navigate = useNavigate();

  

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


  const onSubmit = async (data: any) => {   
    try{
      setIsLoading(true);

      if(procedure === 'create'){      
        const response = await CreateNewRequest({data});
        if(response.success){
          navigate('/home');
        }
      }
    }catch(error){
      console.error('Error en StepperFormRequests', error);
    }
    // } else if (procedure === 'modify'){        
    //     const response = await updateProvidersInfo({data, providerID});
    //     if(response.success){
    //       navigate('/home/Providers');
    //     }
    //   }
    
    // setIsLoading(false);            
  };


  return (
    <section className="flex flex-col items-center w-full">
      <StepperLine step={activeStep} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <div className="w-[85%]">
            {activeStep === 0 && (
                <Step1              
                  register={register}
                  setValue={setValue}
                  errors={errors}                 
                  control={control}                  
                  useProvider={useProvider}
                  setUseProvider={setUseProvider}
                />
            )}

            {activeStep === 1 && (
                <Step2
                  register={register} 
                  setValue={setValue}
                  errors={errors}                                      
                  control={control}      
                  useProvider={useProvider}
                  setUseProvider={setUseProvider}            
                />
            )}

          {activeStep === 2 && (
              <Step3
                register={register} 
                setValue={setValue} 
                errors={errors}                 
                control={control}    
                useProvider = {useProvider}                             
              />
          )} 


          {activeStep === 3 && (
              <Step4
                register={register} 
                setValue={setValue} 
                errors={errors}                 
                control={control}    
                useProvider = {useProvider}                                
              />
          )} 

            {activeStep === 4 && (
              <Step5
                register={register} 
                setValue={setValue} 
                errors={errors}                 
                control={control}   
                watch={watch}                    
                useProvider = {useProvider} 
                requestFormData={requestFormData}
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
            {activeStep < 4 ? (
              <Button
                onClick={async () => {
                  const isStepValid = await trigger(); // valida los campos actuales
                  if (isStepValid) nextStep();
                }}
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
              />
            )}
          </div>
        </div>
      
      </form>
    </section>
  );
};