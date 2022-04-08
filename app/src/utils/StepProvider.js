/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { createContext, memo, useCallback, useState } from "react";

export const StepContext = createContext();

/**
 * Step provider provides functions across application associated with steps.
 */
export const StepProvider = memo(({ children }) => {
  const STEPS = ["Upload", "Configuration", "Area", "Recognition"];

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([
    false,
    true,
    true,
    true,
  ]);

  /**
   * Function resets application to the initial step.
   */
  const resetStep = useCallback(() => {
    setActiveStep(0);
  }, []);

  /**
   * Function moves user step forward.
   */
  const nextStep = useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  /**
   * Function moves user one step back.
   */
  const backStep = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  /**
   * Function sets status of the current step.
   * Some steps require certain actions before they can be considered as completed.
   * E.g. video upload.
   */
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
        resetStep: resetStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
});
