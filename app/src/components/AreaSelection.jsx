import React, { useContext } from "react";
import { DataContext } from "../utils/DataProvider";

const AreaSelection = () => {
  const { videoThumbnail } = useContext(DataContext);

  console.log("Render: AreaSelection");
  console.log(videoThumbnail);
  return (
    <div>
      <img alt="temp" src={videoThumbnail} width={200} height={200}></img>
    </div>
  );
};

export default AreaSelection;
