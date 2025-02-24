import { Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";


interface ButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    isLoading?: boolean;
    isSelected?: boolean;
    bgColor?: string;
    hoverBgColor?: string;
    textColor?: string;
    className2?: string | null;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; 
    navegation?: string;
}


export const Button = ({
    text,
    type = "button",
    isLoading = false,
    isSelected,
    bgColor = "bg-orange-600",
    hoverBgColor = "bg-troquerosOrange",
    textColor = "text-black",
    className2,
    onClick,
    navegation,
}: ButtonProps) => {
    const navigate = useNavigate();

    return (
        <button
            type={type}
            className={`
                p-3 rounded-md w-full flex justify-center items-center font-jersey ${className2} ${textColor}
                ${isSelected ? `${bgColor}` : `${hoverBgColor} hover:${bgColor}`}
            `}
            disabled={isLoading}
            onClick={(event) => {
                event.preventDefault(); // ✅ Evita que el formulario interfiera

                console.log("🔍 Valor de navegation en el botón:", navegation);

                if (onClick) {
                    onClick(event);
                } else if (navegation && navegation !== "") {
                    console.log("🚀 Redirigiendo a:", navegation);
                    navigate(navegation);
                } else {
                    console.warn("⚠ No se ha definido una ruta de navegación");
                }
            }}
        >
            {isLoading ? <BeatLoader color="#fff" size={15} /> : text}
        </button>
    );
};





