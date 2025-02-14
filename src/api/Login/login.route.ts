import axios from '../axios';
import { toast } from 'react-hot-toast';

export const SendLoginCredentials = async (data: any, navigate: any) => {
    try {
        const response = await axios.post('/auth/login', data);
       
        if (Array.isArray(response.data) && response.data.length > 0) {
            const { success, message } = response.data[0]; 
            
            if (success) {
                toast.success(message);
                navigate('/Troqueros/home'); 
            } else {
                toast.error(message);
            }
            
            return response.data[0];  
        } else {
            toast.error("Error en la respuesta del servidor");
            return null;
        }
    } catch (error) {
        console.error('Error en SendLoginCredentials', error);
        toast.error("Error de conexión con el servidor");
        return null;
    }
};

