import React, { memo, useCallback, useContext } from "react";
import { Stepper, Step, StepLabel, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { StepContext } from "../utils/StepProvider";

const ConfigScreen = memo(() => {
  const { t } = useTranslation();
  const { steps, currentStep, backStep, nextStep } = useContext(StepContext);
  console.log("Render: Stepper");

  const createStepLabel = useCallback(
    (label) => {
      switch (label) {
        case steps[0]: // Upload
          return t("UploadLabel");
        case steps[1]: // Area
          return t("AreaLabel");
        default:
          return t("Unknown");
      }
    },
    [steps, t]
  );

  return (
    <Box sx={{ maxWidth: "60%", minWidth: 500, margin: "auto" }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{createStepLabel(label)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {(() => {
          // TODO: Dodělat componenty
          switch (currentStep) {
            case 0:
              return "0";
            case 1:
              return "1";
            default:
              return "error";
          }
        })()}
      </div>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        {currentStep !== 0 && (
          <Button onClick={backStep} sx={{ mr: 1 }}>
            {t("Back")}
          </Button>
        )}
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={nextStep}>
          {currentStep === steps.length - 1 ? t("Finish") : t("Next")}
        </Button>
      </Box>
    </Box>
  );
});

export default ConfigScreen;
