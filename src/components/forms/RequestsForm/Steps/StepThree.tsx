import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DynamicRequestsType } from "../../../../functions/DynamicSections/Requests/DynamicRequestsType";
import { SelectOptionTypes } from "../../../types/Select/select";
import { ServiceType } from "../../../../context/Requests/DynamicRequestsOptions";
import { useLocation } from "react-router-dom";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { ServicesSelectionTeam } from "../../../ui/Tables/RequestsForm/ServicesSelection/ServicesSelectionTeam";

export const Step3: React.FC<StepsRequestsProps> = ({
  useProvider,
  rows,
  setRows,
  serviceTypes,
  setServiceTypes,
  isInitialLoad,
  setIsInitialLoad,
  requestFormData,
  setRequestFormData,
  reset, /* getValues*/
  userRole,
  procedure
}) => {
  // Estado del select de tipos de servicio (catálogo para seleccionar)
  const [servicesSelect, setServicesSelect] = useState<SelectOptionTypes[]>([]);
  // Datos auxiliares por fila: info de ruta (origen/destino/tarifa) y mapping fila->id_servicio_datos
  const [routesInformation, setRoutesInformation] = useState<Record<string, any>>({});
  const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({});

  const { control, setValue, register } = useFormContext<RequestsFormValues>();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  /**
   * Cuando EDITAS: si viene requestFormData con servicios, derivamos serviceTypes agrupando
   * por tipo de servicio para que el UI quede consistente (solo para layout/controles).
   * Nota: En create-mode este efecto no hace nada.
   */
  useEffect(() => {    
    if (!isEditMode) return;
    if (!requestFormData?.servicios?.length) return;
    if (!isInitialLoad) return;
    
    if (requestFormData?.servicios?.length) {
      const grouped: Record<
        string,
        { serviceID: string; selectedValue: string; quantity: number }
      > = {};

      requestFormData.servicios.forEach((servicio) => {
        const key = servicio.servicio;
        if (!grouped[key]) {
          grouped[key] = {
            serviceID: String(servicio.id_servicio ?? ""),
            selectedValue: servicio.servicio,
            quantity: 1,
          };
        } else {
          grouped[key].quantity += 1;
        }
      });

      const transformedServiceTypes: ServiceType[] = Object.values(grouped).map(
        (entry, idx) => ({
          // ID estable por índice en esta derivación (no se usa como PK real en BD)
          id: Date.now() + idx,
          selectedValue: entry.selectedValue,
          quantity: entry.quantity,
          serviceID: entry.serviceID,
        })
      );

      setServiceTypes?.(transformedServiceTypes);
    }    
  }, [isEditMode, requestFormData?.servicios, setServiceTypes]);

  /**
   * Cuando cambian los serviceTypes (create-mode): limpia rutas huérfanas
   */
  useEffect(() => {
    const activeIds = new Set(serviceTypes?.map((st) => st.id));

    setRoutesInformation((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        const id = parseInt(key.split("-")[0], 10);
        if (!activeIds.has(id)) delete updated[key];
      });
      return updated;
    });

    setRouteIDsByRow((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        const id = parseInt(key.split("-")[0], 10);
        if (!activeIds.has(id)) delete updated[key];
      });
      return updated;
    });
  }, [serviceTypes]);

  /**
   * Agregar un nuevo tipo de servicio (create-mode)
   */
  const newServiceType = () => {
    const newId = Date.now(); // timestamp para unicidad básica
    setServiceTypes?.((prev) => [
      ...(prev ?? []),
      {
        id: newId,
        selectedValue: "",
        quantity: 0,
        serviceID: "",
      },
    ]);
  };

  /**
   * Actualizar un tipo de servicio (create-mode)
   */
  const updateServiceType = (
    id: number,
    field: keyof ServiceType,
    name: string | number,
    value: string | number
  ) => {
    setServiceTypes?.((prev) =>
      (prev ?? []).map((st) => {
        if (st.id !== id) return st;

        const updated: Partial<ServiceType> = { [field]: name } as Partial<ServiceType>;

        if (field === "selectedValue") {
          updated.serviceID = String(value ?? "");
        }

        return { ...st, ...updated };
      })
    );
  };

  /**
   * Eliminar un tipo de servicio (borra mappings auxiliares y rows relacionadas)
   */
  const deleteServiceType = (id: number) => {
    setServiceTypes?.((prev) => (prev ?? []).filter((st) => st.id !== id));

    setRoutesInformation((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${id}-`)) delete updated[key];
      });
      return updated;
    });

    setRouteIDsByRow((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${id}-`)) delete updated[key];
      });
      return updated;
    });

    setRows?.((prev) => (prev ?? []).filter((row) => row.serviceTypeId !== id));
  };

  /**
   * Cálculo del total de filas: en edit-mode depende del backend;
   * en create-mode depende de serviceTypes.
   */
  const totalRows = useMemo(() => {
    if (isEditMode) {
      return Array.isArray(requestFormData?.servicios)
        ? requestFormData.servicios.length
        : 0;
    }
    return (serviceTypes ?? []).reduce((acc, st) => acc + (st.quantity || 0), 0);
  }, [isEditMode, requestFormData?.servicios, serviceTypes]);

  return (
    <section className="w-full">
      {!isEditMode ? (
        <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
          Complete el siguiente formulario para crear una nueva petición
        </h1>
      ) : (
        <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
          Complete la edición de servicios
        </h1>
      )}

      <div className="flex flex-col items-center justify-center gap-5 w-full">
        {!isEditMode && (
          <div className="grid grid-cols-[0.4fr_0.2fr_0.1fr] mt-6 gap-4 w-[80%] items-center justify-center">
            <h1 className="text-black">Tipo de Servicio</h1>
            <h1 className="text-black">Cantidad</h1>
          </div>
        )}

        {(serviceTypes ?? []).map((serviceType) => (
          <DynamicRequestsType
            key={serviceType.id}
            id={serviceType.id}
            selectedValue={serviceType.selectedValue}
            quantity={serviceType.quantity}
            onUpdate={updateServiceType}
            setServicesSelect={setServicesSelect}
            servicesSelect={servicesSelect}
            onDelete={deleteServiceType}
            requestFormData={requestFormData}
            isEditMode={isEditMode}
            serviceTypes={serviceTypes}
            useProvider={useProvider}
            procedure={procedure}
            userRole={userRole}
          />
        ))}

        {useProvider ? (
          <></>
        ) : (
          !isEditMode && (
            <Icon
              icon="gg:add"
              width="24"
              height="24"
              className="text-gray-500 cursor-pointer hover:text-black"
              onClick={newServiceType}
            />
          )
        )}
      </div>

      {(totalRows ?? 0) > 0 && (
        <div className={`flex flex-col ${isEditMode ? "mt-20" : ""}`}>
          {!isEditMode && (
            <h1 className="text-black mt-10">
              Favor seleccione las rutas que le desea asignar a cada servicio
            </h1>
          )}

          <ServicesSelectionTeam
            titles={
              isEditMode
                ? [
                    "Tipo de Servicio",
                    "Lugar de Origen",
                    "Lugar de Destino",
                    "Tarifa",
                    "SH",
                    "Número De Contenedor",
                    "Tamaño de Contenedor",
                    "Retención",
                    "Comentario",
                  ]
                : [
                    "Tipo de Servicio",
                    "Rutas",
                    "Lugar de Origen",
                    "Lugar de Destino",
                    "Tarifa",
                    "SH",
                    "Número De Contenedor",
                    "Tamaño de Contenedor",
                    "Retención",
                    "Comentario",
                  ]
            }
            procedure={procedure}
            serviceTypes={serviceTypes}
            servicesSelect={servicesSelect}
            routeIDsByRow={routeIDsByRow}
            setRouteIDsByRow={setRouteIDsByRow}
            routesInformation={routesInformation}
            setRoutesInformation={setRoutesInformation}
            control={control}
            register={register}
            setValue={setValue}
            rows={rows}
            setRows={setRows}
            isInitialLoad={isInitialLoad}
            setIsInitialLoad={setIsInitialLoad}
            isEditMode={isEditMode}
            requestFormData={requestFormData}
            setRequestFormData={setRequestFormData}
            reset={reset}
            userRole = {userRole}
          />
        </div>
      )}
    </section>
  );
};
