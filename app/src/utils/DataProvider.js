import React, { createContext, memo, useCallback, useState } from "react";

export const DataContext = createContext();

export const DataProvider = memo(({ children }) => {
  const [video, setVideo] = useState({
    data: undefined,
    url: undefined,
    width: undefined,
    height: undefined,
    duration: undefined,
  });
  const [videoThumbnail, setVideoThumbnail] = useState(undefined); // base64 img/png
  const [detectionArea, setDetectionArea] = useState([]);

  /**
   * Attention: Coordinates are calculated against the thumbnail, so it is necessary to recalculate them against the scale.
   */
  const setupAreaOfInterest = useCallback(
    (boxes) => {
      if (boxes.length === 0) {
        setDetectionArea([]);
      } else {
        const sx = parseInt(Math.min(boxes[0].sx, boxes[0].ex)); // Starting point x
        const sy = parseInt(Math.min(boxes[0].sy, boxes[0].ey)); // Starting point y

        var ex = parseInt(Math.max(boxes[0].sx, boxes[0].ex)); // End point x
        var ey = parseInt(Math.max(boxes[0].sy, boxes[0].ey)); // End point y
        ex = ex > video.width ? video.width : ex;
        ey = ey > video.height ? video.height : ey;

        const width = ex - sx;
        const height = ey - sy;

        if (width < 50 || height < 50) {
          setDetectionArea([]);
        } else {
          setDetectionArea((prevState) => [
            {
              x: sx < 0 ? 0 : sx,
              y: sy < 0 ? 0 : sy,
              width: ex - sx,
              height: ey - sy,
              key: prevState.length + 1,
            },
          ]);
        }
      }
    },
    [video]
  );

  const reloadVideoThumbnail = useCallback((videoURL) => {
    var tempVideo = document.createElement("video");
    tempVideo.src = videoURL;

    tempVideo.addEventListener(
      "loadeddata",
      function () {
        reloadRandomFrame();
      },
      false
    );

    tempVideo.addEventListener(
      "seeked",
      function () {
        var canvas = document.createElement("canvas");
        canvas.width = tempVideo.videoWidth;
        canvas.height = tempVideo.videoHeight;
        var context = canvas.getContext("2d");
        context.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        var base64DataImage = canvas.toDataURL("image/png");
        const image = new window.Image();
        image.src = base64DataImage;
        image.onload = () => {
          setVideoThumbnail(image);
        };
      },
      false
    );

    function reloadRandomFrame() {
      if (!isNaN(tempVideo.duration)) {
        var rand = Math.round(Math.random() * tempVideo.duration) + 1;
        console.log("Thumbnail: loaded at " + rand + " seconds.");
        tempVideo.currentTime = rand;
      }
    }
  }, []);

  const uploadVideo = useCallback(
    (accptedFile) => {
      if (accptedFile.length !== 0) {
        // TODO: ošetřit MIME video/x-matroska (mkv, asi udělat jen avi a mp4)
        const videoURL = URL.createObjectURL(accptedFile[0]);

        var tempVideo = document.createElement("video");
        tempVideo.src = videoURL;

        tempVideo.addEventListener(
          "loadeddata",
          function () {
            reloadVideoThumbnail(videoURL);

            const thumbnailWidth =
              tempVideo.videoWidth < 900 ? tempVideo.videoWidth : 900;
            const scale = thumbnailWidth / tempVideo.videoWidth;

            setVideo((prevState) => ({
              ...prevState,
              data: accptedFile[0],
              url: videoURL,
              width: tempVideo.videoWidth,
              height: tempVideo.videoHeight,
              thumbnailWidth: thumbnailWidth,
              thumbnailHeight: parseInt(tempVideo.videoHeight * scale),
              thumbnailScale: scale,
              duration: parseInt(tempVideo.duration),
            }));
            console.log("Info: Video uploaded.");
          },
          false
        );
      }
    },
    [reloadVideoThumbnail]
  );

  return (
    <DataContext.Provider
      value={{
        video: video,
        uploadVideo: uploadVideo,
        videoThumbnail: videoThumbnail,
        reloadVideoThumbnail: reloadVideoThumbnail,
        areaOfInterest: detectionArea,
        setupAreaOfInterest: setupAreaOfInterest,
      }}
    >
      {children}
    </DataContext.Provider>
  );
});
