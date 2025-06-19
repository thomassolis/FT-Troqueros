// función que hará que la variable serviceTypeDescription tome el valor de `${serviceType}(${lugar_origen} - ${lugar_destino})`

interface ServiceRow {
  serviceType: string;
  lugar_origen: string;
  lugar_destino: string;
  // puedes incluir otros campos si quieres tiparlos también
}

export const formattedServiceDescriptions = (rows: ServiceRow[]): string[] => {
  const serviceTypeDescription = rows.map(
    ({ serviceType, lugar_origen, lugar_destino }) =>
      `${serviceType}(${lugar_origen} - ${lugar_destino})`
  );

  return serviceTypeDescription;
};
