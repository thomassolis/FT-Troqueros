import { ReportsKPI } from "../ReportsView/ReportsKPI"
import { Input } from "../../../ui/inputs/input"
import Select  from "react-select"
import { Table, TableBody, TableCell, TableHead,TableHeader, TableRow } from "../../../ui/Tables/teamReportsTable/TeamReportsTable"
import { useState } from "react"
import { useEffect } from "react"
import { getTeamReports } from "../../../../api/Reports/reports.route.ts"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Paginacion } from "../../../ui/paginación/pagination.tsx"
import DatePickerRange from "../../../ui/DateRangePicker/DateRangePicker.tsx"
import { SelectData } from "../../../../api/Requests/requests.route.ts"
import { useContext } from "react"
import { searchValueContext } from "../../../../context/searchValueForFilter/searchValue.tsx"

interface TeamReportsTypes {
    selectedTab: number,    
}
type Driver = {
  id_conductor: string | number;
  nombre: string;
};

export const TeamReports = ({ selectedTab }: TeamReportsTypes) => {    
    const [dates, setDates] = useState<{startDate?: Date; endDate?: Date}>({});
    // const [currentPage, setCurrentPage] = useState<number>(1);
    const [reports, setReports] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [driverSearch, setDriverSearch] = useState<string>('');
    const [statusSelected, setStatusSelected] = useState<any>(null);
    const {currentPage, setCurrentPage} = useContext(searchValueContext)!;     
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const handlePageClick = (selectedPage: number) => {        
        setCurrentPage(selectedPage);
    };

  useEffect(()=>{    
    const getData = async () => {
        try{
            const response = await getTeamReports(currentPage, 10, searchTerm, driverSearch, statusSelected, dates);            
            setReports(response.data);            
        }catch(error){
            console.error('Error en getData: ', error);
        }
    }
    getData();
  },[currentPage, searchTerm, statusSelected, driverSearch, dates])

    const hoursBetween = (start: string | Date, end?: string | Date) => {
        const s = new Date(start).getTime();
        const e = end ? new Date(end).getTime() : Date.now();

        if (!Number.isFinite(s) || !Number.isFinite(e) || e < s) return 0;

        const hours = (e - s) / (1000 * 60 * 60);
        return Number(hours.toFixed(1)); // 1 decimal
    };

    return(
        <div className="w-full grid gap-y-6 grid-rows-[auto_auto_1fr] ">

            {/* <div className="flex justify-center w-full items-center bg-blue-100"> */}
                <ReportsKPI 
                    type="team"
                    reports={reports}
                    selectedTab={selectedTab}    
                    styleReport={
                        [
                            {
                                section: "RECURSOS OPERACIONALES",
                                id: 'conductoresActivos',
                                title: 'Conductores Activos',
                                icon:'healthicons:truck-driver',
                                bgColor: 'bg-blue-100',
                                iconColor: "text-blue-600",
                                borderColor: "border-blue-200",
                                iconContainerColor: 'bg-blue-500'
                            },
                            {
                                section: "RECURSOS OPERACIONALES",
                                id: 'equiposActivos',
                                title: 'Equipos en Uso',
                                icon:'mdi:truck',
                                bgColor: "bg-yellow-50",
                                iconColor: "text-green-600",
                                borderColor: "border-yellow-200",
                                iconContainerColor: 'bg-yellow-600'
                            },
                            {
                                section: "ANÁLISIS DE DESEMPEÑO",
                                id: "cantTiemposExcedidos",
                                title: "Tiempos Excedidos",
                                icon: "tabler:alert-triangle-filled",
                                bgColor: "bg-red-50",
                                iconColor: "text-red-600",
                                borderColor: "border-red-200",
                                iconContainerColor: "bg-red-600",

                                subType: "percent_of",
                                subNumeratorId: "cantTiemposExcedidos",
                                subDenominatorId: "totalRows",
                                decimals: 2,
                                subGood: "lower_is_better",
                            },
                            {
                                section: "ANÁLISIS DE DESEMPEÑO",
                                id: "tiempoEnRegla",
                                title: "En Tiempo",
                                icon: "streamline-ultimate:scooter-fast-bold",
                                bgColor: "bg-green-100",
                                iconColor: "text-green-600",
                                borderColor: "border-green-200",
                                iconContainerColor: "bg-green-600",

                                subType: "percent_of",
                                subNumeratorId: "tiempoEnRegla",
                                subDenominatorId: "totalRows",
                                decimals: 2,
                                subGood: "higher_is_better",
                            },
                        ]
                    }
                />
            {/* </div> */}

            <div className="w-full shadow-2xl rounded-lg p-6 bg-white">
                
                <div className="grid gap-8 grid-cols-[1fr_1fr_1fr_1fr]">

                    <div className="flex flex-col">
                        <p className="text-gray-600 font-semibold">Buscar Movimiento</p>
                        <Input 
                            type="string"
                            className2={'py-5 bg-white border-gray-300'}
                            placeholder="ID o Cliente..."
                            onChange={(e)=>{
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-gray-600 font-semibold">Fecha</p>
                        <DatePickerRange                        
                            setDates={setDates}
                            dates={dates}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-gray-600 font-semibold">Conductor</p>
                        <Select
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                menu: (provided) => ({ ...provided, zIndex: 9999 }),
                            }}
                            className="text-black"
                            
                            onMenuOpen={async () => {                                
                                const response = await SelectData({ type: "drivers" });
                                setDrivers(Array.isArray(response) ? response : [] as any);                                
                            }}
                            options={[                        
                                    ...drivers.map((d) => ({
                                    value: d.id_conductor,   // o el id real que venga
                                    label: d.nombre,         // o el nombre real que venga
                                })),
                            ]}
                            placeholder="Seleccione el conductor..."
                            isClearable
                            onChange={(e) => {
                                // 👇 aquí NO es statusSelected; es conductor
                                setDriverSearch(e?.value != null ? String(e.value) : "todos");
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-gray-600 font-semibold">Estado</p>
                        <Select
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: provided => ({ ...provided, zIndex: 9999 })
                            }}
                            className="text-black"
                            
                                options={[
                                    {value: 'todos', label:'Todos'},
                                    {value: 'en_tiempo', label:'En Tiempo'},
                                    {value: 'excedido', label:'Tiempo Excedido'}
                            ]}
                            placeholder='Seleccione...'
                            isClearable
                            onChange={(e)=>{
                                setStatusSelected(e?.value);
                            }}                            
                        />                       
                    </div>

                </div>
            </div>

                            
            <div className="shadow-md text-black">
                <div className="p-0">
                    <div className="max-h-[530px] overflow-hidden flex flex-col">
                        {/* Contenedor de tabla con scroll SOLO en el body */}
                        <div className="relative flex-grow overflow-auto">
                            <Table className="border-collapse">
                                <TableHeader className="sticky top-0 z-10 bg-gray-50">
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-bold text-center min-w-[80px]">ID</TableHead>
                                        <TableHead className="font-bold text-center min-w-[120px]">Cliente</TableHead>
                                        <TableHead className="font-bold text-center min-w-[150px]">Conductor</TableHead>
                                        <TableHead className="font-bold text-center min-w-[140px]">Equipo</TableHead>
                                        <TableHead className="font-bold text-center min-w-[180px]">Ruta</TableHead>
                                        <TableHead className="font-bold text-center min-w-[120px]">Período</TableHead>
                                        <TableHead className="font-bold text-center min-w-[140px]">Duración</TableHead>
                                        <TableHead className="font-bold text-center min-w-[120px]">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports?.data?.map((rep:any) => {
                                        const duracionRealHrs = hoursBetween(rep.fecha_salida, rep.fecha_finalizacion);                                                                             
                                        
                                        return (
                                            <TableRow key={rep.id} className={`${rep.proveedor_id ? 'bg-red-100':''} hover:bg-gray-50`}>
                                                <TableCell className="font-medium text-blue-600 min-w-[80px]">{rep.idPeticion}</TableCell>
                                                <TableCell className="min-w-[120px]">{rep.cliente}</TableCell>
                                                <TableCell className="min-w-[150px]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Icon icon="healthicons:truck-driver" width="23" height="23"/>
                                                        </div>
                                                        {rep.proveedor_id ? (
                                                            <span className="font-medium">Proveedor</span>
                                                        ): (
                                                            <span>{rep.conductor}</span>
                                                        )}

                                                    </div>
                                                </TableCell>
                                                <TableCell className="min-w-[140px]">
                                                    <div className="space-y-1 text-sm">
                                                        {rep.proveedor_id ? (
                                                            <span className="font-medium">
                                                                Proveedor
                                                            </span>
                                                        ): (
                                                        <>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-500">Ch:</span>
                                                                <span className="font-medium">{rep.chasis}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-500">Cb:</span>
                                                                <span className="font-medium">{rep.cabezal}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-500">Fg:</span>
                                                                <span className="font-medium">{rep.furgon}</span>
                                                            </div>
                                                        </>
                                                        )

                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs min-w-[180px] text-center">
                                                    <div className="text-sm">{`${rep.lugar_origen} --> ${rep.lugar_destino}`}</div>
                                                </TableCell>
                                                <TableCell className="min-w-[120px]">
                                                    <div className="text-sm">
                                                        <div className="text-gray-600">
                                                            <span className="font-semibold">Inicio: </span>
                                                            {new Date(rep.fecha_salida).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            <span className="font-semibold">Fin: </span>
                                                            {new Date(rep.fecha_finalizacion).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center min-w-[140px]">
                                                    <div className="space-y-1">
                                                        <div className={`font-bold ${rep.status === 'excedido' ? 'text-red-600' : 'text-green-600'}`}>
                                                            {duracionRealHrs} horas
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Límite: {rep.tiempo_estimado} horas
                                                        </div>
                                                        {rep.status === 'excedido' && (
                                                            <div className="text-xs text-red-600 font-medium">
                                                                +{rep.tiempoExcedido} horas 
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center min-w-[120px]">
                                                    {rep.status && (                                                        
                                                        rep.status === 'excedido' ? (
                                                            <div className="gap-1 bg-red-500 hover:bg-red-600 flex justify-center rounded-lg items-center text-white py-1 px-2">
                                                                <Icon icon="mingcute:alert-fill" width="20" height="20" />
                                                                <span className="text-sm">Excedido</span>
                                                            </div>
                                                        ):(
                                                            <div className="gap-1 bg-green-500 hover:bg-green-600 flex justify-center rounded-lg items-center text-white py-1 px-2">
                                                                <Icon icon="lets-icons:check-fill" width="20" height="20" className="text-white"/>
                                                                <span className="text-sm">En tiempo</span>                                                    
                                                            </div>
                                                        )                                                    

                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Paginación - fuera del scroll */}
                        <div className="flex-shrink-0 mt-auto">
                            <Paginacion
                                pageSize={reports?.pageSize}
                                totalRecords={reports?.totalRows || 0}
                                handlePageClick={handlePageClick}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div> 
            </div>
            
        </div>
    )
}
