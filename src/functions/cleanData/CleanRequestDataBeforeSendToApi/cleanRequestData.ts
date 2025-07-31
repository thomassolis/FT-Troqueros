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
        'cliente',
        'proveedor',
        'servicio',
        'nuevo_costo',
        'lugar_destino',
        'lugar_origen'
      ];

      // Condición especial: eliminar precio_proveedor si NO es solicitud de proveedor
      if ((!isProviderRequest && key === 'precio_proveedor') || FIELDS_TO_REMOVE.includes(key)) {
        return acc; // no incluir esta propiedad
      }

      // 🚫 Remover servicios.costos_extras si isProviderRequest es true
      if (
        isProviderRequest &&
        key === 'costos_extras' &&
        Array.isArray(obj['nuevos_costos_extras']) // esto indica que estamos dentro de un servicio
      ) {
        return acc;
      }

      // No enviar costos_extras si el array está vacío
      if (key === 'costos_extras' && Array.isArray(obj[key]) && obj[key].length === 0) {
        return acc;
      }

      // No enviar fecha_limite si entrega_vacio es false
      if (key === 'fecha_limite' && obj.entrega_vacio === false) {
        return acc;
      }
      if (key === 'entrega_vacio' && obj.entrega_vacio === false) {
        return acc;
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