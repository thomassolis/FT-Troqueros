export const CleanRequestDataBeforeSend = (obj: any, isProviderRequest: boolean): any => {  
  if (obj === null || obj === undefined) {
    return undefined;
  }

  // ⚡️ Evitar limpiar archivos
  if (obj instanceof File) {
    return obj;
  }

  // Si es array, limpiar cada elemento
  if (Array.isArray(obj)) {
    return obj
      .map((item) => CleanRequestDataBeforeSend(item, isProviderRequest))
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

      if ((!isProviderRequest && key === "precio_proveedor") || FIELDS_TO_REMOVE.includes(key)) {
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

      const cleanedValue = CleanRequestDataBeforeSend(obj[key], isProviderRequest);
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
