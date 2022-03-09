import React, { memo, useCallback, useContext } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { StepContext } from "../utils/StepProvider";
import FileDropzone from "../components/FileDropzone";
import AreaSelection from "../components/AreaSelection";

const ConfigScreen = memo(() => {
  const { t } = useTranslation();
  const {
    steps,
    currentStep,
    backStep,
    nextStep,
    completedSteps,
    setStepStatus,
  } = useContext(StepContext);
  console.log("Render: Stepper");

  const optionalSteps = [false, true];

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
    <Box sx={{ maxWidth: "40%", minWidth: 500, margin: "auto" }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => {
          const labelProps = {};

          if (optionalSteps[index] === true) {
            labelProps.optional = (
              <Typography variant="caption">{t("Optional")}</Typography>
            );
          }
          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{createStepLabel(label)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div
        style={{
          fontSize: 22,
          // opacity: 0.5,
          fontStyle: "italic",
          color: "#1976d2",
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        {(() => {
          switch (currentStep) {
            case 0:
              return <p>{t("Step1Desc")}</p>;
            case 1:
              return <p>{t("Step2Desc")}</p>;
            default:
              return "error"; // TODO: Dodělat Error componentu
          }
        })()}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {(() => {
          // TODO: Dodělat componenty
          switch (currentStep) {
            case 0:
              return <FileDropzone setStepStatus={setStepStatus} />;
            case 1:
              return <AreaSelection />;
            default:
              return "error"; // TODO: Dodělat Error componentu
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
        <Button onClick={nextStep} disabled={!completedSteps[currentStep]}>
          {currentStep === steps.length - 1 ? t("Finish") : t("Next")}
        </Button>
      </Box>
    </Box>
  );
});

export default ConfigScreen;
