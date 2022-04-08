/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";
import { io } from "socket.io-client";
import SocketIOFileUpload from "socketio-file-upload";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import { DataContext } from "../utils/DataProvider";
import { StepContext } from "../utils/StepProvider";

import config from "../config.json";

export const WsContext = createContext();

/**
 * WsProvider is responsible for stateful socket communication with the server,
 * sending user data and receiving responses.
 */
export const WsProvider = memo(({ children }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { nextStep, resetStep } = useContext(StepContext);
  const {
    video,
    procConfig,
    areaOfInterest,
    recognitionDatabase,
    setProcessedVideo,
  } = useContext(DataContext);

  const [description, setDescription] = useState("Uploading");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detectionProgress, setDetectionProgress] = useState(0);

  /**
   * Function sends all the data obtained from the user to the server,
   * where the video will be processed according to the configuration.
   */
  const startProcessing = useCallback(() => {
    setDescription("Uploading");
    setUploadProgress(0);
    setDetectionProgress(0);

    var faces = [];
    var faceCnt = 0;
    var faceSent = 0;

    // Create a structure with face images to make them traceable in the results
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

    // Socket initialization
    const socket = io(config.server_url + ":" + config.socket_port);
    // Uploader for video file
    var baseUploader = new SocketIOFileUpload(socket, { topicName: "video" });

    // Function for displaying video upload progress
    const onBaseProgress = (event) => {
      const progress = parseInt((event.bytesLoaded / event.file.size) * 100);
      setUploadProgress(progress);
    };
    baseUploader.addEventListener("progress", onBaseProgress);

    // Function starts detection processing after video file is completely uploaded
    const onBaseComplete = (event) => {
      socket.emit("start-detection", { ...procConfig, area: areaOfInterest });
      setDescription("SettingUpEnvironment");
      setUploadProgress(100);
    };
    baseUploader.addEventListener("complete", onBaseComplete);

    // Uploader for face images
    var imageUploader = new SocketIOFileUpload(socket, {
      topicName: "faces",
    });

    // After the face images are successfully uploaded, it will start sending video file
    const onImageComplete = (event) => {
      faceSent += 1;
      if (faceSent === faceCnt) {
        baseUploader.submitFiles([video.data]); // Face images sent => upload video
      }
    };
    imageUploader.addEventListener("complete", onImageComplete);

    if (faces.length === 0) {
      baseUploader.submitFiles([video.data]); // Upload video without uploading face images
    } else {
      imageUploader.submitFiles(faces); // Upload face images before video
    }

    // Value of progress bar for video processing
    socket.on("progress", (progress) => {
      setDetectionProgress(progress);
      setDescription("Processing");
    });

    // After video is processed, go to the next step
    socket.on("processed", (data) => {
      setDescription("Finishing");
      setProcessedVideo(data);
      socket.disconnect();
      nextStep();
    });

    // On error during processing
    socket.on("process_error", (err) => {
      enqueueSnackbar(t("ProcessingError"), {
        variant: "error",
      });
      socket.disconnect();
      resetStep();
    });

    // On error during video upload
    socket.on("upload_error", (err) => {
      enqueueSnackbar(t("UploadError"), {
        variant: "error",
      });
      socket.disconnect();
      resetStep();
    });

    // On error during uploading face images
    socket.on("face_upload_error", (err) => {
      enqueueSnackbar(t("FaceUploadError"), {
        variant: "error",
      });
      socket.disconnect();
      resetStep();
    });

    // On connection error
    socket.on("connect_error", (err) => {
      enqueueSnackbar(t("ConnectionError"), {
        variant: "error",
      });
      socket.disconnect();
      resetStep();
    });

    return () => {
      socket.disconnect();
    };
  }, [
    video,
    areaOfInterest,
    recognitionDatabase,
    setProcessedVideo,
    procConfig,
    t,
    enqueueSnackbar,
    nextStep,
    resetStep,
  ]);

  return (
    <WsContext.Provider
      value={{
        startProcessing: startProcessing,
        description: description,
        uploadProgress: uploadProgress,
        detectionProgress: detectionProgress,
      }}
    >
      {children}
    </WsContext.Provider>
  );
});
