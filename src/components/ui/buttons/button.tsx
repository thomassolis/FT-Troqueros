import { BeatLoader } from "react-spinners"

interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    isSelected?: boolean; 
    bgColor?: string,
    hoverBgColor?: string,
    textColor?: string
}

export const Button = ({ 
        text, 
        type = 'button', 
        isLoading = false, 
        isSelected,
        bgColor = 'bg-orange-600',
        hoverBgColor = 'bg-troquerosOrange',
        textColor = 'text-black'
    }: ButtonProps) => {
        return (
            <button 
                type={type} 
                className={`
                    p-3 rounded-md w-full  flex justify-center items-center font-jersey ${textColor}
                    ${isSelected ? `${bgColor}` : `${hoverBgColor} hover:${bgColor}`}
                `}
                disabled={isLoading}
            >
                {isLoading ?  
                    <BeatLoader color="#fff" size={15}/> : text}
            </button>
        )
}
