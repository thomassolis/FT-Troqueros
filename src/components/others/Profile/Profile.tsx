import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../../ui/buttons/button";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth/authProvider";
import { logoutUser } from "../../../api/Home/home.route";

interface ProfileProps {
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  showProfile: boolean;
}

export const Profile = ({showProfile, setShowProfile}:ProfileProps) => {
    const {setIsAuthenticated} = useContext(AuthContext)!;    
    return(
        <div className="flex flex-col items-center">
            <div className="w-[100%] flex justify-between px-3 mt-3">
                <Icon icon="proicons:cancel" width="24" height="24"  style={{color: 'black'}} className="cursor-pointer" onClick={()=>setShowProfile(!showProfile)}/>
                <Icon icon="bxs:user" width="30" height="25" className="cursor-pointer" onClick={()=>setShowProfile(!showProfile)}/>                
            </div>

            <div className="flex flex-col gap-5 w-full items-center mt-2">
                <h1 className="text-black font-bold">Thomas</h1>
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