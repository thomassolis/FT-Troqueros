import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { StepOne, StepTwo, StepThree, StepFour } from "./Steps/StepOne";
import { CustomersFormValues } from "../../types/CustomersForm/CustomersForm";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetCustomerDataByID } from "../../../api/Customers/customers.route";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { SendDataForCreationCustomer } from "../../../api/Customers/customers.route";
import { sendDataForUpdateCustomers } from "../../../api/Customers/customers.route";

export const StepperFormCustomers = () => {
  const [customersData, setCustomersData] = useState({});
  const {clienteID} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();

  useEffect(()=>{
    if(clienteID){
      setIsLoading(true);
      const FetchCustomerDataByID = async() =>{
        try{
          const response = await GetCustomerDataByID({clienteID});     
          setCustomersData(response);
        }catch(error){
          console.error('Error en StepperFormCustomers', error);
        } finally{
          setIsLoading(false);
        }
      }

      FetchCustomerDataByID();
    }
    
  }, [clienteID])

  
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
  } = useForm<CustomersFormValues>();

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
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if(procedure === 'create'){
      const response = await SendDataForCreationCustomer({data});
      if(response.success){
        navigate('/home/Customers');
      }
      }else if (procedure === 'modify'){
        console.log('clienteID: ', data);
        const response = await sendDataForUpdateCustomers({data, clienteID});
        if(response.success){
          navigate('/home/Customers');
        }
      }
    
    setIsLoading(false);            
  };


  return (
    <section className="flex flex-col items-center w-full" id="InicioDeFormulario">
      <StepperLine step={activeStep} />
      
      <form onSubmit={handleSubmit(onSubmit)}  className="w-full flex flex-col items-center">
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
              className2="bg-gray-500 p-2 w-full"
              text="Atrás"
            />
          </div>

          <div className="w-[10%] flex">
            {activeStep < 3 ? (
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