/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

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
import { WsContext } from "../utils/WsProvider";
import { ThemeContext } from "../utils/ThemeProvider";

import FileDropzone from "../components/FileDropzone";
import ProcessConfig from "../components/ProcessConfig";
import AreaSelection from "../components/AreaSelection";
import FaceUpload from "../components/FaceUpload";

/**
 * Component represents screen from video load, through configuration to video upload to the server.
 */
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

  const { theme } = useContext(ThemeContext);
  const { startProcessing } = useContext(WsContext);

  const optionalSteps = [false, false, true, true];

  /**
   * Function takes step label and returns corresponding translated name of the label.
   */
  const createStepLabel = useCallback(
    (label) => {
      switch (label) {
        case steps[0]: // Upload
          return t("UploadLabel");
        case steps[1]: // Config
          return t("ConfigurationLabel");
        case steps[2]: // Area
          return t("AreaLabel");
        case steps[3]: // Faces
          return t("RecognitionLabel");
        default:
          return t("Unknown");
      }
    },
    [steps, t]
  );

  /**
   * Function moves user to the next step of configuration.
   */
  const handleNextStep = useCallback(() => {
    if (currentStep === steps.length - 1) {
      nextStep();
      startProcessing();
    } else {
      nextStep();
    }
  }, [currentStep, steps, nextStep, startProcessing]);

  return (
    <Box sx={{ maxWidth: "40%", minWidth: 500, margin: "auto" }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => {
          const labelProps = {};

          if (optionalSteps[index] === true) {
            labelProps.optional = (
              <Typography
                variant="caption"
                sx={{ color: theme.stepperTextOptional }}
              >
                {t("Optional")}
              </Typography>
            );
          }
          return (
            <Step key={label}>
              <StepLabel
                {...labelProps}
                sx={{
                  // Active label color
                  ".MuiStepLabel-label.Mui-active": {
                    color: theme.stepperTextActive,
                  },
                  // Completed label color
                  ".MuiStepLabel-label.Mui-completed": {
                    color: theme.stepperTextCompleted,
                  },
                  // Disabled label color
                  ".MuiStepLabel-label.Mui-disabled": {
                    color: theme.stepperTextDisabled,
                  },
                  // Active Icon color
                  ".MuiSvgIcon-root.Mui-active": {
                    color: theme.primary,
                  },
                  // Completed Icon color
                  ".MuiSvgIcon-root.Mui-completed": {
                    color: theme.stepperIconDisabled,
                  },
                  // Disabled icon color
                  ".MuiSvgIcon-root": {
                    color: theme.stepperIconDisabled,
                  },
                  // Text inside all icons
                  ".MuiStepIcon-text": {
                    fill: theme.stepperIconText,
                  },
                  // Text inside active step
                  ".MuiStepIcon-root.Mui-active > .MuiStepIcon-text": {
                    fill: theme.background,
                  },
                }}
              >
                {createStepLabel(label)}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div
        style={{
          fontSize: 22,
          // opacity: 0.5,
          fontStyle: "italic",
          color: theme.primary,
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
            case 2:
              return <p>{t("Step3Desc")}</p>;
            case 3:
              return <p>{t("Step4Desc")}</p>;
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
          switch (currentStep) {
            case 0:
              return <FileDropzone setStepStatus={setStepStatus} />;
            case 1:
              return <ProcessConfig />;
            case 2:
              return <AreaSelection />;
            case 3:
              return <FaceUpload />;
            default:
              return "error"; // TODO: Dodělat Error componentu
          }
        })()}
      </div>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        {currentStep !== 0 && (
          <Button
            onClick={backStep}
            sx={{
              mr: 1,
              color: theme.primaryButton,
              "&:hover": { background: theme.primaryButtonHover },
            }}
          >
            {t("Back")}
          </Button>
        )}
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={handleNextStep}
          disabled={!completedSteps[currentStep]}
          sx={{
            color: theme.primaryButton,
            "&:hover": { background: theme.primaryButtonHover },
            "&:disabled": {
              color: theme.ButtonDisabled,
            },
          }}
        >
          {currentStep === steps.length - 1 ? t("Finish") : t("Next")}
        </Button>
      </Box>
    </Box>
  );
});

export default ConfigScreen;
