import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  showProfile: boolean;
}
export const Navbar = ({setShowProfile, showProfile}:NavbarProps) => {

    const navigate = useNavigate();    

    return (
      <div className="fixed top-0 left-0 w-full bg-troquerosOrange h-[60px] flex items-center justify-between shadow-xl z-50 px-4">
        <div>
          <img className="w-[50px] cursor-pointer" src="/troqueros-logo.png" alt="Troqueros Logo" onClick={() => navigate('/home')}/>
        </div>
        <div className="flex gap-2">
          {/* <Icon icon="ion:notifications" width="30" height="25" /> */}
          <Icon icon="bxs:user" width="30" height="25" className="cursor-pointer" onClick={()=>setShowProfile(!showProfile)}/>
        </div>
      </div>
    );
  };
  