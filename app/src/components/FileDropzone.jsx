/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { memo, useCallback, useContext, useMemo } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Clear from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";

import { DataContext } from "../utils/DataProvider";
import { ThemeContext } from "../utils/ThemeProvider";

/**
 * Component renders part of splash screen for uploading a video file.
 */
const FileDropzone = memo(({ setStepStatus }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { theme } = useContext(ThemeContext);
  const { video, uploadVideo, removeVideo } = useContext(DataContext);

  /**
   * Function removes uploaded video file.
   */
  const handleClear = useCallback(() => {
    setStepStatus(false);
    removeVideo();
  }, [setStepStatus, removeVideo]);

  /**
   * Function saves the video when it is dropped into the box,
   * allow user to proceed to the next step and notifies him.
   */
  const handleDropFile = useCallback(
    (event) => {
      uploadVideo(event);
      setStepStatus(true);
      enqueueSnackbar(t("VideoUploadSuccessNotification"), {
        variant: "success",
      });
    },
    [uploadVideo, setStepStatus, enqueueSnackbar, t]
  );

  /**
   * Function notifies user when he tries to upload video in unsupported format.
   */
  const handleDropError = useCallback(
    (event) => {
      enqueueSnackbar(t("VideoUploadErrorNotification"), { variant: "error" });
    },
    [enqueueSnackbar, t]
  );

  /**
   * Setup for file dropzone.
   * @link https://react-dropzone.js.org/#section-styling-dropzone
   */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "video/mp4, video/webm",
    multiple: false,
    maxFiles: 1,
    maxSize: 2000000000, // 2 GB
    onDropAccepted: handleDropFile,
    onDropRejected: handleDropError,
  });

  const styles = useMemo(
    () => ({
      ...baseStyles,
      backgroundColor: theme.dropZoneBackground,
      borderColor: theme.dropZoneBorder,
      ...(isFocused ? { borderColor: theme.primary } : {}),
      ...(isDragAccept ? { borderColor: theme.dropZoneBorderAccept } : {}),
      ...(isDragReject ? { borderColor: theme.dropZoneBorderReject } : {}),
    }),
    [isFocused, isDragAccept, isDragReject, theme]
  );

  const tableStyles = useMemo(
    () => ({
      cell: {
        padding: 1,
        color: theme.text,
      },
      text: {
        fontSize: 14,
        maxWidth: 120,
        margin: "auto",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
    }),
    [theme]
  );

  return (
    <React.Fragment>
      {video.data === undefined && (
        <div {...getRootProps({ style: styles })}>
          <input {...getInputProps()} />
          {isDragActive ? t("DragDesc") : t("DnDDesc")}
          <br />
          <p style={{ fontSize: 14, fontStyle: "italic" }}>.mp4, .webm</p>
          <p style={{ fontSize: 14, margin: 0, fontFamily: "Consolas" }}>
            2 GB
          </p>
        </div>
      )}
      {video.data !== undefined && (
        <React.Fragment>
          <video
            width={video.aspectRatio < 1.5 && video.height > 400 ? 500 : "100%"}
            controls
            muted
            style={{ borderRadius: 4 }}
          >
            <source src={video.url} />
          </video>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Name")}
                </TableCell>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Duration")}
                </TableCell>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Resolution")}
                </TableCell>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Size")}
                </TableCell>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Modified")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="video-details">
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography noWrap={true} sx={tableStyles.text}>
                    {video.data.name}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography sx={tableStyles.text}>
                    {new Date(1000 * video.duration)
                      .toISOString()
                      .substr(11, 8)}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography sx={tableStyles.text}>
                    {video.width}x{video.height}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography sx={tableStyles.text}>
                    {(video.data.size / 1000000).toFixed(2)} MB
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography sx={tableStyles.text}>
                    {new Date(video.data.lastModified).toDateString()}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Tooltip title={t("Delete")}>
            <IconButton
              sx={{
                color: theme.primaryButton,
                "&:hover": { background: theme.primaryButtonHover },
              }}
              size="large"
              onClick={handleClear}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

const baseStyles = {
  display: "flex",
  cursor: "pointer",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  height: 400,
  width: "100%",
  borderWidth: 2,
  borderRadius: 4,
  borderStyle: "dashed",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

export default FileDropzone;
