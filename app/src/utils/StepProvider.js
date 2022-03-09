import React, { createContext, memo, useCallback, useState } from "react";

export const StepContext = createContext();

export const StepProvider = memo(({ children }) => {
  const STEPS = ["Upload", "Area"];
  console.log("Render: StepProvider");

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, true]);

  const nextStep = useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  const backStep = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const setStepStatus = useCallback(
    (status) => {
      setCompletedSteps((prevState) => {
        let stateCopy = prevState.slice();
        stateCopy[activeStep] = status;
        return stateCopy;
      });
    },
    [activeStep]
  );

  return (
    <StepContext.Provider
      value={{
        steps: STEPS,
        currentStep: activeStep,
        backStep: backStep,
        nextStep: nextStep,
        completedSteps,
        setStepStatus: setStepStatus,
      }}
    >
      {children}
    </StepContext.Provider>
  );
});
