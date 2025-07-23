import { forwardRef } from "react";

interface InputProps {
    type: string;
    placeholder?: string;    
    className2?: string | null;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name?:string    
    defaultValue?:string|number
    value?:string | number
    min?:string | number
    max?:string | number
    maxLength?:number
}

export const Input = forwardRef <HTMLInputElement, InputProps>(
    ({type, min, maxLength, max, value, defaultValue, placeholder, className2, onChange, ...rest}, ref) =>{
        return(
            <input 
                type={type} 
                placeholder={placeholder} 
                ref={ref}
                className={`w-96 h-6 rounded-md border border-gray-300 px-2 text-black ${className2}`}                
                onChange={onChange} 
                {...rest}
                defaultValue={defaultValue}
                value={value}                
                min={min}
                max={max}
                maxLength={maxLength}                
            />
        );
    }
)