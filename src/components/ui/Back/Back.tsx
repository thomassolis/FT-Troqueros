import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
interface BackProps {
    text: string | null;
    className2?: string;
    redirectTo?: string;
}

export const Back = ({ text, className2, redirectTo }: BackProps) => {
    const navigate = useNavigate();
    
    const handleBack = () => {
        if (redirectTo) {
            navigate(redirectTo); // navegación fija
        } else {
            navigate(-1); // fallback si no se pasa
        }
    };

    return (
        //w-[30%]
        <div className={`flex gap-3 items-center ${className2}`}>
            <Icon icon="tabler:arrow-back-up-double" className="text-white bg-black rounded-md cursor-pointer" width="24" height="24" onClick={handleBack}/>
            <p className="text-black font-bebas text-xl">{text}</p>
        </div>
    );
};
