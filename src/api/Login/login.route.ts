import axios from '../axios';
import { toast } from 'react-hot-toast';

export const SendLoginCredentials = async (data: any, navigate: any) => {
    try {
        const response = await axios.post('/auth/login', data);     
      
        if (response.data.success) {                        
            toast.success(response.data.message);
            navigate('/home'); 
            return response.data
        } else {
            toast.error(response.data.message);
            return null;
        }            
    } catch (error: any) {
        console.error('Error en SendLoginCredentials:', error);
        
        // Verifica si el error tiene una respuesta del backend (AxiosError)
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {            
            toast.error("Error inesperado");
        }           
        return null;
    }
    
};


export const ProtectRoute = async () => {
    try{
        const response = await axios.post('/validate_token',{},{
            withCredentials: true, // ✅ incluye cookies si el token está en una cookie
            headers: {
            'Content-Type': 'application/json',
            },
        });
        console.log('ProtectRoute',response.data);
        return response.data        
    }catch(error){
        console.error('Error en ProtectRoute');
    }
}
