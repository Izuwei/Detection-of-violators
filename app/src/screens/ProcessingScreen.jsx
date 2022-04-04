import React, { memo, useContext } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "../utils/ThemeProvider";
import { WsContext } from "../utils/WsProvider";

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

const ProcessingScreen = memo(() => {
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext);
  const { description, uploadProgress, detectionProgress } =
    useContext(WsContext);

  /*
  const {
    video,
    procConfig,
    areaOfInterest,
    recognitionDatabase,
    setProcessedVideo,
  } = useContext(DataContext);
  const { nextStep, resetStep } = useContext(StepContext);
  
  const { enqueueSnackbar } = useSnackbar();

  const [description, setDescription] = useState(t("Uploading"));
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detectionProgress, setDetectionProgress] = useState(0);

  useEffect(() => {
    var faces = [];
    var faceCnt = 0;
    var faceSent = 0;

    for (
      let personIdx = 0;
      personIdx < recognitionDatabase.length;
      personIdx++
    ) {
      for (
        let faceIdx = 0;
        faceIdx < recognitionDatabase[personIdx].images.length;
        faceIdx++
      ) {
        // Image data
        let firstname = recognitionDatabase[personIdx].firstname
          .replace(/\s/g, "")
          .toLowerCase();
        let lastname = recognitionDatabase[personIdx].lastname
          .replace(/\s/g, "")
          .toLowerCase();
        let personID = recognitionDatabase[personIdx].id;
        let imageID = recognitionDatabase[personIdx].images[faceIdx].id;
        let suffix = recognitionDatabase[personIdx].images[faceIdx].file.name
          .split(".")
          .pop();

        // Rename file by recreating objects, because 'name' prop is read_only
        var newFile = new File(
          [recognitionDatabase[personIdx].images[faceIdx].file],
          `${firstname}_${lastname}_${personID}_${imageID}.${suffix}`,
          { type: recognitionDatabase[personIdx].images[faceIdx].file.type }
        );

        // Save metadata into image
        newFile.meta = {
          personID: personID,
          imageID: imageID,
          firstname: firstname,
          lastname: lastname,
        };

        faces.push(newFile);
        faceCnt += 1;
      }
    }

    const socket = io(config.server_url + ":" + config.socket_port);
    var baseUploader = new SocketIOFileUpload(socket, { topicName: "video" });

    baseUploader.addEventListener("progress", (event) => {
      const progress = parseInt((event.bytesLoaded / event.file.size) * 100);
      setUploadProgress(progress);
    });

    baseUploader.addEventListener("complete", (event) => {
      socket.emit("start-detection", { ...procConfig, area: areaOfInterest });
      setDescription(t("SettingUpEnvironment"));
      setUploadProgress(100);
    });

    var imageUploader = new SocketIOFileUpload(socket, {
      topicName: "faces",
    });

    imageUploader.addEventListener("complete", (event) => {
      faceSent += 1;
      if (faceSent === faceCnt) {
        baseUploader.submitFiles([video.data]); // Face images sent => upload video
      }
    });

    if (faces.length === 0) {
      baseUploader.submitFiles([video.data]); // Upload video without uploading face images
    } else {
      imageUploader.submitFiles(faces); // Upload face images before video
    }

    socket.on("progress", (progress) => {
      setDetectionProgress(progress);
      setDescription(t("Processing"));
    });

    socket.on("processed", (data) => {
      setDescription(t("Finishing"));
      setProcessedVideo(data);
      nextStep();

      console.log(data); // video url by tady měla být
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

    socket.on("face_upload_error", (err) => {
      enqueueSnackbar(t("FaceUploadError"), {
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
    recognitionDatabase,
    setProcessedVideo,
    procConfig,
    enqueueSnackbar,
    t,
    nextStep,
    resetStep,
  ]);
*/

  return (
    <div className="container" style={styles.container}>
      <Typography variant="h4" sx={{ margin: 6, color: theme.primary }}>
        {t(description)}
      </Typography>
      <LinearProgressWithLabel
        color={theme.primary}
        barBackground={theme.progressBarBackground}
        textColor={theme.text}
        value={uploadProgress}
        name={t("Uploaded")}
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
