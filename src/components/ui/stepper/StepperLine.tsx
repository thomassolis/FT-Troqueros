import { stepConfig } from "./Stepper";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface StepperLineProps {
  selectedOption: string;
  step: number;
}

export const StepperLine = ({ selectedOption, step }: StepperLineProps) => {
  const steps = stepConfig[selectedOption] || ["Paso Único"];

  return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={3} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

  );
};
