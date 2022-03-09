import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Stage, Layer, Rect } from "react-konva";
import { DataContext } from "../utils/DataProvider";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "../utils/windowDimensions";

const AreaSelection = memo(() => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const {
    video,
    videoThumbnail,
    reloadVideoThumbnail,
    areaOfInterest,
    setupAreaOfInterest,
  } = useContext(DataContext);

  const [thumbnailSize, setThumbnailSize] = useState({
    width: 500,
    height: 500,
    scale: 1,
  }); // Random values, has no effect but fixes warnings.
  const [drawingAOI, setDrawingAOI] = useState([]);

  useEffect(() => {
    var contentArea = parseInt(width * 0.4);
    contentArea = contentArea < 500 ? 500 : contentArea;
    const thumbnailWidth =
      video.width < contentArea ? video.width : contentArea;
    const scale = thumbnailWidth / video.width;

    setThumbnailSize({
      width: thumbnailWidth,
      height: parseInt(video.height * scale),
      scale: scale,
    });
  }, [video, width]);

  const handleMouseDown = useCallback(
    (event) => {
      if (drawingAOI.length === 0) {
        const { x, y } = event.target.getStage().getPointerPosition();
        setDrawingAOI([
          {
            x: x / thumbnailSize.scale,
            y: y / thumbnailSize.scale,
            width: 0,
            height: 0,
            key: 0,
          },
        ]);
      }
    },
    [drawingAOI, thumbnailSize]
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
            width: x / thumbnailSize.scale - sx,
            height: y / thumbnailSize.scale - sy,
            key: 0,
          },
        ]);
      }
    },
    [drawingAOI, setupAreaOfInterest, thumbnailSize]
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
            ex: x / thumbnailSize.scale,
            ey: y / thumbnailSize.scale,
          },
        ]);
      }
    },
    [drawingAOI, setupAreaOfInterest, thumbnailSize]
  );

  return (
    <React.Fragment>
      {areaOfInterest.length === 1 ? (
        <Typography sx={styles.coords}>
          X:{parseInt(areaOfInterest[0].x)} Y:
          {parseInt(areaOfInterest[0].y)} Width:
          {parseInt(areaOfInterest[0].width)} Height:
          {parseInt(areaOfInterest[0].height)}
        </Typography>
      ) : (
        <Typography sx={styles.coords}>
          X: - Y: - {t("Width")}: - {t("Height")}: -
        </Typography>
      )}
      <Stage
        width={thumbnailSize.width}
        height={thumbnailSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect
            width={thumbnailSize.width}
            height={thumbnailSize.height}
            fillPatternImage={videoThumbnail}
            fillPatternScaleX={thumbnailSize.scale}
            fillPatternScaleY={thumbnailSize.scale}
          />
          {areaOfInterest.map((value) => {
            return (
              <Rect
                cornerRadius={3}
                key={value.key}
                x={value.x * thumbnailSize.scale}
                y={value.y * thumbnailSize.scale}
                width={value.width * thumbnailSize.scale}
                height={value.height * thumbnailSize.scale}
                fill="transparent"
                stroke="orange"
              />
            );
          })}
          {drawingAOI.map((value) => {
            return (
              <Rect
                key={value.key}
                x={value.x * thumbnailSize.scale}
                y={value.y * thumbnailSize.scale}
                width={value.width * thumbnailSize.scale}
                height={value.height * thumbnailSize.scale}
                fill="transparent"
                stroke="orange"
              />
            );
          })}
        </Layer>
      </Stage>
      <Tooltip title={t("ReloadImage")}>
        <IconButton
          color="info"
          size="large"
          onClick={() => reloadVideoThumbnail(video.url)}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
});

const styles = {
  coords: {
    fontFamily: "Consolas",
    fontSize: 14,
    // width: "100%",
    // textAlign: "right",
  },
};

export default AreaSelection;
