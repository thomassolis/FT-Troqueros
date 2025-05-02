import { stepConfig } from "./Stepper";
import { stepConfigCustomers } from "./Stepper";
import { useLocation } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState,  useEffect } from "react";

interface StepperLineProps {
  selectedOption: string;
  step: number;
}

export const StepperLine = ({ selectedOption, step }: StepperLineProps) => {

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const module = pathSegments[pathSegments.length - 2];
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (module === 'Customers') {
      setSteps(stepConfigCustomers['Customers']);
    } else {
      setSteps(stepConfig[selectedOption] || ["Paso Único"]);
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
