import React, { memo, useContext } from "react";
import { StepContext } from "../utils/StepProvider";
import ConfigScreen from "./ConfigScreen";
import ProcessingScreen from "./ProcessingScreen";
import { DataProvider } from "../utils/DataProvider";

const ScreenMnager = memo((props) => {
  const { currentStep } = useContext(StepContext);
  console.log("Render: ScreenManager");

  return (
    <React.Fragment>
      {(() => {
        if (currentStep < 2) {
          return (
            <DataProvider>
              <ConfigScreen />
            </DataProvider>
          );
        } else if (currentStep < 3) {
          return <ProcessingScreen />;
        } else {
          return "TODO: ERROR SCREEN";
        }
      })()}
    </React.Fragment>
  );
});

export default ScreenMnager;
