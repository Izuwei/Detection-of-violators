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
  const { currentStep, resetStep } = useContext(StepContext);

  return (
    <div style={{ marginBottom: 18 }}>
      {(() => {
        // TODO: fix comparison to '=='
        if (currentStep < 4) {
          return <ConfigScreen />;
        } else if (currentStep < 5) {
          return <ProcessingScreen />;
        } else if (currentStep < 6) {
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
