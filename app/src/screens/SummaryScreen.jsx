import React, { memo, useCallback, useContext } from "react";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import RestartIcon from "@mui/icons-material/RestartAlt";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import { DataContext } from "../utils/DataProvider";
import { StepContext } from "../utils/StepProvider";

const SummaryScreen = memo((props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { video, processedVideo } = useContext(DataContext);
  const { resetStep } = useContext(StepContext);

  const copyToClipboard = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(processedVideo);
      enqueueSnackbar(t("LinkCopiedToClipboard"), {
        variant: "success",
      });
    }
  }, [processedVideo, enqueueSnackbar, t]);

  return (
    <Box sx={{ maxWidth: "40%", minWidth: 500, margin: "auto" }}>
      <video
        width={video.aspectRatio < 1.5 && video.height > 400 ? 500 : "100%"}
        controls
        muted
        style={{ borderRadius: 4 }}
      >
        <source src={processedVideo} />
      </video>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Tooltip title={t("CopyToClipboard")}>
          <TextField
            variant="outlined"
            label={t("ShareLink")}
            defaultValue={processedVideo}
            onClick={copyToClipboard}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 400,
              ".MuiOutlinedInput-input:hover": {
                cursor: "pointer",
              },
            }}
          />
        </Tooltip>
        <Tooltip title={t("StartAgain")}>
          <IconButton
            color="error"
            size="large"
            sx={{ width: 50, height: 50 }}
            onClick={resetStep}
          >
            <RestartIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
});

export default SummaryScreen;
