import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode";


interface TokenValues {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    iat: number;
    exp: number;
}

export const getDecodedToken = (): TokenValues | null =>{
    console.log('Entre');
    const token = Cookies.get("token");
    console.log(token);

    if(!token) return null;

    try{
        return jwtDecode<TokenValues>(token);
    }catch(error){
        console.error("Error al decodificar el token: ", error);
        return null;
    }


}
// const decodedToken = getDecodedToken();
// console.log(decodedToken);