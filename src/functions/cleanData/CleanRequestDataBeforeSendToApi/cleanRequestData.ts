export const CleanRequestDataBeforeSend = (obj: any, isProviderRequest: boolean, procedure: string): any => {    
  if (obj === null || obj === undefined) {
    return undefined;
  }  
  
  // ⚡️ Evitar limpiar archivos
  if (obj instanceof File) {
    return obj;
  }

if (Array.isArray(obj)) {
  // Si es el array de servicios, aplicar filtro especial
  if (obj.some(item => item.id_servicio_datos !== undefined)) { // Detecta si es array de servicios
    return obj
      .map((item) => CleanRequestDataBeforeSend(item, isProviderRequest, procedure))
      .filter(
        (item) =>
          item !== undefined &&
          item.id_servicio_datos != null &&
          item.id_servicio_datos !== '' &&
          item.id_servicio_datos !== 0 &&
          item.lugar_origen !== '' &&
          item.lugar_destino !== ''
      );
  }

  return obj
    .map((item) => CleanRequestDataBeforeSend(item, isProviderRequest, procedure))
    .filter((item) => item !== undefined);
}

  // Si es objeto (pero no array ni File), limpiar cada propiedad
  if (typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const FIELDS_TO_REMOVE = [
        "chasis",
        "conductor",
        "cabezal",
        "furgon",
        "id_servicio",
        "servicio",
        "lugar_origen",
        "lugar_destino",
        "profit",
        "monto",
        "cliente",
        "proveedor",
        "servicio",
        "nuevo_costo",
        "lugar_destino",
        "lugar_origen",
        "rowIndex",
      ];

      if (
        ((!isProviderRequest && key === "precio_proveedor") || FIELDS_TO_REMOVE.includes(key)) &&
        !(procedure === "edit" && obj.id_proveedor)
      ) {
        return acc;
      }


      if (
        isProviderRequest &&
        key === "costos_extras" &&
        Array.isArray(obj["nuevos_costos_extras"])
      ) {
        return acc;
      }

      if (key === "costos_extras" && Array.isArray(obj[key]) && obj[key].length === 0) {
        return acc;
      }

      if (key === "fecha_limite" && obj.entrega_vacio === false) {
        return acc;
      }
      if (key === "entrega_vacio" && obj.entrega_vacio === false) {
        return acc;
      }

      const cleanedValue = CleanRequestDataBeforeSend(obj[key], isProviderRequest, procedure);
      if (cleanedValue !== undefined) {
        return { ...acc, [key]: cleanedValue };
      }

      return acc;
    }, {});
  }

  if (obj === "" || obj === null || obj === undefined) {
    return undefined;
  }

  return obj;
};
