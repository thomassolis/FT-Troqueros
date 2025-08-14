import { createContext,useContext } from "react";

type Ctx = {
    activeStep:number;
    goToStep: (n: number) => void; // 0-based
}

export const StepperNavContext = createContext<Ctx | null>(null);
export const useStepperNav = () => {
  const ctx = useContext(StepperNavContext);
  if (!ctx) throw new Error("useStepperNav must be used within provider");
  return ctx;
};