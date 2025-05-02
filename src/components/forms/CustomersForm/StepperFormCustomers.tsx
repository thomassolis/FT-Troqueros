import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { StepOne, StepTwo } from "./Steps/StepOne";
import { FormValues } from "../../types/VehicleForm/VehiclesFormTypes";
import { useLocation } from "react-router-dom";

export const StepperFormCustomers = () => {


  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const currentAction = pathSegments[pathSegments.length - 1];


//     if (vehicleID) {      
//       setIsLoading(true);    
//       const fetchData = async () => {
//         try {
//           const data = await getVehicleData({ vehicleType, vehicleID });
//           console.log('Data received:', data);
//           setVehicleData(data);
//         } catch (error) {
//           console.error('Error fetching vehicle data:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
  
//       fetchData();
//     }
//   }, [vehicleID]); 
  
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm<FormValues>();

  // Definir los campos para cada paso según la opción seleccionada
//   const stepFields = {
//     Cabezales: [
//       ["deliveryDate", "campoStep1_2"], // Campos del paso 1 para Cabezales
//       ["campoStep2_1", "campoStep2_2"],  // Campos del paso 2 para Cabezales
//       ["campoStep4_1", "campoStep4_2"]  // Campos del paso 3 para Chasises
//     ],
//     Chasises: [
//       ["deliveryDate", "campoStep1_2"], // Campos del paso 1 para Chasises
//       ["campoStep2_1", "campoStep2_2"], // Campos del paso 2 para Chasises
//       ["campoStep3_1", "campoStep3_2"]  // Campos del paso 3 para Chasises
//     ],
//     Furgones: [
//       ["deliveryDate", "campoStep2_2"], // Campos del paso 1 para Furgones (empieza en StepTwo)
//       ["campoStep1_1", "campoStep1_2"],  // Campos del paso 2 para Furgones
//       ["campoStep3_1", "campoStep3_2"],  // Campos del paso 3 para Chasises
//     ]
//   };

  const navigate = useNavigate();
  const formData = watch();

  // Navegar al siguiente paso con validación
  const nextStep = async () => {
    // const currentFields = stepFields[selectedOption]?.[activeStep] || [];
    // const isStepValid = await trigger(currentFields);
    // if (isStepValid) {
    //   setActiveStep((prev) => prev + 1);
    // }
  };

  // Navegar al paso anterior
  const prevStep = () => {
    // if (activeStep > 0) {
    //   setActiveStep((prev) => prev - 1);
    // } else {
    //   navigate(-1);
    // }
  };

  // Enviar el formulario
  const onSubmit = async (data: any) => {
    // setIsLoading(true);

    // if(currentAction === 'create'){
    //   const response = await sendDataForCreation({data, vehicleType});
    //   if(response.success){
    //     navigate('/home/Vehicles');
    //   }
    // }else if (currentAction === 'modify'){
    //   const response = await sendDataForUpdate({data, vehicleType, vehicleID});
    //   if(response.success){
    //     navigate('/home/Vehicles');
    //   }
    // }
    
    // setIsLoading(false);            
  };

  return (
    <section className="flex flex-col items-center w-full" id="InicioDeFormulario">
      <StepperLine /*selectedOption={selectedOption} step={activeStep} *//>
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <div className="w-[85%]">
                    
            <StepTwo
              register={register} 
              setValue={setValue}
              errors={errors}                                   
            />
          
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
           
              <Button
                onClick={nextStep}
                className2="bg-blue-500 p-2 w-full"
                text="Siguiente"
              />
           
          </div>                      
        </div>        
      </form>
    </section>
  );
};