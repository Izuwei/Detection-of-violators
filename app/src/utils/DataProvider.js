import React, { createContext, memo, useCallback, useState } from "react";

export const DataContext = createContext();

export const DataProvider = memo(({ children }) => {
  const [video, setVideo] = useState(undefined);
  const [videoDetails, setVideoDetails] = useState({
    name: undefined,
    size: undefined,
    modified: undefined,
  });

  const uploadVideo = useCallback((accptedVideo) => {
    if (accptedVideo.length !== 0) {
      setVideo(accptedVideo[0]);
      console.log("Info: Video uploaded.");
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        video: video,
        videoDetails: videoDetails,
        uploadVideo: uploadVideo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
});
