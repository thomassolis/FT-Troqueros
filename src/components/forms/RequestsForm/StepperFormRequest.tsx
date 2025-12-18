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
import { GetRequestDataPerID } from "../../../api/Requests/requests.route";
import { EditRequestData } from "../../../api/Requests/requests.route";
import { CleanRequestDataBeforeSend } from "../../../functions/cleanData/CleanRequestDataBeforeSendToApi/cleanRequestData";
import { Step1 } from "./Steps/StepOne";
import { Step2 } from "./Steps/StepTwo";
import { Step3 } from "./Steps/StepThree";
import { Step4 } from "./Steps/StepFour";
import { Step5 } from "./Steps/StepFive";
import { useLocation } from "react-router-dom";
import { toRouteRow  } from "../../../context/Requests/DynamicRequestsOptions";
import isEqual from "lodash/isEqual";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth/authProvider";

export interface ServiceType {
  id: number;
  selectedValue: string;
  quantity: number;
  serviceID?: string;
}

type NavState = { jumpToStep?: number } | null;

export const StepperFormRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as NavState) ?? null;
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
    const [activeStep, setActiveStep] = useState<number>(() => {
    const s = navState?.jumpToStep;
    return typeof s === "number" ? s : 0;   // ← se monta directo en ese paso
  });
  
  const methods = useForm<RequestsFormValues>({
  defaultValues: requestFormData ?? {
    servicios: []
  },
  shouldUnregister:false,
});


  const {
    handleSubmit,
    reset,
    trigger,            
    watch,
    getValues,
    setValue,
    formState: { errors } 
  } = methods;

  const {userRole} = useContext(AuthContext)!;
  
  useEffect(() => {
    const subscription = watch((value) => {      
      setRequestFormData(value as RequestsFormValues);      
    });    
    // console.log('requestFormData updated:', requestFormData)
    return () => subscription.unsubscribe();
  // }, [watch]);
  }, [watch, requestFormData]);


useEffect(() => {  
  if (!Array.isArray(rows)) return;

  const updatedRows: RouteRow[] = rows.map((r) => {
    const row = toRouteRow(r);

    if (!row.serviceID) {
      return {
        ...row,
        id_servicio_datos: "",
        lugar_origen: "",
        lugar_destino: "",
        tarifa: [{ descripcion: "4", costo: 0, venta: 0, profit: 0 }],
        entrega_vacio: false,
        fecha_limite: "",
        costo_proveedor: requestFormData?.precio_proveedor || 9,
      };
    }
    return row;
  });

  if (!isEqual(updatedRows, rows)) {
    setRows(updatedRows);
  }  
}, [rows]);


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
        // setRows([]);                    
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
        if(response.id_proveedor){
          setUseProvider(true);
          setValue('isProviderRequest', true);
        }else{
          setUseProvider(false);
        }        
        reset(response);         
        setRequestFormData(response);
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

          <div className="w-[95%]">            
            <div hidden={activeStep !== 0}>
              <Step1
                userRole={userRole as any}
              />
            </div>

            <div hidden={activeStep !== 1}>
              <Step2
                useProvider={useProvider}
                setUseProvider={setUseProvider}          
                rows={rows}          
                requestFormData = {requestFormData}
                userRole={userRole as any}
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
                requestFormData={requestFormData}
                setRequestFormData={setRequestFormData}
                getValues={getValues}
                reset={reset}
                userRole={userRole as any}
              />
            </div>

            <div hidden={activeStep !== 3}>
              <Step4
                useProvider={useProvider}
                requestFormData={requestFormData}
                setRequestFormData={setRequestFormData}
                rows={rows}
                setRows={setRows}    
                activeStep={activeStep}             
                userRole={userRole as any}
              />
            </div>

            <div hidden={activeStep !== 4}>
              <Step5
                useProvider={useProvider}
                requestFormData={requestFormData}                
                rows={rows}  
                getValues={getValues} 
                setRequestFormData={setRequestFormData} 
                activeStep={activeStep}     
                procedure={procedure}      
                userRole={userRole as any}
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
                    
                    if (isStepValid) {                      
                      nextStep();
                     } else {
                      // Depuración mejorada
                      console.log('Errores de validación:', {
                        step: activeStep,
                        errors: Object.entries(errors).flatMap(([key, value]) => {
                          // Si es un array (como "servicios")
                          if (Array.isArray(value)) {
                            return value.flatMap((item, idx) =>
                              Object.entries(item || {}).map(([subKey]) => ({
                                campo: `${key}[${idx}].${subKey}`,
                                mensaje: (value as any).message,
                                tipo: (value as any).type
                              }))
                            );
                          }

                          // Si es un objeto simple
                          if (typeof value === "object") {
                            return Object.entries(value || {}).map(([subKey, subValue]) => ({
                              campo: `${key}.${subKey}`,
                              mensaje: subValue?.message,
                              tipo: subValue?.type
                            }));
                          }

                          // Si es un error simple
                          return [{
                            campo: key,
                            mensaje: (value as any).message,
                            tipo: (value as any).type
                          }];
                        })
                      });
                    }
                  }}
                  className2="p-2 w-full"
                  textColor="text-white"
                  bgColor="bg-[#1B5316]"
                  text="Siguiente"
                  type="button"                  
                  disabled={(activeStep === 2 && rows.length === 0) ? true : false}       
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