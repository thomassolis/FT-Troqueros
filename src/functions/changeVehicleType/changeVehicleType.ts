export const changeVehicleValue = (vehicleType: string |null | undefined) =>{
    if(vehicleType === 'Chasises') return 'chasis'
    else if(vehicleType === 'Furgones') return 'furgón'
    else return 'cabezal'
  }
  