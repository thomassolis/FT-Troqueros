import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../../ui/buttons/button";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth/authProvider";
import { logoutUser } from "../../../api/Home/home.route";
import { getJwtFromCookies } from "../../../functions/JWT/getJWTFromCookies";
import { decodeJwt } from "../../../functions/JWT/getJWTFromCookies";
import { useEffect } from "react";
import { useState } from "react";

interface ProfileProps {
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  showProfile: boolean;
}

export const Profile = ({showProfile, setShowProfile}:ProfileProps) => {
    const {setIsAuthenticated,userLastName, userName} = useContext(AuthContext)!;  
     const [_userData, setUserData] = useState(); 
      
    const cookie = getJwtFromCookies()
    console.log('cookie',cookie);

  useEffect(() => {
    // Verificar cookies solo en el lado del cliente
    const cookie = getJwtFromCookies();
    console.log('Cookie obtenida:', cookie);
    
    if (cookie) {
      try {
        const decoded = decodeJwt(cookie);
        console.log('Datos decodificados:', decoded);
        setUserData(decoded);
      } catch (error) {
        console.error('Error decodificando JWT:', error);
      }
    }
  }, []);
    return(
        <div className="flex flex-col items-center">
            <div className="w-[100%] flex justify-between px-3 mt-3">
                <Icon icon="proicons:cancel" width="24" height="24"  style={{color: 'black'}} className="cursor-pointer" onClick={()=>setShowProfile(!showProfile)}/>
                <Icon icon="bxs:user" width="30" height="25" className="cursor-pointer" onClick={()=>setShowProfile(!showProfile)}/>                
            </div>

            <div className="flex flex-col gap-5 w-full items-center mt-2">
                <h1 className="text-black font-bold">{userName} {userLastName}</h1>
                <div className="w-[50%]">
                    <Button 
                        type="button"
                        text='Logout'
                        bgColor='bg-red-600'
                        onClick={async()=>{
                            const response = await logoutUser()
                            if(response.success){
                                setIsAuthenticated(false)                            
                            }
                        }
                            // ()=>setIsAuthenticated(false)                            
                            
                        }
                    />
                </div>
            </div>
        </div>
    )
}