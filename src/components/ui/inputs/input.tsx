import { ForwardedRef, forwardRef } from "react";

interface InputProps {
    type: string;
    placeholder: string;    
    className2?: string | null;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef <HTMLInputElement, InputProps>(
    ({type, placeholder, className2, onChange, ...rest}, ref) =>{
        return(
            <input 
                type={type} 
                placeholder={placeholder} 
                ref={ref}
                className={`w-96 h-9 rounded-md border border-gray-300 px-2 text-black ${className2}`}                
                onChange={onChange} 
                {...rest}
            />
        );
    }
)