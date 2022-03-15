import React, { memo, useContext } from "react";
import { StepContext } from "../utils/StepProvider";
import ConfigScreen from "./ConfigScreen";
import ProcessingScreen from "./ProcessingScreen";
import SummaryScreen from "./SummaryScreen";

const ScreenMnager = memo((props) => {
  const { currentStep, resetStep } = useContext(StepContext);
  console.log("Render: ScreenManager");

  return (
    <React.Fragment>
      {(() => {
        // TODO: opravit to číslování na ==
        if (currentStep < 2) {
          return <ConfigScreen />;
        } else if (currentStep < 3) {
          return <ProcessingScreen />;
        } else if (currentStep < 4) {
          return <SummaryScreen />;
        } else {
          resetStep();
          return;
        }
      })()}
    </React.Fragment>
  );
});

export default ScreenMnager;
