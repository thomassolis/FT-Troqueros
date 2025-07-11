export const CleanRequestDataBeforeSend = (obj: any, isProviderRequest: boolean): any => {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  // Si es array, limpiar cada elemento
  if (Array.isArray(obj)) {
    return obj
      .map((item) => CleanRequestDataBeforeSend(item, isProviderRequest))
      .filter((item) => item !== undefined);
  }

  // Si es objeto (pero no array), limpiar cada propiedad
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      // Lista de campos que NUNCA se deben enviar
      const FIELDS_TO_REMOVE = [
        'chasis',
        'conductor',
        'cabezal',
        'furgon',
        'id_servicio',
        'servicio',
        'lugar_origen',
        'lugar_destino',
        'profit',
        'monto',
        'cliente'
      ];

      // Condición especial: eliminar precio_proveedor si NO es solicitud de proveedor
      if ((!isProviderRequest && key === 'precio_proveedor') || FIELDS_TO_REMOVE.includes(key)) {
        return acc; // no incluir esta propiedad
      }

      const cleanedValue = CleanRequestDataBeforeSend(obj[key], isProviderRequest);
      if (cleanedValue !== undefined) {
        return { ...acc, [key]: cleanedValue };
      }

      return acc;
    }, {});
  }

  // Para valores primitivos: eliminar strings vacíos, null, undefined
  if (obj === "" || obj === null || obj === undefined) {
    return undefined;
  }

  return obj;
};
