import { ClassNames } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom"

interface BackProps {
    text: string | null;
    className2?: string
}

export const Back = ({text, className2}:BackProps) => {
    const navigate = useNavigate();
    return(
        
        <div className={`w-[30%] flex gap-3 items-center ${className2}`}>
            <Icon icon="tabler:arrow-back-up-double" className="text-white bg-black rounded-md cursor-pointer" width="24" height="24" onClick={() => navigate(-1)}/>
            <p className="text-black font-bebas text-xl">{text}</p>
        </div> 
        
    )
}