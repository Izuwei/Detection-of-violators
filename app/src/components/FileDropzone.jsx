import React, { memo, useContext, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { DataContext } from "../utils/DataProvider";
import { useTranslation } from "react-i18next";

/**
 * https://react-dropzone.js.org/#section-styling-dropzone
 */
const FileDropzone = memo(() => {
  const { t } = useTranslation();
  const { video, uploadVideo } = useContext(DataContext);
  console.log("Render: Dropzone");

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "video/*",
    multiple: false,
    maxFiles: 1,
    maxSize: 2000000000, // TODO: předělat na 1 GB
    onDrop: uploadVideo,
  });

  const styles = useMemo(
    () => ({
      ...baseStyles,
      ...(isFocused ? focusedStyles : {}),
      ...(isDragAccept ? acceptStyles : {}),
      ...(isDragReject ? rejectStyles : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <React.Fragment>
      {video.data === undefined && (
        <div {...getRootProps({ style: styles })}>
          <input {...getInputProps()} />
          {isDragActive ? t("DragDesc") : t("DnDDesc")}
        </div>
      )}
      {video.data !== undefined && (
        <div>
          <video height="400" controls style={{ borderRadius: 4 }}>
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
        </div>
      )}
    </React.Fragment>
  );
});

const baseStyles = {
  flex: 1,
  display: "flex",
  cursor: "pointer",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  height: 400,
  borderWidth: 2,
  borderRadius: 4,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyles = {
  borderColor: "#2196f3",
};

const acceptStyles = {
  borderColor: "#00e676",
};

const rejectStyles = {
  borderColor: "#ff1744",
};

const tableStyles = {
  cell: {
    padding: 1,
  },
  text: {
    fontSize: 14,
    maxWidth: 120,
    margin: "auto",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
};

export default FileDropzone;
