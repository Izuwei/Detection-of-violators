/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { memo, useContext } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "../utils/ThemeProvider";
import { DataContext } from "../utils/DataProvider";
import { WsContext } from "../utils/WsProvider";

/**
 * Function returns a progress bar with a name and a percentage.
 *
 * @param {Object} props An object containing a name of progess bar, value and colors.
 * @returns React element.
 */
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
      <Typography align="left" sx={{ marginLeft: 1, color: props.textColor }}>
        {props.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={props.value}
            sx={{
              background: props.barBackground,
              "& .MuiLinearProgress-bar": {
                backgroundColor: props.color,
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            sx={{ color: props.textColor }}
          >{`${props.value}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Component represents a screen with progress bars showing progress
 * during video processing on the server.
 */
const ProcessingScreen = memo(() => {
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext);
  const { weights } = useContext(DataContext);
  const { description, uploadProgress, weightsProgress, detectionProgress } =
    useContext(WsContext);

  return (
    <div className="container" style={styles.container}>
      <Typography variant="h4" sx={{ margin: 6, color: theme.primary }}>
        {t(description)}
      </Typography>
      {weights !== undefined && (
        <LinearProgressWithLabel
          color={theme.primary}
          barBackground={theme.progressBarBackground}
          textColor={theme.text}
          value={weightsProgress}
          name={t("Weights")}
        />
      )}
      <LinearProgressWithLabel
        color={theme.primary}
        barBackground={theme.progressBarBackground}
        textColor={theme.text}
        value={uploadProgress}
        name={t("Video")}
      />
      <LinearProgressWithLabel
        color={theme.primary}
        barBackground={theme.progressBarBackground}
        textColor={theme.text}
        value={detectionProgress}
        name={t("Processed")}
      />
    </div>
  );
});

const styles = {
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 200,
    maxWidth: "50%",
    minWidth: 500,
  },
};

export default ProcessingScreen;
