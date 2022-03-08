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
        setVideoThumbnail(base64DataImage);
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
            setVideo((prevState) => ({
              ...prevState,
              data: accptedFile[0],
              url: videoURL,
              width: tempVideo.videoWidth,
              height: tempVideo.videoHeight,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
});
