import React, { memo, useContext, useEffect, useState } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { io } from "socket.io-client";
import SocketIOFileUpload from "socketio-file-upload";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import { DataContext } from "../utils/DataProvider";
import { StepContext } from "../utils/StepProvider";
import config from "../config.json";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
      <Typography align="left" sx={{ marginLeft: 1 }}>
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
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >{`${props.value}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

const ProcessingScreen = memo(() => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { nextStep, resetStep } = useContext(StepContext);
  const { video, areaOfInterest, setProcessedVideo } = useContext(DataContext);

  const [description, setDescription] = useState(t("Uploading"));
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detectionProgress, setDetectionProgress] = useState(0);

  console.log("Render: ProcessingScreen");

  useEffect(() => {
    const socket = io(config.server_url + ":" + config.socket_port);
    const uploader = new SocketIOFileUpload(socket);

    uploader.addEventListener("progress", (event) => {
      const progress = parseInt((event.bytesLoaded / event.file.size) * 100);
      setUploadProgress(progress);
    });

    uploader.addEventListener("complete", (event) => {
      socket.emit("start-detection", { area: areaOfInterest });
      setDescription(t("SettingUpEnvironment"));
      setUploadProgress(100);
    });

    uploader.submitFiles([video.data]);

    socket.on("progress", (progress) => {
      setDetectionProgress(progress);
      setDescription(t("Processing"));
    });

    socket.on("processed", (videoURL) => {
      setDescription(t("Finishing"));
      setProcessedVideo(videoURL);
      nextStep();

      console.log(videoURL); // video url by tady měla být
    });

    socket.on("process_error", (err) => {
      enqueueSnackbar(t("ProcessingError"), {
        variant: "error",
      });
      resetStep();
    });

    socket.on("upload_error", (err) => {
      enqueueSnackbar(t("UploadError"), {
        variant: "error",
      });
      resetStep();
    });

    socket.on("connect_error", (err) => {
      enqueueSnackbar(t("ConnectionError"), {
        variant: "error",
      });
      resetStep();
    });

    // Clean up
    return () => {
      socket.disconnect();
    };
  }, [
    video,
    areaOfInterest,
    setProcessedVideo,
    enqueueSnackbar,
    t,
    nextStep,
    resetStep,
  ]);

  return (
    <div className="container" style={styles.container}>
      <Typography variant="h4" sx={{ margin: 6, color: "#1976d2" }}>
        {description}
      </Typography>
      <LinearProgressWithLabel value={uploadProgress} name={t("Uploaded")} />
      <LinearProgressWithLabel
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
