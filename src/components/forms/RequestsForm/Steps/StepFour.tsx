import { useEffect, useState } from "react";
import { Input } from "../../../ui/inputs/input";
import { SmallLabel } from "../../../ui/Labels/smallLabel";
import Select from 'react-select';
import { Controller, useFormContext } from "react-hook-form";
import { SelectData } from "../../../../api/Requests/requests.route";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ServicesSelectionTable } from "../../../ui/Tables/RequestsForm/servicesSelection";
import { DynamicRequestsType } from "../../../../functions/DynamicSections/Requests/DynamicRequestsType";
import { SelectOptionTypes } from "../../../types/Select/select";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { ServiceType } from "../../../../context/Requests/DynamicRequestsOptions";
import { SelectionTeamTable } from "../../../ui/Tables/RequestsForm/selectionTeamTable";
import { PrevisualizationTab } from "../../../ui/tabs/Tabs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { NeonWarning } from "../../../ui/Warning/NeonWarning";
import { InvoiceTable } from "../../../ui/Tables/AmountTable/InvoiceTable";
import { useLocation } from "react-router-dom";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

export const Step4: React.FC<StepsRequestsProps> = ({useProvider, rows, requestFormData, setRows, requestData}) => {      
    const { control, setValue, register, errors } = useFormContext<RequestsFormValues>();    
    return(
        <div className="flex flex-col mt-10 gap-10">
            
            <h1 className="text-black">Completa el formulario para crear una nueva petición</h1>
            <SelectionTeamTable
                title = {['Tipo de Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón']}
                control = {control}
                useProvider = {useProvider}
                rows={rows}
                requestFormData = {requestFormData}
                setRows={setRows}
                requestData = {requestData}
                setValue= {setValue}
                register = {register}
            />
            {useProvider &&
                <NeonWarning message={'Se utilizará el equipo del proveedor designado.'}/>
            }            
        </div>
    )
}