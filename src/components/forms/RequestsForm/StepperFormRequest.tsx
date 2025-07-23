import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/buttons/button";
import { StepperLine } from "../../ui/stepper/StepperLine";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetProcedureFromURL } from "../../../functions/GetURL/GetURLInfo";
import { RouteRow } from "../../../context/Requests/DynamicRequestsOptions";
import { CreateNewRequest } from "../../../api/Requests/requests.route";
import { RequestsFormValues } from "../../types/forms/RequestsForm/requestsForm";
// import {Step1, Step2, Step3, Step4, Step5 } from "./Steps/RequestsSteps";
import { GetRequestDataPerID } from "../../../api/Requests/requests.route";
import { EditRequestData } from "../../../api/Requests/requests.route";
import { CleanRequestDataBeforeSend } from "../../../functions/cleanData/CleanRequestDataBeforeSendToApi/cleanRequestData";
// import { Step1 } from "./Steps/RequestsSteps/StepOne";
import Step1 from "./Steps/StepOne";
import Step2 from "./Steps/StepTwo";
import Step3 from "./Steps/StepThree";
import Step4 from "./Steps/StepFour";
import Step5 from "./Steps/StepFive";

export interface ServiceType {
  id: number;
  selectedValue: string;
  quantity: number;
  serviceID?: string;
}
export const StepperFormRequests = () => {
  
  const {requestID} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const procedure = GetProcedureFromURL();    
const [useProvider, setUseProvider] = useState<boolean | null>(null);
  //Estado que validará si una petición será manejada por un proveedor o no
  const [requestFormData, setRequestFormData]= useState<RequestsFormValues>({} as RequestsFormValues);
  //Estado que maneja si una 
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
    {
      id: 1,
      selectedValue: "",
      quantity: 0,
      serviceID: "" // Opcional
    },
    // Más objetos si es necesario
  ]);
  const [rows, setRows] = useState<RouteRow[]>([]);//Filas que tienen las tablas
  const [activeStep, setActiveStep] = useState(0);
  const [requestData, setRequestData] = useState();
  // 1) Creamos el hook de RHF con defaultValues y shouldUnregister
  const methods = useForm<RequestsFormValues>({
    defaultValues: {
      // **Aquí defines la forma completa**; al menos vacíos si no tienes nada aún
      fecha_salida: "",
      hora_salida: "",
      id_cliente: "",
      id_proveedor: "",
      precio_proveedor:undefined,
      isProviderRequest: false, //Variable que controla el checkox (esta variable no se enviará)
      servicios: [
        {
          entrega_vacio: false,
          fecha_limite: '',
          id_cabezal: '',
          id_chasis: '',
          id_conductor: '',
          id_furgon: '',
          id_servicio_datos: '',
          tarifa: 0,
        }
      ]
    },
    shouldUnregister: false
  });

    const {
    handleSubmit,
    reset,
    trigger,            
    watch,
    formState: { errors }
  } = methods;

  useEffect(()=>{
    console.log('ServiceTypes: ', serviceTypes)
  },[serviceTypes])

  useEffect(()=>{
    console.log('Rows: ',rows)    
  },[rows])


  //UseEffect para Test
// useEffect(() => {
//   const activeServiceIDs = rows.map(r => String(r.id_servicio_datos));
//   const serviciosActuales = requestFormData.servicios || [];

//   const serviciosFiltrados = serviciosActuales
//     .filter(s => activeServiceIDs.includes(String(s.id_servicio_datos)))
//     .map(s => {
//       const rowMatch = rows.find(r => String(r.id_servicio_datos) === String(s.id_servicio_datos));
//       return {
//         ...s,
//         servicio: rowMatch?.serviceType || "", // ← nuevo campo agregado
//       };
//     });

//   const esDiferente = JSON.stringify(serviciosActuales) !== JSON.stringify(serviciosFiltrados);

//   if (esDiferente) {
//     setValue('servicios', serviciosFiltrados);
//   }
// }, [rows, requestFormData.servicios, setValue]);




  useEffect(() => {
    const subscription = watch((value) => {
      console.log("📋 Formulario actualizado:", value);    
      setRequestFormData(value as RequestsFormValues);
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
  try {
    setIsLoading(true);
    const {isProviderRequest, ...payload} = data; // Elimina el campo isProviderRequest

    // Función mejorada de limpieza
    const cleanData = CleanRequestDataBeforeSend(payload, isProviderRequest);
    
    if (procedure === 'create') {
      const response = await CreateNewRequest({ data: cleanData });
      if (response.success) {          
        setRows([]);                    
        navigate('/home');          
      }
    } else { // Modo editar
      const response = await EditRequestData({
        data: cleanData,
        requestID: requestID,
        id_pedidoServicio: requestFormData?.id_pedidoServicio
      });

      if(response.success){
        navigate('/home');
      }
    }
  } catch(error) {
    console.error('Error en StepperFormRequests', error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(()=>{
    const GetDataForEditRequest = async() => {
      try{
        const response = await GetRequestDataPerID({requestID});  
        reset(response);         
      }catch(error){
        console.error('Error en GetDataForEditRequest', error);
      }
    }
    if (procedure != 'create') GetDataForEditRequest();    
  },[])


  return (
    <section className="flex flex-col items-center w-full">      
      
<FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
    <StepperLine step={activeStep} />

    <div className="w-[85%]">
      <div hidden={activeStep !== 0}>
        <Step1/>
      </div>

      <div hidden={activeStep !== 1}>
        <Step2
          useProvider={useProvider}
          setUseProvider={setUseProvider}          
          rows={rows}          
          requestFormData = {requestFormData}
        />
      </div>

      <div hidden={activeStep !== 2}>
        <Step3
          useProvider={useProvider}
          rows={rows}
          setRows={setRows}
          serviceTypes={serviceTypes}
          setServiceTypes={setServiceTypes}
          isInitialLoad={isInitialLoad}
          setIsInitialLoad={setIsInitialLoad}
          requestData={requestData}
          requestFormData={requestFormData}
        />
      </div>

      <div hidden={activeStep !== 3}>
        <Step4
          useProvider={useProvider}
          requestFormData={requestFormData}
          rows={rows}
          setRows={setRows}
          requestData={requestData}
        />
      </div>

      <div hidden={activeStep !== 4}>
        <Step5
          useProvider={useProvider}
          requestFormData={requestFormData}
          rows={rows}
          requestData={requestData}
        />
      </div>
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
              const isStepValid = await trigger();
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
</FormProvider>


    </section>
  );
};