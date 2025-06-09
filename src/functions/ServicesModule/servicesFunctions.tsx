import { ServicesActions } from "../../api/Services/services.route";

export const editService = async( 
    setServiceEdit: React.Dispatch<React.SetStateAction<boolean>>, 
    serviceID: string, 
    serviceName?: string) => {

    console.log('serviceID', serviceID)
    try{    
        setServiceEdit(true);
        const response = await ServicesActions('update',serviceID,serviceName);

        if(response.success){
            setServiceEdit(false);
        }

    }catch(error){
        console.error('Error en editService ', error);
    }
    
}