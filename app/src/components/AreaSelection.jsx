import React, { memo, useCallback, useContext, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { Button, Typography } from "@mui/material";
import { DataContext } from "../utils/DataProvider";
import { useTranslation } from "react-i18next";

const AreaSelection = memo(() => {
  const { t } = useTranslation();

  const {
    video,
    videoThumbnail,
    reloadVideoThumbnail,
    areaOfInterest,
    setupAreaOfInterest,
  } = useContext(DataContext);
  console.log(video);
  const [drawingAOI, setDrawingAOI] = useState([]);

  const handleMouseDown = useCallback(
    (event) => {
      if (drawingAOI.length === 0) {
        const { x, y } = event.target.getStage().getPointerPosition();
        setDrawingAOI([{ x, y, width: 0, height: 0, key: 0 }]);
      }
    },
    [drawingAOI]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (drawingAOI.length === 1) {
        const sx = drawingAOI[0].x;
        const sy = drawingAOI[0].y;
        const { x, y } = event.target.getStage().getPointerPosition();
        setupAreaOfInterest([]);
        setDrawingAOI([
          {
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
            key: 0,
          },
        ]);
      }
    },
    [drawingAOI, setupAreaOfInterest]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (drawingAOI.length === 1) {
        const sx = drawingAOI[0].x;
        const sy = drawingAOI[0].y;
        const { x, y } = event.target.getStage().getPointerPosition();
        setDrawingAOI([]);
        setupAreaOfInterest([
          {
            sx: sx,
            sy: sy,
            ex: x,
            ey: y,
          },
        ]);
      }
    },
    [drawingAOI, setupAreaOfInterest]
  );

  return (
    <React.Fragment>
      {areaOfInterest.length === 1 ? (
        <Typography align="center" sx={styles.coords}>
          X:{parseInt(areaOfInterest[0].x / video.thumbnailScale)} Y:
          {parseInt(areaOfInterest[0].y / video.thumbnailScale)} Width:
          {parseInt(areaOfInterest[0].width / video.thumbnailScale)} Height:
          {parseInt(areaOfInterest[0].height / video.thumbnailScale)}
        </Typography>
      ) : (
        <Typography align="center" sx={styles.coords}>
          X: - Y: - {t("Width")}: - {t("Height")}: -
        </Typography>
      )}
      <Stage
        width={video.thumbnailWidth}
        height={video.thumbnailHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect
            width={video.thumbnailWidth}
            height={video.thumbnailHeight}
            fillPatternImage={videoThumbnail}
          />
          {areaOfInterest.map((value) => {
            return (
              <Rect
                cornerRadius={3}
                key={value.key}
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="transparent"
                stroke="orange"
              />
            );
          })}
          {drawingAOI.map((value) => {
            return (
              <Rect
                key={value.key}
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="transparent"
                stroke="orange"
              />
            );
          })}
        </Layer>
      </Stage>
      <Button onClick={() => reloadVideoThumbnail(video.url)}>Reload</Button>
    </React.Fragment>
  );
});

const styles = {
  coords: {
    fontFamily: "Consolas",
  },
};

export default AreaSelection;
