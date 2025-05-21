import { stepConfig } from "./Stepper";
import { stepConfigCustomers } from "./Stepper";
import { stepConfigDrivers } from "./Stepper";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState,  useEffect } from "react";
import { GetModuleFromURL } from "../../../functions/GetURL/GetURLInfo";

interface StepperLineProps {
  selectedOption?: string;
  step: number;
}

export const StepperLine = ({ selectedOption, step }: StepperLineProps) => {
  console.log('step', step);
  const module = GetModuleFromURL();
  
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    if (module === 'Customers') {
      setSteps(stepConfigCustomers['Customers']);
    } else if(module === 'Drivers'){
      setSteps(stepConfigDrivers['Drivers']);
    }
    else {
      if (selectedOption && stepConfig[selectedOption]) {
        setSteps(stepConfig[selectedOption]);
      } else {
        setSteps(["Paso Único"]);
      }
    }
    
  }, [module, selectedOption]); // Dependencias del efecto
  

  return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

  );
};
