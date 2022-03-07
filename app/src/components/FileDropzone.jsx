import React, { memo, useContext, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { DataContext } from "../utils/DataProvider";
import { useTranslation } from "react-i18next";

/**
 * https://react-dropzone.js.org/#section-styling-dropzone
 */
const FileDropzone = memo(() => {
  const { t } = useTranslation();
  const { video, videoDetails, uploadVideo } = useContext(DataContext);
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
      {video === undefined && (
        <div {...getRootProps({ style: styles })}>
          <input {...getInputProps()} />
          {isDragActive ? t("DragDesc") : t("DnDDesc")}
        </div>
      )}
      {video !== undefined && (
        <div>
          <video height="400" controls style={{ borderRadius: 4 }}>
            <source src={URL.createObjectURL(video)} />
          </video>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Name")}
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
                  {video.name}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  {(video.size / 1000000).toFixed(2)} MB
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  {new Date(video.lastModified).toDateString()}
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
};

export default FileDropzone;
