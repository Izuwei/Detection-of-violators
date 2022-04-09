/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { memo, useContext } from "react";
import { StepContext } from "../utils/StepProvider";
import ConfigScreen from "./ConfigScreen";
import ProcessingScreen from "./ProcessingScreen";
import SummaryScreen from "./SummaryScreen";

/**
 * Component is responsible for displaying/switching screens during
 * user's progress from loading the video to showing the results.
 */
const ScreenMnager = memo((props) => {
  const { steps, currentStep, resetStep } = useContext(StepContext);

  return (
    <div style={{ marginBottom: 18 }}>
      {(() => {
        // TODO: fix comparison to '=='
        if (currentStep < steps.length) {
          return <ConfigScreen />;
        } else if (currentStep < steps.length + 1) {
          return <ProcessingScreen />;
        } else if (currentStep < steps.length + 2) {
          return <SummaryScreen />;
        } else {
          // Should not happen, but in case of error it will return user to the start
          resetStep();
          return;
        }
      })()}
    </div>
  );
});

export default ScreenMnager;
