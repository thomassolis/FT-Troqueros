import { Icon } from "@iconify/react/dist/iconify.js"
import Select from "react-select"
import DatePickerRange from "../../../ui/DateRangePicker/DateRangePicker"
import { useState } from "react"
import { SelectData } from "../../../../api/Requests/requests.route"

interface FiltersSectionProps {
    filterSelected: boolean;
    setFilterSelected: React.Dispatch<React.SetStateAction<boolean>>;
    setDates: React.Dispatch<React.SetStateAction<{startDate?: Date; endDate?: Date}>>;
    setRange: React.Dispatch<React.SetStateAction<{start?: Date; end?: Date}>>;
    range: {start?: Date; end?: Date};
    selected: Record<SelectKey, Option|null>;
    setSelected: React.Dispatch<React.SetStateAction<Record<SelectKey, Option | null>>>;
    dates:{
        startDate?: Date | undefined;
        endDate?: Date | undefined;
    }
}

type SelectKey = "drivers" | "customers" | "services";
type Option = { value: number | string; label: string;};

export const FiltersSection = ({setFilterSelected, setDates, selected, setSelected, dates}:FiltersSectionProps) => {         
    const [opts, setOpts] = useState<Record<SelectKey, Option[]>>({
    drivers: [],
    customers: [],
    services: [],
    });

    const adapters: Record<SelectKey, (row: any) => Option> = {
        drivers:   (r) => ({ value: r.id_conductor, label: r.nombre}),
        customers: (r) => ({ value: r.id_cliente,   label: r.nombre}),
        services:  (r) => ({ value: r.id_servicio,  label: r.nombre}),
    };

    const getSelectData = async (type: SelectKey) => {
    try {
        // Evita refetch si ya cargaste
        if (opts[type]?.length) return;
        const response = await SelectData({ type }); // ← tu función
        setOpts(prev => ({
        ...prev,
        [type]: (response ?? []).map(adapters[type]),
        }));
    } catch (error) {
        console.error("Error en getSelectData: ", error);
    }
    };

    return(
        <div className="flex-col bg-white w-full h-full rounded-lg pt-3 pl-6 pr-6 pb-72">
            <div className="w-full flex-col space-y-3"> {/* Cambia gap-3 por space-y-3 */}
                
                <div className="flex justify-between">
                    <h1 className="text-black">Filtrar por</h1>
                    <Icon icon="line-md:filter" width="24" height="24" color="black" className="cursor-pointer hover:text-gray-300" onClick={()=>setFilterSelected(false)}/>
                </div>

                <div>
                    <Select
                        placeholder="Servicio"
                        isClearable
                        onMenuOpen={() => getSelectData('services')}
                        onChange={(opt) => setSelected(p => ({ ...p, services: opt as Option | null }))}
                        options={opts.services}
                        value={selected.services}

                        styles={{
                            option: (base) => ({ ...base, color: '#000' }),       // dropdown
                            singleValue: (base) => ({ ...base, color: '#000' }),  // valor seleccionado
                            input: (base) => ({ ...base, color: '#000' }),        // texto cuando escribes
                            placeholder: (base) => ({ ...base, color: '#6b7280' })// opcional
                        }}
                    />

                </div>

                <div>
                    <Select
                        placeholder="Conductor"
                        isClearable
                        onMenuOpen={() => getSelectData("drivers")}
                        options={opts.drivers}
                        value={selected.drivers}
                        onChange={(opt) => setSelected(p => ({ ...p, drivers: opt as Option | null }))}
                        styles={{
                            option: (base) => ({ ...base, color: '#000' }),       // dropdown
                            singleValue: (base) => ({ ...base, color: '#000' }),  // valor seleccionado
                            input: (base) => ({ ...base, color: '#000' }),        // texto cuando escribes
                            placeholder: (base) => ({ ...base, color: '#6b7280' })// opcional
                        }}
                    />
                </div>

                <div>
                    <Select
                        placeholder="Cliente"
                        isClearable
                        onMenuOpen={() => getSelectData("customers")}
                        options={opts.customers}
                        value={selected.customers}
                        onChange={(opt) => setSelected(p => ({ ...p, customers: opt as Option | null }))}
                        styles={{
                            option: (base) => ({ ...base, color: '#000' }),       // dropdown
                            singleValue: (base) => ({ ...base, color: '#000' }),  // valor seleccionado
                            input: (base) => ({ ...base, color: '#000' }),        // texto cuando escribes
                            placeholder: (base) => ({ ...base, color: '#6b7280' })// opcional
                        }}
                    />
                </div>

                <div className="w-full">
                    <DatePickerRange                        
                        setDates={setDates}
                        dates={dates}
                    />
                </div>
                
            </div>
        </div>
    )
}