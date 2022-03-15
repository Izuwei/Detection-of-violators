import React, { memo, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketIOFileUpload from "socketio-file-upload";

import { DataContext } from "../utils/DataProvider";

const ProcessingScreen = memo(() => {
  const { video, areaOfInterest } = useContext(DataContext);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [videoResult, setVideoResult] = useState(undefined);

  console.log("Render: ProcessingScreen");

  useEffect(() => {
    const socket = io("http://localhost:3001");
    const uploader = new SocketIOFileUpload(socket);

    uploader.addEventListener("progress", (event) => {
      const progress = parseInt((event.bytesLoaded / event.file.size) * 100);
      setUploadProgress(progress);
      // console.log("Progress: " + progress);
    });

    uploader.addEventListener("complete", (event) => {
      socket.emit("start-detection", { area: areaOfInterest });
      setUploadProgress(100);
    });

    uploader.submitFiles([video.data]);

    socket.on("progress", (progress) => {
      console.log("Progress: " + progress);
      setDetectionProgress(progress);
    });

    socket.on("processed", (videoURL) => {
      setVideoResult(videoURL);
      console.log(videoURL); // video url by tady měla být
    });
  }, [video, areaOfInterest, setVideoResult]);

  return (
    <React.Fragment>
      {videoResult === undefined ? (
        <div>TODO: Processing...</div>
      ) : (
        <video controls muted style={{ borderRadius: 4 }}>
          <source src={videoResult} type="video/mp4" />
        </video>
      )}
    </React.Fragment>
  );
});

export default ProcessingScreen;
