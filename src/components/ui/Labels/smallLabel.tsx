interface LabelProps {
    text: string;
    className2?: string
}    


export const SmallLabel = ({text, className2}:LabelProps) =>{


    return(
        <label htmlFor="" className={`text-black ${className2}`}>{text}</label>        
    )
}