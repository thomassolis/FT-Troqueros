import { AnimatedCounter } from "../../../ui/AnimatedCounter/AnimatedCounter";
import { Icon } from "@iconify/react/dist/iconify.js";
interface ReportsKPIProps {
    reports: {
        totalCostos: number;
        totalPeticiones: number;
        totalVentas: number;
    }|undefined
}
export const ReportsKPI = ({reports}:ReportsKPIProps) => {
    return(
<div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Movimientos */}
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-blue-500 rounded-lg">
        <Icon icon="ph:shipping-container-fill" width="24" height="24"  style={{color: 'white'}} />
      </div>
    </div>
    <h1 className="text-3xl font-bebas text-gray-900 mb-1">
      $ <AnimatedCounter value={reports?.totalPeticiones || 0} />
    </h1>
    <div className="text-gray-600 text-sm">Total Movimientos</div>
  </div>

  {/* Costos */}
  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-red-500 rounded-lg">
        <Icon icon="mdi:trending-down" width="24" height="24" color="white" />
      </div>

    </div>
    <h1 className="text-3xl font-bebas text-gray-900 mb-1">
      $ <AnimatedCounter value={reports?.totalCostos || 0} />
    </h1>
    <div className="text-gray-600 text-sm">Costos Totales</div>
  </div>

  {/* Ventas */}
  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-green-500 rounded-lg">
        <Icon icon="mdi:trending-up" width="24" height="24" color="white" />
      </div>
    </div>
    <h1 className="text-3xl font-bebas text-gray-900 mb-1">
      $ <AnimatedCounter value={reports?.totalVentas || 0} />
    </h1>
    <div className="text-gray-600 text-sm">Ventas Totales</div>
  </div>

  {/* Ganancias */}
  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-purple-500 rounded-lg">
        <Icon icon="mdi:finance" width="24" height="24" color="white" />
      </div>
    </div>
    <h1 className="text-3xl font-bebas text-gray-900 mb-1">
      $ <AnimatedCounter value={(reports?.totalVentas || 0) - (reports?.totalCostos || 0)} />
    </h1>
    <div className="text-gray-600 text-sm">Ganancias Netas</div>
  </div>
</div>
    )
}